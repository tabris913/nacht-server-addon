import { CustomCommandParamType, EasingType, system } from '@minecraft/server';

import { MinecraftEnchantmentTypes } from '../types/index';

export enum SuccessOrFailure {
  Success = 'success',
  Failure = 'failure',
}

export enum DimensionTypes {
  Overworld = 'overworld',
  Nether = 'nether',
  TheEnd = 'the_end',
}

export enum FillMode {
  destroy = 'destroy',
  hollow = 'hollow',
  keep = 'keep',
  outline = 'outline',
  replace = 'replace',
}

export enum Mode {
  cancel = 'cancel',
  set = 'set',
}

export enum PraySubCommand {
  Free = 'free',
  Paid = 'paid',
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

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:successOrFailure', [
      SuccessOrFailure.Failure,
      SuccessOrFailure.Success,
    ]);

    event.customCommandRegistry.registerEnum('nacht:AreaSetMode', [Mode.cancel, Mode.set]);

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

    event.customCommandRegistry.registerEnum('nacht:DimensionTypes', [
      DimensionTypes.Nether,
      DimensionTypes.Overworld,
      DimensionTypes.TheEnd,
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

    event.customCommandRegistry.registerEnum('nacht:oldBlockHandling', [
      FillMode.destroy,
      FillMode.hollow,
      FillMode.keep,
      FillMode.outline,
      FillMode.replace,
    ]);

    event.customCommandRegistry.registerEnum('nacht:PraySubCommand', [PraySubCommand.Free, PraySubCommand.Paid]);

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
  });
