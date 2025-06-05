import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { registerCommand } from "./common";
import { setAutoRemoveFortuneEnchant, setAutoRemoveFortuneEnchantInterval, } from "./gameRules/autoRemoveFortuneEnchant";
import { setBaseMarketPrice, setBaseMaximumRange } from "./gameRules/base";
import { setShowAreaBorder, setShowAreaBorderInterval, setShowAreaBorderRange, } from "./gameRules/showAreaBorder";
import { setTeleportTarget } from "./gameRules/teleportTarget";
import { setWatchCrossingArea, setWatchCrossingAreaInterval, } from "./gameRules/watchCrossingArea";
export var RuleName;
(function (RuleName) {
    RuleName["autoRemoveFortuneEnchant"] = "autoRemoveFortuneEnchant";
    RuleName["autoRemoveFortuneEnchantInterval"] = "autoRemoveFortuneEnchantInterval";
    RuleName["baseMarketPrice"] = "baseMarketPrice";
    RuleName["baseMaximumRange"] = "baseMaximumRange";
    RuleName["showAreaBorder"] = "showAreaBorder";
    RuleName["showAreaBorderInterval"] = "showAreaBorderInterval";
    RuleName["showAreaBorderRange"] = "showAreaBorderRange";
    RuleName["teleportTargets"] = "teleportTargets";
    RuleName["watchCrossingArea"] = "watchCrossingArea";
    RuleName["watchCrossingAreaInterval"] = "watchCrossingAreaInterval";
})(RuleName || (RuleName = {}));
const gameruleCommand = {
    name: "nacht:gamerule",
    description: "アドオンで追加したゲームルールを変更する",
    permissionLevel: CommandPermissionLevel.Admin,
    mandatoryParameters: [
        { name: "nacht:ruleName", type: CustomCommandParamType.Enum },
        { name: "value", type: CustomCommandParamType.String },
    ],
};
/**
 * ゲームルールを変更するコマンドの処理
 *
 * @param origin
 * @param ruleName
 * @param value
 * @returns
 */
const commandProcess = (origin, ruleName, value) => {
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
        case RuleName.teleportTargets:
            return setTeleportTarget(value);
        case RuleName.watchCrossingArea:
            return setWatchCrossingArea(value);
        case RuleName.watchCrossingAreaInterval:
            return setWatchCrossingAreaInterval(value);
        default:
            return { status: CustomCommandStatus.Success };
    }
};
export default () => {
    system.beforeEvents.startup.subscribe((event) => {
        event.customCommandRegistry.registerEnum("nacht:ruleName", [
            RuleName.autoRemoveFortuneEnchant,
            RuleName.autoRemoveFortuneEnchantInterval,
            RuleName.baseMarketPrice,
            RuleName.baseMaximumRange,
            RuleName.showAreaBorder,
            RuleName.showAreaBorderInterval,
            RuleName.showAreaBorderRange,
            RuleName.teleportTargets,
            RuleName.watchCrossingArea,
            RuleName.watchCrossingAreaInterval,
        ]);
        registerCommand(gameruleCommand, commandProcess)(event);
    });
};
