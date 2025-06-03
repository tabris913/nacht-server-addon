import { system, world } from "@minecraft/server";

export default () => {
  world.afterEvents.worldLoad.subscribe((event) => {
    const point = world.scoreboard.getObjective("point");
    if (point === undefined) {
      world.scoreboard.addObjective("point");
    }
  });
};
