import { world } from "@minecraft/server";
import { PREFIX_BASE } from "../const";
export const getBaseDp = (key) => {
    const dp = world.getDynamicProperty(PREFIX_BASE + key);
    if (dp) {
        return JSON.parse(dp);
    }
};
/**
 * 拠点エリアのグローバル変数を取得する
 *
 * @params playerName
 * @returns
 */
export const getBaseDps = (playerName) => world
    .getDynamicPropertyIds()
    .filter((dpId) => dpId.startsWith(PREFIX_BASE + playerName ? `${playerName}_` : ""))
    .reduce((prev, dpId) => {
    try {
        const dp = world.getDynamicProperty(dpId);
        return dp ? Object.assign(Object.assign({}, prev), { [dpId]: JSON.parse(dp) }) : prev;
    }
    catch (error) {
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
export const getLocationDps = (playerNameTag) => world
    .getDynamicPropertyIds()
    .filter((dpId) => dpId.startsWith(`LOC_${playerNameTag}_`));
