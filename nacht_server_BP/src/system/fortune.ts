import { system, TicksPerSecond, world } from "@minecraft/server";
import { RuleName } from "../commands/gamerule";
import { gatherSlots } from "../utils/items";

const GAME_RULE_KEY = `nacht:gamerule_${RuleName.autoRemoveFortuneEnchant}`;
const GAME_RULE_KEY_INTERVAL = `nacht:gamerule_${RuleName.autoRemoveFortuneEnchantInterval}`;

// 幸運エンチャントを除去する
export default () =>
  system.runTimeout(
    () =>
      system.runInterval(() => {
        if (world.getDynamicProperty(GAME_RULE_KEY) || false) {
          world.getAllPlayers().forEach((player) =>
            gatherSlots(player).forEach((slot) => {
              const item = slot.getItem();
              if (item === undefined) {
                return;
              }

              const enchantments =
                item.getComponent("minecraft:enchantable")?.getEnchantments() ||
                [];

              if (
                enchantments.filter(
                  (enchantment) => enchantment.type.id === "fortune"
                ).length > 0
              ) {
                // このスロットのアイテムに幸運エンチャントがあり
                item
                  .getComponent("minecraft:enchantable")
                  ?.removeEnchantment("fortune");
                slot.setItem(item);
                player.sendMessage([
                  item.nameTag || {
                    translate: `item.${item.typeId.replace(
                      "minecraft:",
                      ""
                    )}.name`,
                  },
                  "から幸運エンチャントを除去しました。",
                ]);
              }
            })
          );
        }
      }, (world.getDynamicProperty(GAME_RULE_KEY_INTERVAL) as number) || TicksPerSecond),
    1
  );
