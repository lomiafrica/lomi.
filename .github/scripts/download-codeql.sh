#!/usr/bin/env bash
# The CodeQL action downloads its bundle with curl and gives up on a 504.
# The GitHub API download retried here is the same path that works for gitleaks.
set -euo pipefail

tag="codeql-bundle-v2.27.4"
asset="codeql-bundle-linux64.tar.zst"
dest="${RUNNER_TEMP}/codeql-bundle"
mkdir -p "$dest"

if ! command -v zstd >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y zstd
fi

ok=0
for attempt in 1 2 3 4 5; do
  if gh release download "$tag" \
    --repo github/codeql-action \
    --pattern "$asset" \
    --output "${dest}/${asset}" \
    --clobber; then
    ok=1
    break
  fi
  echo "CodeQL download attempt ${attempt} failed"
  sleep $((attempt * 8))
done

test "$ok" = 1
# The CodeQL action extracts the archive itself and only accepts a .tar.zst path.
echo "tools=${dest}/${asset}" >> "$GITHUB_OUTPUT"
