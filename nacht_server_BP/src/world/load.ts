import { world } from '@minecraft/server';

import { GAMERULE_DEFAULT, PREFIX_GAMERULE, SCOREBOARD_POINT } from '../const';
import { Logger } from '../utils/logger';

const RESTORE_DATA = {};

export default () =>
  world.afterEvents.worldLoad.subscribe((event) => {
    // ポイント準備
    const point = world.scoreboard.getObjective(SCOREBOARD_POINT);
    if (point === undefined) {
      world.scoreboard.addObjective(SCOREBOARD_POINT);
      Logger.log(`${SCOREBOARD_POINT} is enabled.`);
    } else {
      Logger.log(`${SCOREBOARD_POINT} has already enabled.`);
    }

    // ゲームルール
    if (world.getDynamicPropertyIds().length === 0) {
      world.setDynamicProperties(RESTORE_DATA);
      Logger.log(`Succeeded to restore data.`);
    }
    Object.entries(GAMERULE_DEFAULT).forEach(([ruleName, value]) => {
      const id = `${PREFIX_GAMERULE}${ruleName}`;
      const current = world.getDynamicProperty(id);
      if (current === undefined) {
        world.setDynamicProperty(id, value);
        Logger.log(`Default value (${value}) set as ${ruleName} is not set.`);
      }
    });
  });
