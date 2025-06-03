import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { getPlayer } from "../utils/player";
import { addScore, getScore, setScore } from "../utils/scoreboard";
import { giveItem } from "../utils/items";
import { Formatting } from "../const";
export default () => system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
    name: "nacht:buy",
    description: "アイテム購入コマンド",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: "item", type: CustomCommandParamType.ItemType },
        { name: "amount", type: CustomCommandParamType.Integer },
        { name: "point", type: CustomCommandParamType.Integer },
    ],
    optionalParameters: [
        { name: "pointless_msg", type: CustomCommandParamType.String },
        { name: "after_msg", type: CustomCommandParamType.String },
    ],
}, (origin, item, amount, point, pointless_msg, after_msg) => {
    var _a, _b;
    try {
        const initiatorPlayer = getPlayer(origin.initiator);
        if (initiatorPlayer) {
            // called by NPC
            const score = getScore(initiatorPlayer, "point");
            if (score === undefined) {
                // ポイントシステムが無効
                console.error(`${initiatorPlayer.nameTag}のスコアボードpointが有効になっていません`);
                system.runTimeout(() => {
                    setScore(initiatorPlayer, "point", 0);
                    initiatorPlayer.sendMessage(`${Formatting.Color.GOLD}ポイントシステムが有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`);
                }, 1);
                return { status: CustomCommandStatus.Failure };
            }
            const npcName = ((_a = origin.sourceEntity) === null || _a === void 0 ? void 0 : _a.nameTag) || "NPC";
            if (initiatorPlayer.matches({
                scoreOptions: [{ minScore: point, objective: "point" }],
            })) {
                // 必要なポイントを持っている
                system.runTimeout(() => {
                    if (score !== undefined) {
                        addScore(initiatorPlayer, "point", -point);
                    }
                    giveItem(initiatorPlayer, item.id, amount);
                    initiatorPlayer.sendMessage(`[${npcName}] ${after_msg || "まいどあり！"}`);
                }, 1);
            }
            else {
                initiatorPlayer.sendMessage(`[${npcName}] ${pointless_msg || "ポイントが足りません"}`);
                return { status: CustomCommandStatus.Failure };
            }
        }
        else {
            // called by player
            return {
                message: "このコマンドはNPCしか実行できません",
                status: CustomCommandStatus.Failure,
            };
        }
        return { status: CustomCommandStatus.Success };
    }
    catch (error) {
        let message = "予期せぬエラーが発生しました";
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        if (origin.initiator) {
            (_b = getPlayer(origin.initiator)) === null || _b === void 0 ? void 0 : _b.sendMessage(message);
        }
        return { message, status: CustomCommandStatus.Failure };
    }
}));
