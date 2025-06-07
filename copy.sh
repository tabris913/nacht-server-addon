#!/bin/bash -e

rm -r nacht_server_BP/src/types
mkdir nacht_server_BP/src/types
for file in `ls node_modules/@minecraft/vanilla-data/lib | grep -e '\.d'`; do
  # file_name=`echo $file | sed -e 's/\.d//'`
  cp node_modules/@minecraft/vanilla-data/lib/$file nacht_server_BP/src/types/$file
done

# rm -rf nacht_server_BP/node_modules
# mkdir -p nacht_server_BP/node_modules/@minecraft
# cp -r node_modules/@minecraft/vanilla-data nacht_server_BP/node_modules/@minecraft/
