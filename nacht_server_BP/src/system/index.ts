import { system, TicksPerDay, TicksPerSecond, world } from '@minecraft/server';

import { RuleName } from '../commands/enum';
import { PREFIX_GAMERULE } from '../const';
import { Logger } from '../utils/logger';

import actionbar from './actionbar';
import area from './area';
import base from './base';
import border from './border';
import fortune from './fortune';
import title from './title';

export default () =>
  system.run(() => {
    Logger.log('Subscribing original game systems...');

    // 範囲チェック
    const watchCrossingAreaInterval =
      (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingAreaInterval) as number | undefined) ||
      TicksPerSecond / 5;
    //
    const showAreaBorderInterval =
      (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderInterval) as number | undefined) ||
      TicksPerSecond / 2;
    //
    const autoRemoveFortuneEnchantInterval =
      (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.autoRemoveFortuneEnchantInterval) as number | undefined) ||
      TicksPerSecond;

    let tickCounter = 0;
    let day = world.getDay();
    system.runInterval(async () => {
      actionbar();

      if (tickCounter % watchCrossingAreaInterval === 0) {
        area();
      }
      if (tickCounter % showAreaBorderInterval === 0) {
        border();
      }
      if (tickCounter % autoRemoveFortuneEnchantInterval === 0) {
        fortune();
      }
      if (tickCounter % TicksPerSecond === 0) {
        base();
        title();
      }

      const today = world.getDay();
      if (day !== today) {
        tickCounter = 0;
        day = today;
      } else {
        tickCounter++;
      }
    });
  });
