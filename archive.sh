#!/bin/bash -e

FILENAME=nacht_server_addon_v${npm_package_version}

zip -r releases/${FILENAME}.zip dist/* README.md
cp releases/${FILENAME}.zip releases/${FILENAME}.mcaddon

rm -rf ../development_behavior_packs/nacht_server_BP ../development_resource_packs/nacht_server_RP
