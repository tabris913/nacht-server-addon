import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, } from '@minecraft/server';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import { MinecraftItemTypes } from '../types/index';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
const buyEnchantedBookCommand = {
    name: 'nacht:buyenchantedbook',
    description: 'エンチャントの本を購入する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'nacht:EnchantTypes', type: CustomCommandParamType.Enum },
        { name: 'level', type: CustomCommandParamType.Integer },
        { name: 'quantity', type: CustomCommandParamType.Integer },
        { name: 'point', type: CustomCommandParamType.Integer },
    ],
};
/**
 *
 * @param origin
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
const commandProcess = (origin, enchant, level, quantity, point) => {
    if (origin.sourceType !== CustomCommandSource.NPCDialogue)
        throw new NonNPCSourceError();
    const player = PlayerUtils.convertToPlayer(origin.initiator);
    if (player === undefined || origin.sourceEntity === undefined)
        throw new UndefinedSourceOrInitiatorError();
    marketLogic.purchaseItem(player, origin.sourceEntity, MinecraftItemTypes.EnchantedBook, quantity, point, undefined, undefined, undefined, enchant, level);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(buyEnchantedBookCommand, commandProcess));
