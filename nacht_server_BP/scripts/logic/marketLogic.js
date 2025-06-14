import { system } from '@minecraft/server';
import { SCOREBOARD_POINT } from '../const';
import { PointlessError } from '../errors/market';
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
const purchaseItem = (player, sourceEntity, itemType, quantity, price, pointless_msg, after_msg, data) => {
    try {
        ScoreboardUtils.getScoreOrEnable(player, SCOREBOARD_POINT);
        const sellerName = sourceEntity.nameTag || 'NPC';
        if (player.matches({
            scoreOptions: [{ maxScore: price - 1, objective: SCOREBOARD_POINT }],
        })) {
            player.sendMessage(`[${sellerName}] ${pointless_msg || 'ポイントが足りません。'}`);
            throw new PointlessError();
        }
        system.runTimeout(() => {
            ScoreboardUtils.addScore(player, SCOREBOARD_POINT, -price);
            InventoryUtils.giveItem(player, itemType, quantity, data);
            player.sendMessage(`[${sellerName}] ${after_msg || 'まいどあり！'}`);
        }, 1);
    }
    catch (error) {
        Logger.error(`${player.nameTag} failed to purchase ${quantity} ${itemType}(s) for ${price} points.`);
        throw error;
    }
};
export default { purchaseItem };
