import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { Logger } from "../../utils/logger";
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("nacht:sampleEnum", [
        "a",
        "b",
        "c",
    ]);
    event.customCommandRegistry.registerCommand({
        name: "nacht:testparams",
        description: "コマンドパラメータの確認を行う (デバッグ用)",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "blockType", type: CustomCommandParamType.BlockType },
            {
                name: "entitySelector",
                type: CustomCommandParamType.EntitySelector,
            },
            { name: "nacht:sampleEnum", type: CustomCommandParamType.Enum },
            { name: "itemType", type: CustomCommandParamType.ItemType },
            { name: "location", type: CustomCommandParamType.Location },
            {
                name: "playerSelector",
                type: CustomCommandParamType.PlayerSelector,
            },
        ],
    }, (origin, blockType, entitySelector, enumParam, itemType, location, playerSelector) => {
        var _a, _b;
        try {
            Logger.log(blockType, JSON.stringify(blockType));
            Logger.log(entitySelector, JSON.stringify(entitySelector), (_a = entitySelector[0]) === null || _a === void 0 ? void 0 : _a.isValid);
            Logger.log(enumParam, JSON.stringify(enumParam));
            Logger.log(itemType, JSON.stringify(itemType));
            Logger.log(location, JSON.stringify(location));
            Logger.log(playerSelector, JSON.stringify(playerSelector), (_b = playerSelector[0]) === null || _b === void 0 ? void 0 : _b.isValid);
            return { status: CustomCommandStatus.Success };
        }
        catch (error) {
            let message = "予期せぬエラーが発生しました";
            if (error instanceof Error) {
                message += `\n${error.message}`;
            }
            return { message, status: CustomCommandStatus.Failure };
        }
    });
});
