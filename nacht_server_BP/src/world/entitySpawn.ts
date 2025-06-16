import { EntityInitializationCause, world } from '@minecraft/server';
import { enemies } from '../const';
import AreaUtils from '../utils/AreaUtils';
import { Logger } from '../utils/logger';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';

export default () =>
  world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.cause !== EntityInitializationCause.Spawned) return;
    if (!enemies.includes(event.entity.typeId)) return;

    if (AreaUtils.existsInTownArea(event.entity)) {
      Logger.debug(`${event.entity.nameTag} (${event.entity.typeId}) removed because it spawned in town area.`);
      event.entity.remove();

      return;
    }
    const here = DynamicPropertyUtils.retrieveSafeAreas().find((dp) => {
      const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);

      return (
        blockVolume.isInside(event.entity.location) ||
        blockVolume.isInside({ ...event.entity.location, y: event.entity.location.y - 1 })
      );
    });
    if (here) {
      Logger.debug(`${event.entity.nameTag} (${event.entity.typeId}) removed because it spawned in safe area.`);
      event.entity.remove();

      return;
    }
  });
