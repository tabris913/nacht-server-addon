import { ItemStack } from "@minecraft/server";
/**
 * 指定されたアイテムの個数をカウントする
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @returns 指定されたアイテムの個数
 */
export const countItem = (player, itemId) => {
    try {
        const slots = gatherSlots(player, itemId);
        return slots.reduce((prev, cur) => prev + cur.amount, 0);
    }
    catch (error) {
        console.error(`Failed to count the amount of ${itemId} in ${player.nameTag}'s inventory.`);
        console.error(error);
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
export const gatherSlots = (player, itemId) => {
    try {
        return Array(36)
            .fill(null)
            .map((_, index) => {
            var _a;
            try {
                const slot = (_a = player
                    .getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.getSlot(index);
                return slot;
            }
            catch (error) {
                console.warn(`${player.nameTag}'s inventory slot ${index} is invalid.`);
                return undefined;
            }
        })
            .filter((slot) => {
            const commonCond = slot !== undefined && slot.isValid && slot.hasItem();
            if (itemId === undefined) {
                // スロットのみ取得
                return commonCond;
            }
            else {
                // アイテムでフィルタ
                return commonCond && slot.typeId === itemId;
            }
        });
    }
    catch (error) {
        console.error(`Failed to get slots of ${itemId} in ${player.nameTag}'s inventory.`);
        console.error(error);
        return [];
    }
};
/**
 * アイテムをインベントリに追加する
 *
 * @param player プレイヤー
 * @param itemId アイテム ID
 * @param amount アイテムの個数
 * @returns 成否を表すフラグ
 */
export const giveItem = (player, itemId, amount = 1) => {
    var _a;
    try {
        (_a = player
            .getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.addItem(new ItemStack(itemId, amount));
        return true;
    }
    catch (error) {
        console.error(`Failed to give ${itemId} to ${player.nameTag}.`);
        console.error(error);
        return false;
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
export const hasItem = (player, itemId, opt) => {
    try {
        let count = countItem(player, itemId);
        if (count === undefined) {
            // count error
            return false;
        }
        if (opt) {
            // 条件あり
            console.log(`item count: ${count} (expected: min ${opt.min} / max ${opt.max})`);
            return ((opt.max === undefined ? true : count <= opt.max) &&
                (opt.min === undefined ? true : opt.min <= count));
        }
        return 0 < count;
    }
    catch (error) {
        console.error(`Failed to check whether ${player.nameTag} have ${itemId}.`);
        console.error(error);
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
export const removeItem = (player, itemId, amount = Infinity) => {
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
        }
        else {
            let num = amount; // 消す残量
            for (let index = 0; index < slots.length; index++) {
                const slotAmount = slots[index].amount;
                if (slotAmount < num) {
                    // 足りないのでスロットのアイテムを全部消す
                    num -= slotAmount;
                    slots[index].setItem(undefined);
                }
                else if (num === slotAmount) {
                    // ちょうど足りる
                    slots[index].setItem(undefined);
                    return true;
                }
                else {
                    // 全部消してしまうと過剰
                    const stack = slots[index].getItem();
                    if (stack) {
                        stack.amount = slotAmount - num;
                        slots[index].setItem(stack);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }
    }
    catch (error) {
        console.error(`Failed to remove ${itemId} from ${player.nameTag}'s inventory.`);
        console.error(error);
        return false;
    }
};
