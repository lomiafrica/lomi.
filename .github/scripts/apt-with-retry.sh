#!/usr/bin/env bash
# Install apt packages on GitHub-hosted runners.
#
# ubuntu-latest (Ubuntu 26.04) intermittently cannot resolve
# azure.archive.ubuntu.com, which aborted the Supabase backup, restore,
# grants, and admin-RPC jobs before they reached Postgres. Point apt at the
# public archive and at resolvers that can see both Azure and the public
# internet, then update and install.
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: apt-with-retry.sh package [package...]" >&2
  exit 2
fi

printf 'nameserver 168.63.129.16\nnameserver 1.1.1.1\nnameserver 8.8.8.8\n' \
  | sudo tee /tmp/lomi-resolv.conf >/dev/null
# /etc/resolv.conf is a symlink to systemd-resolved's stub. Replace the
# symlink so apt does not keep asking the stub that failed to resolve the
# Ubuntu mirrors.
sudo rm -f /etc/resolv.conf
sudo mv /tmp/lomi-resolv.conf /etc/resolv.conf

if [ -f /etc/apt/sources.list.d/ubuntu.sources ]; then
  sudo sed -i \
    -e 's|https://azure.archive.ubuntu.com/ubuntu|http://archive.ubuntu.com/ubuntu|g' \
    -e 's|http://azure.archive.ubuntu.com/ubuntu|http://archive.ubuntu.com/ubuntu|g' \
    /etc/apt/sources.list.d/ubuntu.sources
fi

if [ -f /etc/apt/apt-mirrors.txt ]; then
  sudo sed -i 's|azure.archive.ubuntu.com|archive.ubuntu.com|g' /etc/apt/apt-mirrors.txt || true
fi

updated=0
for attempt in 1 2 3; do
  if sudo apt-get update; then
    updated=1
    break
  fi
  echo "apt-get update failed (attempt ${attempt}); retrying."
  sleep $((attempt * 5))
done

if [ "$updated" -ne 1 ]; then
  echo "::error::apt-get update failed after retries." >&2
  exit 1
fi

sudo apt-get install -y --no-install-recommends "$@"
