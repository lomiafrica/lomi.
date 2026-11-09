#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OPENAPI="${ROOT}/../docs/openapi.json"
OUT_API="${ROOT}/src/utils/rules/api-reference.md"
OUT_LLMS="${ROOT}/src/utils/rules/llms.txt"
DOCS_LLMS_URL="${LOMI_DOCS_LLMS_URL:-https://docs.lomi.africa/llms.txt}"

if [[ ! -f "${OPENAPI}" ]]; then
  echo "OpenAPI spec not found at ${OPENAPI}" >&2
  exit 1
fi

python3 - "${OPENAPI}" "${OUT_API}" <<'PY'
import json
import sys
from pathlib import Path

openapi_path = Path(sys.argv[1])
out_path = Path(sys.argv[2])
spec = json.loads(openapi_path.read_text())

lines = [
    "# lomi. API Reference (Generated)",
    "",
    "Auto-generated from OpenAPI. Do not edit manually.",
    "",
    "Base URLs:",
    "- Production: `https://api.lomi.africa`",
    "- Sandbox: `https://sandbox.api.lomi.africa`",
    "",
]

for path, methods in sorted(spec.get("paths", {}).items()):
    for method, operation in sorted(methods.items()):
        if method.startswith("x-"):
            continue
        summary = operation.get("summary") or operation.get("operationId", "")
        lines.append(f"- `{method.upper()} {path}` — {summary}")

lines.append("")
lines.append("Full docs: https://docs.lomi.africa/api")
lines.append("")

out_path.write_text("\n".join(lines))
print(f"Wrote {out_path}")
PY

echo "Fetching llms.txt from ${DOCS_LLMS_URL}..."
if curl -fsSL "${DOCS_LLMS_URL}" -o "${OUT_LLMS}.tmp"; then
  mv "${OUT_LLMS}.tmp" "${OUT_LLMS}"
  echo "Wrote ${OUT_LLMS} from docs site"
else
  rm -f "${OUT_LLMS}.tmp"
  if [[ ! -f "${OUT_LLMS}" ]]; then
    cat > "${OUT_LLMS}" <<'EOF'
# lomi.

> Payment platform for Africa. Refresh this file with: ./scripts/generate/generate-rules.sh

- Documentation: https://docs.lomi.africa
- Sandbox API: https://sandbox.api.lomi.africa
- Live API: https://api.lomi.africa
EOF
    echo "Created fallback ${OUT_LLMS} (could not fetch from docs site)"
  else
    echo "Kept existing ${OUT_LLMS} (fetch failed)"
  fi
fi

echo "Rules generation complete."
