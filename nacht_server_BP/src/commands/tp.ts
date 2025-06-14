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
} from '@minecraft/server';

import teleportLogic from '../logic/teleportLogic';
import { MinecraftDimensionTypes } from '../types/index';

import { registerCommand } from './common';

enum DimensionTypes {
  Overworld = 'overworld',
  Nether = 'nether',
  TheEnd = 'the_end',
}

const tpCommand: CustomCommand = {
  name: 'nacht:tp',
  description: '転移する',
  permissionLevel: CommandPermissionLevel.Any,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'location', type: CustomCommandParamType.Location },
  ],
  optionalParameters: [{ name: 'nacht:DimensionTypes', type: CustomCommandParamType.Enum }],
};

const commandProcess = (
  origin: CustomCommandOrigin,
  target: Array<Player>,
  location: Vector3,
  dimension?: DimensionTypes
): CustomCommandResult => {
  system.runTimeout(
    () =>
      target.forEach((player) =>
        teleportLogic.teleport(
          player,
          location,
          (dimension ? `minecraft:${dimension}` : player.dimension.id) as MinecraftDimensionTypes
        )
      ),
    1
  );
  return { status: CustomCommandStatus.Success };
};

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:DimensionTypes', [
      DimensionTypes.Nether,
      DimensionTypes.Overworld,
      DimensionTypes.TheEnd,
    ]);

    registerCommand(tpCommand, commandProcess)(event);
  });
