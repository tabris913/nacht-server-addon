import { BlockVolume, Dimension, type VectorXZ, world } from '@minecraft/server';

import LocationUtils from '../utils/LocationUtils';

import { DimensionBlockVolume } from './DimensionBlockVolume';
import { FlatDimensionBlockVolume } from './FlatDimensionBlockVolume';

import type { FixedBaseAreaInfo } from './location';
import type { MinecraftDimensionTypes } from '../types/index';

export class BaseAreaDimensionBlockVolume extends DimensionBlockVolume {
  constructor(from: VectorXZ, to: VectorXZ, dimension: Dimension | MinecraftDimensionTypes) {
    const dim = dimension instanceof Dimension ? dimension : world.getDimension(dimension);
    super({ ...from, y: dim.heightRange.min }, { ...to, y: dim.heightRange.max }, dimension);
  }

  static from = (blockVolume: BlockVolume, dimension: Dimension | MinecraftDimensionTypes) =>
    new BaseAreaDimensionBlockVolume(blockVolume.from, blockVolume.to, dimension);
  static fromDimensioned = (dbv: DimensionBlockVolume) =>
    new BaseAreaDimensionBlockVolume(dbv.from, dbv.to, dbv.dimension);
  static fromFixedDynamicProperty = (dp: FixedBaseAreaInfo) =>
    new BaseAreaDimensionBlockVolume(
      dp.northWest,
      LocationUtils.offsetLocation(dp.northWest, dp.edgeSize),
      dp.dimension
    );

  toFlat = () => new FlatDimensionBlockVolume(this.from, this.to, this.dimension);
}
