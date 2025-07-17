import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemStack, system, world } from '@minecraft/server';

import { ITEM_TAG_INVISIBLE, TAG_INVISIBLE } from '../const';
import { MinecraftItemTypes } from '../types/index';

/**
 * 装備品の状態をコピーする
 *
 * @param item
 * @param visualize 透明化を解除する場合は true、そうでない場合は false
 * @returns
 */
const copyItem = (item: ItemStack, visualize: boolean) => {
  const newItemStack = new ItemStack(
    visualize ? item.type.id.replace('_invisible', '') : `${item.type.id}_invisible`,
    item.amount
  );
  newItemStack.amount = item.amount;
  newItemStack.keepOnDeath = item.keepOnDeath;
  newItemStack.lockMode = item.lockMode;
  newItemStack.nameTag = item.nameTag;
  newItemStack.setCanDestroy(item.getCanDestroy());
  newItemStack.setCanPlaceOn(item.getCanPlaceOn());
  const durability = newItemStack.getComponent(ItemComponentTypes.Durability);
  const durabilityOld = item.getComponent(ItemComponentTypes.Durability);
  if (durability && durabilityOld) {
    durability.damage = durabilityOld.damage;
  }
  const enchantable = newItemStack.getComponent(ItemComponentTypes.Enchantable);
  const enchantableOld = item.getComponent(ItemComponentTypes.Enchantable);
  if (enchantable && enchantableOld) {
    enchantable.addEnchantments(enchantableOld.getEnchantments());
  }
  item.getDynamicPropertyIds().forEach((dpid) => newItemStack.setDynamicProperty(dpid, item.getDynamicProperty(dpid)));
  newItemStack.setLore(item.getLore());

  return newItemStack;
};

export default async () =>
  system.runJob(
    (function* () {
      for (const player of world.getAllPlayers()) {
        const equippable = player.getComponent(EntityComponentTypes.Equippable);
        if (equippable === undefined) return;

        for (const equipmentSlot of [EquipmentSlot.Feet, EquipmentSlot.Chest, EquipmentSlot.Head, EquipmentSlot.Legs]) {
          const item = equippable.getEquipment(equipmentSlot);
          if (item === undefined) continue;
          if (item.typeId.startsWith('minecraft:')) continue;

          if (player.hasTag(TAG_INVISIBLE)) {
            // 透明化状態
            if (!item.hasTag(ITEM_TAG_INVISIBLE)) {
              // 透明装備ではない
              equippable.setEquipment(equipmentSlot, copyItem(item, false));
            }
          } else if (item.hasTag(ITEM_TAG_INVISIBLE)) {
            // 透明化状態ではなく、透明装備
            equippable.setEquipment(equipmentSlot, copyItem(item, true));
          }

          yield;
        }
      }
    })()
  );
