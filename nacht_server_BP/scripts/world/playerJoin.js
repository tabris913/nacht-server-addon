import { world } from '@minecraft/server';
import { SCOREBOARD_POINT } from '../const';
import { Logger } from '../utils/logger';
import ScoreboardUtils from '../utils/ScoreboardUtils';
export default () => world.afterEvents.playerJoin.subscribe((event) => {
    Logger.info(`${event.playerName} is joined.`);
    world.sendMessage(`${event.playerName} さんが参加しました`);
    const entity = world.getEntity(event.playerId);
    if (entity) {
        const score = ScoreboardUtils.getScore(entity, SCOREBOARD_POINT);
        if (score === undefined) {
            ScoreboardUtils.setScore(entity, SCOREBOARD_POINT, 0);
            Logger.log(`${entity.nameTag}'s scoreboard ${SCOREBOARD_POINT} is enabled.`);
        }
        else {
            Logger.log(`${entity.nameTag}'s scoreboard ${SCOREBOARD_POINT} has already enabled.`);
        }
    }
    else {
        Logger.warning(`Entity ${event.playerId} cannot be gotten.`);
    }
});
