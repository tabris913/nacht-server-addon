import { EntityComponentTypes, system, TicksPerSecond, world } from '@minecraft/server';

import { NachtServerAddonItemTypes } from '../enums';
import { MinecraftEffectTypes } from '../types/index';

export default () =>
  world.afterEvents.itemCompleteUse.subscribe((event) => {
    if (event.itemStack.typeId === NachtServerAddonItemTypes.Elixir) {
      system.run(() => {
        event.source.getComponent(EntityComponentTypes.Health)?.resetToMaxValue();
        event.source.addEffect(MinecraftEffectTypes.Regeneration, 600 * TicksPerSecond, {
          amplifier: 2,
          showParticles: true,
        });
        [
          MinecraftEffectTypes.Slowness,
          MinecraftEffectTypes.MiningFatigue,
          MinecraftEffectTypes.InstantDamage,
          MinecraftEffectTypes.Nausea,
          MinecraftEffectTypes.Blindness,
          MinecraftEffectTypes.Hunger,
          MinecraftEffectTypes.Weakness,
          MinecraftEffectTypes.Poison,
          MinecraftEffectTypes.Wither,
          MinecraftEffectTypes.FatalPoison,
          MinecraftEffectTypes.BadOmen,
          MinecraftEffectTypes.Darkness,
        ].forEach((effect) => event.source.removeEffect(effect));
      });
    }
  });
