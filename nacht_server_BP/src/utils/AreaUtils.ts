import type { Block, Dimension, Entity, VectorXZ } from "@minecraft/server";

/**
 * 与えられたエンティティまたはブロックが拠点エリアに居るかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInBaseArea = (object: Entity | Block) =>
  isInBaseArea(object.location, object.dimension);

/**
 * 与えられたエンティティまたはブロックが街エリアに存在するかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInTownArea = (object: Entity | Block) =>
  isInTownArea(object.location, object.dimension);

/**
 * 与えられたエンティティまたはブロックが探索エリアに居るかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInExploringArea = (object: Entity | Block) =>
  isInExploringArea(object.location, object.dimension);

/**
 * 与えられた座標が拠点エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInBaseArea = (location: VectorXZ, dimension: Dimension) =>
  !isInTownArea(location, dimension) && 0 < location.z;

/**
 * 与えられた座標が探索エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInExploringArea = (location: VectorXZ, dimension: Dimension) =>
  !isInTownArea(location, dimension) && location.z < 0;

/**
 * 与えられた座標が街エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInTownArea = (location: VectorXZ, dimension: Dimension) => {
  const nw: VectorXZ = { x: -6400, z: -6400 };
  const se: VectorXZ = { x: 6400, z: 6400 };

  switch (dimension.id) {
    case "overworld":
      if (se.x < location.x) return false;
      if (location.x < nw.x) return false;
      if (se.z < location.z) return false;
      if (location.z < nw.z) return false;

      return true;
    case "nether":
      if (se.x < location.x / 8) return false;
      if (location.x / 8 < nw.x) return false;
      if (se.z < location.z / 8) return false;
      if (location.z / 8 < nw.z) return false;

      return true;
    default:
      return false;
  }
};

const AreaUtils = {
  existsInBaseArea,
  existsInTownArea,
  existsInExploringArea,
  isInBaseArea,
  isInExploringArea,
  isInTownArea,
};

export default AreaUtils;
