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
mkdir -p $BP/blocks/ores/${METAL_NAME}
cat templates/blocks_ore.json | sed s/\$ITEM_NAME/deepslate_${METAL_NAME}_ore/g > $BP/blocks/ores/${METAL_NAME}/deepslate_${METAL_NAME}_ore.json
cat templates/blocks_ore.json | sed s/\$ITEM_NAME/${METAL_NAME}_ore/g > $BP/blocks/ores/${METAL_NAME}/${METAL_NAME}_ore.json
cat templates/blocks_oreblock.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}_block/g > $BP/blocks/ores/${METAL_NAME}/raw_${METAL_NAME}_block.json
cat templates/blocks_oreblock.json | sed s/\$ITEM_NAME/${METAL_NAME}_block/g > $BP/blocks/ores/${METAL_NAME}/${METAL_NAME}_block.json

# ores
cat templates/feature_rules.json | sed s/\$ITEM_NAME/${METAL_NAME}_ore/g > $BP/feature_rules/ores/${METAL_NAME}_ore.json
cat templates/features.json | sed s/\$ITEM_NAME/${METAL_NAME}_ore/g > $BP/features/ores/${METAL_NAME}_ore.json

# items
mkdir -p $BP/items/metal/${METAL_NAME}
cat templates/items.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/items/metal/${METAL_NAME}/raw_${METAL_NAME}.json
cat templates/items.json | sed s/\$ITEM_NAME/${METAL_NAME}_ingot/g > $BP/items/metal/${METAL_NAME}/${METAL_NAME}_ingot.json

# ores
cat templates/loot_tables.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/loot_tables/ores/${METAL_NAME}_ore.json
# cat templates/loot_tables.json | sed s/\$ITEM_NAME/raw_${METAL_NAME}/g > $BP/loot_tables/ores/deepslate_${METAL_NAME}_ore.json

# blocks, items
mkdir -p $BP/recipes/metal/${METAL_NAME}
cat templates/recipes_furnace.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/recipes/metal/${METAL_NAME}/${METAL_NAME}_ingot_from_raw.json
cat templates/recipes.json | sed s/\$ITEM_NAME/${METAL_NAME}_ingot/g > $BP/recipes/metal/${METAL_NAME}/${METAL_NAME}_ingot_from_block.json
cat templates/recipes_block.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/recipes/metal/${METAL_NAME}/${METAL_NAME}_block.json
cat templates/recipes_rawblock.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/recipes/metal/${METAL_NAME}/raw_${METAL_NAME}_block.json
cat templates/recipes_raw.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/recipes/metal/${METAL_NAME}/raw_${METAL_NAME}.json

# blocks
mkdir -p $RP/textures/blocks/ores/${METAL_NAME}
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/blocks/deepslate/deepslate_iron_ore.png $RP/textures/blocks/ores/${METAL_NAME}/deepslate_${METAL_NAME}_ore.png
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/blocks/iron_ore.png $RP/textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_ore.png
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/blocks/iron_block.png $RP/textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_block.png
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/blocks/raw_iron_block.png $RP/textures/blocks/ores/${METAL_NAME}/raw_${METAL_NAME}_block.png

# item
mkdir -p $RP/textures/items/metal/${METAL_NAME}
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/items/raw_iron.png $RP/textures/items/metal/${METAL_NAME}/raw_${METAL_NAME}.png
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/items/iron_ingot.png $RP/textures/items/metal/${METAL_NAME}/${METAL_NAME}_ingot.png

# armor, tool
mkdir -p $BP/items/armor/${METAL_NAME}
for part in _boots _chestplate _helmet _leggings; do
  cat templates/items$part.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/items/armor/${METAL_NAME}/${METAL_NAME}$part.json
done
mkdir -p $BP/items/tools/${METAL_NAME}
for part in _sword _axe _pickaxe _shovel _hoe; do
  cat templates/items$part.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/items/tools/${METAL_NAME}/${METAL_NAME}$part.json
done

mkdir -p $BP/recipes/armor/${METAL_NAME}
for part in _boots _chestplate _helmet _leggings; do
  cat templates/recipes$part.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/recipes/armor/${METAL_NAME}/${METAL_NAME}$part.json
done
mkdir -p $BP/recipes/tools/${METAL_NAME}
for part in _sword _axe _pickaxe _shovel _hoe; do
  cat templates/recipes$part.json | sed s/\$ITEM_NAME/${METAL_NAME}/g > $BP/recipes/tools/${METAL_NAME}/${METAL_NAME}$part.json
done

mkdir -p $RP/attachables/${METAL_NAME}
for part in boots chestplate helmet leggings; do
  cat templates/attachables.json | sed s/\$ITEM_NAME/${METAL_NAME}/g | sed s/\$PART/$part/g > $RP/attachables/${METAL_NAME}/${METAL_NAME}_$part.json
  cat templates/attachables.player.json | sed s/\$ITEM_NAME/${METAL_NAME}/g | sed s/\$PART/$part/g > $RP/attachables/${METAL_NAME}/${METAL_NAME}_$part.player.json
done

mkdir -p $RP/textures/items/armor/${METAL_NAME}
for part in _boots _chestplate _helmet _leggings; do
  cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/items/iron$part.png $RP/textures/items/armor/${METAL_NAME}/${METAL_NAME}$part.png
done
mkdir -p $RP/textures/items/tools/${METAL_NAME}
for part in _sword _axe _pickaxe _shovel _hoe; do
  cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/items/iron$part.png $RP/textures/items/tools/${METAL_NAME}/${METAL_NAME}$part.png
done

cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/models/armor/iron_2.png $RP/textures/models/armor/${METAL_NAME}_leggings.png
cp .vscode/bedrock-samples-1.21.90.3/resource_pack/textures/models/armor/iron_1.png $RP/textures/models/armor/${METAL_NAME}_main.png

echo Don\'t forget to add to below files
echo $BP/item_catalog/crafting_item_catalog.json
echo lang.txt

echo "// $RP/texts/ja_JP.lang" > lang.txt
echo "## ${METAL_NAME}" >> lang.txt
echo "item.nacht:raw_${METAL_NAME}.name=${2}の原石	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_ingot.name=${2}のインゴット	##" >> lang.txt
echo "tile.nacht:${METAL_NAME}_ore.name=${2}鉱石	##" >> lang.txt
echo "tile.nacht:deepslate_${METAL_NAME}_ore.name=深層岩${2}鉱石	##" >> lang.txt
echo "tile.nacht:${METAL_NAME}_block.name=${2}ブロック	##" >> lang.txt
echo "tile.nacht:raw_${METAL_NAME}_block.name=${2}の原石ブロック	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_boots.name=${2}のブーツ	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_chestplate.name=${2}のチェストプレート	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_helmet.name=${2}のヘルメット	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_leggings.name=${2}のレギンス	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_sword.name=${2}の剣	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_axe.name=${2}の斧	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_pickaxe.name=${2}のピッケル	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_shovel.name=${2}のシャベル	##" >> lang.txt
echo "item.nacht:${METAL_NAME}_hoe.name=${2}のクワ	##" >> lang.txt
echo >> lang.txt

echo "// $RP/textures/item_texture.json" >> lang.txt
echo ",\"nacht:raw_${METAL_NAME}\":{\"textures\":\"textures/items/metal/${METAL_NAME}/raw_${METAL_NAME}\"}" >> lang.txt
for part in ingot sword axe pickaxe shovel hoe boots chestplate helmet leggings; do
  echo ",\"nacht:${METAL_NAME}_$part\":{\"textures\":\"textures/items/metal/${METAL_NAME}/${METAL_NAME}_$part\"}" >> lang.txt
done
echo >> lang.txt

echo "// $RP/textures/textures_list.json" >> lang.txt
echo ",\"textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_ore\"" >> lang.txt
echo ",\"textures/blocks/ores/${METAL_NAME}/deepslate_${METAL_NAME}_ore\"" >> lang.txt
echo ",\"textures/blocks/ores/${METAL_NAME}/raw_${METAL_NAME}_block\"" >> lang.txt
echo ",\"textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_block\"" >> lang.txt
echo ",\"textures/items/metal/${METAL_NAME}/raw_${METAL_NAME}\"" >> lang.txt
echo ",\"textures/items/metal/${METAL_NAME}/${METAL_NAME}_ingot\"" >> lang.txt
for part in sword axe pickaxe shovel hoe; do
  echo ",\"textures/items/tools/${METAL_NAME}/${METAL_NAME}_$part\"" >> lang.txt
done
for part in boots chestplate helmet leggings; do
  echo ",\"textures/items/armor/${METAL_NAME}/${METAL_NAME}_$part\"" >> lang.txt
done
echo ",\"textures/models/armor/${METAL_NAME}/${METAL_NAME}_main\"" >> lang.txt
echo ",\"textures/models/armor/${METAL_NAME}/${METAL_NAME}_leggings\"" >> lang.txt
echo >> lang.txt

echo "// $RP/textures/terrain_texture.json" >> lang.txt
echo ",\"${METAL_NAME}_ore\":{\"textures\":\"textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_ore\"}" >> lang.txt
echo ",\"deepslate_${METAL_NAME}_ore\":{\"textures\":\"textures/blocks/ores/${METAL_NAME}/deepslate_${METAL_NAME}_ore\"}" >> lang.txt
echo ",\"raw_${METAL_NAME}_block\":{\"textures\":\"textures/blocks/ores/${METAL_NAME}/raw_${METAL_NAME}_block\"}" >> lang.txt
echo ",\"${METAL_NAME}_block\":{\"textures\":\"textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_block\"}" >> lang.txt
echo >> lang.txt

echo "// $RP/blocks.json" >> lang.txt
echo ",\"${METAL_NAME}_ore\":{\"sound\":\"stone\",\"textures\":\"textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_ore\"}" >> lang.txt
echo ",\"deepslate_${METAL_NAME}_ore\":{\"sound\":\"stone\",\"textures\":\"textures/blocks/ores/${METAL_NAME}/deepslate_${METAL_NAME}_ore\"}" >> lang.txt
echo ",\"raw_${METAL_NAME}_block\":{\"sound\":\"stone\",\"textures\":\"textures/blocks/ores/${METAL_NAME}/raw_${METAL_NAME}_block\"}" >> lang.txt
echo ",\"${METAL_NAME}_block\":{\"sound\":\"metal\",\"textures\":\"textures/blocks/ores/${METAL_NAME}/${METAL_NAME}_block\"}" >> lang.txt
