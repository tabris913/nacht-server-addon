import { ItemComponentTypes, system, world } from '@minecraft/server';

import { RuleName } from '../commands/enum';
import { EnchantmentNames, PREFIX_GAMERULE } from '../const';
import { MinecraftEnchantmentTypes } from '../types/index';
import InventoryUtils from '../utils/InventoryUtils';

const GAME_RULE_KEY = `${PREFIX_GAMERULE}${RuleName.autoRemoveFortuneEnchant}`;

// 幸運エンチャントを除去する
export default async () => {
  if (world.getDynamicProperty(GAME_RULE_KEY) || false) {
    system.runJob(
      (function* () {
        for (const player of world.getAllPlayers()) {
          for (const slot of InventoryUtils.gatherSlots(player)) {
            const item = slot.getItem();
            if (item === undefined) {
              continue;
            }

            const enchantments = item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments() || [];

            if (enchantments.filter((enchantment) => enchantment.type.id === 'fortune').length > 0) {
              // このスロットのアイテムに幸運エンチャントがあり
              item.getComponent(ItemComponentTypes.Enchantable)?.removeEnchantment('fortune');
              slot.setItem(item);
              player.sendMessage([
                item.nameTag || { translate: item.localizationKey },
                'から',
                { translate: EnchantmentNames[MinecraftEnchantmentTypes.Fortune] },
                'エンチャントを除去しました。',
              ]);
            }

            yield;
          }
        }
      })()
    );
  }
};
