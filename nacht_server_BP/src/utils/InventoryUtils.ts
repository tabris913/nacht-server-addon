import {
  type ContainerSlot,
  EnchantmentType,
  type Entity,
  EntityComponentTypes,
  ItemComponentTypes,
  ItemStack,
  ItemType,
  system,
} from '@minecraft/server';

import { MinecraftEnchantmentTypes, MinecraftPotionEffectTypes } from '../types/index';

import { Logger } from './logger';

/**
 * 指定されたアイテムの個数をカウントする
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @returns 指定されたアイテムの個数
 */
export const countItem = (player: Entity, itemId: string) => {
  try {
    const slots = gatherSlots(player, itemId);

    return slots.reduce((prev, cur) => prev + cur.amount, 0);
  } catch (error) {
    Logger.error(`Failed to count the amount of ${itemId} in ${player.nameTag}'s inventory.`);
    Logger.error(error);

    return undefined;
  }
};

/**
 * 指定したアイテムのスロットを取得する
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @param onlyContained
 * @returns 指定したアイテムのスロットの配列
 */
export const gatherSlots = (player: Entity, itemId?: string, onlyContained: boolean = true) => {
  try {
    return Array(36)
      .fill(null)
      .map((_, index) => {
        try {
          const slot = player.getComponent(EntityComponentTypes.Inventory)?.container.getSlot(index);

          return slot;
        } catch (error) {
          Logger.warning(`${player.nameTag}'s inventory slot ${index} is invalid.`);

          return undefined;
        }
      })
      .filter(
        (slot) =>
          slot !== undefined &&
          slot.isValid &&
          (onlyContained ? slot.hasItem() : true) &&
          (itemId === undefined ? true : slot.typeId === itemId)
      ) as Array<ContainerSlot>;
  } catch (error) {
    Logger.error(`Failed to get slots of ${itemId} in ${player.nameTag}'s inventory.`);
    Logger.error(error);

    return [];
  }
};

/**
 * プレイヤーにアイテムを与える。
 * インベントリスロットの指定はしない。
 *
 * @param playerEntity プレイヤー
 * @param itemType アイテム ID
 * @param quantity 数量
 * @param data
 * @returns 成否
 */
const giveItem = (playerEntity: Entity, itemType: string, quantity: number = 1, data?: number) => {
  try {
    if (data !== undefined) {
      playerEntity.dimension.runCommand(`give "${playerEntity.nameTag}" ${itemType} ${quantity} ${data}`);
      return true;
    }
    playerEntity.getComponent(EntityComponentTypes.Inventory)?.container.addItem(new ItemStack(itemType, quantity));

    return true;
  } catch (error) {
    Logger.error();

    throw error;
  }
};

/**
 * プレイヤーにアイテムを与える。
 * インベントリスロットの指定はしない。
 *
 * @param playerEntity プレイヤー
 * @param itemType アイテム ID
 * @param quantity 数量
 * @returns 成否
 */
const giveEnchantedItem = (
  playerEntity: Entity,
  itemType: string,
  quantity: number = 1,
  enchant: MinecraftEnchantmentTypes,
  level: number = 1
) => {
  try {
    const itemStack = new ItemStack(itemType, quantity);
    itemStack
      .getComponent(ItemComponentTypes.Enchantable)
      ?.addEnchantment({ level, type: new EnchantmentType(enchant) });
    playerEntity.getComponent(EntityComponentTypes.Inventory)?.container.addItem(itemStack);

    return true;
  } catch (error) {
    Logger.error();

    throw error;
  }
};

/**
 * アイテムを持っているか判定する
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @param opt 個数条件
 * @returns
 */
export const hasItem = (player: Entity, itemId: string, opt?: { max?: number; min?: number }) => {
  try {
    const count = countItem(player, itemId);

    if (count === undefined) {
      // count error
      return false;
    }

    if (opt) {
      // 条件あり
      Logger.log(`item count: ${count} (expected: min ${opt.min} / max ${opt.max})`);

      return (opt.max === undefined ? true : count <= opt.max) && (opt.min === undefined ? true : opt.min <= count);
    }

    return 0 < count;
  } catch (error) {
    Logger.error(`Failed to check whether ${player.nameTag} have ${itemId}.`);
    Logger.error(error);

    return false;
  }
};

const isFull = (player: Entity) => {
  try {
    return gatherSlots(player, undefined, false).every((slot) => slot.hasItem());
  } catch (error) {
    Logger.error(`Failed to judge whether every slots has item because of`, error);

    throw error;
  }
};

/**
 * アイテムをインベントリから削除する
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @param quantity 削除するアイテムの個数
 * @param data
 * @returns 成否を表すフラグ
 */
export const removeItem = (player: Entity, itemId: string, quantity: number = Infinity, data: number = 0) => {
  try {
    if (quantity < 0) {
      return false;
    }
    if (data) {
      player.dimension.runCommand(`clear ${player.nameTag} ${itemId} ${data} ${quantity === Infinity ? '' : quantity}`);
      return true;
    }
    const count = countItem(player, itemId);
    if (count === undefined) {
      return false;
    }
    if (count < quantity) {
      // 足りない
      return false;
    }
    const slots = gatherSlots(player, itemId);
    if (quantity === Infinity || count === quantity) {
      // 全部消す
      slots.forEach((slot) => slot.setItem(undefined));
    } else {
      let num = quantity; // 消す残量
      for (let index = 0; index < slots.length; index++) {
        const slotAmount = slots[index].amount;
        if (slotAmount < num) {
          // 足りないのでスロットのアイテムを全部消す
          num -= slotAmount;
          slots[index].setItem(undefined);
        } else if (num === slotAmount) {
          // ちょうど足りる
          slots[index].setItem(undefined);

          return true;
        } else {
          // 全部消してしまうと過剰
          const stack = slots[index].getItem();
          if (stack) {
            stack.amount = slotAmount - num;
            slots[index].setItem(stack);

            return true;
          } else {
            return false;
          }
        }
      }
    }
  } catch (error) {
    Logger.error(`Failed to remove ${itemId} from ${player.nameTag}'s inventory.`);
    Logger.error(error);

    return false;
  }
};

const InventoryUtils = {
  countItem,
  gatherSlots,
  giveEnchantedItem,
  giveItem,
  hasItem,
  isFull,
  removeItem,
};

export default InventoryUtils;
