import { world } from '@minecraft/server';
import { TAG_OPERATOR } from '../const';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { Logger } from '../utils/logger';
export default () => {
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
        if (DynamicPropertyUtils.retrieveUneditableAreas()
            .filter((area) => area.dimension === event.dimension.id)
            .map((area) => new DimensionBlockVolume(area.min, area.max, area.dimension))
            .some((bv) => bv.isInside(event.block.location))) {
            if (event.player.isOp() || event.player.hasTag(TAG_OPERATOR)) {
                Logger.log("The block is in a non-editable area, but it's an operator, so it can be destroyed.");
                return;
            }
            event.player.sendMessage('編集不可領域のブロックです。');
            event.cancel = true;
        }
    });
    world.beforeEvents.playerPlaceBlock.subscribe((event) => {
        if (DynamicPropertyUtils.retrieveUneditableAreas()
            .filter((area) => area.dimension === event.dimension.id)
            .map((area) => new DimensionBlockVolume(area.min, area.max, area.dimension))
            .some((bv) => bv.isInside(event.block.location))) {
            if (event.player.isOp() || event.player.hasTag(TAG_OPERATOR)) {
                Logger.log("The block is in a non-editable area, but it's an operator, so it can be destroyed.");
                return;
            }
            event.player.sendMessage('編集不可領域のブロックです。');
            event.cancel = true;
        }
    });
};
