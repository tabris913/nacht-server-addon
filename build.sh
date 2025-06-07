#!/bin/bash -e

rm -rf nacht_server_BP/scripts/
npx tsc
mkdir nacht_server_BP/scripts/types
cp node_modules/@minecraft/vanilla-data/lib/index.js nacht_server_BP/scripts/types/

rm -rf dist/*
cp -r nacht_server_BP dist/
rm -rf dist/nacht_server_BP/src
cp -r nacht_server_RP dist/

rm -rf ../development_behavior_packs/nacht_server_BP
rm -rf ../development_resource_packs/nacht_server_RP
cp -r dist/nacht_server_BP ../development_behavior_packs
cp -r dist/nacht_server_RP ../development_resource_packs
