#!/usr/bin/env bash
# Probe documented ecommerce install hosts. Shopify is optional until
# connect.lomi.africa DNS + Vercel deploy are live (`--strict-shopify`).
set -euo pipefail

strict_shopify=0
if [[ "${1:-}" == "--strict-shopify" ]]; then
  strict_shopify=1
fi

fail=0

check() {
  local name="$1"
  local url="$2"
  local expect="${3:-200}"
  local code
  code="$(curl -sS -o /dev/null -w "%{http_code}" --max-time 20 -L "$url" || echo "000")"
  if [[ "$code" == "$expect" ]]; then
    printf "ok   %s %s -> %s\n" "$name" "$url" "$code"
    return 0
  fi
  printf "fail %s %s -> %s (expected %s)\n" "$name" "$url" "$code" "$expect"
  fail=1
}

check "api" "https://api.lomi.africa/" 200
check "sandbox-api" "https://sandbox.api.lomi.africa/" 200
check "woo-docs-zip" "https://docs.lomi.africa/downloads/woo-lomi.zip" 200
check "woo-github" "https://github.com/lomiafrica/woo" 200
check "magento-github" "https://github.com/lomiafrica/magento" 200
check "prestashop-github" "https://github.com/lomiafrica/prestashop" 200
check "bubble-github" "https://github.com/lomiafrica/bubble" 200

shopify_code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 \
  "https://connect.lomi.africa/health" 2>/dev/null || true)"
shopify_code="${shopify_code:-000}"
if [[ "$shopify_code" == "200" ]]; then
  printf "ok   shopify-health https://connect.lomi.africa/health -> %s\n" "$shopify_code"
else
  printf "warn shopify-health https://connect.lomi.africa/health -> %s\n" "$shopify_code"
  if [[ "$strict_shopify" -eq 1 ]]; then
    fail=1
  fi
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi
