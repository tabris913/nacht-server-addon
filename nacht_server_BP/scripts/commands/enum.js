import { EasingType, system } from '@minecraft/server';
import { MinecraftEnchantmentTypes } from '../types/index';
export var SuccessOrFailure;
(function (SuccessOrFailure) {
    SuccessOrFailure["Success"] = "success";
    SuccessOrFailure["Failure"] = "failure";
})(SuccessOrFailure || (SuccessOrFailure = {}));
export var DimensionTypes;
(function (DimensionTypes) {
    DimensionTypes["Overworld"] = "overworld";
    DimensionTypes["Nether"] = "nether";
    DimensionTypes["TheEnd"] = "the_end";
})(DimensionTypes || (DimensionTypes = {}));
export var FillMode;
(function (FillMode) {
    FillMode["destroy"] = "destroy";
    FillMode["hollow"] = "hollow";
    FillMode["keep"] = "keep";
    FillMode["outline"] = "outline";
    FillMode["replace"] = "replace";
})(FillMode || (FillMode = {}));
export var Mode;
(function (Mode) {
    Mode["cancel"] = "cancel";
    Mode["set"] = "set";
})(Mode || (Mode = {}));
export var OpGameMode;
(function (OpGameMode) {
    OpGameMode["development"] = "development";
    OpGameMode["play"] = "play";
})(OpGameMode || (OpGameMode = {}));
export var PraySubCommand;
(function (PraySubCommand) {
    PraySubCommand["Free"] = "free";
    PraySubCommand["Paid"] = "paid";
})(PraySubCommand || (PraySubCommand = {}));
export var RuleName;
(function (RuleName) {
    RuleName["autoRemoveFortuneEnchant"] = "autoRemoveFortuneEnchant";
    RuleName["autoRemoveFortuneEnchantInterval"] = "autoRemoveFortuneEnchantInterval";
    RuleName["baseMarketPrice"] = "baseMarketPrice";
    RuleName["baseMaximumRange"] = "baseMaximumRange";
    RuleName["prayPrice"] = "prayPrice";
    RuleName["showAreaBorder"] = "showAreaBorder";
    RuleName["showAreaBorderInterval"] = "showAreaBorderInterval";
    RuleName["showAreaBorderRange"] = "showAreaBorderRange";
    RuleName["showAreaBorderYRange"] = "showAreaBorderYRange";
    RuleName["teleportTargets"] = "teleportTargets";
    RuleName["watchCrossingArea"] = "watchCrossingArea";
    RuleName["watchCrossingAreaInterval"] = "watchCrossingAreaInterval";
})(RuleName || (RuleName = {}));
export default () => system.beforeEvents.startup.subscribe((event) => {
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
    ]);
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
    event.customCommandRegistry.registerEnum('nacht:OpGameMode', [OpGameMode.development, OpGameMode.play]);
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
