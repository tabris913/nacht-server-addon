import { type Block, BlockVolume, type DimensionLocation, type Entity, world } from '@minecraft/server';

import { MinecraftDimensionTypes } from '../types/index';

import { Logger } from './logger';

import type { DimensionBlockVolume } from '../models/DimensionBlockVolume';

/**
 * ネザーの街エリアの BlockVolume を生成する
 *
 * @returns `BlockVolume`
 */
export const createNetherTownArea = () => {
  try {
    const nether = world.getDimension(MinecraftDimensionTypes.Nether);

    return new BlockVolume(
      { x: -800, y: nether.heightRange.min, z: -800 },
      { x: 800, y: nether.heightRange.max, z: 800 }
    );
  } catch (error) {
    Logger.error('Failed to create BlockVolume for town area in nether because of', error);

    throw error;
  }
};

/**
 * オーバーワールドの街エリアの BlockVolume を生成する
 *
 * @returns `BlockVolume`
 */
export const createOverworldTownArea = () => {
  try {
    const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

    return new BlockVolume(
      { x: -6400, y: overworld.heightRange.min, z: -6400 },
      { x: 6400, y: overworld.heightRange.max, z: 6400 }
    );
  } catch (error) {
    Logger.error('Failed to create BlockVolume for town area in overworld because of', error);

    throw error;
  }
};

/**
 * 与えられたエンティティまたはブロックが拠点エリアに居るかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInBaseArea = (object: Entity | Block) =>
  isInBaseArea({ dimension: object.dimension, ...object.location });

/**
 * 与えられたエンティティまたはブロックが街エリアに存在するかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInTownArea = (object: Entity | Block) =>
  isInTownArea({ dimension: object.dimension, ...object.location });

/**
 * 与えられたエンティティまたはブロックが探索エリアに居るかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInExploringArea = (object: Entity | Block) =>
  isInExploringArea({ dimension: object.dimension, ...object.location });

/**
 * 与えられた座標が拠点エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInBaseArea = (location: DimensionLocation) => !isInTownArea(location) && 0 < location.z;

/**
 * 与えられた座標が探索エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInExploringArea = (location: DimensionLocation) => !isInTownArea(location) && location.z < 0;

/**
 * 与えられた座標が街エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInTownArea = (location: DimensionLocation) => {
  switch (location.dimension.id) {
    case MinecraftDimensionTypes.Overworld:
      const overworld = createOverworldTownArea();
      return overworld.isInside(location);
    case MinecraftDimensionTypes.Nether:
      const nether = createNetherTownArea();
      return nether.isInside(location);
    default:
      return false;
  }
};

/**
 * 与えられた平面が拠点エリアの範囲外にはみ出してないか確認する
 *
 * @param volume
 */
export const isOutOfBaseArea = (volume: DimensionBlockVolume) => {
  const min = volume.getMin();
  const max = volume.getMax();
  let minXZ, maxXZ;
  switch (volume.dimension.id) {
    case MinecraftDimensionTypes.Overworld:
      minXZ = -6400;
      maxXZ = 6400;
      break;
    case MinecraftDimensionTypes.Nether:
      minXZ = -800;
      maxXZ = 800;
      break;
    default:
      return false;
  }

  // 西側
  if (max.x < minXZ && min.z < 0) return true;
  // 中央 (凵型部分)
  if (minXZ <= max.x && min.x <= maxXZ && min.z <= maxXZ) {
    return true;
  }
  // 東側
  if (maxXZ < min.x && min.z < 0) return true;

  return false;
};

const AreaUtils = {
  createNetherTownArea,
  createOverworldTownArea,
  existsInBaseArea,
  existsInTownArea,
  existsInExploringArea,
  isInBaseArea,
  isInExploringArea,
  isInTownArea,
  isOutOfBaseArea,
};

export default AreaUtils;
