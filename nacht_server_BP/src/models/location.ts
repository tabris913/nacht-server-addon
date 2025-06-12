import { MinecraftDimensionTypes } from '../types/index';

import type { Vector3, VectorXZ } from '@minecraft/server';

// import { MinecraftDimensionTypes } from "../types/index";

export type AreaVertices<T extends VectorXZ | Vector3 = VectorXZ> = {
  northWest: T;
  southEast: T;
};

export type BaseAreaInfo = {
  dimension?: MinecraftDimensionTypes;
  edgeSize: number;
  entityId?: string;
  fixed: boolean;
  id: string; // base_{owner}_{index}
  index: number;
  name?: string;
  northWest?: VectorXZ;
  owner: string;
  participants: Array<string>;
  showBorder: boolean;
};

export type FixedBaseAreaInfo = BaseAreaInfo & {
  dimension: MinecraftDimensionTypes;
  fixed: true;
  name: string;
  northWest: VectorXZ;
};

export type LocationInfo = {
  displayName: string;
  dimension: MinecraftDimensionTypes;
  id: string; // location_{owner}_{name}
  location: Vector3;
  name: string;
  owner: string;
};

export type UneditableAreas = {
  dimension: MinecraftDimensionTypes;
  id: string; // fixedarea_{index}
  index: number;
  max: Vector3;
  min: Vector3;
};
