import {
  BlockVolume,
  BlockVolumeIntersection,
  Dimension,
  world,
  type Vector3,
} from "@minecraft/server";
import { MinecraftDimensionTypes } from "../types/index";

/**
 * ディメンション情報を付与した BlockVolume
 */
export class DimensionBlockVolume extends BlockVolume {
  dimension: Dimension;

  constructor(
    from: Vector3,
    to: Vector3,
    dimension: Dimension | MinecraftDimensionTypes
  ) {
    super(from, to);
    this.dimension =
      dimension instanceof Dimension
        ? dimension
        : world.getDimension(dimension);
  }

  static fromVolume = (
    blockVolume: BlockVolume,
    dimension: Dimension | MinecraftDimensionTypes
  ) => new DimensionBlockVolume(blockVolume.from, blockVolume.to, dimension);

  isOverlapped = (other: DimensionBlockVolume) =>
    this.intersects(other) !== BlockVolumeIntersection.Disjoint &&
    this.dimension === other.dimension;
}
