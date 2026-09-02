#!/bin/sh
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `entrypoint.sh`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file renders Shiro from CREDENTIALS, starts Fuseki, and seeds datasets.
#
# @created: 2026-09-02 12:16
# @modified: 2026-09-02 14:20
#
# @since: 0.1.0-alpha.42
# @version: 0.1.0-alpha.49
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

set -eu

: "${CREDENTIALS:?CREDENTIALS is required (user:password)}"
: "${FUSEKI_HOME:=/jena-fuseki}"
: "${FUSEKI_BASE:=/fuseki}"

ADMIN_USER="${CREDENTIALS%%:*}"
ADMIN_PASSWORD="${CREDENTIALS#*:}"

[ -n "${ADMIN_USER}" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }
[ -n "${ADMIN_PASSWORD}" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }
[ "${ADMIN_USER}" != "${CREDENTIALS}" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }

export ADMIN_USER ADMIN_PASSWORD
export SEMANTYK_BASE_URI="${SEMANTYK_BASE_URI:-http://localhost:3031}"

FUSEKI_CONFIG="${FUSEKI_BASE}/configuration"
FUSEKI_SEED="${FUSEKI_SEED:-${FUSEKI_BASE}/seed}"
FUSEKI_URL="http://127.0.0.1:3030"

mkdir -p "${FUSEKI_BASE}/databases" "${FUSEKI_BASE}/logs" "${FUSEKI_CONFIG}" \
  "${SIS_DATA:-${FUSEKI_BASE}/databases/sis}"

envsubst '${ADMIN_USER} ${ADMIN_PASSWORD}' \
  < "${FUSEKI_HOME}/shiro.ini" \
  > "${FUSEKI_BASE}/shiro.ini"
envsubst '${SEMANTYK_BASE_URI}' < "${FUSEKI_SEED}/context.ttl" > "${FUSEKI_BASE}/context.ttl"

curl_admin() {
  curl -sf -u "${ADMIN_USER}:${ADMIN_PASSWORD}" "$@"
}

# Dataset names follow `{name}.config.ttl` (same convention as the assemblers).
list_datasets() {
  for config in "${FUSEKI_CONFIG}"/*.config.ttl; do
    [ -f "${config}" ] || continue
    basename "${config}" .config.ttl
  done | sort -u
}

seed_prefix_map() {
  dataset="$1"
  sed -n 's/^@prefix[[:space:]]\{1,\}\([^:]\{1,\}\):[[:space:]]\{1,\}<\([^>]\{1,\}\)>.*/\1|\2/p' \
    "${FUSEKI_BASE}/context.ttl" |
  while IFS='|' read -r prefix uri; do
    [ -n "${prefix}" ] || continue
    curl_admin -X POST -G "${FUSEKI_URL}/${dataset}/prefixes-rw" \
      --data-urlencode "prefix=${prefix}" \
      --data-urlencode "uri=${uri}" >/dev/null
  done
}

reset_logical_model() {
  dataset="$1"
  export DATASET="${dataset}"
  envsubst '${SEMANTYK_BASE_URI} ${DATASET}' < "${FUSEKI_SEED}/dataset.reset.ru" |
    curl_admin -X POST "${FUSEKI_URL}/${dataset}/update" \
      -H "Content-Type: application/sparql-update" \
      --data-binary @- >/dev/null
}

seed_trig() {
  dataset="$1"
  export DATASET="${dataset}"
  envsubst '${SEMANTYK_BASE_URI} ${DATASET}' < "${FUSEKI_SEED}/dataset.trig" |
    curl_admin -X POST "${FUSEKI_URL}/${dataset}/data" \
      -H "Content-Type: application/trig" \
      --data-binary @- >/dev/null
}

seed_dataset() {
  dataset="$1"
  reset_logical_model "${dataset}"
  seed_trig "${dataset}"
  seed_prefix_map "${dataset}"
}

"$@" &
pid=$!
trap 'kill -TERM "${pid}" 2>/dev/null || true; wait "${pid}"' TERM INT

i=0
until curl -sf "${FUSEKI_URL}/\$/ping" >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "${i}" -gt 60 ]; then
    echo "Fuseki did not become ready in time" >&2
    kill -TERM "${pid}" 2>/dev/null || true
    wait "${pid}" || true
    exit 1
  fi
  sleep 1
done

for dataset in $(list_datasets); do
  seed_dataset "${dataset}"
done

wait "${pid}"
