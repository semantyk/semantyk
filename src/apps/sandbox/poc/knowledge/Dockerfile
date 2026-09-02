#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `Dockerfile`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file defines the Docker image for the knowledge app.
#
# @created: 2026-09-02 11:48
# @modified: 2026-09-02 12:36
#
# @since: 0.1.0-alpha.42
# @version: 0.1.0-alpha.43
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

FROM stain/jena-fuseki:5.1.0

ENV FUSEKI_BASE=/fuseki

EXPOSE 3030

COPY entrypoint.sh /knowledge-entrypoint.sh
COPY src/config/shiro.ini /jena-fuseki/shiro.ini
COPY src/config/log4j2.properties /jena-fuseki/log4j2.properties
COPY src/config/*.config.ttl /fuseki/configuration/

ENTRYPOINT ["/sbin/tini", "--", "sh", "/knowledge-entrypoint.sh"]
CMD ["/jena-fuseki/fuseki-server"]
