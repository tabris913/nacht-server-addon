import { world } from '@minecraft/server';
import { SCOREBOARD_POINT } from '../const';
import { Logger } from '../utils/logger';
export default () => world.afterEvents.worldLoad.subscribe((event) => {
    const point = world.scoreboard.getObjective(SCOREBOARD_POINT);
    if (point === undefined) {
        world.scoreboard.addObjective(SCOREBOARD_POINT);
        Logger.log(`${SCOREBOARD_POINT} is enabled.`);
    }
    else {
        Logger.log(`${SCOREBOARD_POINT} has already enabled.`);
    }
});
