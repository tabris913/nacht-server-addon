import { PlayerPermissionLevel, world } from '@minecraft/server';
import { TAG_OPERATOR } from '../const';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { Logger } from '../utils/logger';
export default () => {
    // 破壊不可能
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (DynamicPropertyUtils.retrieveUneditableAreas()
            .filter((area) => area.dimension === event.dimension.id)
            .map((area) => new DimensionBlockVolume(area.min, area.max, area.dimension))
            .some((bv) => bv.isInside(event.block.location))) {
            if (event.player.playerPermissionLevel === PlayerPermissionLevel.Operator || event.player.hasTag(TAG_OPERATOR)) {
                Logger.log("The block is in a non-editable area, but it's an operator, so it can be destroyed.");
                return;
            }
            event.player.sendMessage('編集不可領域のブロックです。');
            event.cancel = true;
        }
    });
    // 設置不可能
    world.beforeEvents.playerPlaceBlock.subscribe((event) => {
        if (DynamicPropertyUtils.retrieveUneditableAreas()
            .filter((area) => area.dimension === event.dimension.id)
            .map((area) => new DimensionBlockVolume(area.min, area.max, area.dimension))
            .some((bv) => bv.isInside(event.block.location))) {
            if (event.player.playerPermissionLevel === PlayerPermissionLevel.Operator || event.player.hasTag(TAG_OPERATOR)) {
                Logger.log("The block is in a non-editable area, but it's an operator, so it can be destroyed.");
                return;
            }
            event.player.sendMessage('編集不可領域のブロックです。');
            event.cancel = true;
        }
    });
    // 爆発により破壊不可能
    world.beforeEvents.explosion.subscribe((event) => {
        const uneditableAreas = DynamicPropertyUtils.retrieveUneditableAreas()
            .filter((area) => area.dimension === event.dimension.id)
            .map((area) => new DimensionBlockVolume(area.min, area.max, area.dimension));
        const breakable = event
            .getImpactedBlocks()
            .filter((impactedBlock) => !uneditableAreas.some((bv) => bv.isInside(impactedBlock.location)));
        event.setImpactedBlocks(breakable);
    });
};
