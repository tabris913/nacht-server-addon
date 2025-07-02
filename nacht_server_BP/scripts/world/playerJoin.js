import { GameMode, world } from '@minecraft/server';
import { SCOREBOARD_POINT, TAG_AREA_BASE, TAG_AREA_EXPL, TAG_AREA_TOWN, TAG_OP_DEV, TAG_OP_PLAY, TAG_OPERATOR, } from '../const';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';
export default () => world.afterEvents.playerJoin.subscribe((event) => {
    Logger.info(`${event.playerName} is joined.`);
    // world.sendMessage(`${event.playerName} さんが参加しました`);
    const entity = world.getEntity(event.playerId);
    const player = PlayerUtils.findPlayer({ id: event.playerId });
    if (entity) {
        // ポイント有効化
        const score = ScoreboardUtils.getScore(entity, SCOREBOARD_POINT);
        if (score === undefined) {
            ScoreboardUtils.setScore(entity, SCOREBOARD_POINT, 0);
            Logger.log(`${entity.nameTag}'s scoreboard ${SCOREBOARD_POINT} is enabled.`);
        }
        else {
            Logger.log(`${entity.nameTag}'s scoreboard ${SCOREBOARD_POINT} has already enabled.`);
        }
        // エリアタグ
        if (!(entity.hasTag(TAG_AREA_BASE) || entity.hasTag(TAG_AREA_EXPL) || entity.hasTag(TAG_AREA_TOWN))) {
            entity.addTag(TAG_AREA_TOWN);
        }
        // オペレーターゲームモード
        if (entity.hasTag(TAG_OPERATOR) && !(entity.hasTag(TAG_OP_DEV) || entity.hasTag(TAG_OP_PLAY))) {
            switch (player === null || player === void 0 ? void 0 : player.getGameMode()) {
                case GameMode.Adventure:
                case GameMode.Survival:
                    player.addTag(TAG_OP_PLAY);
                    Logger.log(`${player.nameTag} is initialized to play mode.`);
                    break;
                case GameMode.Creative:
                case GameMode.Spectator:
                    player.addTag(TAG_OP_DEV);
                    Logger.log(`${player.nameTag} is initialized to development mode.`);
                    break;
            }
        }
    }
    else {
        Logger.warning(`Entity ${event.playerId} cannot be gotten.`);
    }
});
