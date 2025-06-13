import type { Vector3 } from '@minecraft/server';
import { MinecraftEffectTypes } from '@minecraft/vanilla-data';

// Counter
export const COUNTER_UNEDITABLE = 'uneditable-areas';

// Dynamic Properties
export const PREFIX_BASE = 'nacht:base_';
export const PREFIX_COUNTER = 'nacht:counter_';
export const PREFIX_GAMERULE = 'nacht:gamerule_';
export const PREFIX_LOCATION = 'nacht:location_';
export const PREFIX_UNEDITABLEAREA = 'nacht:uneditablearea_';

// Effect
export const EffectNames: Partial<Record<MinecraftEffectTypes, string>> = {
  [MinecraftEffectTypes.Absorption]: '衝撃吸収',
  [MinecraftEffectTypes.BadOmen]: '不吉な予感',
  [MinecraftEffectTypes.Blindness]: '盲目',
  [MinecraftEffectTypes.ConduitPower]: 'コンジットパワー',
  [MinecraftEffectTypes.Darkness]: '暗闇',
  [MinecraftEffectTypes.FatalPoison]: '致死毒',
  [MinecraftEffectTypes.FireResistance]: '火炎耐性',
  [MinecraftEffectTypes.Haste]: '採掘速度上昇',
  [MinecraftEffectTypes.HealthBoost]: '体力増強',
  [MinecraftEffectTypes.Hunger]: '空腹',
  [MinecraftEffectTypes.InstantDamage]: '即時ダメージ',
  [MinecraftEffectTypes.InstantHealth]: '即時回復',
  [MinecraftEffectTypes.Invisibility]: '透明化',
  [MinecraftEffectTypes.JumpBoost]: '跳躍力上昇',
  [MinecraftEffectTypes.Levitation]: '浮遊',
  [MinecraftEffectTypes.MiningFatigue]: '採掘速度低下',
  [MinecraftEffectTypes.Nausea]: '吐き気',
  [MinecraftEffectTypes.NightVision]: '暗視',
  [MinecraftEffectTypes.Poison]: '毒',
  [MinecraftEffectTypes.Regeneration]: '再生能力',
  [MinecraftEffectTypes.Resistance]: '耐性',
  [MinecraftEffectTypes.Saturation]: '満腹度回復',
  [MinecraftEffectTypes.SlowFalling]: '落下速度低下',
  [MinecraftEffectTypes.Slowness]: '移動速度低下',
  [MinecraftEffectTypes.Speed]: '移動速度上昇',
  [MinecraftEffectTypes.Strength]: '攻撃力上昇',
  [MinecraftEffectTypes.VillageHero]: '村の英雄',
  [MinecraftEffectTypes.WaterBreathing]: '水中呼吸',
  [MinecraftEffectTypes.Weakness]: '弱体化',
  [MinecraftEffectTypes.Wither]: '衰弱',
};

// Formatting
export const Formatting = {
  Color: {
    BLACK: '§0',
    DARK_BLUE: '§1',
    DARK_GREEN: '§2',
    DARK_AQUA: '§3',
    DARK_RED: '§4',
    DARK_PURPLE: '§5',
    GOLD: '§6',
    GRAY: '§7',
    DARK_GRAY: '§8',
    BLUE: '§9',
    GREEN: '§a',
    AQUA: '§b',
    RED: '§c',
    LIGHT_PURPLE: '§d',
    YELLOW: '§e',
    WHITE: '§f',
    MINECOIN_GOLD: '§g',
    MATERIAL_QUARTZ: '§h',
    MATERIAL_IRON: '§i',
    MATERIAL_NETHERITE: '§j',
    MATERIAL_REDSTONE: '§m',
    MATERIAL_COPPER: '§n',
    MATERIAL_GOLD: '§p',
    MATERIAL_EMERALD: '§q',
    MATERIAL_DIAMOND: '§s',
    MATERIAL_LAPIS: '§t',
    MATERIAL_AMETHYST: '§u',
  },
  Obfuscated: '§k',
  Bold: '§l',
  Italic: '§o',
  Reset: '§r',
};

export const flatFormatting: Record<string, string> = Object.entries(Formatting).reduce(
  (prev, [curK, curV]) =>
    curK !== 'Color'
      ? {
          ...prev,
          [curK.toLowerCase()]: curV,
        }
      : {
          ...prev,
          ...Object.entries(curV).reduce(
            (prev2, [cur2K, cur2V]) => ({
              ...prev2,
              [cur2K.toLowerCase()]: cur2V,
            }),
            {}
          ),
        },
  {}
);

// Game rule
export const COMMAND_MODIFICATION_BLOCK_LIMIT = 32768;

// Location
export const LOC_ERSTE: Vector3 = { x: -10, y: 63, z: 0 };

// Scoreboard
export const SCOREBOARD_POINT = 'point';

// Tag
export const TAG_OPERATOR = 'OP';
