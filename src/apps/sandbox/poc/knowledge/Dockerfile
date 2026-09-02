#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `Dockerfile`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file defines the Docker image for the knowledge app.
#
# @created: 2026-09-02 13:38
# @modified: 2026-09-02 13:38
#
# @since: 0.1.0-alpha.42
# @version: 0.1.0-alpha.46
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

FROM eclipse-temurin:21-jre-alpine

ARG JENA_VERSION=6.2.0
ARG MAVEN_BASE=https://repo1.maven.org/maven2
ARG FUSEKI_JAR=jena-fuseki-server-${JENA_VERSION}.jar

ENV FUSEKI_HOME=/opt/fuseki \
    FUSEKI_BASE=/fuseki \
    SIS_DATA=/fuseki/databases/sis \
    JVM_ARGS=-Xmx4G \
    JAVA_OPTIONS=-Xmx4G

EXPOSE 3030

RUN apk add --no-cache curl gettext tini \
 && addgroup -g 1000 fuseki \
 && adduser -D -H -G fuseki -u 1000 -s /bin/sh fuseki \
 && mkdir -p "${FUSEKI_HOME}" \
             "${FUSEKI_BASE}/configuration" \
             "${FUSEKI_BASE}/databases" \
             "${FUSEKI_BASE}/logs" \
 && curl -fsSL -o "${FUSEKI_HOME}/${FUSEKI_JAR}" \
      "${MAVEN_BASE}/org/apache/jena/jena-fuseki-server/${JENA_VERSION}/${FUSEKI_JAR}" \
 && curl -fsSL -o /tmp/${FUSEKI_JAR}.sha1 \
      "${MAVEN_BASE}/org/apache/jena/jena-fuseki-server/${JENA_VERSION}/${FUSEKI_JAR}.sha1" \
 && echo "$(cat /tmp/${FUSEKI_JAR}.sha1)  ${FUSEKI_HOME}/${FUSEKI_JAR}" | sha1sum -c - \
 && rm -f /tmp/${FUSEKI_JAR}.sha1 \
 && ln -sf "${FUSEKI_HOME}/${FUSEKI_JAR}" "${FUSEKI_HOME}/fuseki-server.jar" \
 && chown -R fuseki:fuseki "${FUSEKI_HOME}" "${FUSEKI_BASE}"

COPY entrypoint.sh /knowledge-entrypoint.sh
COPY src/config/shiro.ini /opt/fuseki/shiro.ini
COPY src/config/log4j2.properties /opt/fuseki/log4j2.properties
COPY src/config/*.config.ttl /fuseki/configuration/

RUN chown -R fuseki:fuseki /opt/fuseki /fuseki /knowledge-entrypoint.sh \
 && chmod +x /knowledge-entrypoint.sh

USER fuseki
WORKDIR /fuseki

ENTRYPOINT ["/sbin/tini", "--", "sh", "/knowledge-entrypoint.sh"]
CMD []
