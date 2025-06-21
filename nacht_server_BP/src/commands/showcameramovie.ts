import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandSource,
  CustomCommandStatus,
  Player,
  system,
  TicksPerSecond,
  world,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
} from '@minecraft/server';

import { PREFIX_MOVIE } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import teleportLogic from '../logic/teleportLogic';
import { MinecraftCameraPresetsTypes } from '../types/index';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

import type { CameraMovie } from '../models/camera';

const showCameraMovieCommand: CustomCommand = {
  name: 'nacht:showcameramovie',
  description: 'カメラ操作で動画風の映像を見せる',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'moviename', type: CustomCommandParamType.String },
  ],
};

/**
 *
 * @param origin
 * @param target
 * @param moviename 映像名
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link NachtServerAddonError}
 */
const commandProcess = (origin: CustomCommandOrigin, target: Array<Player>, moviename: string): CustomCommandResult => {
  if (origin.sourceType !== CustomCommandSource.NPCDialogue) throw new NonNPCSourceError();
  const player = PlayerUtils.convertToPlayer(origin.initiator);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();
  if (target.some((p) => !p.camera.isValid)) {
    player.sendMessage('カメラが有効ではありません。');

    throw new NachtServerAddonError('カメラが有効ではありません。');
  }

  const dp = world.getDynamicProperty(`${PREFIX_MOVIE}${moviename}`) as string | undefined;
  if (dp === undefined) {
    player.sendMessage('動画が見つかりませんでした。');

    throw new NachtServerAddonError('動画が見つかりませんでした。');
  }

  const cm = JSON.parse(dp) as CameraMovie;
  system.runTimeout(async () => {
    for (const cmd of cm.commands) {
      if ('setOptions' in cmd) {
        target.forEach((t) => t.camera.setCamera(cmd.cameraPreset || MinecraftCameraPresetsTypes.Free, cmd.setOptions));
        if (cmd.waitTime) {
          await system.waitTicks(TicksPerSecond * cmd.waitTime);
        }
      } else if ('location' in cmd) {
        target.forEach((t) => teleportLogic.teleport(t, cmd.location, cmd.dimension));
      } else {
        target.forEach((t) => t.onScreenDisplay.setTitle(cmd.title, cmd.options));
      }
    }
    if (cm.clearAfterFinishing) {
      player.camera.clear();
      target.forEach((t) => t.camera.clear());
    }
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(showCameraMovieCommand, commandProcess));
