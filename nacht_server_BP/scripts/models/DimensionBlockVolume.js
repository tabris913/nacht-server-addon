import { BlockVolume, BlockVolumeIntersection, Dimension, world, } from "@minecraft/server";
/**
 * ディメンション情報を付与した BlockVolume
 */
export class DimensionBlockVolume extends BlockVolume {
    constructor(from, to, dimension) {
        super(from, to);
        this.isOverlapped = (other) => this.intersects(other) !== BlockVolumeIntersection.Disjoint &&
            this.dimension === other.dimension;
        this.dimension =
            dimension instanceof Dimension
                ? dimension
                : world.getDimension(dimension);
    }
}
DimensionBlockVolume.fromVolume = (blockVolume, dimension) => new DimensionBlockVolume(blockVolume.from, blockVolume.to, dimension);
