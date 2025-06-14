import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { UndefinedSourceOrInitiatorError } from '../errors/command';
import teleportLogic from '../logic/teleportLogic';

import { registerCommand } from './common';

const registerTeleportTargetCommand: CustomCommand = {
  name: 'nacht:registertptarget',
  description: 'なはとの羽根に転移先を登録する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'name', type: CustomCommandParamType.String },
    { name: 'displayName', type: CustomCommandParamType.String },
  ],
};

/**
 * テレポート転移先を登録するコマンドの処理
 *
 * @param origin
 * @param name
 * @param displayName
 * @returns
 * @throws This function can throw errors.
 *
 * {@link CommandProcessError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin: CustomCommandOrigin, name: string, displayName: string) => {
  if (origin.initiator) {
    // called by NPC
    teleportLogic.registerTeleportTarget(origin.initiator, name, displayName);
  } else if (origin.sourceEntity) {
    teleportLogic.registerTeleportTarget(origin.sourceEntity, name, displayName);
  } else {
    throw new UndefinedSourceOrInitiatorError();
  }

  return { status: CustomCommandStatus.Success };
};

export default () =>
  system.beforeEvents.startup.subscribe(registerCommand(registerTeleportTargetCommand, commandProcess));
