import { Rotate } from '../commands/enum';
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

export class Location implements Vector3 {
  x;
  y;
  z;

  constructor(location: Vector3) {
    this.x = location.x;
    this.y = location.y;
    this.z = location.z;
  }

  diff = (origin: Vector3) => new Location({ x: this.x - origin.x, y: this.y - origin.y, z: this.z - origin.z });

  max = (other: Vector3) => {
    this.x = Math.max(this.x, other.x);
    this.y = Math.max(this.y, other.y);
    this.z = Math.max(this.z, other.z);

    return this;
  };

  min = (other: Vector3) => {
    this.x = Math.min(this.x, other.x);
    this.y = Math.min(this.y, other.y);
    this.z = Math.min(this.z, other.z);

    return this;
  };

  offset = (offsetSpan: number | Vector3) => {
    if (typeof offsetSpan === 'number') {
      this.x += offsetSpan;
      this.y += offsetSpan;
      this.z += offsetSpan;
    } else {
      this.x += offsetSpan.x;
      this.y += offsetSpan.y;
      this.z += offsetSpan.z;
    }

    return this;
  };

  offsetNega = (offsetSpan: number | Vector3) => {
    if (typeof offsetSpan === 'number') {
      this.x -= offsetSpan;
      this.y -= offsetSpan;
      this.z -= offsetSpan;
    } else {
      this.x -= offsetSpan.x;
      this.y -= offsetSpan.y;
      this.z -= offsetSpan.z;
    }

    return this;
  };

  rotate = (deg: Rotate) => {
    switch (deg) {
      case Rotate._90:
        const _x = this.x;
        this.x = this.z;
        this.z = -_x;
        break;
      case Rotate._180:
        this.x *= -1;
        this.z *= -1;
        break;
      case Rotate._270:
        const _z = this.z;
        this.z = this.x;
        this.x = -_z;
        break;
    }

    return this;
  };
}
