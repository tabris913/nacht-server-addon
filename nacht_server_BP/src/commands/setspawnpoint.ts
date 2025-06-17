import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type Player,
  system,
  type Vector3,
  world,
} from '@minecraft/server';

import { UndefinedSourceOrInitiatorError } from '../errors/command';

import { registerCommand } from './common';
import { DimensionTypes } from './enum';

const setSpawnPointCommand: CustomCommand = {
  name: 'nacht:setspawnpoint',
  description: 'スポーン地点を設定する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'location', type: CustomCommandParamType.Location },
  ],
  optionalParameters: [{ name: 'nacht:DimensionTypes', type: CustomCommandParamType.Enum }],
};

const commandProcess = (
  { sourceEntity }: CustomCommandOrigin,
  targets: Array<Player>,
  location: Vector3,
  dimension?: DimensionTypes
): CustomCommandResult => {
  if (sourceEntity === undefined) throw new UndefinedSourceOrInitiatorError();

  targets.forEach((target) => {
    system.runTimeout(
      () =>
        target.setSpawnPoint({
          ...location,
          dimension: dimension ? world.getDimension(dimension) : sourceEntity.dimension,
        }),
      1
    );
  });

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(setSpawnPointCommand, commandProcess));
