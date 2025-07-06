import { system, TicksPerSecond, world } from '@minecraft/server';

import {
  PREFIX_TITLE,
  SCOREBOARD_POINT,
  TAG_TITLE_BILLIONAIRE,
  TAG_TITLE_FIRST_BILLIONAIRE,
  TAG_TITLE_FIRST_MILLIONAIRE,
  TAG_TITLE_MILLIONAIRE,
} from '../const';
import ScoreboardUtils from '../utils/ScoreboardUtils';

export default () =>
  system.runInterval(() => {
    system.runJob(
      (function* () {
        for (const player of world.getAllPlayers()) {
          const score = ScoreboardUtils.getScore(player, SCOREBOARD_POINT);
          if (score !== undefined) {
            if (score > 1_000_000) {
              if (!player.hasTag(TAG_TITLE_MILLIONAIRE)) player.addTag(TAG_TITLE_MILLIONAIRE);
              if (world.getDynamicProperty(PREFIX_TITLE + TAG_TITLE_MILLIONAIRE) === undefined) {
                player.addTag(TAG_TITLE_FIRST_MILLIONAIRE);
                world.setDynamicProperty(PREFIX_TITLE + TAG_TITLE_FIRST_MILLIONAIRE, player.nameTag);
              }
            }
            if (score > 1_000_000_000) {
              if (!player.hasTag(TAG_TITLE_BILLIONAIRE)) player.addTag(TAG_TITLE_BILLIONAIRE);
              if (world.getDynamicProperty(PREFIX_TITLE + TAG_TITLE_BILLIONAIRE) === undefined) {
                player.addTag(TAG_TITLE_FIRST_BILLIONAIRE);
                world.setDynamicProperty(PREFIX_TITLE + TAG_TITLE_FIRST_BILLIONAIRE, player.nameTag);
              }
            }
          }
          yield;
        }
      })()
    );
  }, TicksPerSecond);
