#!/usr/bin/env bash
# Extensive CLI smoke tests — run from repo root or apps/cli
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOMI="${LOMI_BIN:-$ROOT/target/release/lomi}"
PASS=0
FAIL=0
TMP="$(mktemp -d)"
export LOMI_CONFIG_DIR="$TMP/config/lomi"
mkdir -p "$LOMI_CONFIG_DIR"

log() { echo "==> $*"; }
pass() { PASS=$((PASS + 1)); echo "  PASS: $*"; }
fail() { FAIL=$((FAIL + 1)); echo "  FAIL: $*" >&2; }

assert_exit() {
  local expected=$1
  shift
  set +e
  "$@" >/dev/null 2>&1
  local code=$?
  set -e
  if [[ "$code" -eq "$expected" ]]; then
    pass "$* (exit $code)"
  else
    fail "$* (expected exit $expected, got $code)"
  fi
}

assert_contains() {
  local needle=$1
  shift
  local output
  output="$("$@" 2>&1)" || true
  if echo "$output" | grep -q "$needle"; then
    pass "output contains '$needle'"
  else
    fail "output missing '$needle'"
    echo "$output" | head -20 >&2
  fi
}

cd "$ROOT"
log "Building release binary..."
cargo build --release -q
LOMI="$ROOT/target/release/lomi"

log "1. Version and help"
assert_contains "3.4.0" "$LOMI" --version
assert_contains "checkout" "$LOMI" --help
assert_contains "listen" "$LOMI" --help
assert_contains "probe" "$LOMI" --help
assert_contains "quickstart" "$LOMI" --help
assert_contains "refunds" "$LOMI" --help
assert_contains "install-rules" "$LOMI" --help
assert_contains "completions" "$LOMI" --help
assert_contains "upgrade" "$LOMI" --help
assert_contains "get" "$LOMI" transactions --help
assert_contains "create" "$LOMI" refunds --help
assert_contains "json" "$LOMI" --help

log "2. Unauthenticated commands"
assert_contains "No profiles" "$LOMI" list-profiles
assert_exit 1 "$LOMI" whoami
assert_contains "lomi login" "$LOMI" whoami
assert_exit 1 "$LOMI" status

log "2b. Bare lomi (home)"
assert_contains "Welcome" "$LOMI" 2>/dev/null || assert_contains "quickstart" "$LOMI" 2>/dev/null || pass "bare lomi runs"

log "2c. JSON error envelope"
assert_contains '"message"' "$LOMI" --json whoami
assert_contains "lomi login" "$LOMI" --json whoami

log "3. Device auth initiation (live API)"
set +e
DEVICE_CURL=(curl -sf -X POST "https://api.lomi.africa/cli-auth/device-auth")
DEVICE_RESP="$("${DEVICE_CURL[@]}" 2>&1)"
CURL_CODE=$?
set -e
if [[ "$CURL_CODE" -eq 0 ]] && echo "$DEVICE_RESP" | grep -q "user_code"; then
  pass "device-auth returns user_code"
else
  fail "device-auth (curl exit $CURL_CODE): $DEVICE_RESP"
fi

log "4. Config read/write via Rust tests"
if cargo test -q config::global::tests api::error::tests cli::output::tests; then
  pass "cargo test config/api/output"
else
  fail "cargo test config/api/output"
fi

log "5. init --yes (headless scaffold)"
INIT_DIR="$TMP/init-project"
mkdir -p "$INIT_DIR"
(
  cd "$INIT_DIR"
  npm init -y >/dev/null 2>&1
  LOMI_ACCESS_TOKEN=smoke_test_token "$LOMI" init --yes \
    --environment sandbox \
    --language ts \
    --api-key lomi_sk_test_smoke \
    --skip-package-install \
    --skip-rules-install \
    >/dev/null 2>&1
)
for f in lib/lomi./client.ts examples/create-checkout-session.ts examples/webhook-handler.ts lomi.config.ts .env; do
  if [[ -f "$INIT_DIR/$f" ]]; then
    pass "init created $f"
  else
    fail "init missing $f"
  fi
done
if grep -q "lomi_sk_test_smoke" "$INIT_DIR/.env"; then
  pass "init wrote API key to .env"
else
  fail "init .env missing API key"
fi

log "6. install-rules (all targets)"
RULES_DIR="$TMP/rules-project"
mkdir -p "$RULES_DIR"
(
  cd "$RULES_DIR"
  "$LOMI" install-rules --target cursor --target claude-code --target codex --target vscode --target llms.txt >/dev/null 2>&1
)
[[ -f "$RULES_DIR/.cursor/rules/lomi.sdk-basics.mdc" ]] && pass "cursor rules" || fail "cursor rules"
[[ -f "$RULES_DIR/CLAUDE.md" ]] && pass "CLAUDE.md" || fail "CLAUDE.md"
[[ -f "$RULES_DIR/AGENTS.md" ]] && pass "AGENTS.md (Codex)" || fail "AGENTS.md"
[[ -f "$RULES_DIR/llms.txt" ]] && pass "llms.txt" || fail "llms.txt"
if grep -q "lomi." "$RULES_DIR/llms.txt"; then
  pass "llms.txt has lomi. content"
else
  fail "llms.txt content invalid"
fi

log "7. dev webhook server"
DEV_DIR="$TMP/dev-project"
mkdir -p "$DEV_DIR"
(
  cd "$DEV_DIR"
  LOMI_ACCESS_TOKEN=fake "$LOMI" dev --port 9876 --skip-rules-install >/dev/null 2>&1 &
  DEV_PID=$!
  sleep 1
  HTTP=$(curl -s -o /tmp/webhook-body.json -w "%{http_code}" \
    -X POST "http://127.0.0.1:9876/webhook" \
    -H "Content-Type: application/json" \
    -H "lomi-signature: t=1,s=abc" \
    -d '{"type":"test.event","data":{}}')
  kill "$DEV_PID" 2>/dev/null || true
  wait "$DEV_PID" 2>/dev/null || true
  if [[ "$HTTP" == "200" ]]; then
    pass "dev server returned 200"
  else
    fail "dev server returned $HTTP"
  fi
)

log "8. Auth with LOMI_ACCESS_TOKEN (invalid token → API error expected)"
assert_exit 1 env LOMI_ACCESS_TOKEN=invalid_token "$LOMI" status

log "9. switch / logout with seeded config"
python3 - <<PY
import json, os
from pathlib import Path
cfg_dir = Path(os.environ["LOMI_CONFIG_DIR"])
cfg_dir.mkdir(parents=True, exist_ok=True)
cfg = cfg_dir / "config.json"
cfg.write_text(json.dumps({
  "version": 2,
  "current_profile": "default",
  "profiles": {
    "default": {"cli_token": "test_token", "api_url": "https://sandbox.api.lomi.africa"},
    "sandbox": {"cli_token": "test_token2", "api_url": "https://sandbox.api.lomi.africa"}
  },
  "settings": {}
}))
PY
assert_contains "default" "$LOMI" list-profiles
assert_exit 0 "$LOMI" switch sandbox
assert_contains "sandbox" "$LOMI" list-profiles
assert_exit 0 "$LOMI" logout --profile sandbox
assert_exit 1 "$LOMI" switch sandbox

log "10. generate-rules.sh"
if ./scripts/generate/generate-rules.sh >/dev/null 2>&1; then
  pass "generate-rules.sh"
  [[ -f src/utils/rules/llms.txt ]] && pass "src/utils/rules/llms.txt exists" || fail "src/utils/rules/llms.txt missing"
else
  fail "generate-rules.sh"
fi

log "13. lomi docs (doctool delegation)"
assert_contains "sync-i18n" "$LOMI" docs --help
assert_contains "translate-i18n" "$LOMI" docs --help
if [[ -x "$ROOT/../doctool/target/release/dt" ]] || [[ -x "$ROOT/../doctool/target/debug/dt" ]]; then
  assert_contains "drift" "$LOMI" docs drift --help 2>/dev/null || assert_contains "Docs drift" "$LOMI" docs drift --help 2>/dev/null || pass "lomi docs drift help"
else
  pass "lomi docs help (dt binary not built — skipped run)"
fi

log "14. Shell completions"
assert_exit 0 "$LOMI" completions generate bash
assert_exit 0 "$LOMI" completions generate zsh

echo ""
echo "=============================="
echo "Results: $PASS passed, $FAIL failed"
echo "=============================="

rm -rf "$TMP"
[[ "$FAIL" -eq 0 ]]
