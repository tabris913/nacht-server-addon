import { type DimensionLocation, world } from '@minecraft/server';

import { PREFIX_BASE } from '../const';
import { DynamicPropertyNotFoundError } from '../errors/dp';
import { BaseAreaDimensionBlockVolume } from '../models/BaseAreaDimensionBlockVolume';

import LocationUtils from './LocationUtils';
import { Logger } from './logger';
import { isFixedBase } from './TypeGuards';

import type { BaseAreaInfo } from '../models/location';

/**
 * Dynamic Property から指定した拠点を取得する
 *
 * @param idSuffix id 接尾辞
 * @returns
 * @throws This function can throw error.
 *
 * {@link DynamicPropertyNotFoundError}
 */
export const getById = (idSuffix: string) => {
  try {
    const base = findById(idSuffix);

    if (base === undefined) {
      throw new DynamicPropertyNotFoundError(PREFIX_BASE + idSuffix);
    }

    return base;
  } catch (error) {
    Logger.error('Failed to get dynamic property by a given key because of', error);

    throw error;
  }
};

/**
 * Dynamic Property から指定したエンティティと紐づいた拠点を探す
 * @param entityId
 * @returns
 */
export const findByEntityId = (entityId: string) => {
  try {
    return world
      .getDynamicPropertyIds()
      .filter((dpid) => dpid.startsWith(PREFIX_BASE))
      .map((dpid) => world.getDynamicProperty(dpid) as string | undefined)
      .filter((dp) => dp !== undefined)
      .filter((dp) => dp.includes(entityId))
      .map((dp) => JSON.parse(dp) as BaseAreaInfo)
      .filter((dp) => dp.entityId === entityId)
      .at(0);
  } catch (error) {
    Logger.error('Failed to find base because of', error);

    throw error;
  }
};

/**
 * Dynamic Property から指定した拠点を探す
 *
 * @param idSuffix id 接尾辞
 * @returns
 */
export const findById = (idSuffix: string) => {
  try {
    const base = world.getDynamicProperty(PREFIX_BASE + idSuffix) as string | undefined;

    return base ? (JSON.parse(base) as BaseAreaInfo) : undefined;
  } catch (error) {
    Logger.error('Failed to find base because of', error);

    throw error;
  }
};

/**
 * Dynamic Property から指定した拠点を探す
 *
 * @param location 座標
 * @param playerNameTag
 * @returns
 */
export const findByLocation = (location: DimensionLocation, playerNameTag?: string) => {
  try {
    return world
      .getDynamicPropertyIds()
      .filter((dpid) => dpid.startsWith(`${PREFIX_BASE}${playerNameTag ? `${playerNameTag}_` : ''}`))
      .map((dpid) => world.getDynamicProperty(dpid) as string | undefined)
      .filter((dp) => dp !== undefined)
      .map((dp) => JSON.parse(dp) as BaseAreaInfo)
      .filter(isFixedBase)
      .filter((dp) => {
        const blockVolume = new BaseAreaDimensionBlockVolume(
          dp.northWest,
          LocationUtils.offsetLocation(dp.northWest, dp.edgeSize),
          location.dimension
        );

        return blockVolume.isInside(location);
      })
      .at(0);
  } catch (error) {
    Logger.error('Failed to find base because of', error);

    throw error;
  }
};

/**
 * 与えられた平面が既に確定された拠点と重複しているか確認する
 *
 * @param baseArea
 * @returns
 */
export const hasOverlappingBlocks = (baseArea: BaseAreaDimensionBlockVolume) =>
  BaseUtils.retrieveBases()
    .filter(isFixedBase)
    .some((baseDp) => {
      const base = new BaseAreaDimensionBlockVolume(
        baseDp.northWest,
        LocationUtils.offsetLocation(baseDp.northWest, baseDp.edgeSize - 1),
        baseDp.dimension
      );

      return LocationUtils.isOverlapped(baseArea, base);
    });

/**
 * 拠点の Dynamic Property を検索する
 *
 * @param playerNameTag プレイヤー名
 * @returns
 */
export const retrieveBases = (playerNameTag?: string) => {
  try {
    const prefix = PREFIX_BASE + (playerNameTag ? `${playerNameTag}_` : '');

    return world
      .getDynamicPropertyIds()
      .filter((dpId) => dpId.startsWith(prefix))
      .map((dpId) => world.getDynamicProperty(dpId) as string | undefined)
      .filter((dp) => dp !== undefined)
      .map((dp) => JSON.parse(dp) as BaseAreaInfo);
  } catch (error) {
    Logger.error('Failed to get dynamic properties of base area because of', error);

    throw error;
  }
};

const BaseUtils = {
  findByEntityId,
  findById,
  findByLocation,
  getById,
  hasOverlappingBlocks,
  retrieveBases,
};

export default BaseUtils;
