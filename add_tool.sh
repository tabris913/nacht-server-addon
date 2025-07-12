#!/bin/bash

BP=nacht_server_BP
RP=nacht_server_RP
ITEM_NAME=$1

cat templates/items.json | sed s/\$ITEM_NAME/$ITEM_NAME/g > $BP/items/tools/$ITEM_NAME.json

cat templates/recipes.json | sed s/\$ITEM_NAME/$ITEM_NAME/g > $BP/recipes/tools/$ITEM_NAME.json

cp templates/_16.png $RP/textures/items/tools/$ITEM_NAME.png

echo Don\'t forget to add to below files
echo $BP/item_catalog/crafting_item_catalog.json
echo $RP/texts/ja_JP.lang
echo $RP/textures/item_texture.json
echo $RP/textures/textures_list.json
