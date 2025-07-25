# ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
# # `serialize.py`
# @organization: Semantyk
# @project: Knowledge
#
# @file: This file contains the script to serialize the entire knowledge base
# into a single TTL file.
#
# @created: Apr 1, 2025
# @modified: Apr 1, 2025
#
# @author: Semantyk Team
# @maintainer: Daniel Bakas <https://id.danielbakas.com>
#
# @copyright: Semantyk © 2025. All rights reserved.
# ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

# * Imports
import os

from rdflib import Graph

# * Main
base_dir = 'apps/knowledge/src/'

exclude_paths = [
    'apps/knowledge/src/mex/state/fed/loc/data.ttl',
]

abox_g = Graph()
tbox_g = Graph()

namespaces_file = 'apps/knowledge/namespaces.ttl'
abox_g.parse(namespaces_file, format='turtle')
tbox_g.parse(namespaces_file, format='turtle')

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.ttl'):
            file_path = os.path.join(root, file)
            if file_path in exclude_paths:
                continue
            abox_g.parse(file_path, format='turtle')
            if file == 'onto.ttl':
                tbox_g.parse(file_path, format='turtle')

output_file = 'dist/knowledge/latest/abox.ttl'
os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w') as f:
    f.write(abox_g.serialize(format='turtle'))

output_file = 'dist/knowledge/latest/tbox.ttl'
with open(output_file, 'w') as f:
    f.write(tbox_g.serialize(format='turtle'))
