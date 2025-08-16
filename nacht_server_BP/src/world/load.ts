import { type Vector3, world } from '@minecraft/server';

import { GAMERULE_DEFAULT, PREFIX_GAMERULE, SCOREBOARD_POINT } from '../const';
import { Logger } from '../utils/logger';

import camera from './afterLoading/camera';

const RESTORE_DATA: Record<string, boolean | number | string | Vector3> = {};
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
      Object.entries(RESTORE_DATA).forEach(([key, value]) => world.setDynamicProperty(key, value));
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

    // カメラ
    camera();
  });
