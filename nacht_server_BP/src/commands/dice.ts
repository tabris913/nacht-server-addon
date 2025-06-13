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

import { Formatting } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

const diceCommand: CustomCommand = {
  name: 'nacht:diceroll',
  description: 'ダイスを振る。',
  permissionLevel: CommandPermissionLevel.Any,
  mandatoryParameters: [{ name: 'dice', type: CustomCommandParamType.String }],
};

/**
 * ダイスロールコマンドの処理
 *
 * @param origin
 * @param dice ダイス指示
 * @returns
 */
const commandProcess = (origin: CustomCommandOrigin, dice: string): CustomCommandResult => {
  if (!/^\d+D\d+$/.test(dice)) throw new NachtServerAddonError('指示が不正です。');
  const player = PlayerUtils.convertToPlayer(origin.initiator || origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  const [quantity, surface] = dice.split('D').map((v) => parseInt(v));
  const rolls = Array(quantity)
    .fill(null)
    .map(() => Math.ceil(Math.random() * surface));
  const formatted = rolls.map((value) =>
    surface === 100 && (value <= 5 || 95 < value)
      ? `${Formatting.Color.RED}${value.toString()}${Formatting.Reset}`
      : value.toString()
  );

  system.runTimeout(
    () =>
      world.sendMessage(
        `[${player.nameTag}] ${dice} = ${rolls.reduce((prev, cur) => prev + cur, 0)} ( ${formatted.join(' ')} )`
      ),
    1
  );

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(diceCommand, commandProcess));
