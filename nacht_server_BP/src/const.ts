import { TicksPerSecond, type Vector3 } from '@minecraft/server';

import { RuleName } from './commands/enum';
import { MinecraftEffectTypes, MinecraftEnchantmentTypes, MinecraftEntityTypes } from './types/index';

// Dynamic Properties
/// Counter
export const COUNTER_BASE = 'base';
export const COUNTER_SAFE_AREA = 'safe-area';
export const COUNTER_TRANSFER = 'point-transfer';
export const COUNTER_UNEDITABLE = 'uneditable-areas';
export const COUNTER_UNSAFE_AREA = 'unsafe-area';

/// prefix
export const PREFIX_BASE = 'nacht:base_';
export const PREFIX_COUNTER = 'nacht:counter_';
export const PREFIX_GAMERULE = 'nacht:gamerule_';
export const PREFIX_LOCATION = 'nacht:location_';
export const PREFIX_MOVIE = 'nacht:movie_';
export const PREFIX_OPGAMEMODE = 'nacht:opgamemode_';
export const PREFIX_PLAYERNAME = 'nacht:playername_';
export const PREFIX_SAFEAREA = 'nacht:safearea_';
export const PREFIX_TELEPORTRUNID = 'nacht:teleportRunId_';
export const PREFIX_TICKING = 'nacht:ticking_';
export const PREFIX_TITLE = 'nacht:title_';
export const PREFIX_TRANSFER = 'nacht:transfer_';
export const PREFIX_UNEDITABLEAREA = 'nacht:uneditablearea_';
export const PREFIX_UNSAFEAREA = 'nacht:unsafearea_';

/// variables
export const VAR_STASH = 'nacht:var_stash';

// Effect
export const EffectNames: Partial<Record<MinecraftEffectTypes, string>> = {
  [MinecraftEffectTypes.Absorption]: 'potion.absorption',
  [MinecraftEffectTypes.BadOmen]: 'effect.badOmen',
  [MinecraftEffectTypes.Blindness]: 'potion.blindness',
  [MinecraftEffectTypes.ConduitPower]: 'potion.conduitPower',
  [MinecraftEffectTypes.Darkness]: 'effect.darkness',
  // [MinecraftEffectTypes.FatalPoison]: '致死毒',
  [MinecraftEffectTypes.FireResistance]: 'potion.fireResistance',
  [MinecraftEffectTypes.Haste]: 'potion.digSpeed',
  [MinecraftEffectTypes.HealthBoost]: 'potion.healthBoost',
  [MinecraftEffectTypes.Hunger]: 'potion.hunger',
  [MinecraftEffectTypes.InstantDamage]: 'potion.harm',
  [MinecraftEffectTypes.InstantHealth]: 'potion.heal',
  [MinecraftEffectTypes.Invisibility]: 'potion.invisibility',
  [MinecraftEffectTypes.JumpBoost]: 'potion.jump',
  [MinecraftEffectTypes.Levitation]: 'potion.levitation',
  [MinecraftEffectTypes.MiningFatigue]: 'potion.digSlowDown',
  // [MinecraftEffectTypes.Nausea]: '吐き気',
  [MinecraftEffectTypes.NightVision]: 'potion.nightVision',
  [MinecraftEffectTypes.Poison]: 'potion.poison',
  [MinecraftEffectTypes.Regeneration]: 'potion.regeneration',
  [MinecraftEffectTypes.Resistance]: 'potion.resistance',
  [MinecraftEffectTypes.Saturation]: 'potion.saturation',
  [MinecraftEffectTypes.SlowFalling]: 'potion.slowFalling',
  [MinecraftEffectTypes.Slowness]: 'potion.moveSlowdown',
  [MinecraftEffectTypes.Speed]: 'potion.moveSpeed',
  [MinecraftEffectTypes.Strength]: 'potion.damageBoost',
  [MinecraftEffectTypes.VillageHero]: 'effect.villageHero',
  [MinecraftEffectTypes.WaterBreathing]: 'potion.waterBreathing',
  [MinecraftEffectTypes.Weakness]: 'potion.weakness',
  [MinecraftEffectTypes.Wither]: 'potion.wither',
};

// Enchantment
export const EnchantmentNames: Record<MinecraftEnchantmentTypes, string> = {
  [MinecraftEnchantmentTypes.AquaAffinity]: 'enchantment.waterWorker',
  [MinecraftEnchantmentTypes.BaneOfArthropods]: 'enchantment.damage.arthropods',
  [MinecraftEnchantmentTypes.Binding]: 'enchantment.curse.binding',
  [MinecraftEnchantmentTypes.BlastProtection]: 'enchantment.protect.explosion',
  [MinecraftEnchantmentTypes.BowInfinity]: 'enchantment.arrowInfinite',
  [MinecraftEnchantmentTypes.Breach]: 'enchantment.heavy_weapon.breach',
  [MinecraftEnchantmentTypes.Channeling]: 'enchantment.tridentChanneling',
  [MinecraftEnchantmentTypes.Density]: 'enchantment.heavy_weapon.density',
  [MinecraftEnchantmentTypes.DepthStrider]: 'enchantment.waterWalker',
  [MinecraftEnchantmentTypes.Efficiency]: 'enchantment.digging',
  [MinecraftEnchantmentTypes.FeatherFalling]: 'enchantment.protect.fall',
  [MinecraftEnchantmentTypes.FireAspect]: 'enchantment.fire',
  [MinecraftEnchantmentTypes.FireProtection]: 'enchantment.protect.fire',
  [MinecraftEnchantmentTypes.Flame]: 'enchantment.arrowFire',
  [MinecraftEnchantmentTypes.Fortune]: 'enchantment.lootBonusDigger',
  [MinecraftEnchantmentTypes.FrostWalker]: 'enchantment.frostwalker',
  [MinecraftEnchantmentTypes.Impaling]: 'enchantment.tridentImpaling',
  [MinecraftEnchantmentTypes.Knockback]: 'enchantment.knockback',
  [MinecraftEnchantmentTypes.Looting]: 'enchantment.lootBonus',
  [MinecraftEnchantmentTypes.Loyalty]: 'enchantment.tridentLoyalty',
  [MinecraftEnchantmentTypes.LuckOfTheSea]: 'enchantment.lootBonusFishing',
  [MinecraftEnchantmentTypes.Lure]: 'enchantment.fishingSpeed',
  [MinecraftEnchantmentTypes.Mending]: 'enchantment.mending',
  [MinecraftEnchantmentTypes.Multishot]: 'enchantment.crossbowMultishot',
  [MinecraftEnchantmentTypes.Piercing]: 'enchantment.crossbowPiercing',
  [MinecraftEnchantmentTypes.Power]: 'enchantment.arrowDamage',
  [MinecraftEnchantmentTypes.ProjectileProtection]: 'enchantment.protect.projectile',
  [MinecraftEnchantmentTypes.Protection]: 'enchantment.protect.all',
  [MinecraftEnchantmentTypes.Punch]: 'enchantment.arrowKnockback',
  [MinecraftEnchantmentTypes.QuickCharge]: 'enchantment.crossbowQuickCharge',
  [MinecraftEnchantmentTypes.Respiration]: 'enchantment.oxygen',
  [MinecraftEnchantmentTypes.Riptide]: 'enchantment.tridentRiptide',
  [MinecraftEnchantmentTypes.Sharpness]: 'enchantment.damage.all',
  [MinecraftEnchantmentTypes.SilkTouch]: 'enchantment.untouching',
  [MinecraftEnchantmentTypes.Smite]: 'enchantment.damage.undead',
  [MinecraftEnchantmentTypes.SoulSpeed]: 'enchantment.soul_speed',
  [MinecraftEnchantmentTypes.SwiftSneak]: 'enchantment.swift_sneak',
  [MinecraftEnchantmentTypes.Thorns]: 'enchantment.thorns',
  [MinecraftEnchantmentTypes.Unbreaking]: 'enchantment.durability',
  [MinecraftEnchantmentTypes.Vanishing]: 'enchantment.curse.vanishing',
  [MinecraftEnchantmentTypes.WindBurst]: 'enchantment.heavy_weapon.windburst',
};

// Entity
export const Enemies: Array<string> = [
  // MinecraftEntityTypes.Agent,
  // MinecraftEntityTypes.Allay,
  // MinecraftEntityTypes.AreaEffectCloud,
  // MinecraftEntityTypes.Armadillo,
  // MinecraftEntityTypes.ArmorStand,
  // MinecraftEntityTypes.Arrow,
  // MinecraftEntityTypes.Axolotl,
  // MinecraftEntityTypes.Bat,
  // MinecraftEntityTypes.Bee,
  MinecraftEntityTypes.Blaze,
  // MinecraftEntityTypes.Boat,
  MinecraftEntityTypes.Bogged,
  MinecraftEntityTypes.Breeze,
  // MinecraftEntityTypes.BreezeWindChargeProjectile,
  // MinecraftEntityTypes.Camel,
  // MinecraftEntityTypes.Cat,
  MinecraftEntityTypes.CaveSpider,
  // MinecraftEntityTypes.ChestBoat,
  // MinecraftEntityTypes.ChestMinecart,
  // MinecraftEntityTypes.Chicken,
  // MinecraftEntityTypes.Cod,
  // MinecraftEntityTypes.CommandBlockMinecart,
  // MinecraftEntityTypes.Cow,
  MinecraftEntityTypes.Creaking,
  MinecraftEntityTypes.Creeper,
  // MinecraftEntityTypes.Dolphin,
  // MinecraftEntityTypes.Donkey,
  // MinecraftEntityTypes.DragonFireball,
  MinecraftEntityTypes.Drowned,
  // MinecraftEntityTypes.Egg,
  MinecraftEntityTypes.ElderGuardian,
  // MinecraftEntityTypes.EnderCrystal,
  MinecraftEntityTypes.EnderDragon,
  // MinecraftEntityTypes.EnderPearl,
  MinecraftEntityTypes.Enderman,
  MinecraftEntityTypes.Endermite,
  MinecraftEntityTypes.EvocationIllager,
  // MinecraftEntityTypes.EyeOfEnderSignal,
  // MinecraftEntityTypes.Fireball,
  // MinecraftEntityTypes.FireworksRocket,
  // MinecraftEntityTypes.FishingHook,
  // MinecraftEntityTypes.Fox,
  // MinecraftEntityTypes.Frog,
  MinecraftEntityTypes.Ghast,
  // MinecraftEntityTypes.GlowSquid,
  // MinecraftEntityTypes.Goat,
  MinecraftEntityTypes.Guardian,
  // MinecraftEntityTypes.HappyGhast,
  MinecraftEntityTypes.Hoglin,
  // MinecraftEntityTypes.HopperMinecart,
  // MinecraftEntityTypes.Horse,
  MinecraftEntityTypes.Husk,
  // MinecraftEntityTypes.IronGolem,
  // MinecraftEntityTypes.LightningBolt,
  // MinecraftEntityTypes.LingeringPotion,
  // MinecraftEntityTypes.Llama,
  // MinecraftEntityTypes.LlamaSpit,
  MinecraftEntityTypes.MagmaCube,
  // MinecraftEntityTypes.Minecart,
  // MinecraftEntityTypes.Mooshroom,
  // MinecraftEntityTypes.Mule,
  // MinecraftEntityTypes.Npc,
  // MinecraftEntityTypes.Ocelot,
  // MinecraftEntityTypes.OminousItemSpawner,
  // MinecraftEntityTypes.Panda,
  // MinecraftEntityTypes.Parrot,
  MinecraftEntityTypes.Phantom,
  // MinecraftEntityTypes.Pig,
  MinecraftEntityTypes.Piglin,
  MinecraftEntityTypes.PiglinBrute,
  MinecraftEntityTypes.Pillager,
  // MinecraftEntityTypes.Player,
  // MinecraftEntityTypes.PolarBear,
  // MinecraftEntityTypes.Pufferfish,
  // MinecraftEntityTypes.Rabbit,
  MinecraftEntityTypes.Ravager,
  // MinecraftEntityTypes.Salmon,
  // MinecraftEntityTypes.Sheep,
  MinecraftEntityTypes.Shulker,
  // MinecraftEntityTypes.ShulkerBullet,
  MinecraftEntityTypes.Silverfish,
  MinecraftEntityTypes.Skeleton,
  // MinecraftEntityTypes.SkeletonHorse,
  MinecraftEntityTypes.Slime,
  // MinecraftEntityTypes.SmallFireball,
  // MinecraftEntityTypes.Sniffer,
  // MinecraftEntityTypes.SnowGolem,
  // MinecraftEntityTypes.Snowball,
  MinecraftEntityTypes.Spider,
  // MinecraftEntityTypes.SplashPotion,
  // MinecraftEntityTypes.Squid,
  MinecraftEntityTypes.Stray,
  // MinecraftEntityTypes.Strider,
  // MinecraftEntityTypes.Tadpole,
  // MinecraftEntityTypes.ThrownTrident,
  // MinecraftEntityTypes.Tnt,
  // MinecraftEntityTypes.TntMinecart,
  // MinecraftEntityTypes.TraderLlama,
  // MinecraftEntityTypes.TripodCamera,
  // MinecraftEntityTypes.Tropicalfish,
  // MinecraftEntityTypes.Turtle,
  MinecraftEntityTypes.Vex,
  MinecraftEntityTypes.Villager,
  MinecraftEntityTypes.VillagerV2,
  MinecraftEntityTypes.Vindicator,
  // MinecraftEntityTypes.WanderingTrader,
  MinecraftEntityTypes.Warden,
  // MinecraftEntityTypes.WindChargeProjectile,
  MinecraftEntityTypes.Witch,
  MinecraftEntityTypes.Wither,
  MinecraftEntityTypes.WitherSkeleton,
  // MinecraftEntityTypes.WitherSkull,
  // MinecraftEntityTypes.WitherSkullDangerous,
  // MinecraftEntityTypes.Wolf,
  // MinecraftEntityTypes.XpBottle,
  // MinecraftEntityTypes.XpOrb,
  MinecraftEntityTypes.Zoglin,
  MinecraftEntityTypes.Zombie,
  // MinecraftEntityTypes.ZombieHorse,
  MinecraftEntityTypes.ZombiePigman,
  MinecraftEntityTypes.ZombieVillager,
  MinecraftEntityTypes.ZombieVillagerV2,
];

export const UnnecessaryEntities: Array<string> = [
  // MinecraftEntityTypes.Agent,
  // MinecraftEntityTypes.Allay,
  // MinecraftEntityTypes.AreaEffectCloud,
  MinecraftEntityTypes.Armadillo,
  // MinecraftEntityTypes.ArmorStand,
  // MinecraftEntityTypes.Arrow,
  // MinecraftEntityTypes.Axolotl,
  MinecraftEntityTypes.Bat,
  MinecraftEntityTypes.Bee,
  // MinecraftEntityTypes.Blaze,
  // MinecraftEntityTypes.Boat,
  // MinecraftEntityTypes.Bogged,
  // MinecraftEntityTypes.Breeze,
  // MinecraftEntityTypes.BreezeWindChargeProjectile,
  MinecraftEntityTypes.Camel,
  // MinecraftEntityTypes.Cat,
  // MinecraftEntityTypes.CaveSpider,
  // MinecraftEntityTypes.ChestBoat,
  // MinecraftEntityTypes.ChestMinecart,
  MinecraftEntityTypes.Chicken,
  MinecraftEntityTypes.Cod,
  // MinecraftEntityTypes.CommandBlockMinecart,
  MinecraftEntityTypes.Cow,
  // MinecraftEntityTypes.Creaking,
  // MinecraftEntityTypes.Creeper,
  // MinecraftEntityTypes.Dolphin,
  MinecraftEntityTypes.Donkey,
  // MinecraftEntityTypes.DragonFireball,
  // MinecraftEntityTypes.Drowned,
  // MinecraftEntityTypes.Egg,
  // MinecraftEntityTypes.ElderGuardian,
  // MinecraftEntityTypes.EnderCrystal,
  // MinecraftEntityTypes.EnderDragon,
  // MinecraftEntityTypes.EnderPearl,
  // MinecraftEntityTypes.Enderman,
  // MinecraftEntityTypes.Endermite,
  // MinecraftEntityTypes.EvocationIllager,
  // MinecraftEntityTypes.EyeOfEnderSignal,
  // MinecraftEntityTypes.Fireball,
  // MinecraftEntityTypes.FireworksRocket,
  // MinecraftEntityTypes.FishingHook,
  // MinecraftEntityTypes.Fox,
  // MinecraftEntityTypes.Frog,
  // MinecraftEntityTypes.Ghast,
  MinecraftEntityTypes.GlowSquid,
  MinecraftEntityTypes.Goat,
  // MinecraftEntityTypes.Guardian,
  MinecraftEntityTypes.HappyGhast,
  // MinecraftEntityTypes.Hoglin,
  // MinecraftEntityTypes.HopperMinecart,
  MinecraftEntityTypes.Horse,
  // MinecraftEntityTypes.Husk,
  MinecraftEntityTypes.IronGolem,
  // MinecraftEntityTypes.LightningBolt,
  // MinecraftEntityTypes.LingeringPotion,
  MinecraftEntityTypes.Llama,
  // MinecraftEntityTypes.LlamaSpit,
  // MinecraftEntityTypes.MagmaCube,
  // MinecraftEntityTypes.Minecart,
  MinecraftEntityTypes.Mooshroom,
  MinecraftEntityTypes.Mule,
  // MinecraftEntityTypes.Npc,
  MinecraftEntityTypes.Ocelot,
  // MinecraftEntityTypes.OminousItemSpawner,
  // MinecraftEntityTypes.Panda,
  // MinecraftEntityTypes.Parrot,
  // MinecraftEntityTypes.Phantom,
  MinecraftEntityTypes.Pig,
  // MinecraftEntityTypes.Piglin,
  // MinecraftEntityTypes.PiglinBrute,
  // MinecraftEntityTypes.Pillager,
  // MinecraftEntityTypes.Player,
  MinecraftEntityTypes.PolarBear,
  MinecraftEntityTypes.Pufferfish,
  // MinecraftEntityTypes.Rabbit,
  // MinecraftEntityTypes.Ravager,
  MinecraftEntityTypes.Salmon,
  MinecraftEntityTypes.Sheep,
  // MinecraftEntityTypes.Shulker,
  // MinecraftEntityTypes.ShulkerBullet,
  // MinecraftEntityTypes.Silverfish,
  // MinecraftEntityTypes.Skeleton,
  MinecraftEntityTypes.SkeletonHorse,
  // MinecraftEntityTypes.Slime,
  // MinecraftEntityTypes.SmallFireball,
  MinecraftEntityTypes.Sniffer,
  // MinecraftEntityTypes.SnowGolem,
  // MinecraftEntityTypes.Snowball,
  // MinecraftEntityTypes.Spider,
  // MinecraftEntityTypes.SplashPotion,
  MinecraftEntityTypes.Squid,
  // MinecraftEntityTypes.Stray,
  MinecraftEntityTypes.Strider,
  MinecraftEntityTypes.Tadpole,
  // MinecraftEntityTypes.ThrownTrident,
  // MinecraftEntityTypes.Tnt,
  // MinecraftEntityTypes.TntMinecart,
  // MinecraftEntityTypes.TraderLlama,
  // MinecraftEntityTypes.TripodCamera,
  // MinecraftEntityTypes.Tropicalfish,
  // MinecraftEntityTypes.Turtle,
  // MinecraftEntityTypes.Vex,
  // MinecraftEntityTypes.Villager,
  // MinecraftEntityTypes.VillagerV2,
  // MinecraftEntityTypes.Vindicator,
  // MinecraftEntityTypes.WanderingTrader,
  // MinecraftEntityTypes.Warden,
  // MinecraftEntityTypes.WindChargeProjectile,
  // MinecraftEntityTypes.Witch,
  // MinecraftEntityTypes.Wither,
  // MinecraftEntityTypes.WitherSkeleton,
  // MinecraftEntityTypes.WitherSkull,
  // MinecraftEntityTypes.WitherSkullDangerous,
  // MinecraftEntityTypes.Wolf,
  // MinecraftEntityTypes.XpBottle,
  // MinecraftEntityTypes.XpOrb,
  // MinecraftEntityTypes.Zoglin,
  // MinecraftEntityTypes.Zombie,
  MinecraftEntityTypes.ZombieHorse,
  // MinecraftEntityTypes.ZombiePigman,
  // MinecraftEntityTypes.ZombieVillager,
  // MinecraftEntityTypes.ZombieVillagerV2,
];

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
export const GAMERULE_DEFAULT = {
  [RuleName.autoRemoveFortuneEnchant]: true,
  [RuleName.autoRemoveFortuneEnchantInterval]: TicksPerSecond,
  [RuleName.baseMarketPrice]: 20,
  [RuleName.baseMaximumRange]: 501,
  [RuleName.prayPrice]: 300,
  [RuleName.showAreaBorder]: true,
  [RuleName.showAreaBorderInterval]: TicksPerSecond / 2,
  [RuleName.showAreaBorderRange]: 101,
  [RuleName.showAreaBorderYRange]: 5,
  [RuleName.teleportTargets]: 6,
  [RuleName.teleportTimeout]: 5,
  [RuleName.watchCrossingArea]: true,
  [RuleName.watchCrossingAreaInterval]: TicksPerSecond / 5,
};

// Items
// export const BIOME_TYPES = BiomeTypes.getAll().map((bt) => bt.id);
// export const BLOCK_TYPES = BlockTypes.getAll().map((bt) => bt.id);
// export const DIMENSION_TYPES = DimensionTypes.getAll().map((dt) => dt.typeId);
// export const EFFECT_TYPES = EffectTypes.getAll().map((et) => et.getName);
// export const ENCHANTMENT_TYPES = EnchantmentTypes.getAll().map((et) => et.id);
// export const ENTITY_TYPES = EntityTypes.getAll().map((et) => et.id);
// export const ITEM_TYPES = ItemTypes.getAll().map((it) => it.id);

// Location
export const LOC_ERSTE: Vector3 = { x: -10, y: 63, z: 0 };

// Scoreboard
export const SCOREBOARD_POINT = 'point';

// Tag
export const TAG_AREA_BASE = 'AREA_BASE';
export const TAG_AREA_EXPL = 'AREA_EXPL';
export const TAG_AREA_TOWN = 'AREA_TOWN';
export const TAG_OPERATOR = 'OP';
export const TAG_OP_DEV = 'OP_DEVELOPMENT';
export const TAG_OP_PLAY = 'OP_PLAY';

/// Title
export const TAG_TITLE_BILLIONAIRE = 'TITLE_BILLIONAIRE';
export const TAG_TITLE_FIRST_BILLIONAIRE = 'TITLE_FIRST_BILLIONAIRE';
export const TAG_TITLE_FIRST_MILLIONAIRE = 'TITLE_FIRST_MILLIONAIRE';
export const TAG_TITLE_LUCK = 'TITLE_LUCK';
export const TAG_TITLE_MILLIONAIRE = 'TITLE_MILLIONAIRE';
export const TAG_TITLE_NACHT_HALO = 'TITLE_NACHT_HALO';
export const TAG_TITLE_NACHT_LEFT_WING = 'TITLE_NACHT_LEFT_WING';
export const TAG_TITLE_NACHT_RIGHT_WING = 'TITLE_NACHT_RIGHT_WING';
export const TAG_TITLE_NACHT_TAIL = 'TITLE_NACHT_TAIL';
export const Titles = {
  [TAG_TITLE_BILLIONAIRE]: '億万長者',
  [TAG_TITLE_FIRST_BILLIONAIRE]: 'はじめての億万長者',
  [TAG_TITLE_FIRST_MILLIONAIRE]: 'はじめての大富豪',
  [TAG_TITLE_LUCK]: '豪運',
  [TAG_TITLE_MILLIONAIRE]: '大富豪',
  [TAG_TITLE_NACHT_HALO]: '光輪を見つけし者',
  [TAG_TITLE_NACHT_LEFT_WING]: '自由の翼を得たもの',
  [TAG_TITLE_NACHT_RIGHT_WING]: '誓約の翼を得たもの',
  [TAG_TITLE_NACHT_TAIL]: '尾を掴みし者',
};
