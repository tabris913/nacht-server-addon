import { world } from "@minecraft/server";
export default () => world.afterEvents.playerJoin.subscribe((event) => {
    world.sendMessage(`${event.playerName} さんが参加しました`);
    const entity = world.getEntity(event.playerId);
    const scoreboardIdentity = entity === null || entity === void 0 ? void 0 : entity.scoreboardIdentity;
    const point = world.scoreboard.getObjective("point");
    if (scoreboardIdentity &&
        !(point === null || point === void 0 ? void 0 : point.hasParticipant(entity.scoreboardIdentity))) {
        point === null || point === void 0 ? void 0 : point.setScore(scoreboardIdentity, 0);
    }
});
