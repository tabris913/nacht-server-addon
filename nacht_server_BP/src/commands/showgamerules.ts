import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
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
import { RuleName } from './enum';

const showGameRulesCommand: CustomCommand = {
  name: 'nacht:showgamerules',
  description: 'ゲームルールを表示する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  optionalParameters: [{ name: 'nacht:ruleName', type: CustomCommandParamType.Enum }],
};

/**
 *
 * @param origin
 * @param ruleName
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin: CustomCommandOrigin, ruleName: RuleName): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  if (ruleName === undefined) {
    const gamerules = world
      .getDynamicPropertyIds()
      .filter((dpid) => dpid.startsWith(PREFIX_GAMERULE))
      .map(
        (dpid) => [dpid, world.getDynamicProperty(dpid)] as [string, boolean | number | string | Vector3 | undefined]
      )
      .filter(([_dpid, dp]) => dp !== undefined)
      .map(([dpid, dp]) => `${dpid.replace(PREFIX_GAMERULE, '')}: ${JSON.stringify(dp)}`);

    player.sendMessage(`ゲームルール一覧\n${gamerules.join('\n')}`);
  } else {
    const dp = world.getDynamicProperty(`${PREFIX_GAMERULE}${ruleName}`);
    if (dp === undefined) {
      player.sendMessage(`ゲームルール${ruleName}は設定されていません。`);
    } else {
      player.sendMessage(`${ruleName}: ${JSON.stringify(dp)}`);
    }
  }

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(showGameRulesCommand, commandProcess));
