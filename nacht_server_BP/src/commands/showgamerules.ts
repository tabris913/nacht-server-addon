import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  type Vector3,
  world,
} from '@minecraft/server';

import { PREFIX_GAMERULE } from '../const';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

const showGameRulesCommand: CustomCommand = {
  name: 'nacht:showgamerules',
  description: 'ゲームルールを表示する',
  permissionLevel: CommandPermissionLevel.Admin,
};

/**
 *
 * @param origin
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  const gamerules = world
    .getDynamicPropertyIds()
    .filter((dpid) => dpid.startsWith(PREFIX_GAMERULE))
    .map((dpid) => [dpid, world.getDynamicProperty(dpid)] as [string, boolean | number | string | Vector3 | undefined])
    .filter(([_dpid, dp]) => dp !== undefined)
    .map(([dpid, dp]) => `${dpid}: ${JSON.stringify(dp)}`);

  player.sendMessage(`ゲームルール一覧\n${gamerules.join('\n')}`);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(showGameRulesCommand, commandProcess));
