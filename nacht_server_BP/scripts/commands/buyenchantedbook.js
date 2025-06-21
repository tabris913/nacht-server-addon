import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, } from '@minecraft/server';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
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
};
/**
 *
 * @param origin
 * @param target
 * @param enchant
 * @param level
 * @param quantity
 * @param point
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = ({ sourceEntity, sourceType }, target, enchant, level, quantity, point) => {
    if (sourceType !== CustomCommandSource.NPCDialogue)
        throw new NonNPCSourceError();
    if (sourceEntity === undefined)
        throw new UndefinedSourceOrInitiatorError();
    target.forEach((player) => marketLogic.purchaseItem(player, sourceEntity, MinecraftItemTypes.EnchantedBook, quantity, point, undefined, undefined, undefined, enchant, level));
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(buyEnchantedBookCommand, commandProcess));
