export const count_item = (player, item) => {
    let count = 0;
    Array(36)
        .fill(null)
        .forEach((_, index) => {
        var _a;
        try {
            const slot = (_a = player.getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.getSlot(index);
            count += (slot === null || slot === void 0 ? void 0 : slot.typeId) === item ? slot.amount : 0;
        }
        catch (_b) {
            console.warn(`${player.nameTag} inventory slot ${index} is invalid`);
        }
    });
    return count;
};
export const has_item = (player, item, opt) => {
    let count = 0;
    if (opt) {
        Array(36)
            .fill(null)
            .forEach((_, index) => {
            var _a;
            try {
                const slot = (_a = player
                    .getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.getSlot(index);
                if ((slot === null || slot === void 0 ? void 0 : slot.typeId) !== item)
                    return;
                if (typeof opt.max === "number" && slot.amount > opt.max)
                    return;
                if (typeof opt.min === "number" && slot.amount < opt.min)
                    return;
                count += slot.amount;
            }
            catch (_b) {
                console.warn(`${player.nameTag} inventory slot ${index} is invalid`);
            }
        });
        console.log(`item count: ${count} (expected: min ${opt.min} / max ${opt.max})`);
        return count > 0;
    }
    else {
        return Array(36)
            .fill(null)
            .some((_, index) => {
            var _a;
            return ((_a = player.getComponent("inventory")) === null || _a === void 0 ? void 0 : _a.container.getSlot(index).typeId) ===
                item;
        });
    }
};
