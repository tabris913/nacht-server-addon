import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type ItemType,
  system,
} from '@minecraft/server';

import { UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

const buyCommand: CustomCommand = {
  name: 'nacht:buy',
  description: 'NPCからアイテムを購入する。',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'item', type: CustomCommandParamType.ItemType },
    { name: 'amount', type: CustomCommandParamType.Integer },
    { name: 'point', type: CustomCommandParamType.Integer },
  ],
  optionalParameters: [
    { name: 'pointless_msg', type: CustomCommandParamType.String },
    { name: 'after_msg', type: CustomCommandParamType.String },
  ],
};

/**
 * アイテム購入コマンドの処理
 *
 * @param origin
 * @param item
 * @param amount
 * @param point
 * @param pointless_msg
 * @param after_msg
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (
  origin: CustomCommandOrigin,
  item: ItemType,
  amount: number,
  point: number,
  pointless_msg?: string,
  after_msg?: string,
): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(origin.initiator);
  if (player === undefined || origin.sourceEntity === undefined) {
    throw new UndefinedSourceOrInitiatorError();
  }

  marketLogic.purchaseItem(player, origin.sourceEntity, item.id, amount, point, pointless_msg, after_msg);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(buyCommand, commandProcess));
