import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { setAutoRemoveFortuneEnchant, setAutoRemoveFortuneEnchantInterval, } from "./gameRules/autoRemoveFortuneEnchant";
import { setShowAreaBorder, setShowAreaBorderInterval, setShowAreaBorderRange, } from "./gameRules/showAreaBorder";
import { setWatchCrossingArea, setWatchCrossingAreaInterval, } from "./gameRules/watchCrossingArea";
import { setBaseMarketPrice, setBaseMaximumRange } from "./gameRules/base";
export var RuleName;
(function (RuleName) {
    RuleName["autoRemoveFortuneEnchant"] = "autoRemoveFortuneEnchant";
    RuleName["autoRemoveFortuneEnchantInterval"] = "autoRemoveFortuneEnchantInterval";
    RuleName["baseMarketPrice"] = "baseMarketPrice";
    RuleName["baseMaximumRange"] = "baseMaximumRange";
    RuleName["showAreaBorder"] = "showAreaBorder";
    RuleName["showAreaBorderInterval"] = "showAreaBorderInterval";
    RuleName["showAreaBorderRange"] = "showAreaBorderRange";
    RuleName["watchCrossingArea"] = "watchCrossingArea";
    RuleName["watchCrossingAreaInterval"] = "watchCrossingAreaInterval";
})(RuleName || (RuleName = {}));
export default () => {
    system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerEnum("nacht:ruleName", [
        RuleName.autoRemoveFortuneEnchant,
        RuleName.autoRemoveFortuneEnchantInterval,
        RuleName.baseMarketPrice,
        RuleName.baseMaximumRange,
        RuleName.showAreaBorder,
        RuleName.showAreaBorderInterval,
        RuleName.showAreaBorderRange,
        RuleName.watchCrossingArea,
        RuleName.watchCrossingAreaInterval,
    ]));
    system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
        name: "nacht:gamerule",
        description: "アドオンで追加したゲームルールを変更する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "nacht:ruleName", type: CustomCommandParamType.Enum },
            { name: "value", type: CustomCommandParamType.String },
        ],
    }, (origin, ruleName, value) => {
        try {
            switch (ruleName) {
                case RuleName.autoRemoveFortuneEnchant:
                    return setAutoRemoveFortuneEnchant(value);
                case RuleName.autoRemoveFortuneEnchantInterval:
                    return setAutoRemoveFortuneEnchantInterval(value);
                case RuleName.baseMarketPrice:
                    return setBaseMarketPrice(value);
                case RuleName.baseMaximumRange:
                    return setBaseMaximumRange(value);
                case RuleName.showAreaBorder:
                    return setShowAreaBorder(value);
                case RuleName.showAreaBorderInterval:
                    return setShowAreaBorderInterval(value);
                case RuleName.showAreaBorderRange:
                    return setShowAreaBorderRange(value);
                case RuleName.watchCrossingArea:
                    return setWatchCrossingArea(value);
                case RuleName.watchCrossingAreaInterval:
                    return setWatchCrossingAreaInterval(value);
                default:
                    return { status: CustomCommandStatus.Success };
            }
        }
        catch (error) {
            console.error(error);
            return {
                message: `${ruleName}の設定に失敗しました。`,
                status: CustomCommandStatus.Failure,
            };
        }
    }));
};
