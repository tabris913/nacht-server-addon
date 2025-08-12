import { EntityComponentTypes, EquipmentSlot, GameMode, ItemComponentTypes, system } from '@minecraft/server';

import { InstantMineableBlocks } from '../const';
import { MinecraftEnchantmentTypes } from '../types/index';

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.itemComponentRegistry.registerCustomComponent('nacht:tool_durability', {
      onBeforeDurabilityDamage: (event2) => {
        if (event2.durabilityDamage > 1) {
          event2.durabilityDamage = 1;
        }
      },
      onMineBlock: (event2) => {
        if (event2.source.matches({ gameMode: GameMode.Creative }) || event2.itemStack === undefined) {
          return;
        }

        if ((InstantMineableBlocks as Array<string>).includes(event2.minedBlockPermutation.type.id)) {
          return;
        }

        const enchantable = event2.itemStack.getComponent(ItemComponentTypes.Enchantable);
        const unbreaking = enchantable?.getEnchantment(MinecraftEnchantmentTypes.Unbreaking);
        if (unbreaking !== undefined && 1 / (1 + unbreaking.level) < Math.random()) {
          return;
        }

        // reduce
        const durability = event2.itemStack.getComponent(ItemComponentTypes.Durability);
        const equippable = event2.source.getComponent(EntityComponentTypes.Equippable);
        if (durability === undefined || equippable === undefined) return;
        if (durability?.damage + 1 >= durability?.maxDurability) {
          equippable.setEquipment(EquipmentSlot.Mainhand, undefined);
          event2.source.dimension.playSound('random.break', event2.source.location);
          return;
        }
        durability.damage += 1;
        equippable.setEquipment(EquipmentSlot.Mainhand, event2.itemStack);
      },
    })
  );
