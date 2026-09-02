#!/bin/sh
set -eu

: "${CREDENTIALS:?CREDENTIALS is required (user:password)}"
: "${FUSEKI_HOME:=/opt/fuseki}"
: "${FUSEKI_BASE:=/fuseki}"

ADMIN_USER="${CREDENTIALS%%:*}"
ADMIN_PASSWORD="${CREDENTIALS#*:}"

[ -n "$ADMIN_USER" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }
[ -n "$ADMIN_PASSWORD" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }
[ "$ADMIN_USER" != "$CREDENTIALS" ] || { echo "CREDENTIALS must be user:password" >&2; exit 1; }

export ADMIN_USER ADMIN_PASSWORD
envsubst '${ADMIN_USER} ${ADMIN_PASSWORD}' \
  < "${FUSEKI_HOME}/shiro.ini" \
  > "${FUSEKI_BASE}/shiro.ini"

# Persist Apache SIS geodetic data under the databases volume.
mkdir -p "${SIS_DATA:-${FUSEKI_BASE}/databases/sis}"

JAR="${FUSEKI_HOME}/fuseki-server.jar"
[ -e "$JAR" ] || { echo "Missing $JAR" >&2; exit 1; }

# shellcheck disable=SC2086
exec java ${JVM_ARGS:--Xmx4G} \
  -Dlog4j.configurationFile="${FUSEKI_HOME}/log4j2.properties" \
  -jar "$JAR" \
  "$@"
