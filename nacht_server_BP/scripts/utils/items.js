import { ItemStack } from "@minecraft/server";
/**
 * 指定したアイテムのスロットを取得する
 *
 * @param player
 * @param item
 * @returns
 */
const gatherSlots = (player, item) => Array(36)
    .fill(null)
    .map((_, index) => {
    var _a;
    try {
        const slot = (_a = player.getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.getSlot(index);
        return slot;
    }
    catch (error) {
        console.warn(`${player.nameTag} inventory slot ${index} is invalid`);
        return undefined;
    }
})
    .filter((slot) => slot !== undefined &&
    slot.isValid &&
    slot.hasItem() &&
    (slot === null || slot === void 0 ? void 0 : slot.typeId) === item);
/**
 * アイテムをカウントする
 *
 * @param player
 * @param item
 * @returns
 */
export const countItem = (player, item) => {
    try {
        const slots = gatherSlots(player, item);
        return slots.reduce((prev, cur) => prev + cur.amount, 0);
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
/**
 * アイテムを持っているか判定する
 *
 * @param player
 * @param item
 * @param opt
 * @returns
 */
export const hasItem = (player, item, opt) => {
    try {
        let count = countItem(player, item);
        if (count === null) {
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
        console.error(error);
        return false;
    }
};
/**
 * アイテムをインベントリに追加する
 *
 * @param player
 * @param item
 * @param amount
 * @returns
 */
export const giveItem = (player, item, amount = 1) => {
    var _a;
    try {
        (_a = player
            .getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.addItem(new ItemStack(item, amount));
        return true;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};
/**
 * アイテムをインベントリから削除する
 *
 * @param player
 * @param item
 * @param amount
 */
export const removeItem = (player, item, amount = Infinity) => {
    try {
        if (amount < 0) {
            return false;
        }
        const count = countItem(player, item);
        if (count === null) {
            return false;
        }
        if (count < amount) {
            // 足りない
            return false;
        }
        const slots = gatherSlots(player, item);
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
        console.error(error);
        return false;
    }
};
