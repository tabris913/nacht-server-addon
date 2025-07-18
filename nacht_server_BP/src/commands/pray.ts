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
  TicksPerSecond,
  world,
} from '@minecraft/server';

import { EffectNames, PREFIX_GAMERULE, SCOREBOARD_POINT } from '../const';
import { CommandProcessError, NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import { PointlessError } from '../errors/market';
import { MinecraftEffectTypes } from '../types/index';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';

import { registerCommand } from './common';
import { PraySubCommand, RuleName } from './enum';

type Rarity = 'N' | 'R' | 'SR' | 'SSR';

const prayLootTable = {
  rarity: {
    N: {
      cumulative: 0.6,
      rate: 0.6,
      effects: [
        MinecraftEffectTypes.Speed,
        MinecraftEffectTypes.JumpBoost,
        MinecraftEffectTypes.Invisibility,
        MinecraftEffectTypes.SlowFalling,
      ],
    },
    R: {
      cumulative: 0.9,
      rate: 0.3,
      effects: [
        MinecraftEffectTypes.Haste,
        MinecraftEffectTypes.Strength,
        MinecraftEffectTypes.Resistance,
        MinecraftEffectTypes.FireResistance,
        MinecraftEffectTypes.WaterBreathing,
        MinecraftEffectTypes.NightVision,
        MinecraftEffectTypes.HealthBoost,
        MinecraftEffectTypes.Saturation,
      ],
    },
    SR: { cumulative: 0.97, rate: 0.07, effects: [MinecraftEffectTypes.Absorption] },
    SSR: { cumulative: 1.0, rate: 0.03, effects: [MinecraftEffectTypes.VillageHero] },
  },
  mode: {
    [PraySubCommand.Free]: { level: { 1: { cumulative: 0.95, rate: 0.95 }, 2: { cumulative: 1.0, rate: 0.05 } } },
    [PraySubCommand.Paid]: {
      level: {
        1: { cumulative: 0.8, rate: 0.8 },
        2: { cumulative: 0.95, rate: 0.15 },
        3: { cumulative: 1.0, rate: 0.05 },
      },
    },
  },
};

const prayCommand: CustomCommand = {
  name: 'nacht:pray',
  description: '教会でお祈りを捧げる',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'nacht:PraySubCommand', type: CustomCommandParamType.Enum }],
};

/**
 * お祈りコマンドの処理
 *
 * @param origin
 * @param subCommand サブコマンド
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link PointlessError}
 */
const commandProcess = (origin: CustomCommandOrigin, subCommand: PraySubCommand): CustomCommandResult => {
  NonNPCSourceError.validate(origin);

  const prayer = PlayerUtils.convertToPlayer(origin.initiator);
  if (prayer === undefined) throw new UndefinedSourceOrInitiatorError();

  if (prayer.getEffects().length > 0) {
    prayer.sendMessage('お主にはもう神のご加護がついているようだ。');

    throw new CommandProcessError('エフェクトがついていないときのみ実行できます。');
  }

  let rarity: Rarity;
  let effect: MinecraftEffectTypes;
  const randomValue = Math.random();
  if (randomValue < prayLootTable.rarity.N.cumulative) {
    rarity = 'N';
    const choices = Math.floor(Math.random() * prayLootTable.rarity.N.effects.length);
    effect = prayLootTable.rarity.N.effects[choices];
  } else if (randomValue < prayLootTable.rarity.R.cumulative) {
    rarity = 'R';
    const choices = Math.floor(Math.random() * prayLootTable.rarity.R.effects.length);
    effect = prayLootTable.rarity.R.effects[choices];
  } else if (randomValue < prayLootTable.rarity.SR.cumulative) {
    rarity = 'SR';
    const choices = Math.floor(Math.random() * prayLootTable.rarity.SR.effects.length);
    effect = prayLootTable.rarity.SR.effects[choices];
  } else {
    rarity = 'SSR';
    const choices = Math.floor(Math.random() * prayLootTable.rarity.SSR.effects.length);
    effect = prayLootTable.rarity.SSR.effects[choices];
  }

  switch (subCommand) {
    case PraySubCommand.Free:
      freePray(prayer, effect, rarity);
      break;
    case PraySubCommand.Paid:
      paidPray(prayer, effect, rarity);
      break;
  }

  return { status: CustomCommandStatus.Success };
};

const freePray = (prayer: Player, effect: MinecraftEffectTypes, rarity: Rarity) => {
  const randomValue = Math.random();
  let level: 1 | 2 | 3;
  if (randomValue < prayLootTable.mode[PraySubCommand.Free].level[1].cumulative) {
    level = 1;
  } else {
    level = 2;
  }

  system.runTimeout(() => {
    prayer.addEffect(effect, TicksPerSecond * 90, { amplifier: level - 1, showParticles: true });
    prayer.sendMessage([
      `[${rarity}] `,
      { translate: `${EffectNames[effect]}` },
      'レベル',
      { translate: `potion.potency.${level - 1}` },
      'を90秒間付与しました。',
    ]);
  }, 1);
};

const paidPray = (prayer: Player, effect: MinecraftEffectTypes, rarity: Rarity) => {
  system.runTimeout(() => {
    const score = ScoreboardUtils.getScoreOrEnable(prayer, SCOREBOARD_POINT);
    const price = (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.prayPrice) as number | undefined) || 100;
    if (score < price) throw new PointlessError();
    ScoreboardUtils.addScore(prayer, SCOREBOARD_POINT, -price);

    const randomValue = Math.random();
    let level: 1 | 2 | 3;
    if (randomValue < prayLootTable.mode[PraySubCommand.Free].level[1].cumulative) {
      level = 1;
    } else if (randomValue < prayLootTable.mode[PraySubCommand.Free].level[2].cumulative) {
      level = 2;
    } else {
      level = 3;
    }

    prayer.addEffect(effect, TicksPerSecond * 180, { amplifier: level - 1, showParticles: true });
    prayer.sendMessage([
      `[${rarity}] `,
      { translate: `${EffectNames[effect]}` },
      'レベル',
      { translate: `potion.potency.${level - 1}` },
      'を180秒間付与しました。',
    ]);
  }, 1);
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(prayCommand, commandProcess));
