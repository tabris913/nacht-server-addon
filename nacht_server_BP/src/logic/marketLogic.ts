import { type Entity, Player } from "@minecraft/server";
import { SCOREBOARD_POINT } from "../const";
import PlayerUtils from "../utils/PlayerUtils";
import ScoreboardUtils from "../utils/ScoreboardUtils";
import { PointlessError } from "../errors";

/**
 * プレイヤーがアイテムを購入する
 *
 * @param entityOrPlayer エンティティまたはプレイヤー
 * @param sourceEntity 売り手
 * @param item アイテム
 * @param amount 数量
 * @param price 金額
 */
const purchaseItem = (
  entityOrPlayer: Entity | Player,
  sourceEntity: Entity,
  item: string,
  amount: number,
  price: number,
  pointless_msg?: string,
  after_msg?: string
) => {
  try {
    const player = PlayerUtils.convertToPlayer(entityOrPlayer);
    if (player === undefined) {
      console.warn(
        "A converted player from a given entity/player is undefined."
      );

      throw new Error("プレイヤーが指定されていません。");
    }

    const score = ScoreboardUtils.getScoreOrEnable(player, SCOREBOARD_POINT);
    const sellerName = sourceEntity.nameTag || "NPC";
    if (
      player.matches({
        scoreOptions: [{ maxScore: price - 1, objective: SCOREBOARD_POINT }],
      })
    ) {
      player.sendMessage(
        `[${sellerName}] ${pointless_msg || "ポイントが足りません。"}`
      );

      throw new PointlessError("ポイントが足りません。");
    }
  } catch (error) {
    console.error(
      `${entityOrPlayer.nameTag} failed to purchase ${amount} ${item}(s) for ${price} points.`
    );

    throw error;
  }
};

export default { purchaseItem };
