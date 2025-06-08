import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { UndefinedSourceOrInitiatorError } from '../errors/command';
import PlayerUtils from '../utils/PlayerUtils';
import StringUtils from '../utils/StringUtils';

import { registerCommand } from './common';

const messageOpCommand: CustomCommand = {
  name: 'nacht:messageop',
  description: 'オペレーターにメッセージを送信する',
  permissionLevel: CommandPermissionLevel.Any,
  mandatoryParameters: [{ name: 'message', type: CustomCommandParamType.String }],
};

/**
 * オペレーターにメッセージを送信するコマンドの処理
 *
 * @param origin
 * @param message
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = ({ sourceEntity }: CustomCommandOrigin, message: string) => {
  if (sourceEntity === undefined) {
    throw new UndefinedSourceOrInitiatorError();
  }

  PlayerUtils.sendMessageToOps(`[${sourceEntity.nameTag}] ${StringUtils.format(message)}`);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(messageOpCommand, commandProcess));
