#!/usr/bin/env bash
# Install the PostgreSQL 17 client. pg_dump must be at least the server major
# (Supabase runs 17). Ubuntu's default client is older on 24.04 and may not be
# 17 on later images, so this uses the PGDG apt repo for the runner's codename.
# The key download is retried: a single dropped connection used to fail the
# database backup (curl exit 56, then "no valid OpenPGP data").
set -euo pipefail

root="$(cd "$(dirname "$0")" && pwd)"
bash "$root/apt-with-retry.sh" age jq curl gnupg lsb-release ca-certificates

key="$(mktemp)"
trap 'rm -f "$key"' EXIT

installed=0
for attempt in 1 2 3 4 5; do
  if curl -fsSL --retry 5 --retry-delay 2 --retry-all-errors \
      https://www.postgresql.org/media/keys/ACCC4CF8.asc -o "$key" \
    && sudo gpg --batch --yes --dearmor -o /etc/apt/trusted.gpg.d/pgdg.gpg "$key"; then
    installed=1
    break
  fi
  echo "PostgreSQL apt key download failed (attempt ${attempt})."
  rm -f "$key"
  sleep $((attempt * 3))
done

if [ "$installed" -ne 1 ]; then
  echo "::error::Could not download the PostgreSQL apt signing key." >&2
  exit 1
fi

codename="$(lsb_release -cs)"
echo "deb [signed-by=/etc/apt/trusted.gpg.d/pgdg.gpg] https://apt.postgresql.org/pub/repos/apt ${codename}-pgdg main" \
  | sudo tee /etc/apt/sources.list.d/pgdg.list >/dev/null

bash "$root/apt-with-retry.sh" postgresql-client-17

# ubuntu-latest ships a local Postgres cluster. pg_dump on PATH is the
# postgresql-common wrapper, which stays on that cluster's major even after
# client 17 is installed ("server version mismatch: server 17.x, pg_dumpall 16.x").
# Later steps need the real v17 binaries first.
echo "/usr/lib/postgresql/17/bin" >> "$GITHUB_PATH"
pg_dumpall_bin="/usr/lib/postgresql/17/bin/pg_dumpall"
"$pg_dumpall_bin" --version
case "$("$pg_dumpall_bin" --version)" in
  *" 17."*) echo "pg_dumpall 17 confirmed." ;;
  *)
    echo "::error::Expected pg_dumpall 17 at ${pg_dumpall_bin}." >&2
    exit 1
    ;;
esac
