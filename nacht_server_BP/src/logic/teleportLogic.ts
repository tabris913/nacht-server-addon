import { type Entity, world } from '@minecraft/server';

import { RuleName } from '../commands/gamerule';
import { PREFIX_GAMERULE, PREFIX_LOCATION, TAG_OPERATOR } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { LocationInfo } from '../models/location';
import { MinecraftDimensionTypes } from '../types/index';
import StringUtils from '../utils/StringUtils';

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

export default { registerTeleportTarget };
