import { system, world } from '@minecraft/server';

import { PREFIX_TELEPORTRUNID, TAG_AREA_BASE, TAG_AREA_EXPL, TAG_AREA_TOWN } from '../const';
import { MinecraftDimensionTypes, MinecraftEntityTypes } from '../types/index';
import AreaUtils from '../utils/AreaUtils';
import PlayerUtils from '../utils/PlayerUtils';

export default () =>
  world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId !== MinecraftEntityTypes.Player) {
      // Logger.debug(`Non-player (${event.deadEntity.typeId}) died.`);

      return;
    }
    // Logger.debug(`Player (${event.deadEntity.nameTag}) died.`);

    const dpid = PREFIX_TELEPORTRUNID + event.deadEntity.nameTag;
    const runId = world.getDynamicProperty(dpid) as number | undefined;
    if (runId !== undefined) system.clearRun(runId);
    world.setDynamicProperty(dpid, undefined);

    const player = PlayerUtils.convertToPlayer(event.deadEntity);
    if (player === undefined) {
      // Logger.debug('Dead entity is not a player.');

      return;
    }
    // Logger.debug(
    //   `Dead at ${event.deadEntity.location.x} ${event.deadEntity.location.y} ${event.deadEntity.location.z}`
    // );

    const spawnPoint = player.getSpawnPoint() || {
      ...world.getDefaultSpawnLocation(),
      dimension: world.getDimension(MinecraftDimensionTypes.Overworld),
    };

    let newTag, oldTag;
    if (AreaUtils.isInBaseArea(spawnPoint)) {
      newTag = TAG_AREA_BASE;
    } else if (AreaUtils.isInExploringArea(spawnPoint)) {
      newTag = TAG_AREA_EXPL;
    } else {
      newTag = TAG_AREA_TOWN;
    }
    if (AreaUtils.existsInBaseArea(event.deadEntity)) {
      oldTag = TAG_AREA_BASE;
    } else if (AreaUtils.existsInExploringArea(event.deadEntity)) {
      oldTag = TAG_AREA_EXPL;
    } else {
      oldTag = TAG_AREA_TOWN;
    }
    if (newTag !== oldTag) {
      player.addTag(newTag);
      player.removeTag(oldTag);
    }
  });
