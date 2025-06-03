import { world } from "@minecraft/server";

export default () => {
  world.afterEvents.playerJoin.subscribe((event) => {
    world.sendMessage(`${event.playerName} さんが参加しました`);
    const entity = world.getEntity(event.playerId);
    const scoreboardIdentity = entity?.scoreboardIdentity;
    const point = world.scoreboard.getObjective("point");

    if (
      scoreboardIdentity &&
      !point?.hasParticipant(entity.scoreboardIdentity)
    ) {
      point?.setScore(scoreboardIdentity, 0);
    }
  });
};
