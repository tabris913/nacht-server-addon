import { world } from "@minecraft/server";
import { PREFIX_BASE, PREFIX_LOCATION } from "../const";
import type { BaseAreaInfo } from "./area";

export const getBaseDp = (key: string) => {
  const dp = world.getDynamicProperty(PREFIX_BASE + key) as string | undefined;

  if (dp) {
    return JSON.parse(dp) as BaseAreaInfo;
  }
};

/**
 * 拠点エリアのグローバル変数を取得する
 *
 * @params playerName
 * @returns
 */
export const getBaseDps = (playerName?: string): Record<string, BaseAreaInfo> =>
  world
    .getDynamicPropertyIds()
    .filter((dpId) =>
      dpId.startsWith(PREFIX_BASE + playerName ? `${playerName}_` : "")
    )
    .reduce((prev, dpId) => {
      try {
        const dp = world.getDynamicProperty(dpId) as string | undefined;

        return dp ? { ...prev, [dpId]: JSON.parse(dp) } : prev;
      } catch (error) {
        console.error(`${dpId} の取得・変換に失敗しました`);
        console.error(error);

        return prev;
      }
    }, {});

/**
 * 座標関連のグローバル変数を取得する
 *
 * @returns
 */
export const getLocationDps = (playerNameTag: string) =>
  world
    .getDynamicPropertyIds()
    .filter((dpId) => dpId.startsWith(`${PREFIX_LOCATION}${playerNameTag}_`));
