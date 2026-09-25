#!/bin/sh
# Fetch packages/shared from private lomiafrica/packages during the MCP image
# build. Railway injects LOMI_PACKAGES_SSH_KEY as an ARG/env for this RUN.
# The Dockerfile RUN line only invokes this script so the key never appears
# in image history. /run/secrets is used when a builder mounts it.
set -eu

keyfile="$(mktemp)"
cleanup() { rm -f "$keyfile"; }
trap cleanup EXIT

if [ -s /run/secrets/LOMI_PACKAGES_SSH_KEY ]; then
  cp /run/secrets/LOMI_PACKAGES_SSH_KEY "$keyfile"
elif [ -n "${LOMI_PACKAGES_SSH_KEY:-}" ]; then
  printf '%s\n' "$LOMI_PACKAGES_SSH_KEY" > "$keyfile"
else
  echo "packages/shared missing: provide LOMI_PACKAGES_SSH_KEY as a BuildKit secret or build-arg" >&2
  exit 1
fi

# Accept keys that arrived without a trailing newline.
printf '\n' >> "$keyfile"
chmod 600 "$keyfile"

apt-get update
apt-get install -y --no-install-recommends git openssh-client ca-certificates
rm -rf /var/lib/apt/lists/*

GIT_SSH_COMMAND="ssh -i ${keyfile} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
export GIT_SSH_COMMAND

git clone --depth 1 git@github.com:lomiafrica/packages.git /tmp/packages
mkdir -p /app/packages
rm -rf /app/packages/shared
cp -R /tmp/packages/shared /app/packages/shared
rm -rf /tmp/packages

test -f /app/packages/shared/package.json
