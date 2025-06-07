import type { VectorXZ, Vector3 } from "@minecraft/server";

export type AreaVertices<T extends VectorXZ | Vector3 = VectorXZ> = {
  northWest: T;
  southEast: T;
};

export type BaseAreaInfo = {
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

export type LocationInfo = {
  displayName: string;
  dimension: string;
  id: string; // location_{owner}_{name}
  location: Vector3;
  name: string;
  owner: string;
};
