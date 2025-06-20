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
import { registerCommand } from './common';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import PlayerUtils from '../utils/PlayerUtils';
import { NachtServerAddonError } from '../errors/base';
import { MinecraftCameraPresetsTypes } from '../types';
import { PREFIX_MOVIE } from '../const';
import { CameraMovie } from '../models/camera';

const showCameraMovieCommand: CustomCommand = {
  name: 'nacht:showcameramovie',
  description: 'カメラ操作で動画風の映像を見せる',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'moviename', type: CustomCommandParamType.String },
  ],
};

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
      player.camera.setCamera(cmd.cameraPreset || MinecraftCameraPresetsTypes.Free, cmd.setOptions);
      if (cmd.waitTime) {
        await system.waitTicks(TicksPerSecond * cmd.waitTime);
      }
    }
    if (cm.clearAfterFinishing) {
      player.camera.clear();
    }
    player.camera.clear();
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(showCameraMovieCommand, commandProcess));
