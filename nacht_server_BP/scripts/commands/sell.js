import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from "@minecraft/server";
import { hasItem, removeItem } from "../utils/items";
import { getPlayer } from "../utils/player";
import { addScore, getScore, setScore } from "../utils/scoreboard";
import { Formatting } from "../const";
export default () => system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
    name: "nacht:sell",
    description: "アイテム売却コマンド",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: "item", type: CustomCommandParamType.ItemType },
        { name: "amount", type: CustomCommandParamType.Integer },
        { name: "point", type: CustomCommandParamType.Integer },
    ],
    optionalParameters: [
        { name: "itemless_msg", type: CustomCommandParamType.String },
        { name: "after_msg", type: CustomCommandParamType.String },
    ],
}, (origin, item, amount, point, itemless_msg, after_msg) => {
    var _a;
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
            if (hasItem(initiatorPlayer, item.id, { min: amount })) {
                // 必要なポイントを持っている
                system.runTimeout(() => {
                    removeItem(initiatorPlayer, item.id, amount);
                    if (score !== null) {
                        addScore(initiatorPlayer, "point", point);
                    }
                    initiatorPlayer.sendMessage(`[${npcName}] ${after_msg || "まいどあり！"}`);
                }, 1);
            }
            else {
                initiatorPlayer.sendMessage(`[${npcName}] ${itemless_msg || "アイテムが足りません"}`);
            }
        }
        else {
            world.sendMessage("このコマンドはNPCしか実行できません");
        }
        return undefined;
    }
    catch (error) {
        let message = "予期せぬエラーが発生しました";
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        return { message, status: CustomCommandStatus.Failure };
    }
}));
