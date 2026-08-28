#!/usr/bin/env bash
# Automated plugin test suite (issue #39). Runs static parity checks plus smoke tests.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGINS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
FAST=0
SKIP_WOO=0

usage() {
  cat <<'EOF'
Usage:
  ./scripts/run-plugin-tests.sh [--fast] [--skip-woo]

Runs:
  1) verify-lomi-plugins.sh — static API contract, branding, legacy brand scan
  2) test_webhook_signature.mjs — HMAC-SHA256 webhook contract
  3) test_bubble_json.mjs — Bubble plugin JSON parse smoke (skipped if submodule empty)
  4) Woo build + release zip validation (unless --fast or --skip-woo)

Options:
  --fast      Static checks only (no Woo pnpm build / zip)
  --skip-woo  Skip Woo build and zip validation
EOF
}

log() {
  printf "\n[%s] %s\n" "$(date +'%H:%M:%S')" "$1"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --fast)
      FAST=1
      shift
      ;;
    --skip-woo)
      SKIP_WOO=1
      shift
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

if ! command -v node >/dev/null 2>&1; then
  echo "FAIL: node is required"
  exit 1
fi

log "1/4 Static plugin parity (verify-lomi-plugins.sh)"
bash "${SCRIPT_DIR}/verify-lomi-plugins.sh"

log "2/4 Webhook signature contract"
node "${SCRIPT_DIR}/test_webhook_signature.mjs"

log "3/4 Bubble JSON smoke"
node "${SCRIPT_DIR}/test_bubble_json.mjs"

if [[ "${SKIP_WOO}" == "1" || "${FAST}" == "1" ]]; then
  log "4/4 Woo release zip — SKIPPED"
else
  log "4/4 Woo build + release zip"
  WOO_DIR="${PLUGINS_DIR}/woo"
  if [[ ! -f "${WOO_DIR}/woo-lomi.php" ]]; then
    echo "FAIL: woo submodule not initialized (${WOO_DIR})"
    exit 1
  fi
  if [[ ! -f "${WOO_DIR}/pnpm-lock.yaml" ]]; then
    echo "FAIL: woo/pnpm-lock.yaml missing"
    exit 1
  fi
  if ! command -v pnpm >/dev/null 2>&1; then
    echo "FAIL: pnpm is required for Woo build tests"
    exit 1
  fi
  (
    cd "${WOO_DIR}"
    pnpm install --ignore-workspace --frozen-lockfile
    pnpm run build
    if grep -q '"i18n"' package.json 2>/dev/null; then
      pnpm run i18n
    fi
  )
  RUN_RELEASE=1 WOO_DIR="${WOO_DIR}" bash "${SCRIPT_DIR}/test_woo_release_zip.sh"
fi

log "All automated plugin tests passed."
