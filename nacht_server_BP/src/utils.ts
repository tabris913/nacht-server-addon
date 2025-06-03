import { Entity } from "@minecraft/server";

export const count_item = (player: Entity, item: string) => {
  let count = 0;

  Array(36)
    .fill(null)
    .forEach((_, index) => {
      try {
        const slot = player.getComponent("inventory")?.container.getSlot(index);
        count += slot?.typeId === item ? slot.amount : 0;
      } catch {
        console.warn(`${player.nameTag} inventory slot ${index} is invalid`);
      }
    });

  return count;
};

export const has_item = (
  player: Entity,
  item: string,
  opt?: { max?: number; min?: number }
) => {
  let count = 0;

  if (opt) {
    Array(36)
      .fill(null)
      .forEach((_, index) => {
        try {
          const slot = player
            .getComponent("inventory")
            ?.container.getSlot(index);
          if (slot?.typeId !== item) return;
          if (typeof opt.max === "number" && slot.amount > opt.max) return;
          if (typeof opt.min === "number" && slot.amount < opt.min) return;
          count += slot.amount;
        } catch {
          console.warn(`${player.nameTag} inventory slot ${index} is invalid`);
        }
      });

    console.log(
      `item count: ${count} (expected: min ${opt.min} / max ${opt.max})`
    );
    return count > 0;
  } else {
    return Array(36)
      .fill(null)
      .some(
        (_, index) =>
          player.getComponent("inventory")?.container.getSlot(index).typeId ===
          item
      );
  }
};
