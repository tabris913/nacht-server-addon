import {
  type ContainerSlot,
  type Entity,
  EntityComponentTypes,
  ItemStack,
} from "@minecraft/server";
import { Logger } from "./logger";

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
    Logger.error(
      `Failed to count the amount of ${itemId} in ${player.nameTag}'s inventory.`
    );
    Logger.error(error);

    return undefined;
  }
};

/**
 * 指定したアイテムのスロットを取得する
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @returns 指定したアイテムのスロットの配列
 */
export const gatherSlots = (player: Entity, itemId?: string) => {
  try {
    return Array(36)
      .fill(null)
      .map((_, index) => {
        try {
          const slot = player
            .getComponent("inventory")
            ?.container.getSlot(index);

          return slot;
        } catch (error) {
          Logger.warning(
            `${player.nameTag}'s inventory slot ${index} is invalid.`
          );

          return undefined;
        }
      })
      .filter((slot) => {
        const commonCond = slot !== undefined && slot.isValid && slot.hasItem();

        if (itemId === undefined) {
          // スロットのみ取得
          return commonCond;
        } else {
          // アイテムでフィルタ
          return commonCond && slot.typeId === itemId;
        }
      }) as Array<ContainerSlot>;
  } catch (error) {
    Logger.error(
      `Failed to get slots of ${itemId} in ${player.nameTag}'s inventory.`
    );
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
 * @param amount 数量
 * @returns 成否
 */
const giveItem = (
  playerEntity: Entity,
  itemType: string,
  amount: number = 1
) => {
  try {
    playerEntity
      .getComponent(EntityComponentTypes.Inventory)
      ?.container.addItem(new ItemStack(itemType, amount));

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
export const hasItem = (
  player: Entity,
  itemId: string,
  opt?: { max?: number; min?: number }
) => {
  try {
    let count = countItem(player, itemId);

    if (count === undefined) {
      // count error
      return false;
    }

    if (opt) {
      // 条件あり
      Logger.log(
        `item count: ${count} (expected: min ${opt.min} / max ${opt.max})`
      );

      return (
        (opt.max === undefined ? true : count <= opt.max) &&
        (opt.min === undefined ? true : opt.min <= count)
      );
    }

    return 0 < count;
  } catch (error) {
    Logger.error(`Failed to check whether ${player.nameTag} have ${itemId}.`);
    Logger.error(error);

    return false;
  }
};

/**
 * アイテムをインベントリから削除する
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @param amount 削除するアイテムの個数
 * @returns 成否を表すフラグ
 */
export const removeItem = (
  player: Entity,
  itemId: string,
  amount: number = Infinity
) => {
  try {
    if (amount < 0) {
      return false;
    }
    const count = countItem(player, itemId);
    if (count === undefined) {
      return false;
    }
    if (count < amount) {
      // 足りない
      return false;
    }
    const slots = gatherSlots(player, itemId);
    if (amount === Infinity || count === amount) {
      // 全部消す
      slots.forEach((slot) => slot.setItem(undefined));
    } else {
      let num = amount; // 消す残量
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
    Logger.error(
      `Failed to remove ${itemId} from ${player.nameTag}'s inventory.`
    );
    Logger.error(error);

    return false;
  }
};

const InventoryUtils = {
  countItem,
  gatherSlots,
  giveItem,
  hasItem,
  removeItem,
};

export default InventoryUtils;
