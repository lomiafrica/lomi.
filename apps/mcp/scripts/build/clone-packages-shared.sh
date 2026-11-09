#!/bin/sh
# Fetch packages/shared from private lomiafrica/packages during the MCP image
# build. Railway injects LOMI_PACKAGES_SSH_KEY, and may also inject
# LOMI_PACKAGES_PAT or REPO_CHECKOUT_PAT. Prefer the PAT. A key stored with
# literal \n sequences is turned back into real lines before ssh uses it.
set -eu

keyfile="$(mktemp)"
cleanup() { rm -f "$keyfile"; }
trap cleanup EXIT

write_key() {
  raw="$1"
  if printf '%s' "$raw" | grep -q '\\n'; then
    printf '%b\n' "$raw" > "$keyfile"
  else
    printf '%s\n' "$raw" > "$keyfile"
  fi
  chmod 600 "$keyfile"
}

token="${LOMI_PACKAGES_PAT:-${REPO_CHECKOUT_PAT:-}}"
ssh_key="${LOMI_PACKAGES_SSH_KEY:-}"

if [ -z "$token" ] && [ -n "$ssh_key" ]; then
  case "$ssh_key" in
    ghp_*|github_pat_*|gho_*) token="$ssh_key" ;;
  esac
fi

if [ -s /run/secrets/LOMI_PACKAGES_SSH_KEY ] && [ -z "$ssh_key" ]; then
  ssh_key="$(cat /run/secrets/LOMI_PACKAGES_SSH_KEY)"
fi

apt-get update
apt-get install -y --no-install-recommends git openssh-client ca-certificates
rm -rf /var/lib/apt/lists/*

cloned=0
if [ -n "$token" ]; then
  if git clone --depth 1 "https://x-access-token:${token}@github.com/lomiafrica/packages.git" /tmp/packages; then
    cloned=1
  fi
fi

if [ "$cloned" -ne 1 ] && [ -n "$ssh_key" ]; then
  write_key "$ssh_key"
  GIT_SSH_COMMAND="ssh -i ${keyfile} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
  export GIT_SSH_COMMAND
  if git clone --depth 1 git@github.com:lomiafrica/packages.git /tmp/packages; then
    cloned=1
  fi
  unset GIT_SSH_COMMAND
fi

if [ "$cloned" -ne 1 ]; then
  echo "failed to clone lomiafrica/packages; set LOMI_PACKAGES_PAT, REPO_CHECKOUT_PAT, or LOMI_PACKAGES_SSH_KEY" >&2
  exit 1
fi

mkdir -p /app/packages
rm -rf /app/packages/shared
cp -R /tmp/packages/shared /app/packages/shared
rm -rf /tmp/packages

test -f /app/packages/shared/package.json
