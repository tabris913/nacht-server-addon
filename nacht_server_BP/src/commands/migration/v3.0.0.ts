import { world, type Vector3 } from '@minecraft/server';

import { Formatting, PREFIX_LOCATION } from '../../const';
import { MinecraftDimensionTypes } from '../../types/index';
import { Logger } from '../../utils/logger';
import PlayerUtils from '../../utils/PlayerUtils';

import type { LocationInfo } from '../../models/location';

type LocationInfoV2_0_0 = { displayName: string; dimension: string; location: Vector3 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLocationInfoV2_0_0 = (parsed: any): parsed is LocationInfoV2_0_0 =>
  (['displayName', 'dimension', 'location'] satisfies Array<keyof LocationInfoV2_0_0>).every((key) => key in parsed);

export const migrateFromV2_0_0 = () => {
  let count = 0;
  const teleportLocations = world
    .getDynamicPropertyIds()
    .filter((dpid) => dpid.startsWith('LOC_'))
    .map((dpid) => [dpid, world.getDynamicProperty(dpid)] as [string, string | undefined])
    .filter(([_dpid, dp]) => dp !== undefined)
    .map(([dpid, dp]) => [dpid, JSON.parse(dp!)])
    .filter((arg): arg is [string, LocationInfoV2_0_0] => {
      if (isLocationInfoV2_0_0(arg[1])) {
        return true;
      }

      Logger.warning(`${arg[0]} is not a location type at the time of v0.2.0.`);
      PlayerUtils.sendMessageToOps(`${Formatting.Color.GOLD}型不正です。`);
      return false;
    })
    .reduce(
      (prev, [curDpid, curDp]) => {
        count++;
        const [nameTag] = curDpid.replace('LOC_', '').split('_', 1);

        return { ...prev, [nameTag]: { ...(prev[nameTag] || {}), [curDpid]: curDp } };
      },
      {} as Record<string, Record<string, LocationInfoV2_0_0>>
    );
  PlayerUtils.sendMessageToOps(`改名が必要なDynamic Propertyが${count}件見つかりました。`);

  let resCount = 0;
  Object.entries(teleportLocations).forEach(([nameTag, locations]) =>
    Object.entries(locations).forEach(([dpid, dp], index) => {
      try {
        // 古いプロパティを削除
        world.setDynamicProperty(dpid, undefined);
        const newId = `${PREFIX_LOCATION}${nameTag}_${index}`;
        const [_nameTag, name] = dpid.replace('LOC_', '').split('_', 2);
        // 新しくプロパティを登録
        world.setDynamicProperty(
          newId,
          JSON.stringify({
            ...dp,
            id: newId,
            owner: nameTag,
            name,
            dimension: MinecraftDimensionTypes.Overworld,
          } satisfies LocationInfo)
        );
        PlayerUtils.sendMessageToOps(`[migration from 0.2.0; #${resCount++}] ${dpid}を${newId}に改名しました。`);
      } catch (error) {
        Logger.error('Failed to migrate from v0.2.0 because of', error);
        PlayerUtils.sendMessageToOps(`[migration from 0.2.0; #${resCount++}] マイグレーションに失敗しました。`);

        throw error;
      }
    })
  );
};
