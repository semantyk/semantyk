#!/bin/sh
set -eu

: "${CREDENTIALS:?CREDENTIALS is required (user:password)}"

ADMIN_USER="${CREDENTIALS%%:*}"
ADMIN_PASSWORD="${CREDENTIALS#*:}"

[ -n "$ADMIN_USER" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }
[ -n "$ADMIN_PASSWORD" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }
[ "$ADMIN_USER" != "$CREDENTIALS" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }

export ADMIN_USER ADMIN_PASSWORD
envsubst '${ADMIN_USER} ${ADMIN_PASSWORD}' \
  < /jena-fuseki/shiro.ini \
  > /fuseki/shiro.ini

exec sh /docker-entrypoint.sh "$@"
