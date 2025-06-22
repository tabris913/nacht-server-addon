import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from '@minecraft/server';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import { MinecraftItemTypes } from '../types/index';
import { registerCommand } from './common';
const buyEnchantedBookCommand = {
    name: 'nacht:buyenchantedbook',
    description: 'エンチャントの本を購入する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'target', type: CustomCommandParamType.PlayerSelector },
        { name: 'nacht:EnchantTypes', type: CustomCommandParamType.Enum },
        { name: 'level', type: CustomCommandParamType.Integer },
        { name: 'quantity', type: CustomCommandParamType.Integer },
        { name: 'point', type: CustomCommandParamType.Integer },
    ],
    optionalParameters: [
        { name: 'pointless_msg', type: CustomCommandParamType.String },
        { name: 'after_msg', type: CustomCommandParamType.String },
    ],
};
/**
 *
 * @param origin
 * @param target
 * @param enchant
 * @param level
 * @param quantity
 * @param point
 * @param pointless_msg
 * @param after_msg
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = ({ sourceEntity }, target, enchant, level, quantity, point, pointless_msg, after_msg) => {
    if (sourceEntity === undefined)
        throw new UndefinedSourceOrInitiatorError();
    target.forEach((player) => marketLogic.purchaseItem(player, sourceEntity, MinecraftItemTypes.EnchantedBook, quantity, point, pointless_msg, after_msg, undefined, enchant, level));
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(buyEnchantedBookCommand, commandProcess));
