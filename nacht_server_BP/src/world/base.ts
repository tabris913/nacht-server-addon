import { system, TicksPerDay, world } from "@minecraft/server";
import { isInBaseArea2D, offsetLocation } from "../utils/area";
import { getBaseDps } from "../utils/dp";
import { TAG_OPERATOR } from "../const";

export default () => {
  // ブロック破壊
  world.beforeEvents.playerBreakBlock.subscribe((event) => {
    if (isInBaseArea2D(event.block.location, event.block.dimension)) {
      for (const dp of Object.values(getBaseDps())) {
        const southEast = offsetLocation(dp.northWest, dp.edgeSize);
        if (
          dp.northWest.x <= event.block.location.x &&
          event.block.location.x <= southEast.x &&
          dp.northWest.z <= event.block.location.z &&
          event.block.location.z <= southEast.z
        ) {
          // 範囲内
          if (
            dp.owner !== event.player.nameTag &&
            !dp.participants.includes(event.player.nameTag) &&
            !event.player.isOp() &&
            !event.player.hasTag(TAG_OPERATOR)
          ) {
            // 所有者ではなく、同居人でもなく、かつオペレーターではない
            event.cancel = true;

            break;
          }
        }
      }
    }
  });

  // ブロック設置
  world.beforeEvents.playerPlaceBlock.subscribe((event) => {
    if (isInBaseArea2D(event.block.location, event.block.dimension)) {
      for (const dp of Object.values(getBaseDps())) {
        const southEast = offsetLocation(dp.northWest, dp.edgeSize);
        if (
          dp.northWest.x <= event.block.location.x &&
          event.block.location.x <= southEast.x &&
          dp.northWest.z <= event.block.location.z &&
          event.block.location.z <= southEast.z
        ) {
          // 範囲内
          if (
            dp.owner !== event.player.nameTag &&
            !dp.participants.includes(event.player.nameTag) &&
            !event.player.isOp() &&
            !event.player.hasTag(TAG_OPERATOR)
          ) {
            // 所有者ではなく、同居人でもなく、かつオペレーターではない
            event.cancel = true;

            break;
          }
        }
      }
    }
  });
};
