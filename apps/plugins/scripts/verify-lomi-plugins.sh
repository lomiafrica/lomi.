#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGINS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
RUN_RUNTIME=0
MAGENTO_ROOT=""

usage() {
  cat <<'EOF'
Usage:
  ./verify-lomi-plugins.sh [--run-runtime] [--magento-root /path/to/magento]

What it does:
  1) Verifies zero legacy brand remnants under apps/plugins/.
  2) Verifies Magento/PrestaShop/Woo/Shopify reference the Lomi API contract.
  3) Verifies integration_source attribution per platform.
  4) Verifies XOF amount handling and checkout branding assets.
  5) Verifies test/live webhook secret switching patterns.
  6) Scans plugin trees for broken image path references.
  7) Checks Magento rename targets are present.
  8) Optionally runs Magento runtime checks if --run-runtime is provided.

Notes:
  - --run-runtime requires a valid Magento installation path via --magento-root.
  - PrestaShop/Woo runtime checks are environment-specific and are printed as next-step commands.
EOF
}

log() {
  printf "\n[%s] %s\n" "$(date +'%H:%M:%S')" "$1"
}

SEARCH_TOOL=""
# Built from parts so the legacy vendor name never appears as one literal.
_ps="$(printf '%s%s' 'pay' 'stack')"
LEGACY_BRAND_PATTERN="${_ps}|Pay${_ps}|Pstk"

search_has_matches() {
  local pattern="$1"
  local path="$2"
  if [[ "$SEARCH_TOOL" == "rg" ]]; then
    rg -n --hidden -S \
      --glob '!**/node_modules/**' \
      --glob '!**/dist/**' \
      --glob '!**/.next/**' \
      --glob '!**/build/**' \
      --glob '!**/coverage/**' \
      --glob '!**/.cursor/**' \
      --glob '!verify-lomi-plugins.sh' \
      "$pattern" "$path"
  else
    grep -RInE \
      --exclude-dir=.git \
      --exclude-dir=node_modules \
      --exclude-dir=dist \
      --exclude-dir=.next \
      --exclude-dir=build \
      --exclude-dir=coverage \
      --exclude-dir=.cursor \
      --exclude=verify-lomi-plugins.sh \
      "$pattern" "$path"
  fi
}

search_must_exist() {
  local pattern="$1"
  local path="$2"
  if [[ "$SEARCH_TOOL" == "rg" ]]; then
    rg -q \
      --glob '!**/node_modules/**' \
      --glob '!**/dist/**' \
      --glob '!**/.next/**' \
      --glob '!**/build/**' \
      --glob '!**/coverage/**' \
      --glob '!**/.cursor/**' \
      --glob '!verify-lomi-plugins.sh' \
      "$pattern" "$path"
  else
    grep -RqE \
      --exclude-dir=.git \
      --exclude-dir=node_modules \
      --exclude-dir=dist \
      --exclude-dir=.next \
      --exclude-dir=build \
      --exclude-dir=coverage \
      --exclude-dir=.cursor \
      --exclude=verify-lomi-plugins.sh \
      "$pattern" "$path"
  fi
}

file_must_exist() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "FAIL: missing required file: $file"
    exit 1
  fi
}

# Private platform submodules (shopify, bubble) are not checked out in CI
# because the default token cannot clone them. Skip their checks when absent;
# they are validated where the submodule is available (local/dev with access).
plugin_present() {
  local dir="$1"
  [[ -d "$dir" ]] && [[ -n "$(ls -A "$dir" 2>/dev/null)" ]]
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --run-runtime)
      RUN_RUNTIME=1
      shift
      ;;
    --magento-root)
      MAGENTO_ROOT="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

if command -v rg >/dev/null 2>&1; then
  SEARCH_TOOL="rg"
elif command -v grep >/dev/null 2>&1; then
  SEARCH_TOOL="grep"
else
  echo "Missing search tools: need rg or grep"
  exit 1
fi

log "1/8 Checking for legacy brand remnants in apps/plugins"
if search_has_matches "$LEGACY_BRAND_PATTERN" "$PLUGINS_DIR"; then
  echo
  echo "FAIL: Found remaining legacy brand references."
  exit 1
fi
echo "PASS: No legacy brand references found."

log "2/8 Validating Lomi API contract references in plugins"

# Woo sends X-API-KEY and reads HTTP_X_LOMI_SIGNATURE / HTTP_X_LOMI_EVENT ($_SERVER keys).
LOMI_API_CONTRACT_RE='checkout-sessions|X-API-[Kk]ey|X-Lomi-Signature|HTTP_X_LOMI_SIGNATURE|X-Lomi-Event|HTTP_X_LOMI_EVENT|api\.lomi\.africa|sandbox\.api\.lomi\.africa'

echo "- Magento"
search_must_exist "$LOMI_API_CONTRACT_RE" \
  "$PLUGINS_DIR/magento"
echo "  PASS"

echo "- PrestaShop"
search_must_exist "$LOMI_API_CONTRACT_RE" \
  "$PLUGINS_DIR/prestashop"
echo "  PASS"

echo "- Woo"
search_must_exist "$LOMI_API_CONTRACT_RE" \
  "$PLUGINS_DIR/woo"
echo "  PASS"

echo "- Shopify"
if plugin_present "$PLUGINS_DIR/shopify/app"; then
  search_must_exist "/checkout-sessions|integration_source|api\.lomi\.africa|sandbox\.api\.lomi\.africa" \
    "$PLUGINS_DIR/shopify/app"
  echo "  PASS"
else
  echo "  SKIP (shopify submodule not checked out)"
fi

echo "- Bubble"
if plugin_present "$PLUGINS_DIR/bubble"; then
  search_must_exist "$LOMI_API_CONTRACT_RE" \
    "$PLUGINS_DIR/bubble"
  echo "  PASS"
else
  echo "  SKIP (bubble submodule not checked out)"
fi

log "3/8 Validating integration_source attribution (must match DB enum)"

echo "- Woo → woocommerce"
search_must_exist "'integration_source'[[:space:]]*=>[[:space:]]*'woocommerce'|integration_source:[[:space:]]*'woocommerce'" \
  "$PLUGINS_DIR/woo"
echo "  PASS"

echo "- PrestaShop → prestashop"
search_must_exist "'integration_source'[[:space:]]*=>[[:space:]]*'prestashop'" \
  "$PLUGINS_DIR/prestashop"
echo "  PASS"

echo "- Magento → magento"
search_must_exist "'integration_source'[[:space:]]*=>[[:space:]]*'magento'" \
  "$PLUGINS_DIR/magento"
echo "  PASS"

echo "- Shopify → shopify"
if plugin_present "$PLUGINS_DIR/shopify/app"; then
  search_must_exist 'integration_source:[[:space:]]*"shopify"' \
    "$PLUGINS_DIR/shopify/app"
  echo "  PASS"
else
  echo "  SKIP (shopify submodule not checked out)"
fi

echo "- Bubble → bubble"
if plugin_present "$PLUGINS_DIR/bubble"; then
  search_must_exist "integration_source: 'bubble'|integration_source: \"bubble\"" \
    "$PLUGINS_DIR/bubble"
  echo "  PASS"
else
  echo "  SKIP (bubble submodule not checked out)"
fi

log "4/8 Validating XOF amount handling (whole francs, not minor units)"

search_must_exist "=== 'XOF'" "$PLUGINS_DIR/magento/Gateway/LomiApiClient.php"
search_must_exist "=== 'XOF'" "$PLUGINS_DIR/prestashop/lomi/lomi.php"
search_must_exist "'XOF' => 0" "$PLUGINS_DIR/woo/includes/class-wc-gateway-lomi.php"
if plugin_present "$PLUGINS_DIR/bubble"; then
  search_must_exist "code === 'XOF'" "$PLUGINS_DIR/bubble/lib/lomi-server-helpers.js"
  echo "PASS: XOF special-casing present in Magento, PrestaShop, Woo, and Bubble."
else
  echo "PASS: XOF special-casing present in Magento, PrestaShop, and Woo (Bubble skipped)."
fi

log "5/8 Validating checkout branding assets"

file_must_exist "$PLUGINS_DIR/magento/view/frontend/web/css/checkout-branding.css"
file_must_exist "$PLUGINS_DIR/magento/view/frontend/web/images/pay-with-lomi.webp"
file_must_exist "$PLUGINS_DIR/prestashop/lomi/views/css/checkout-branding.css"
file_must_exist "$PLUGINS_DIR/prestashop/lomi/views/img/pay-with-lomi.webp"
file_must_exist "$PLUGINS_DIR/woo/assets/css/checkout-branding.css"
search_must_exist "wc-lomi-checkout-branding" "$PLUGINS_DIR/woo"
if plugin_present "$PLUGINS_DIR/bubble"; then
  file_must_exist "$PLUGINS_DIR/bubble/assets/images/pay-with-lomi.webp"
  file_must_exist "$PLUGINS_DIR/bubble/assets/images/secured-by-lomi.webp"
  file_must_exist "$PLUGINS_DIR/bubble/assets/js/lomi-embed.js"
  file_must_exist "$PLUGINS_DIR/bubble/elements/LOM-branding/params.json"
  echo "PASS: branding CSS and pay-with image present on Magento, PrestaShop, Woo, and Bubble."
else
  echo "PASS: branding CSS and pay-with image present on Magento, PrestaShop, and Woo (Bubble skipped)."
fi

log "6/8 Validating test/live webhook secret switching"

search_must_exist "test_webhook_secret|testmode.*webhook_secret|LOMI_TEST_WEBHOOK_SECRET" "$PLUGINS_DIR/magento"
search_must_exist "live_webhook_secret|LOMI_LIVE_WEBHOOK_SECRET" "$PLUGINS_DIR/magento"
search_must_exist "REFUND_COMPLETED" "$PLUGINS_DIR/magento/Controller/Payment/Webhook.php"
search_must_exist "getWebhookSecret|LOMI_TEST_WEBHOOK_SECRET|LOMI_LIVE_WEBHOOK_SECRET" "$PLUGINS_DIR/prestashop"
search_must_exist "test_webhook_secret|live_webhook_secret|webhook_secret" "$PLUGINS_DIR/woo/includes/class-wc-gateway-lomi.php"
search_must_exist "sandbox\.api\.lomi\.africa|api\.lomi\.africa" "$PLUGINS_DIR/magento/Gateway/LomiApiClient.php"
if plugin_present "$PLUGINS_DIR/bubble"; then
  search_must_exist "sandbox\.api\.lomi\.africa|api\.lomi\.africa" "$PLUGINS_DIR/bubble/actions/LOM-create_session/server.js"
fi
search_must_exist "sandbox\.api\.lomi\.africa|api\.lomi\.africa" "$PLUGINS_DIR/prestashop/lomi/classes/LomiApiClient.php"
echo "PASS: test/live API base URLs and webhook secret fields detected."

log "6b/8 Validating abandon recovery assets"

file_must_exist "$PLUGINS_DIR/woo/assets/js/checkout-abandon.js"
file_must_exist "$PLUGINS_DIR/magento/view/frontend/web/js/checkout-abandon.js"
file_must_exist "$PLUGINS_DIR/prestashop/lomi/views/js/checkout-abandon.js"
file_must_exist "$PLUGINS_DIR/prestashop/lomi/controllers/front/abandon.php"
if plugin_present "$PLUGINS_DIR/bubble"; then
  file_must_exist "$PLUGINS_DIR/bubble/assets/js/checkout-abandon.js"
  file_must_exist "$PLUGINS_DIR/bubble/actions/LOM-parse_webhook/server.js"
  search_must_exist "PAYMENT_SUCCEEDED" "$PLUGINS_DIR/bubble"
  echo "PASS: abandon recovery assets present on Woo, Magento, PrestaShop, and Bubble."
else
  echo "PASS: abandon recovery assets present on Woo, Magento, and PrestaShop (Bubble skipped)."
fi

log "7/8 Scanning plugin trees for broken image path references"
python3 "$SCRIPT_DIR/scan_broken_images.py"

log "8/8 Checking Magento rename targets are present"
search_must_exist "Lomi_Payments|Lomi\\\\Payments|payment/lomi|/lomi/payment/" \
  "$PLUGINS_DIR/magento"
echo "PASS: Magento rename targets detected."

if [[ "$RUN_RUNTIME" -eq 1 ]]; then
  log "Optional: running Magento runtime commands"
  if [[ -z "$MAGENTO_ROOT" ]]; then
    echo "FAIL: --run-runtime requires --magento-root /path/to/magento"
    exit 1
  fi
  if [[ ! -f "$MAGENTO_ROOT/bin/magento" ]]; then
    echo "FAIL: Magento binary not found at: $MAGENTO_ROOT/bin/magento"
    exit 1
  fi
  if ! command -v php >/dev/null 2>&1; then
    echo "FAIL: php is required for Magento runtime checks."
    exit 1
  fi

  php "$MAGENTO_ROOT/bin/magento" module:status | grep -E "Lomi_Payments" || true
  php "$MAGENTO_ROOT/bin/magento" setup:upgrade
  php "$MAGENTO_ROOT/bin/magento" setup:di:compile
  php "$MAGENTO_ROOT/bin/magento" cache:flush
  echo "PASS: Magento runtime commands completed."
else
  cat <<'EOF'

Runtime checks skipped. Run end-to-end in each stack:
  - Magento:  apps/plugins/magento/dev (Docker) — place order, webhook, abandon flow
  - PrestaShop: docker-compose in apps/plugins/prestashop
  - Woo: apps/plugins/woo/dev (Docker) or staging store with test + live keys

Optional Magento runtime:
  ./verify-lomi-plugins.sh --run-runtime --magento-root /absolute/path/to/magento
EOF
fi

log "All automated plugin checks passed."
