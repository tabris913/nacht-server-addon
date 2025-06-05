import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { registerCommand } from "./common";
import StringUtils from "../utils/StringUtils";
const messageCommand = {
    name: "nacht:message",
    description: "メッセージを送信する",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: "target", type: CustomCommandParamType.PlayerSelector },
        { name: "message", type: CustomCommandParamType.String },
    ],
    optionalParameters: [{ name: "name", type: CustomCommandParamType.String }],
};
/**
 * メッセージ送信コマンドの処理
 *
 * @param origin
 * @param target
 * @param message
 * @param name
 * @returns
 */
const commandProcess = (origin, target, message, name) => {
    var _a;
    const msgFrom = name || ((_a = origin.sourceEntity) === null || _a === void 0 ? void 0 : _a.nameTag);
    const msg = StringUtils.format(message);
    target.forEach((player) => player.sendMessage(`[${msgFrom}] ${msg}`));
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(messageCommand, commandProcess));
