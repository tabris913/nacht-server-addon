import { Dimension, type VectorXZ } from '@minecraft/server';

import { DimensionBlockVolume } from './DimensionBlockVolume';

import type { MinecraftDimensionTypes } from '../types/index';

export class FlatDimensionBlockVolume extends DimensionBlockVolume {
  constructor(from: VectorXZ, to: VectorXZ, dimension: Dimension | MinecraftDimensionTypes) {
    super({ ...from, y: 0 }, { ...to, y: 0 }, dimension);
  }
}
