#!/bin/sh
set -eu
dir="${WORKER_DATA_DIR:-/data}"
mkdir -p "$dir"
chown pwuser:pwuser "$dir"
exec runuser -u pwuser -- node --experimental-strip-types src/index.ts
