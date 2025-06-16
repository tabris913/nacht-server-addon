import { EntityInitializationCause, world } from '@minecraft/server';
import { enemies } from '../const';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import AreaUtils from '../utils/AreaUtils';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
export default () => world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.cause !== EntityInitializationCause.Spawned)
        return;
    if (!enemies.includes(event.entity.typeId))
        return;
    if (AreaUtils.existsInTownArea(event.entity)) {
        event.entity.remove();
        return;
    }
    const here = DynamicPropertyUtils.retrieveSafeAreas().find((dp) => {
        const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);
        return (blockVolume.isInside(event.entity.location) ||
            blockVolume.isInside(Object.assign(Object.assign({}, event.entity.location), { y: event.entity.location.y - 1 })));
    });
    if (here) {
        event.entity.remove();
        return;
    }
});
