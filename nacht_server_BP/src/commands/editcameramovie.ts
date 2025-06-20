import {
  CommandPermissionLevel,
  CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandStatus,
  EasingType,
  system,
  world,
  type CustomCommand,
  type CustomCommandResult,
  type Vector3,
} from '@minecraft/server';

import { registerCommand } from './common';
import { PREFIX_MOVIE } from '../const';
import type { CameraMovie, Command } from '../models/camera';

const editCameraMovieCommand: CustomCommand = {
  name: 'nacht:editcameramovie',
  description: '動画設定を編集する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'moviename', type: CustomCommandParamType.String },
    { name: 'location1', type: CustomCommandParamType.Location },
    { name: 'xRot1', type: CustomCommandParamType.Float },
    { name: 'yRot1', type: CustomCommandParamType.Float },
  ],
  optionalParameters: [
    { name: 'nacht:easeType', type: CustomCommandParamType.Enum },
    { name: 'easeTime', type: CustomCommandParamType.Float },
    { name: 'location2', type: CustomCommandParamType.Location },
    { name: 'xRot2', type: CustomCommandParamType.Float },
    { name: 'yRot2', type: CustomCommandParamType.Float },
    { name: 'wait', type: CustomCommandParamType.Float },
  ],
};

const commandProcess = (
  origin: CustomCommandOrigin,
  moviename: string,
  location1: Vector3,
  xRot1: number,
  yRot1: number,
  easeType?: EasingType,
  easeTime?: number,
  location2?: Vector3,
  xRot2?: number,
  yRot2?: number,
  wait?: number
): CustomCommandResult => {
  const key = `${PREFIX_MOVIE}${moviename}`;
  const dp = world.getDynamicProperty(key) as string | undefined;

  let movieConfig: CameraMovie;
  if (dp === undefined) {
    // new
    movieConfig = { clearAfterFinishing: true, name: key, commands: [] } satisfies CameraMovie;
  } else {
    //
    movieConfig = JSON.parse(dp);
  }

  movieConfig.commands.push({ setOptions: { location: location1, rotation: { x: xRot1, y: yRot1 } } });

  if (easeType && easeTime !== undefined && location2 && xRot2 !== undefined && yRot2 !== undefined) {
    movieConfig.commands.push({
      setOptions: { location: location2, rotation: { x: xRot2, y: yRot2 } },
      waitTime: wait === undefined ? easeTime : wait,
    });
  }

  world.setDynamicProperty(key, JSON.stringify(movieConfig));

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(editCameraMovieCommand, commandProcess));
