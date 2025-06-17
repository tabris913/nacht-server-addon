import { EntityInitializationCause, world } from '@minecraft/server';
import { Enemies, UnnecessaryEntities } from '../const';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import AreaUtils from '../utils/AreaUtils';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
export default () => world.afterEvents.entitySpawn.subscribe((event) => {
    if (event.cause !== EntityInitializationCause.Spawned)
        return;
    const unsafeArea = DynamicPropertyUtils.retrieveUnsafeAreas().find((dp) => {
        const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);
        return (blockVolume.dimension.id === event.entity.dimension.id &&
            (blockVolume.isInside(event.entity.location) ||
                blockVolume.isInside(Object.assign(Object.assign({}, event.entity.location), { y: event.entity.location.y - 1 }))));
    });
    // 非安全地帯なら全スルー
    if (unsafeArea) {
        // Logger.debug('Spawned in unsafe area.');
        return;
    }
    let existsInTownArea;
    try {
        existsInTownArea = AreaUtils.existsInTownArea(event.entity);
    }
    catch (error) {
        // Logger.debug('Failed because of', error);
        return;
    }
    if (existsInTownArea) {
        // 街エリアは敵だけではなくペットとして購入できないその他のモブも消す
        // Logger.debug('Spawned in town area.');
        if (Enemies.includes(event.entity.typeId) || UnnecessaryEntities.includes(event.entity.typeId)) {
            // Logger.debug('Removed from town area.');
            event.entity.remove();
        }
        return;
    }
    const safeArea = DynamicPropertyUtils.retrieveSafeAreas().find((dp) => {
        const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);
        return (blockVolume.dimension.id === event.entity.dimension.id &&
            (blockVolume.isInside(event.entity.location) ||
                blockVolume.isInside(Object.assign(Object.assign({}, event.entity.location), { y: event.entity.location.y - 1 }))));
    });
    if (safeArea) {
        // 安全地帯は敵だけ消す
        // Logger.debug('Spawned in safe area.');
        if (Enemies.includes(event.entity.typeId)) {
            // Logger.debug('Removed from save area.');
            event.entity.remove();
        }
    }
});
