import { system, TicksPerSecond, world } from '@minecraft/server';

import { NachtServerAddonItemTypes } from '../enums';
import { MinecraftEffectTypes } from '../types/index';

export default () =>
  world.afterEvents.itemCompleteUse.subscribe((event) => {
    if (event.itemStack.typeId === NachtServerAddonItemTypes.PoorElixir) {
      system.run(() => {
        event.source.addEffect(MinecraftEffectTypes.Regeneration, 120 * TicksPerSecond, {
          amplifier: 1,
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
