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

import { Formatting, PREFIX_PLAYERNAME, TAG_TITLE_LUCK, Titles } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
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
  if (!/^\d+[Dd]\d+$/.test(dice)) throw new NachtServerAddonError('指示が不正です。');
  const player = PlayerUtils.convertToPlayer(origin.initiator || origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  const [quantity, surface] = dice
    .toUpperCase()
    .split('D')
    .map((v) => parseInt(v));
  const rolls = Array(quantity)
    .fill(null)
    .map(() => Math.ceil(Math.random() * surface));
  const formatted = rolls.map((value) =>
    surface === 100 && (value <= 5 || 95 < value)
      ? `${Formatting.Color.RED}${value.toString()}${Formatting.Reset}`
      : value.toString()
  );

  system.runTimeout(() => {
    world.sendMessage(
      `[${player.nameTag}] ${dice} = ${rolls.reduce((prev, cur) => prev + cur, 0)} ( ${formatted.join(' ')} )`
    );
    if (!player.hasTag(TAG_TITLE_LUCK) && surface === 100 && rolls.length >= 10 && rolls.every((roll) => roll <= 5)) {
      player.addTag(TAG_TITLE_LUCK);
      player.onScreenDisplay.setTitle(
        `称号「${Formatting.Color.AQUA}${Titles[TAG_TITLE_LUCK]}${Formatting.Reset}」獲得`
      );
      world.sendMessage(
        `${Formatting.Color.AQUA}${world.getDynamicProperty(PREFIX_PLAYERNAME + player.nameTag) || player.nameTag} が称号「${Titles[TAG_TITLE_LUCK]}」を獲得しました。`
      );
    }
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(diceCommand, commandProcess));
