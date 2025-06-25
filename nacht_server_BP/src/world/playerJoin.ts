import { world } from '@minecraft/server';

import { SCOREBOARD_POINT, TAG_AREA_BASE, TAG_AREA_EXPL, TAG_AREA_TOWN } from '../const';
import { Logger } from '../utils/logger';
import ScoreboardUtils from '../utils/ScoreboardUtils';

export default () =>
  world.afterEvents.playerJoin.subscribe((event) => {
    Logger.info(`${event.playerName} is joined.`);
    world.sendMessage(`${event.playerName} さんが参加しました`);

    const entity = world.getEntity(event.playerId);
    if (entity) {
      const score = ScoreboardUtils.getScore(entity, SCOREBOARD_POINT);
      if (score === undefined) {
        ScoreboardUtils.setScore(entity, SCOREBOARD_POINT, 0);
        Logger.log(`${entity.nameTag}'s scoreboard ${SCOREBOARD_POINT} is enabled.`);
      } else {
        Logger.log(`${entity.nameTag}'s scoreboard ${SCOREBOARD_POINT} has already enabled.`);
      }

      if (!(entity.hasTag(TAG_AREA_BASE) || entity.hasTag(TAG_AREA_EXPL) || entity.hasTag(TAG_AREA_TOWN))) {
        entity.addTag(TAG_AREA_TOWN);
      }
    } else {
      Logger.warning(`Entity ${event.playerId} cannot be gotten.`);
    }
  });
