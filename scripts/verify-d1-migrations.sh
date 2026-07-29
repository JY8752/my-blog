#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
verify_dir="$(mktemp -d "${TMPDIR:-/tmp}/my-blog-d1-verify.XXXXXX")"

cleanup() {
  rm -rf -- "$verify_dir"
}
trap cleanup EXIT

cd "$project_root"

env \
  CI=true \
  WRANGLER_LOG_PATH="$verify_dir/wrangler.log" \
  ./node_modules/.bin/wrangler d1 migrations apply my-blog-scraps \
  --local \
  --persist-to "$verify_dir"
