#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# `dataset.reset.ru`
# @organization: Semantyk
# @project: Ecosystem
#
# @file: This file clears the logical-dataset skeleton before TriG seed load.
#
# @created: 2026-09-02 14:20
# @modified: 2026-09-02 14:32
#
# @since: 0.1.0-alpha.48
# @version: 0.1.0-alpha.50
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <daniel@semantyk.com>
#
# @copyright: Semantyk © 2026
#––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
#
# Placeholders: SEMANTYK_NS, DATASET.
# Makes TriG seed load idempotent across container restarts.

DROP SILENT GRAPH <${SEMANTYK_NS}/${DATASET}> ;
DROP SILENT GRAPH <${SEMANTYK_NS}/${DATASET}/tbox> ;
DROP SILENT GRAPH <${SEMANTYK_NS}/${DATASET}/abox> ;
DROP SILENT GRAPH <${SEMANTYK_NS}/${DATASET}/vbox> ;

DELETE WHERE {
  <${SEMANTYK_NS}/${DATASET}> ?p ?o .
} ;
