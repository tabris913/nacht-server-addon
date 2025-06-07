import {
  Dimension,
  type DimensionLocation,
  world,
  type VectorXZ,
  BlockVolume,
} from "@minecraft/server";
import type { MinecraftDimensionTypes } from "../types/index";
import { DimensionBlockVolume } from "./DimensionBlockVolume";
import { FlatDimensionBlockVolume } from "./FlatDimensionBlockVolume";

export class BaseAreaDimensionBlockVolume extends DimensionBlockVolume {
  constructor(
    from: VectorXZ,
    to: VectorXZ,
    dimension: Dimension | MinecraftDimensionTypes
  ) {
    const dim =
      dimension instanceof Dimension
        ? dimension
        : world.getDimension(dimension);
    super(
      { ...from, y: dim.heightRange.min },
      { ...to, y: dim.heightRange.max },
      dimension
    );
  }

  static from = (
    blockVolume: BlockVolume,
    dimension: Dimension | MinecraftDimensionTypes
  ) =>
    new BaseAreaDimensionBlockVolume(
      blockVolume.from,
      blockVolume.to,
      dimension
    );
  static fromDimensioned = (dbv: DimensionBlockVolume) =>
    new BaseAreaDimensionBlockVolume(dbv.from, dbv.to, dbv.dimension);

  toFlat = () =>
    new FlatDimensionBlockVolume(this.from, this.to, this.dimension);
}
