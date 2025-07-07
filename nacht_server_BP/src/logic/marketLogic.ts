import { type Entity, type Player, system } from '@minecraft/server';

import { SCOREBOARD_POINT } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { PointlessError } from '../errors/market';
import { MinecraftEnchantmentTypes } from '../types/index';
import InventoryUtils from '../utils/InventoryUtils';
import { Logger } from '../utils/logger';
import ScoreboardUtils from '../utils/ScoreboardUtils';

/**
 * プレイヤーがアイテムを購入する
 *
 * @param player エンティティまたはプレイヤー
 * @param sourceEntity 売り手
 * @param itemType アイテム
 * @param quantity 数量
 * @param price 金額
 * @param pointless_msg
 * @param after_msg
 * @param data
 * @throws This function can throw error.
 *
 * {@link PointlessError}
 */
const purchaseItem = async (
  player: Player,
  sourceEntity: Entity,
  itemType: string,
  quantity: number,
  price: number,
  pointless_msg?: string,
  after_msg?: string,
  data?: number,
  enchant?: MinecraftEnchantmentTypes,
  level?: number
) => {
  try {
    ScoreboardUtils.getScoreOrEnable(player, SCOREBOARD_POINT);
    const sellerName = sourceEntity.nameTag || 'NPC';
    if (
      player.matches({
        scoreOptions: [{ maxScore: price - 1, objective: SCOREBOARD_POINT }],
      })
    ) {
      player.sendMessage(`[${sellerName}] ${pointless_msg || 'ポイントが足りません。'}`);

      throw new PointlessError();
    }
    if (InventoryUtils.isFull(player)) {
      player.sendMessage(`[${sellerName}] 荷物がいっぱいです。`);

      throw new NachtServerAddonError('インベントリがいっぱいです。');
    }

    ScoreboardUtils.addScore(player, SCOREBOARD_POINT, -price);
    let result;
    if (enchant) {
      result = InventoryUtils.giveEnchantedItem(player, itemType, quantity, enchant, level);
    } else {
      result = InventoryUtils.giveItem(player, itemType, quantity, data);
    }
    if (result) {
      player.sendMessage(`[${sellerName}] ${after_msg || 'まいどあり！'}`);
    } else {
      ScoreboardUtils.addScore(player, SCOREBOARD_POINT, price);
    }
  } catch (error) {
    Logger.error(`${player.nameTag} failed to purchase ${quantity} ${itemType}(s) for ${price} points.`);

    throw error;
  }
};

export default { purchaseItem };
