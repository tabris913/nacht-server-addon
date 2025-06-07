import { Dimension, type VectorXZ } from "@minecraft/server";
import type { MinecraftDimensionTypes } from "../types/index";
import { DimensionBlockVolume } from "./DimensionBlockVolume";

export class FlatDimensionBlockVolume extends DimensionBlockVolume {
  constructor(
    from: VectorXZ,
    to: VectorXZ,
    dimension: Dimension | MinecraftDimensionTypes
  ) {
    super({ ...from, y: 0 }, { ...to, y: 0 }, dimension);
  }
}
