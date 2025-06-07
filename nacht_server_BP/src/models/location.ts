import type { Vector3, VectorXZ } from "@minecraft/server";
import { MinecraftDimensionTypes } from "../types/index";
// import { MinecraftDimensionTypes } from "../types/index";

export type AreaVertices<T extends VectorXZ | Vector3 = VectorXZ> = {
  northWest: T;
  southEast: T;
};

export type BaseAreaInfo = {
  dimension?: MinecraftDimensionTypes;
  edgeSize: number;
  entityId?: string;
  id: string; // base_{owner}_{index}
  index: number;
  name?: string;
  northWest: VectorXZ;
  owner: string;
  participants: Array<string>;
  showBorder: boolean;
};

export type FixedBaseAreaInfo = {
  dimension: MinecraftDimensionTypes;
  edgeSize: number;
  entityId?: string;
  id: string; // base_{owner}_{index}
  index: number;
  name: string;
  northWest: VectorXZ;
  owner: string;
  participants: Array<string>;
  showBorder: boolean;
};

export type LocationInfo = {
  displayName: string;
  dimension: MinecraftDimensionTypes;
  id: string; // location_{owner}_{name}
  location: Vector3;
  name: string;
  owner: string;
};
