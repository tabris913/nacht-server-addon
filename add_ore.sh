#!/bin/bash

BP=nacht_server_BP
RP=nacht_server_RP
METAL_NAME=$1

# 追加するもの
## block
### XXXXX_ore
### deepslate_XXXXX_ore
### XXXXX_block
### raw_XXXXX_block
## item
### raw_XXXXX
### XXXXX_ingot
## armor
### XXXXX_boots
### XXXXX_chestplate
### XXXXX_helmet
### XXXXX_leggings

# blocks
cat templates/blocks.json | sed s/\$ITEM_NAME/deepslate_${METAL_NAME}_ore/g > $BP/block/ores/deepslate_${METAL_NAME}_ore.json
cat templates/blocks.json | sed s/\$ITEM_NAME/${METAL_NAME}_ore/g > $BP/block/ores/${METAL_NAME}_ore.json
cat templates/blocks.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}_block/g > $BP/block/ores/raw_${METAL_NAME}_block.json
cat templates/blocks.json | sed s/\$ITEM_NAME/${METAL_NAME}_block/g > $BP/block/ores/${METAL_NAME}_block.json

# ores
cat templates/feature_rules.json | sed s/\$ITEM_NAME/${METAL_NAME}_ore/g > $BP/feature_rules/ores/${METAL_NAME}_ore.json
cat templates/features.json | sed s/\$ITEM_NAME/${METAL_NAME}_ore/g > $BP/features/ores/${METAL_NAME}_ore.json

# items
cat templates/items.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/items/metal/raw_${METAL_NAME}.json
cat templates/items.json | sed s/\$ITEM_NAME/${METAL_NAME}_ingot/g > touch $BP/items/metal/${METAL_NAME}_ingot.json

# ores
cat templates/loot_tables.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/loot_tables/ores/${METAL_NAME}_ore.json
cat templates/loot_tables.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/loot_tables/ores/deepslate_${METAL_NAME}_ore.json

# blocks, items
cat templates/recipes_furnace.json | sed s/\$ITEM_NAME/${METAL_NAME}_ingot/g > $BP/recipes/metal/${METAL_NAME}_ingot_from_raw.json
cat templates/recipes.json | sed s/\$ITEM_NAME/${METAL_NAME}_ingot/g > $BP/recipes/metal/${METAL_NAME}_ingot_from_block.json
cat templates/recipes.json | sed s/\$ITEM_NAME/${METAL_NAME}_block/g > $BP/recipes/metal/${METAL_NAME}_block.json
cat templates/recipes.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}_block/g > $BP/recipes/metal/raw_${METAL_NAME}_block.json
cat templates/recipes.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/recipes/metal/raw_${METAL_NAME}.json

# blocks
cp templates/_16.png $RP/textures/blocks/ores/deepslate_${METAL_NAME}_ore.png
cp templates/_16.png $RP/textures/blocks/ores/${METAL_NAME}_ore.png
cp templates/_16.png $RP/textures/blocks/ores/${METAL_NAME}_block.png
cp templates/_16.png $RP/textures/blocks/ores/raw_${METAL_NAME}_block.png

# item
cp templates/_16.png $RP/textures/items/metal/raw_${METAL_NAME}.png
cp templates/_16.png $RP/textures/items/metal/${METAL_NAME}_ingot.png

echo Don\'t forget to add to below files
echo $BP/item_catalog/crafting_item_catalog.json
echo $RP/texts/ja_JP.lang
echo $RP/textures/item_texture.json
echo $RP/textures/textures_list.json
echo $RP/textures/terrain_texture.json
echo $RP/blocks.json

# armor, tool
for part in _boots _chestplate _helmet _leggings; do
  cat templates/items$part.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/items/armor/${METAL_NAME}$part.json
done
for part in _sword _axe _pickaxe _shovel _hoe; do
  cat templates/items.json | sed s/\$ITEM_NAME/${METAL_NAME}$part/g > $BP/items/tools/${METAL_NAME}$part.json
done

for part in _boots _chestplate _helmet _leggings; do
  cat templates/recipes.json | sed s/\$ITEM_NAME/${METAL_NAME}$part/g > $BP/recipes/armor/${METAL_NAME}$part.json
done
for part in _sword _axe _pickaxe _shovel _hoe; do
  cat templates/recipes.json | sed s/\$ITEM_NAME/${METAL_NAME}$part/g > $BP/recipes/tools/${METAL_NAME}$part.json
done

for part in boots chestplate helmet leggings; do
  cp templates/attachables.json | sed s/\$ITEM_NAME/${METAL_NAME}/g | set s/\$PART/$part/g > $RP/attachables/${METAL_NAME}_$part.json
  cp templates/attachables.player.json | sed s/\$ITEM_NAME/${METAL_NAME}/g | set s/\$PART/$part/g > $RP/attachables/${METAL_NAME}_$part.player.json
done

for part in _boots _chestplate _helmet _leggings; do
  cp templates/_16.png $RP/textures/items/armor/${METAL_NAME}$part.png
done
for part in _sword _axe _pickaxe _shovel _hoe; do
  cp templates/_16.png $RP/textures/items/tools/${METAL_NAME}$part.png
done

cp templates/_64_32.png $RP/textures/models/armor/${METAL_NAME}_leggings.png
cp templates/_64_32.png $RP/textures/models/armor/${METAL_NAME}_main.png
