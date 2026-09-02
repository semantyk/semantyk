#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `Dockerfile`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file defines the Docker image for the knowledge app.
#
# @created: 2026-09-02 11:48
# @modified: 2026-09-02 14:03
#
# @since: 0.1.0-alpha.42
# @version: 0.1.0-alpha.47
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

FROM eclipse-temurin:21-jre-alpine

ARG JENA_VERSION=6.2.0
ARG APACHE_DIST=https://dlcdn.apache.org/jena/binaries
ARG FUSEKI_SHA512=ba65f5867d2d4741b2ed9e2af5a0d4fbb447909894ab2a0c6bc4dac8997f4fe339c87b13c48d45d054977769f0f8bf763ea346b1f7792d5cdc458041bd43a132

ENV FUSEKI_HOME=/jena-fuseki \
    FUSEKI_BASE=/fuseki \
    SIS_DATA=/fuseki/databases/sis \
    JVM_ARGS=-Xmx4G

EXPOSE 3030

RUN apk add --no-cache curl gettext tini \
 && addgroup -g 1000 fuseki \
 && adduser -D -H -G fuseki -u 1000 -s /bin/sh fuseki \
 && mkdir -p "${FUSEKI_HOME}" \
             "${FUSEKI_BASE}/configuration" \
             "${FUSEKI_BASE}/databases" \
             "${FUSEKI_BASE}/logs" \
             "${FUSEKI_BASE}/seed" \
 && curl -fsSL -o /tmp/fuseki.tar.gz \
      "${APACHE_DIST}/apache-jena-fuseki-${JENA_VERSION}.tar.gz" \
 && echo "${FUSEKI_SHA512}  /tmp/fuseki.tar.gz" | sha512sum -c - \
 && tar -xzf /tmp/fuseki.tar.gz -C /tmp \
 && mv /tmp/apache-jena-fuseki-${JENA_VERSION}/* "${FUSEKI_HOME}/" \
 && test -x "${FUSEKI_HOME}/fuseki-server" \
 && rm -rf /tmp/fuseki.tar.gz /tmp/apache-jena-fuseki-${JENA_VERSION} \
 && chown -R fuseki:fuseki "${FUSEKI_HOME}" "${FUSEKI_BASE}"

COPY entrypoint.sh /knowledge-entrypoint.sh
COPY src/config/shiro.ini /jena-fuseki/shiro.ini
COPY src/config/log4j2.properties /jena-fuseki/log4j2.properties
COPY src/config/*.config.ttl /fuseki/configuration/
COPY src/seed/ /fuseki/seed/

RUN chown -R fuseki:fuseki /jena-fuseki /fuseki /knowledge-entrypoint.sh \
 && chmod +x /knowledge-entrypoint.sh

USER fuseki
WORKDIR /fuseki

ENTRYPOINT ["/sbin/tini", "--", "sh", "/knowledge-entrypoint.sh"]
CMD ["/jena-fuseki/fuseki-server"]
