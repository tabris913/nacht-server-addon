import { CommandPermissionLevel, CustomCommandSource, CustomCommandStatus, system, world, } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { getPlayer } from "../utils/player";
import { Formatting, PREFIX_BASE, PREFIX_GAMERULE } from "../const";
import { RuleName } from "./gamerule";
import { addScore, getScore, setScore } from "../utils/scoreboard";
import { giveItem } from "../utils/items";
import { getBaseDps } from "../utils/dp";
const purchase = (player, npc, size, price, count) => {
    const purchaseForm = new ActionFormData();
    purchaseForm.title(`${price}ポイントになりますがよろしいですか？`);
    purchaseForm.button("はい");
    purchaseForm.button("いいえ");
    purchaseForm.show(player).then((response2) => {
        if (response2.canceled)
            return;
        if (response2.selection === 1) {
            // はい
            // origin.sourceEntity?.runCommand(`nacht:buy nacht:base_flag 1 ${price}`);
            const score = getScore(player, "point");
            if (score === undefined) {
                // ポイントシステムが無効
                console.error(`${player.nameTag}のスコアボードpointが有効になっていません`);
                setScore(player, "point", 0);
                player.sendMessage(`${Formatting.Color.GOLD}ポイントシステムが有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`);
                return;
            }
            const npcName = npc.nameTag || "NPC";
            if (player.matches({
                scoreOptions: [{ minScore: price, objective: "point" }],
            })) {
                addScore(player, "point", -price);
                giveItem(player, "nacht:base_flag", 1);
                world.setDynamicProperty(PREFIX_BASE + `${player.nameTag}_${count}`, JSON.stringify({
                    northWest: { x: 0, z: 0 },
                    edgeSize: size,
                    id: "",
                }));
                player.sendMessage(`[${npcName}] まいどあり！`);
            }
            else {
                player.sendMessage(`[${npcName}] ポイントが足りません`);
                return;
            }
        }
    });
};
export default () => system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
    name: "nacht:buyarea",
    description: "拠点用地を購入する",
    permissionLevel: CommandPermissionLevel.GameDirectors,
}, (origin) => {
    try {
        if (origin.sourceType !== CustomCommandSource.NPCDialogue) {
            return {
                message: "このコマンドはNPCのみ実行できます。",
                status: CustomCommandStatus.Failure,
            };
        }
        const player = getPlayer(origin.initiator);
        if (player && origin.sourceEntity) {
            const baseDps = getBaseDps(player.nameTag);
            if (Object.values(baseDps).some((baseDp) => baseDp.name === undefined)) {
                return {
                    message: "拠点の設定が進行中です。",
                    status: CustomCommandStatus.Failure,
                };
            }
            const form = new ModalFormData();
            form.title("どんな拠点にするんだい？");
            const maxRange = Math.max(51, world.getDynamicProperty(PREFIX_GAMERULE + RuleName.baseMaximumRange) || 501);
            form.slider("サイズ", 51, maxRange, {
                valueStep: 2,
                defaultValue: Math.min(maxRange, 101),
            });
            form.submitButton("決定");
            form.show(player).then((response) => {
                var _a;
                if (response.canceled)
                    return;
                const size = (_a = response.formValues) === null || _a === void 0 ? void 0 : _a[0];
                const price = (size - 1) ** 2 *
                    (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.baseMarketPrice) || 20);
                purchase(player, origin.sourceEntity, size, price, Object.keys(baseDps).length);
                // const purchaseForm = new ActionFormData();
                // purchaseForm.title(
                //   `${price}ポイントになりますがよろしいですか？`
                // );
                // purchaseForm.button("はい");
                // purchaseForm.button("いいえ");
                // purchaseForm.show(player).then((response2) => {
                //   if (response2.canceled) return;
                //   if (response2.selection === 1) {
                //     origin.sourceEntity?.runCommand(
                //       `nacht:buy nacht:base_flag 1 ${price}`
                //     );
                //   }
                // });
            });
        }
        return { status: CustomCommandStatus.Success };
    }
    catch (error) {
        console.error(error);
        return { status: CustomCommandStatus.Failure };
    }
}));
