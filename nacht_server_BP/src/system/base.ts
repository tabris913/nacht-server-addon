import { system, TicksPerSecond, world } from '@minecraft/server';

import { BaseAreaDimensionBlockVolume } from '../models/BaseAreaDimensionBlockVolume';
import BaseUtils from '../utils/BaseUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import type { FixedBaseAreaInfo } from '../models/location';

export default () =>
  system.runInterval(() => {
    const players = world.getAllPlayers();

    BaseUtils.retrieveBases()
      .filter((base): base is FixedBaseAreaInfo => base.fixed)
      .filter((base) =>
        players.some((player) => BaseAreaDimensionBlockVolume.fromFixedDynamicProperty(base).isInside(player.location))
      )
      .forEach((base) => {
        if (base.entityId === undefined) {
          // 未設置ということになっている
        } else {
          // 設置済ということになっている
          const entity = world.getEntity(base.entityId);
          if (entity === undefined) {
            // 設置されていない or 紐づけがおかしい
            world.setDynamicProperty(
              base.id,
              JSON.stringify({ ...base, entityId: undefined } satisfies FixedBaseAreaInfo)
            );
            Logger.warning(`Modified dynamic property for base ${base.id} bacause the entity does not exist.`);
            PlayerUtils.sendMessageToOps(
              `紐づいた旗が存在しないためダイナミックプロパティ(${base.id})を書き換えました。`
            );
          }
        }
      });
  }, TicksPerSecond);
