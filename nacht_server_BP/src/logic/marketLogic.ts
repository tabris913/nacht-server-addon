import { type Entity, Player, system } from "@minecraft/server";
import { SCOREBOARD_POINT } from "../const";
import { PointlessError } from "../errors/market";
import InventoryUtils from "../utils/InventoryUtils";
import ScoreboardUtils from "../utils/ScoreboardUtils";

/**
 * プレイヤーがアイテムを購入する
 *
 * @param player エンティティまたはプレイヤー
 * @param sourceEntity 売り手
 * @param itemType アイテム
 * @param amount 数量
 * @param price 金額
 * @param pointless_msg
 * @param after_msg
 */
const purchaseItem = (
  player: Player,
  sourceEntity: Entity,
  itemType: string,
  amount: number,
  price: number,
  pointless_msg?: string,
  after_msg?: string
) => {
  try {
    ScoreboardUtils.getScoreOrEnable(player, SCOREBOARD_POINT);
    const sellerName = sourceEntity.nameTag || "NPC";
    if (
      player.matches({
        scoreOptions: [{ maxScore: price - 1, objective: SCOREBOARD_POINT }],
      })
    ) {
      player.sendMessage(
        `[${sellerName}] ${pointless_msg || "ポイントが足りません。"}`
      );

      throw new PointlessError();
    }

    system.runTimeout(() => {
      ScoreboardUtils.addScore(player, SCOREBOARD_POINT, -price);
      InventoryUtils.giveItem(player, itemType, amount);
      player.sendMessage(`${sellerName} ${after_msg || "まいどあり！"}`);
    }, 1);
  } catch (error) {
    console.error(
      `${player.nameTag} failed to purchase ${amount} ${itemType}(s) for ${price} points.`
    );

    throw error;
  }
};

export default { purchaseItem };
