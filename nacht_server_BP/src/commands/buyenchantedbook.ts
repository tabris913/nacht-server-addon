import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandSource,
  CustomCommandStatus,
  type Player,
  system,
} from '@minecraft/server';

import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import marketLogic from '../logic/marketLogic';
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from '../types/index';

import { registerCommand } from './common';

const buyEnchantedBookCommand: CustomCommand = {
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
const commandProcess = (
  { sourceEntity, sourceType }: CustomCommandOrigin,
  target: Array<Player>,
  enchant: MinecraftEnchantmentTypes,
  level: number,
  quantity: number,
  point: number
): CustomCommandResult => {
  if (sourceType !== CustomCommandSource.NPCDialogue) throw new NonNPCSourceError();
  if (sourceEntity === undefined) throw new UndefinedSourceOrInitiatorError();

  target.forEach((player) =>
    marketLogic.purchaseItem(
      player,
      sourceEntity,
      MinecraftItemTypes.EnchantedBook,
      quantity,
      point,
      undefined,
      undefined,
      undefined,
      enchant,
      level
    )
  );

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(buyEnchantedBookCommand, commandProcess));
