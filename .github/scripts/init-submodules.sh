#!/usr/bin/env bash
# Initialize specific git submodules at the SHAs recorded in the superproject.
# Usage: bash .github/scripts/init-submodules.sh <path> [path...]
# Optional: REPO_CHECKOUT_PAT or TOKEN for private GitHub submodules.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <submodule-path> [submodule-path...]" >&2
  exit 2
fi

root="${GITHUB_WORKSPACE:-$(git rev-parse --show-toplevel)}"
cd "$root"

token="${REPO_CHECKOUT_PAT:-${TOKEN:-}}"
if [[ -n "$token" ]]; then
  git config --global url."https://x-access-token:${token}@github.com/".insteadOf "https://github.com/"
fi

auth_url() {
  local url="$1"
  if [[ -n "$token" ]]; then
    url="${url/https:\/\/github.com\//https://x-access-token:${token}@github.com/}"
  fi
  printf '%s\n' "$url"
}

url_for_path() {
  local path="$1" key value name
  while read -r key value; do
    if [[ "$value" == "$path" ]]; then
      name="${key#submodule.}"
      name="${name%.path}"
      git config -f .gitmodules --get "submodule.${name}.url"
      return 0
    fi
  done < <(git config -f .gitmodules --get-regexp '^submodule\..*\.path$')
  return 1
}

is_gitlink() {
  local path="$1" mode
  mode="$(git ls-tree HEAD -- "$path" | awk '{print $1}')"
  [[ "$mode" == "160000" ]]
}

paths=()
for path in "$@"; do
  if is_gitlink "$path"; then
    paths+=("$path")
  else
    echo "skip ${path} (not a submodule gitlink)"
  fi
done

if [[ ${#paths[@]} -eq 0 ]]; then
  echo "no submodule gitlinks to initialize"
  exit 0
fi

git submodule sync -- "${paths[@]}"

if git -c protocol.version=1 submodule update --init --force --checkout -- "${paths[@]}"; then
  exit 0
fi

echo "submodule update failed; fetching pinned SHAs directly" >&2

for path in "${paths[@]}"; do
  sha="$(git rev-parse "HEAD:${path}")"
  url="$(url_for_path "$path")"
  if [[ -z "$url" ]]; then
    echo "error: no .gitmodules url for ${path}" >&2
    exit 1
  fi
  if [[ ! -e "${path}/.git" ]]; then
    mkdir -p "$(dirname "$path")"
    git clone --no-checkout "$(auth_url "$url")" "$path"
  fi
  git -C "$path" -c protocol.version=1 fetch --force origin "$sha"
  git -C "$path" checkout --force "$sha"
done
