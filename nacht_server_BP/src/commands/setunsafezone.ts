import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  type Vector3,
  world,
} from '@minecraft/server';

import { COUNTER_UNSAFE_AREA, PREFIX_UNSAFEAREA } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import { MinecraftDimensionTypes } from '../types/index';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';
import { Mode } from './setsafezone';

import type { UneditableAreas } from '../models/location';

const setUnsafeZoneCommand: CustomCommand = {
  name: 'nacht:setunsafezone',
  description: '非安全地帯を設定する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'nacht:AreaSetMode', type: CustomCommandParamType.Enum }],
  optionalParameters: [
    { name: 'from', type: CustomCommandParamType.Location },
    { name: 'to', type: CustomCommandParamType.Location },
  ],
};

/**
 *
 * @param origin
 * @param mode
 * @param from
 * @param to
 * @returns
 * @throws This function can throw errors.
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link NachtServerAddonError}
 */
const commandProcess = (origin: CustomCommandOrigin, mode: Mode, from?: Vector3, to?: Vector3): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  switch (mode) {
    case Mode.set:
      if (from === undefined || to === undefined) throw new NachtServerAddonError('座標が設定されていません。');
      const blockVolume = new DimensionBlockVolume(from, to, player.dimension);
      system.runTimeout(() => {
        const index = DynamicPropertyUtils.getNextCounter(COUNTER_UNSAFE_AREA);
        const id = `${PREFIX_UNSAFEAREA}${index}`;
        world.setDynamicProperty(
          id,
          JSON.stringify({
            dimension: blockVolume.dimension.id as MinecraftDimensionTypes,
            id,
            index,
            ...blockVolume.getBoundingBox(),
          } satisfies UneditableAreas)
        );
        DynamicPropertyUtils.countUpCounter(COUNTER_UNSAFE_AREA);
        player.sendMessage('指定された範囲を非安全地帯に設定しました。');
      }, 1);
      break;
    case Mode.cancel:
      system.runTimeout(() => {
        const here = DynamicPropertyUtils.retrieveUnsafeAreas().find((dp) => {
          const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);

          return (
            blockVolume.isInside(player.location) ||
            blockVolume.isInside({ ...player.location, y: player.location.y - 1 })
          );
        });

        if (here === undefined) {
          player.sendMessage('今いる場所は非安全地帯ではありません。');

          return;
        }

        world.setDynamicProperty(here.id, undefined);
        player.sendMessage('非安全地帯を解除しました。');
      }, 1);
      break;
  }
  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(setUnsafeZoneCommand, commandProcess));
