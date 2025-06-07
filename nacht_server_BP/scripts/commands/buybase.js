import { CommandPermissionLevel, CustomCommandSource, CustomCommandStatus, system, TicksPerSecond, world, } from "@minecraft/server";
import { MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { Formatting, PREFIX_BASE, PREFIX_GAMERULE } from "../const";
import { NonNPCSourceError, UndefinedSourceOrInitiatorError, } from "../errors/command";
import DynamicPropertyUtils from "../utils/DynamicPropertyUtils";
import InventoryUtils from "../utils/InventoryUtils";
import PlayerUtils from "../utils/PlayerUtils";
import ScoreboardUtils from "../utils/ScoreboardUtils";
import { registerCommand } from "./common";
import { RuleName } from "./gamerule";
import { Logger } from "../utils/logger";
const buybaseCommand = {
    name: "nacht:buybase",
    description: "拠点用地を購入する",
    permissionLevel: CommandPermissionLevel.GameDirectors,
};
/**
 * 拠点購入コマンドの処理
 *
 * @param origin
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin) => {
    if (origin.sourceType !== CustomCommandSource.NPCDialogue) {
        throw new NonNPCSourceError();
    }
    const player = PlayerUtils.convertToPlayer(origin.initiator);
    if (player === undefined || origin.sourceEntity === undefined) {
        throw new UndefinedSourceOrInitiatorError();
    }
    const baseDps = DynamicPropertyUtils.retrieveBases(player.nameTag);
    if (baseDps.some((baseDp) => baseDp.name === undefined)) {
        player.sendMessage("拠点の設定が進行中です。");
        return { status: CustomCommandStatus.Failure };
    }
    const form = new ModalFormData();
    form.title("どんな拠点にするんだい？");
    const maxRange = Math.max(51, world.getDynamicProperty(PREFIX_GAMERULE + RuleName.baseMaximumRange) || 501);
    form.slider("サイズ", 51, maxRange, {
        valueStep: 2,
        defaultValue: Math.min(maxRange, 101),
    });
    form.submitButton("決定");
    system.runTimeout(() => {
        form.show(player).then((response) => {
            var _a;
            if (response.canceled) {
                Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
                return;
            }
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
    }, TicksPerSecond);
    return { status: CustomCommandStatus.Success };
};
const purchase = (player, npc, size, price, count) => {
    const purchaseForm = new MessageFormData();
    purchaseForm.body(`${price}ポイントになりますがよろしいですか？`);
    purchaseForm.button1("はい");
    purchaseForm.button2("いいえ");
    purchaseForm.show(player).then((response) => {
        if (response.canceled)
            return;
        if (response.selection === 1) {
            // はい
            // origin.sourceEntity?.runCommand(`nacht:buy nacht:base_flag 1 ${price}`);
            const score = ScoreboardUtils.getScore(player, "point");
            if (score === undefined) {
                // ポイントシステムが無効
                Logger.error(`${player.nameTag}のスコアボードpointが有効になっていません`);
                ScoreboardUtils.setScore(player, "point", 0);
                player.sendMessage(`${Formatting.Color.GOLD}ポイントシステムが有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`);
                return;
            }
            const npcName = npc.nameTag || "NPC";
            if (player.matches({
                scoreOptions: [{ minScore: price, objective: "point" }],
            })) {
                ScoreboardUtils.addScore(player, "point", -price);
                InventoryUtils.giveItem(player, "nacht:base_flag", 1);
                world.setDynamicProperty(PREFIX_BASE + `${player.nameTag}_${count}`, JSON.stringify({
                    edgeSize: size,
                    id: "",
                    index: count,
                    northWest: { x: 0, z: 0 },
                    owner: player.nameTag,
                    participants: [],
                    showBorder: true,
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
export default () => system.beforeEvents.startup.subscribe(registerCommand(buybaseCommand, commandProcess));
