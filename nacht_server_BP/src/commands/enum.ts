import { CustomCommandParamType, EasingType, system } from '@minecraft/server';

import { MinecraftEnchantmentTypes } from '../types/index';

export enum SuccessOrFailure {
  Success = 'success',
  Failure = 'failure',
}

export enum CloneMode {
  Force = 'force',
  Move = 'move',
  Normal = 'normal',
}

export enum DiagonalTypes {
  Line = 'line',
  Section = 'section',
}

export enum DimensionTypes {
  Overworld = 'overworld',
  Nether = 'nether',
  TheEnd = 'the_end',
}

export enum Direction {
  West = 'west',
  East = 'east',
  North = 'north',
  South = 'south',

  NorthWest = 'north_west',
  NorthEast = 'north_east',
  SouthWest = 'south_west',
  SouthEast = 'south_east',
}

export enum ExpandMode {
  Expand = 'expand',
  Shrink = 'shrink',
}

export enum FillMode {
  destroy = 'destroy',
  hollow = 'hollow',
  keep = 'keep',
  outline = 'outline',
  replace = 'replace',
}

export enum MaskMode {
  // Filtered = 'filtered',
  Replace = 'replace',
  Masked = 'masked',
}

export enum Mode {
  cancel = 'cancel',
  set = 'set',
}

export enum OpGameMode {
  development = 'development',
  play = 'play',
}

export enum PraySubCommand {
  Free = 'free',
  Paid = 'paid',
}

export enum Rotate {
  _0 = '0',
  _90 = '90',
  _180 = '180',
  _270 = '270',
}

export enum RuleName {
  autoRemoveFortuneEnchant = 'autoRemoveFortuneEnchant',
  autoRemoveFortuneEnchantInterval = 'autoRemoveFortuneEnchantInterval',
  baseMarketPrice = 'baseMarketPrice',
  baseMaximumRange = 'baseMaximumRange',
  prayPrice = 'prayPrice',
  showAreaBorder = 'showAreaBorder',
  showAreaBorderInterval = 'showAreaBorderInterval',
  showAreaBorderRange = 'showAreaBorderRange',
  showAreaBorderYRange = 'showAreaBorderYRange',
  teleportTargets = 'teleportTargets',
  watchCrossingArea = 'watchCrossingArea',
  watchCrossingAreaInterval = 'watchCrossingAreaInterval',
}

export enum VerticalDirection {
  UP = 'up',
  DOWN = 'down',
}

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:successOrFailure', [
      SuccessOrFailure.Failure,
      SuccessOrFailure.Success,
    ]);

    event.customCommandRegistry.registerEnum('nacht:AreaSetMode', [Mode.cancel, Mode.set]);

    event.customCommandRegistry.registerEnum('nacht:CloneMode', [CloneMode.Force, CloneMode.Move, CloneMode.Normal]);

    event.customCommandRegistry.registerEnum('nacht:CustomCommandParamType', [
      'BlockType',
      'Boolean',
      'EntitySelector',
      'Float',
      'Integer',
      'ItemType',
      'Location',
      'PlayerSelector',
      'String',
    ] satisfies Array<keyof typeof CustomCommandParamType>);

    event.customCommandRegistry.registerEnum('nacht:DiagonalTypes', [DiagonalTypes.Line, DiagonalTypes.Section]);

    event.customCommandRegistry.registerEnum('nacht:DimensionTypes', [
      DimensionTypes.Nether,
      DimensionTypes.Overworld,
      DimensionTypes.TheEnd,
    ]);

    event.customCommandRegistry.registerEnum('nacht:Direction', [
      Direction.East,
      Direction.North,
      Direction.South,
      Direction.West,
      Direction.NorthEast,
      Direction.NorthWest,
      Direction.SouthEast,
      Direction.SouthWest,
    ]);

    event.customCommandRegistry.registerEnum('nacht:easeType', [
      EasingType.InBack,
      EasingType.InBounce,
      EasingType.InCirc,
      EasingType.InCubic,
      EasingType.InElastic,
      EasingType.InExpo,
      EasingType.InOutBack,
      EasingType.InOutBounce,
      EasingType.InOutCirc,
      EasingType.InOutCubic,
      EasingType.InOutElastic,
      EasingType.InOutExpo,
      EasingType.InOutQuad,
      EasingType.InOutQuart,
      EasingType.InOutQuint,
      EasingType.InOutSine,
      EasingType.InQuad,
      EasingType.InQuart,
      EasingType.InQuint,
      EasingType.InSine,
      EasingType.Linear,
      EasingType.OutBack,
      EasingType.OutBounce,
      EasingType.OutCirc,
      EasingType.OutCubic,
      EasingType.OutElastic,
      EasingType.OutExpo,
      EasingType.OutQuad,
      EasingType.OutQuart,
      EasingType.OutQuint,
      EasingType.OutSine,
      EasingType.Spring,
    ]);

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

    event.customCommandRegistry.registerEnum('nacht:ExpandMode', [ExpandMode.Expand, ExpandMode.Shrink]);

    event.customCommandRegistry.registerEnum('nacht:MaskMode', [
      // MaskMode.Filtered,
      MaskMode.Masked,
      MaskMode.Replace,
    ]);

    event.customCommandRegistry.registerEnum('nacht:oldBlockHandling', [
      FillMode.destroy,
      FillMode.hollow,
      FillMode.keep,
      FillMode.outline,
      FillMode.replace,
    ]);

    event.customCommandRegistry.registerEnum('nacht:OpGameMode', [OpGameMode.development, OpGameMode.play]);

    event.customCommandRegistry.registerEnum('nacht:PraySubCommand', [PraySubCommand.Free, PraySubCommand.Paid]);

    event.customCommandRegistry.registerEnum('nacht:Rotate', [Rotate._0, Rotate._180, Rotate._90, Rotate._270]);

    event.customCommandRegistry.registerEnum('nacht:ruleName', [
      RuleName.autoRemoveFortuneEnchant,
      RuleName.autoRemoveFortuneEnchantInterval,
      RuleName.baseMarketPrice,
      RuleName.baseMaximumRange,
      RuleName.prayPrice,
      RuleName.showAreaBorder,
      RuleName.showAreaBorderInterval,
      RuleName.showAreaBorderRange,
      RuleName.showAreaBorderYRange,
      RuleName.teleportTargets,
      RuleName.watchCrossingArea,
      RuleName.watchCrossingAreaInterval,
    ]);

    event.customCommandRegistry.registerEnum('nacht:VerticalDirection', [VerticalDirection.DOWN, VerticalDirection.UP]);
  });
