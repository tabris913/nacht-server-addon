import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  world,
} from '@minecraft/server';

import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

const releaseAreaCommand: CustomCommand = {
  name: 'nacht:releasearea',
  description: '編集不可の範囲を解放する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
};

/**
 * 編集不可範囲を解除する
 *
 * @param origin
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  system.runTimeout(() => {
    const here = DynamicPropertyUtils.retrieveUneditableAreas().find((dp) => {
      const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);

      return (
        blockVolume.isInside(player.location) || blockVolume.isInside({ ...player.location, y: player.location.y - 1 })
      );
    });

    if (here === undefined) {
      player.sendMessage('今いる場所は編集不可領域ではありません。');

      return;
    }

    world.setDynamicProperty(here.id, undefined);
    player.sendMessage('編集不可を解除しました。');
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(releaseAreaCommand, commandProcess));
