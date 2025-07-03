import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type Player,
  system,
  world,
} from '@minecraft/server';

import { PREFIX_PLAYERNAME } from '../const';
import { CommandProcessError } from '../errors/command';

import { registerCommand } from './common';

const setNameCommand: CustomCommand = {
  name: 'nacht:setname',
  description: '表示名を設定する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'displayName', type: CustomCommandParamType.String },
  ],
};

const commandProcess = (
  origin: CustomCommandOrigin,
  target: Array<Player>,
  displayName: string
): CustomCommandResult => {
  if (target.length > 1) throw new CommandProcessError('対象が一人に特定できませんでした。');

  system.run(() => {
    world.setDynamicProperty(`${PREFIX_PLAYERNAME}${target[0].nameTag}`, displayName);
  });

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(setNameCommand, commandProcess));
