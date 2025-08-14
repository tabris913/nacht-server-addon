import { system, TicksPerSecond, world } from '@minecraft/server';

import { RuleName } from '../commands/enum';
import { Formatting, PREFIX_GAMERULE } from '../const';
import { MinecraftDimensionTypes } from '../types/index';
import { Logger } from '../utils/logger';

import actionbar from './actionbar';
import area from './area';
import armorInvisible from './armorInvisible';
import base from './base';
import border from './border';
import custom_component from './custom_component';
import fortune from './fortune';
import title from './title';

export default () => {
  custom_component();

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
        armorInvisible();
        base();
        title();
      }
      if ((tickCounter % TicksPerSecond) * 10 === 0) {
        if (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.isMaintenainceMode) === true) {
          // world.sendMessage(`${Formatting.Color.RED}ただいまサーバーメンテナンス中です。`);
          [MinecraftDimensionTypes.Overworld, MinecraftDimensionTypes.Nether, MinecraftDimensionTypes.TheEnd].forEach(
            (dimensionId) => {
              world.getDimension(dimensionId).runCommand('title @a times 0 220 0');
              world.getDimension(dimensionId).runCommand(`title @a title ${Formatting.Color.RED}メンテナンス中`);
            }
          );
        }
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
};
