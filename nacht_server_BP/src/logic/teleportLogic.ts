import { type DimensionLocation, type Entity, type Player, type Vector3, world } from '@minecraft/server';

import { RuleName } from '../commands/enum';
import { PREFIX_GAMERULE, PREFIX_LOCATION, TAG_AREA_BASE, TAG_AREA_EXPL, TAG_AREA_TOWN, TAG_OPERATOR } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { MinecraftDimensionTypes } from '../types/index';
import AreaUtils from '../utils/AreaUtils';
import { Logger } from '../utils/logger';
import StringUtils from '../utils/StringUtils';

import type { LocationInfo } from '../models/location';

/**
 * 登録する
 *
 * @param entity 操作者
 * @param name 地点名
 * @param displayName 地点表示名
 * @throws This function can throw errors
 *
 * {@link NachtServerAddonError}
 */
const registerTeleportTarget = (entity: Entity, name: string, displayName: string) => {
  const prefix = `${PREFIX_LOCATION}${entity.nameTag}_`;
  const locationName = `${prefix}${name}`;
  const dpIds = world.getDynamicPropertyIds();
  if (dpIds.includes(locationName)) {
    throw new NachtServerAddonError('その名前は既に使用されています。');
  }
  const num = world.getDynamicProperty(`${PREFIX_GAMERULE}${RuleName.teleportTargets}`);
  if (!entity.hasTag(TAG_OPERATOR) && dpIds.filter((dpId) => dpId.startsWith(prefix)).length === num) {
    throw new NachtServerAddonError(`すでにテレポート先が${num}件登録されています`);
  }

  world.setDynamicProperty(
    locationName,
    JSON.stringify({
      displayName: StringUtils.format(displayName),
      dimension: entity.dimension.id as MinecraftDimensionTypes,
      id: locationName,
      location: entity.location,
      name,
      owner: entity.nameTag,
    } satisfies LocationInfo)
  );
};

/**
 * 転移する。エリアタグの編集も行う。
 *
 * @param entity
 * @param location
 * @param dimensionId
 */
const teleport = (entity: Player, location: Vector3, dimensionId: MinecraftDimensionTypes) => {
  try {
    const dimension = world.getDimension(dimensionId);
    const target: DimensionLocation = { ...location, dimension };
    let newTag, oldTag;
    if (AreaUtils.isInBaseArea(target)) {
      newTag = TAG_AREA_BASE;
    } else if (AreaUtils.isInExploringArea(target)) {
      newTag = TAG_AREA_EXPL;
    } else {
      newTag = TAG_AREA_TOWN;
    }
    if (AreaUtils.existsInBaseArea(entity)) {
      oldTag = TAG_AREA_BASE;
    } else if (AreaUtils.existsInExploringArea(entity)) {
      oldTag = TAG_AREA_EXPL;
    } else {
      oldTag = TAG_AREA_TOWN;
    }
    if (newTag !== oldTag) {
      entity.addTag(newTag);
      entity.removeTag(oldTag);
    }
    entity.tryTeleport(location, { dimension });
  } catch (error) {
    Logger.error(
      `Failed to teleport ${entity.nameTag} to (${location.x} ${location.y} ${location.z}) because of`,
      error
    );

    throw error;
  }
};

export default { registerTeleportTarget, teleport };
