import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, TicksPerSecond, world, } from '@minecraft/server';
import { EffectNames, PREFIX_GAMERULE, SCOREBOARD_POINT } from '../const';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import { PointlessError } from '../errors/market';
import { MinecraftEffectTypes } from '../types/index';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import { registerCommand } from './common';
import { RuleName } from './gamerule';
var PraySubCommand;
(function (PraySubCommand) {
    PraySubCommand["Free"] = "free";
    PraySubCommand["Paid"] = "paid";
})(PraySubCommand || (PraySubCommand = {}));
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
const prayCommand = {
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
const commandProcess = (origin, subCommand) => {
    if (origin.sourceType !== CustomCommandSource.NPCDialogue)
        throw new NonNPCSourceError();
    const prayer = PlayerUtils.convertToPlayer(origin.initiator);
    if (prayer === undefined)
        throw new UndefinedSourceOrInitiatorError();
    let rarity;
    let effect;
    const randomValue = Math.random();
    if (randomValue < prayLootTable.rarity.N.cumulative) {
        rarity = 'N';
        const choices = Math.floor(Math.random() * prayLootTable.rarity.N.effects.length);
        effect = prayLootTable.rarity.N.effects[choices];
    }
    else if (randomValue < prayLootTable.rarity.R.cumulative) {
        rarity = 'R';
        const choices = Math.floor(Math.random() * prayLootTable.rarity.R.effects.length);
        effect = prayLootTable.rarity.R.effects[choices];
    }
    else if (randomValue < prayLootTable.rarity.SR.cumulative) {
        rarity = 'SR';
        const choices = Math.floor(Math.random() * prayLootTable.rarity.SR.effects.length);
        effect = prayLootTable.rarity.SR.effects[choices];
    }
    else {
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
const freePray = (prayer, effect, rarity) => {
    const randomValue = Math.random();
    let level;
    if (randomValue < prayLootTable.mode[PraySubCommand.Free].level[1].cumulative) {
        level = 1;
    }
    else {
        level = 2;
    }
    system.runTimeout(() => {
        prayer.addEffect(effect, TicksPerSecond * 90, { amplifier: level - 1, showParticles: true });
        prayer.sendMessage(`[${rarity}] ${EffectNames[effect]}レベル${level}を90秒間付与しました。`);
    }, 1);
};
const paidPray = (prayer, effect, rarity) => {
    system.runTimeout(() => {
        const score = ScoreboardUtils.getScoreOrEnable(prayer, SCOREBOARD_POINT);
        const price = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.prayPrice) || 100;
        if (score < price)
            throw new PointlessError();
        ScoreboardUtils.addScore(prayer, SCOREBOARD_POINT, -price);
        const randomValue = Math.random();
        let level;
        if (randomValue < prayLootTable.mode[PraySubCommand.Free].level[1].cumulative) {
            level = 1;
        }
        else if (randomValue < prayLootTable.mode[PraySubCommand.Free].level[2].cumulative) {
            level = 2;
        }
        else {
            level = 3;
        }
        prayer.addEffect(effect, TicksPerSecond * 180, { amplifier: level - 1, showParticles: true });
        prayer.sendMessage(`[${rarity}] ${EffectNames[effect]}レベル${level}を180秒間付与しました。`);
    }, 1);
};
export default () => {
    system.beforeEvents.startup.subscribe((event) => {
        event.customCommandRegistry.registerEnum('nacht:PraySubCommand', [PraySubCommand.Free, PraySubCommand.Paid]);
        registerCommand(prayCommand, commandProcess)(event);
    });
};
