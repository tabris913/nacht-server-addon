import { world } from "@minecraft/server";
import { PREFIX_BASE, PREFIX_LOCATION } from "../const";
import { DynamicPropertyNotFoundError } from "../errors/dp";
import type { BaseAreaInfo, LocationInfo } from "../models/location";

/**
 * Dynamic Property から指定した拠点を取得する
 *
 * @param idSuffix id 接尾辞
 * @returns
 * @throws This function can throw error.
 *
 * {@link DynamicPropertyNotFoundError}
 */
export const getBaseById = (idSuffix: string) => {
  try {
    const base = findBaseById(idSuffix);

    if (base === undefined) {
      throw new DynamicPropertyNotFoundError(PREFIX_BASE + idSuffix);
    }

    return base;
  } catch (error) {
    console.error(
      "Failed to get dynamic property by a given key because of",
      error
    );

    throw error;
  }
};

/**
 * Dynamic Property から指定した拠点を探す
 *
 * @param idSuffix id 接尾辞
 * @returns
 */
export const findBaseById = (idSuffix: string) => {
  try {
    const base = world.getDynamicProperty(PREFIX_BASE + idSuffix) as
      | string
      | undefined;

    return base ? (JSON.parse(base) as BaseAreaInfo) : undefined;
  } catch (error) {
    console.error("Failed to find base because of", error);

    throw error;
  }
};

/**
 * 拠点の Dynamic Property を検索する
 *
 * @param playerNameTag プレイヤー名
 * @returns
 */
export const retrieveBases = (playerNameTag?: string) => {
  try {
    const prefix = PREFIX_BASE + playerNameTag ? `${playerNameTag}_` : "";

    return world
      .getDynamicPropertyIds()
      .filter((dpId) => dpId.startsWith(prefix))
      .map((dpId) => world.getDynamicProperty(dpId) as string | undefined)
      .filter((dp) => dp !== undefined)
      .map((dp) => JSON.parse(dp) as BaseAreaInfo);
  } catch (error) {
    console.error(
      "Failed to get dynamic properties of base area because of",
      error
    );

    throw error;
  }
};

/**
 * 座標の Dynamic Propertyを検索する
 *
 * @returns
 */
export const retrieveLocations = (playerNameTag?: string) => {
  try {
    const prefix = PREFIX_LOCATION + playerNameTag ? `${playerNameTag}_` : "";

    return world
      .getDynamicPropertyIds()
      .filter((dpId) => dpId.startsWith(prefix))
      .map((dpId) => world.getDynamicProperty(dpId) as string | undefined)
      .filter((dp) => dp !== undefined)
      .map((dp) => JSON.parse(dp) as LocationInfo);
  } catch (error) {
    console.error("Failed to retrieve locations because of", error);

    throw error;
  }
};

const DynamicPropertyUtils = { getBaseById, retrieveBases, retrieveLocations };

export default DynamicPropertyUtils;
