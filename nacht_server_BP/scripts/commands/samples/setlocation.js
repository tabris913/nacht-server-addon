import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from "@minecraft/server";
import PlayerUtils from "../../utils/PlayerUtils";
export default () => system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
    name: "nacht:setlocation",
    description: "名前をつけて座標を保存します",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        {
            name: "name",
            type: CustomCommandParamType.String,
        },
        {
            name: "location",
            type: CustomCommandParamType.Location,
        },
    ],
}, (origin, arg1, arg2) => {
    var _a, _b;
    try {
        world.setDynamicProperty(`nacht:location_${arg1}`, `${arg2.x}_${arg2.y}_${arg2.z}`);
        if (origin.initiator) {
            (_a = PlayerUtils.convertToPlayer(origin.initiator)) === null || _a === void 0 ? void 0 : _a.sendMessage(`nacht:location_${arg1} に ${arg2.x}_${arg2.y}_${arg2.z} が設定されました`);
        }
        return {
            message: `nacht:location_${arg1} に ${arg2.x}_${arg2.y}_${arg2.z} が設定されました`,
            status: CustomCommandStatus.Success,
        };
    }
    catch (error) {
        let message = "予期せぬエラーが発生しました";
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        if (origin.initiator) {
            (_b = PlayerUtils.convertToPlayer(origin.initiator)) === null || _b === void 0 ? void 0 : _b.sendMessage(message);
        }
        return { message, status: CustomCommandStatus.Failure };
    }
}));
