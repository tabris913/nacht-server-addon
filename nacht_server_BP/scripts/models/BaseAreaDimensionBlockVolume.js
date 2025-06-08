import { Dimension, world } from '@minecraft/server';
import LocationUtils from '../utils/LocationUtils';
import { DimensionBlockVolume } from './DimensionBlockVolume';
import { FlatDimensionBlockVolume } from './FlatDimensionBlockVolume';
export class BaseAreaDimensionBlockVolume extends DimensionBlockVolume {
    constructor(from, to, dimension) {
        const dim = dimension instanceof Dimension ? dimension : world.getDimension(dimension);
        super(Object.assign(Object.assign({}, from), { y: dim.heightRange.min }), Object.assign(Object.assign({}, to), { y: dim.heightRange.max }), dimension);
        this.toFlat = () => new FlatDimensionBlockVolume(this.from, this.to, this.dimension);
    }
}
BaseAreaDimensionBlockVolume.from = (blockVolume, dimension) => new BaseAreaDimensionBlockVolume(blockVolume.from, blockVolume.to, dimension);
BaseAreaDimensionBlockVolume.fromDimensioned = (dbv) => new BaseAreaDimensionBlockVolume(dbv.from, dbv.to, dbv.dimension);
BaseAreaDimensionBlockVolume.fromFixedDynamicProperty = (dp) => new BaseAreaDimensionBlockVolume(dp.northWest, LocationUtils.offsetLocation(dp.northWest, dp.edgeSize), dp.dimension);
