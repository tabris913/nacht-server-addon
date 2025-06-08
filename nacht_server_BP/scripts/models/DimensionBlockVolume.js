import { BlockVolume, BlockVolumeIntersection, Dimension, world } from '@minecraft/server';
/**
 * ディメンション情報を付与した BlockVolume
 */
export class DimensionBlockVolume extends BlockVolume {
    constructor(from, to, dimension) {
        super(from, to);
        this.isOverlapped = (other) => this.intersects(other) !== BlockVolumeIntersection.Disjoint && this.dimension === other.dimension;
        this.toString = () => {
            const min = this.getMin();
            const max = this.getMax();
            return `DimensionBlockVolume[(${min.x},${min.y},${min.z}),(${max.x},${max.y},${max.z}),${this.dimension.id}]`;
        };
        this.dimension = dimension instanceof Dimension ? dimension : world.getDimension(dimension);
    }
}
DimensionBlockVolume.fromVolume = (blockVolume, dimension) => new DimensionBlockVolume(blockVolume.from, blockVolume.to, dimension);
