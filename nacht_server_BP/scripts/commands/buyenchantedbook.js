import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, } from '@minecraft/server';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from '../types/index';
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
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:EnchantTypes', [
        MinecraftEnchantmentTypes.AquaAffinity,
        MinecraftEnchantmentTypes.BaneOfArthropods,
        MinecraftEnchantmentTypes.Binding,
        MinecraftEnchantmentTypes.BlastProtection,
        MinecraftEnchantmentTypes.BowInfinity,
        MinecraftEnchantmentTypes.Breach,
        MinecraftEnchantmentTypes.Channeling,
        MinecraftEnchantmentTypes.Density,
        MinecraftEnchantmentTypes.DepthStrider,
        MinecraftEnchantmentTypes.Efficiency,
        MinecraftEnchantmentTypes.FeatherFalling,
        MinecraftEnchantmentTypes.FireAspect,
        MinecraftEnchantmentTypes.FireProtection,
        MinecraftEnchantmentTypes.Flame,
        MinecraftEnchantmentTypes.Fortune,
        MinecraftEnchantmentTypes.FrostWalker,
        MinecraftEnchantmentTypes.Impaling,
        MinecraftEnchantmentTypes.Knockback,
        MinecraftEnchantmentTypes.Looting,
        MinecraftEnchantmentTypes.Loyalty,
        MinecraftEnchantmentTypes.LuckOfTheSea,
        MinecraftEnchantmentTypes.Lure,
        MinecraftEnchantmentTypes.Mending,
        MinecraftEnchantmentTypes.Multishot,
        MinecraftEnchantmentTypes.Piercing,
        MinecraftEnchantmentTypes.Power,
        MinecraftEnchantmentTypes.ProjectileProtection,
        MinecraftEnchantmentTypes.Protection,
        MinecraftEnchantmentTypes.Punch,
        MinecraftEnchantmentTypes.QuickCharge,
        MinecraftEnchantmentTypes.Respiration,
        MinecraftEnchantmentTypes.Riptide,
        MinecraftEnchantmentTypes.Sharpness,
        MinecraftEnchantmentTypes.SilkTouch,
        MinecraftEnchantmentTypes.Smite,
        MinecraftEnchantmentTypes.SoulSpeed,
        MinecraftEnchantmentTypes.SwiftSneak,
        MinecraftEnchantmentTypes.Thorns,
        MinecraftEnchantmentTypes.Unbreaking,
        MinecraftEnchantmentTypes.Vanishing,
        MinecraftEnchantmentTypes.WindBurst,
    ]);
    registerCommand(buyEnchantedBookCommand, commandProcess)(event);
});
