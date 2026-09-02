#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `dataset.reset.ru`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file clears the logical-dataset skeleton before TriG seed load.
#
# @created: 2026-09-02 14:20
# @modified: 2026-09-02 14:20
#
# @since: 0.1.0-alpha.48
# @version: 0.1.0-alpha.48
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
#
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
#
# Placeholders: SEMANTYK_BASE_URI, DATASET.
# Makes TriG seed load idempotent across container restarts.

DROP SILENT GRAPH <${SEMANTYK_BASE_URI}/${DATASET}> ;
DROP SILENT GRAPH <${SEMANTYK_BASE_URI}/${DATASET}/tbox> ;
DROP SILENT GRAPH <${SEMANTYK_BASE_URI}/${DATASET}/abox> ;
DROP SILENT GRAPH <${SEMANTYK_BASE_URI}/${DATASET}/vbox> ;

DELETE WHERE {
  <${SEMANTYK_BASE_URI}/${DATASET}> ?p ?o .
} ;
