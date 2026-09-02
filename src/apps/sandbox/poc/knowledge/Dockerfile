#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `Dockerfile`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file defines the Docker image for the knowledge app.
#
# @created: 2026-09-02 11:48
# @modified: 2026-09-02 13:08
#
# @since: 0.1.0-alpha.42
# @version: 0.1.0-alpha.44
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

FROM stain/jena-fuseki:5.1.0

ARG JENA_VERSION=5.1.0
ARG MAVEN_BASE=https://repo1.maven.org/maven2

ENV FUSEKI_BASE=/fuseki \
    SIS_DATA=/fuseki/databases/sis

EXPOSE 3030

USER root
RUN mkdir -p /fuseki-extra \
 && curl -fsSL -o /fuseki-extra/jena-fuseki-geosparql-${JENA_VERSION}.jar \
      ${MAVEN_BASE}/org/apache/jena/jena-fuseki-geosparql/${JENA_VERSION}/jena-fuseki-geosparql-${JENA_VERSION}.jar \
 && chown -R fuseki:fuseki /fuseki-extra
USER fuseki

COPY entrypoint.sh /knowledge-entrypoint.sh
COPY src/config/shiro.ini /jena-fuseki/shiro.ini
COPY src/config/log4j2.properties /jena-fuseki/log4j2.properties
COPY src/config/*.config.ttl /fuseki/configuration/

ENTRYPOINT ["/sbin/tini", "--", "sh", "/knowledge-entrypoint.sh"]
CMD ["/jena-fuseki/fuseki-server"]
