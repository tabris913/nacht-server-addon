import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from '@minecraft/server';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import { registerCommand } from './common';
const buyCommand = {
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
const commandProcess = ({ sourceEntity }, target, item, amount, point, data = 0, pointless_msg, after_msg) => {
    if (sourceEntity === undefined) {
        throw new UndefinedSourceOrInitiatorError();
    }
    target.forEach((player) => marketLogic.purchaseItem(player, sourceEntity, item.id, amount, point, pointless_msg, after_msg, data));
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(buyCommand, commandProcess));
