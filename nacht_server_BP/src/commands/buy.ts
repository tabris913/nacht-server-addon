import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type ItemType,
  type Player,
  system,
} from '@minecraft/server';

import { UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';

import { registerCommand } from './common';

const buyCommand: CustomCommand = {
  name: 'nacht:buy',
  description: 'NPCからアイテムを購入する。',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'item', type: CustomCommandParamType.ItemType },
    { name: 'amount', type: CustomCommandParamType.Integer },
    { name: 'point', type: CustomCommandParamType.Integer },
  ],
  optionalParameters: [
    { name: 'data', type: CustomCommandParamType.Integer },
    { name: 'pointless_msg', type: CustomCommandParamType.String },
    { name: 'after_msg', type: CustomCommandParamType.String },
  ],
};

/**
 * アイテム購入コマンドの処理
 *
 * @param origin
 * @param target
 * @param item
 * @param amount
 * @param point
 * @param data
 * @param pointless_msg
 * @param after_msg
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (
  { sourceEntity }: CustomCommandOrigin,
  targets: Array<Player>,
  item: ItemType,
  amount: number,
  point: number,
  data?: number,
  pointless_msg?: string,
  after_msg?: string
): CustomCommandResult => {
  if (sourceEntity === undefined) {
    throw new UndefinedSourceOrInitiatorError();
  }

  system.runJob(
    (function* () {
      for (const target of targets) {
        marketLogic.purchaseItem(target, sourceEntity, item.id, amount, point, pointless_msg, after_msg, data);

        yield;
      }
    })()
  );

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(buyCommand, commandProcess));
