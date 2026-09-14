#!/usr/bin/env bash
# Fail if any superproject gitlink SHA is missing from its GitHub origin.
# Usage: bash .github/scripts/verify-submodule-pins.sh
# Optional: REPO_CHECKOUT_PAT (private repos) or GITHUB_TOKEN.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

token="${REPO_CHECKOUT_PAT:-${GITHUB_TOKEN:-${TOKEN:-}}}"
auth_args=(-H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28")
if [[ -n "$token" ]]; then
  auth_args+=(-H "Authorization: Bearer ${token}")
fi

failed=0
while read -r key path; do
  name="${key#submodule.}"
  name="${name%.path}"
  url="$(git config -f .gitmodules --get "submodule.${name}.url")"
  sha="$(git rev-parse "HEAD:${path}")"
  repo="${url#https://github.com/}"
  repo="${repo%.git}"

  tmp="$(mktemp)"
  code="$(curl -sS -o "$tmp" -w "%{http_code}" \
    "${auth_args[@]}" \
    "https://api.github.com/repos/${repo}/commits/${sha}" || true)"

  if [[ "$code" == "200" ]]; then
    echo "ok      ${path}  ${sha:0:12}  ${repo}"
  else
    echo "MISSING ${path}  ${sha}  ${repo}  HTTP ${code}"
    if [[ -s "$tmp" ]]; then
      echo "        $(tr '\n' ' ' < "$tmp" | head -c 300)"
    fi
    if [[ "$code" == "404" || "$code" == "403" || "$code" == "422" ]]; then
      echo "        Pin is not a commit on origin (dirty/unpushed SHA), or this token cannot read ${repo}."
      echo "        Push the submodule commit first, then update the parent gitlink."
    fi
    failed=1
  fi
  rm -f "$tmp"
done < <(git config -f .gitmodules --get-regexp '^submodule\..*\.path$')

exit "$failed"
