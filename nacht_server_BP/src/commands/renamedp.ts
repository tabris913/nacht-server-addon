import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  world,
} from '@minecraft/server';

import { DynamicPropertyNotFoundError } from '../errors/dp';

import { registerCommand } from './common';

const renameDynamicPropertyCommand: CustomCommand = {
  name: 'nacht:renamedp',
  description: 'グローバル変数の名前を変更する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'before', type: CustomCommandParamType.String },
    { name: 'after', type: CustomCommandParamType.String },
  ],
};

/**
 * グローバル変数の名前を変更するコマンドの処理
 *
 * @param origin
 * @param before 変更前の名前
 * @param after 変更後の名前
 * @returns
 * @throws This function can throw error.
 *
 * {@link DynamicPropertyNotFoundError}
 */
const commandProcess = (origin: CustomCommandOrigin, before: string, after: string): CustomCommandResult => {
  const property = world.getDynamicProperty(before);
  if (property === undefined) {
    throw new DynamicPropertyNotFoundError(before);
  }

  world.setDynamicProperty(after, property);
  world.setDynamicProperty(before, undefined);

  return { status: CustomCommandStatus.Success };
};

export default () =>
  system.beforeEvents.startup.subscribe(registerCommand(renameDynamicPropertyCommand, commandProcess));
