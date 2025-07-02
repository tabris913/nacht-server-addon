import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandSource,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { NonAdminSourceError } from '../errors/command';

import { registerCommand } from './common';

const fillDiagonalCommand: CustomCommand = {
  name: 'nacht:filldiagonal',
  description: '対角線上にブロックを設置する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'nacht:DiagonalTypes', type: CustomCommandParamType.Enum },
    { name: 'from', type: CustomCommandParamType.Location },
    { name: 'hight', type: CustomCommandParamType.Integer },
    { name: 'nacht:Direction', type: CustomCommandParamType.Enum },
  ],
};

const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  if (origin.sourceType !== CustomCommandSource.Entity) throw new NonAdminSourceError();
  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(fillDiagonalCommand, commandProcess));
