import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandStatus,
  type Player,
  system,
} from '@minecraft/server';

import StringUtils from '../utils/StringUtils';

import { registerCommand } from './common';

const messageCommand: CustomCommand = {
  name: 'nacht:message',
  description: 'メッセージを送信する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'message', type: CustomCommandParamType.String },
  ],
  optionalParameters: [{ name: 'name', type: CustomCommandParamType.String }],
};

/**
 * メッセージ送信コマンドの処理
 *
 * @param origin
 * @param target
 * @param message
 * @param name
 * @returns
 */
const commandProcess = (origin: CustomCommandOrigin, target: Array<Player>, message: string, name?: string) => {
  const msgFrom = name || origin.sourceEntity?.nameTag;
  const msg = StringUtils.format(message);
  target.forEach((player) => player.sendMessage(`[${msgFrom}] ${msg}`));

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(messageCommand, commandProcess));
