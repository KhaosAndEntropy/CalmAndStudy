#!/bin/sh
set -eu

persist_dir=/data/wrangler
mkdir -p "$persist_dir"

./node_modules/.bin/wrangler d1 migrations apply calmandstudy-local \
  --local \
  --persist-to "$persist_dir" \
  --config wrangler.toml

set -- pages dev apps/web/dist \
  --ip 0.0.0.0 \
  --port "${PORT:-4173}" \
  --persist-to "$persist_dir"

if [ -n "${OPENALEX_API_KEY:-}" ]; then
  case "$OPENALEX_API_KEY" in
    *[!A-Za-z0-9_-]*)
      echo "OPENALEX_API_KEY tem caracteres inválidos para uso local." >&2
      exit 1
      ;;
  esac
  set -- "$@" --binding "OPENALEX_API_KEY=$OPENALEX_API_KEY"
fi

exec ./node_modules/.bin/wrangler "$@"
