#!/bin/bash -e

npx tsc

rm -rf dist/*
cp -r nacht_server_BP dist/
rm -rf dist/nacht_server_BP/src
cp -r nacht_server_RP dist/

cp -r dist/nacht_server_BP ../development_behavior_packs
cp -r dist/nacht_server_RP ../development_resource_packs
