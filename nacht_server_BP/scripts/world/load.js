import { world } from '@minecraft/server';
import { GAMERULE_DEFAULT, PREFIX_GAMERULE, SCOREBOARD_POINT } from '../const';
import { Logger } from '../utils/logger';
const RESTORE_DATA = {
    'nacht:gamerule_autoRemoveFortuneEnchant': true,
    'nacht:gamerule_autoRemoveFortuneEnchantInterval': 20,
    'nacht:gamerule_baseMarketPrice': 20,
    'nacht:gamerule_baseMaximumRange': 501,
    'nacht:gamerule_prayPrice': 100,
    'nacht:gamerule_showAreaBorder': true,
    'nacht:gamerule_showAreaBorderInterval': 10,
    'nacht:gamerule_showAreaBorderRange': 101,
    'nacht:gamerule_showAreaBorderYRange': 5,
    'nacht:gamerule_teleportTargets': 6,
    'nacht:gamerule_watchCrossingArea': true,
    'nacht:gamerule_watchCrossingAreaInterval': 4,
    'nacht:location_tosshie1216_NPC': '{"displayName":"NPC","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_NPC","location":{"x":6.747990608215332,"y":134,"z":-2.2087960243225098},"name":"NPC","owner":"tosshie1216"}',
    test1: 'hello',
    test2: '1',
};
export default () => world.afterEvents.worldLoad.subscribe((event) => {
    // ポイント準備
    const point = world.scoreboard.getObjective(SCOREBOARD_POINT);
    if (point === undefined) {
        world.scoreboard.addObjective(SCOREBOARD_POINT);
        Logger.log(`${SCOREBOARD_POINT} is enabled.`);
    }
    else {
        Logger.log(`${SCOREBOARD_POINT} has already enabled.`);
    }
    // ゲームルール
    if (world.getDynamicPropertyIds().length === 0) {
        world.setDynamicProperties(RESTORE_DATA);
    }
    Object.entries(GAMERULE_DEFAULT).forEach(([ruleName, value]) => {
        const id = `${PREFIX_GAMERULE}${ruleName}`;
        const current = world.getDynamicProperty(id);
        if (current === undefined) {
            world.setDynamicProperty(id, value);
            Logger.log(`Default value (${value}) set as ${ruleName} is not set.`);
        }
    });
});
