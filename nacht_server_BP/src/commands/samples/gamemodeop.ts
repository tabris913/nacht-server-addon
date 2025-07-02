import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandSource,
  CustomCommandStatus,
  EntityComponentTypes,
  EquipmentSlot,
  GameMode,
  system,
  world,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
} from '@minecraft/server';

import { CommandProcessError, NonAdminSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';

import { registerCommand } from './common';
import PlayerUtils from '../utils/PlayerUtils';
import { OpGameMode } from './enum';
import { PREFIX_OPGAMEMODE, SCOREBOARD_POINT, TAG_OP_DEV, TAG_OP_PLAY } from '../const';
import { OperatorGameMode } from '../models/operator';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import InventoryUtils from '../utils/InventoryUtils';

const gamemodeOpCommand: CustomCommand = {
  name: 'nacht:gamemodeop',
  description: '',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'nacht:OpGameMode', type: CustomCommandParamType.Enum }],
};

/**
 *
 * @param origin
 * @param name
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonAdminSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link CommandProcessError}
 */
const commandProcess = (origin: CustomCommandOrigin, name: OpGameMode): CustomCommandResult => {
  if (origin.sourceType !== CustomCommandSource.Entity) throw new NonAdminSourceError();
  const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  const dpid = `${PREFIX_OPGAMEMODE}${player.nameTag}`;
  switch (name) {
    case OpGameMode.development:
      if (player.hasTag(TAG_OP_DEV)) throw new CommandProcessError('すでに開発モードです。');
      system.run(() => {
        player.addTag(TAG_OP_DEV);
        player.removeTag(TAG_OP_PLAY);
        player.setGameMode(GameMode.Creative);
        const dp = world.getDynamicProperty(dpid) as string | undefined;
        if (dp) {
          const parsed = JSON.parse(dp) as OperatorGameMode;
          player.resetLevel();
          player.addExperience(parsed.xp);
          ScoreboardUtils.setScore(player, SCOREBOARD_POINT, parsed.point);
          parsed.effects.forEach((effect) =>
            player.addEffect(effect.typeId, effect.duration, { amplifier: effect.amplifier })
          );
          const health = player.getComponent(EntityComponentTypes.Health);
          if (health && parsed.health) {
            health.setCurrentValue(parsed.health);
          }
          const hunger = player.getComponent(EntityComponentTypes.Hunger);
          if (hunger && parsed.hunger) {
            hunger.setCurrentValue(parsed.hunger);
          }
        }
        const equippable = player.getComponent(EntityComponentTypes.Equippable);
        world.setDynamicProperty(
          dpid,
          JSON.stringify({
            effects: player.getEffects(),
            equippable: {},
            health: player.getComponent(EntityComponentTypes.Health)?.currentValue,
            hunger: player.getComponent(EntityComponentTypes.Hunger)?.currentValue,
            point: ScoreboardUtils.getScore(player, SCOREBOARD_POINT) || 0,
            xp: player.getTotalXp(),
          } satisfies OperatorGameMode)
        );
      });
      break;
    case OpGameMode.play:
      if (player.hasTag(TAG_OP_PLAY)) throw new CommandProcessError('すでにプレイモードです。');
      system.run(() => {
        player.addTag(TAG_OP_PLAY);
        player.removeTag(TAG_OP_DEV);
        player.setGameMode(GameMode.Survival);
      });
      break;
  }

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(gamemodeOpCommand, commandProcess));
