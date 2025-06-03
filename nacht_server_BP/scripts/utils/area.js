import { makeArray } from "./misc";
/**
 * エリア内のすべてのブロックを取得する
 *
 * @param area
 * @param dimension
 * @returns
 */
export const gatherBlocksWithin = (area, dimension) => {
    const yArray = makeArray(area.northWest.y, area.southEast.y);
    const zArray = makeArray(area.northWest.z, area.southEast.z);
    return makeArray(area.northWest.x, area.southEast.z).flatMap((x) => yArray.flatMap((y) => zArray
        .map((z) => dimension.getBlock({ x, y, z }))
        .filter((b) => b !== undefined)));
};
/**
 * エリア内の整数座標を取得する
 *
 * @param area
 * @returns
 */
export const gatherLocationsWithin = (area) => {
    const zArray = makeArray(area.northWest.z, area.southEast.z);
    if (isVector3(area.northWest) && isVector3(area.southEast)) {
        const yArray = makeArray(area.northWest.y, area.southEast.y);
        return makeArray(area.northWest.x, area.southEast.x).flatMap((x) => yArray.flatMap((y) => zArray.map((z) => ({ x, y, z }))));
    }
    if (!isVector3(area.northWest) && !isVector3(area.southEast)) {
        return makeArray(area.northWest.x, area.southEast.x).flatMap((x) => zArray.map((z) => ({ x, z })));
    }
    return [];
};
export const get2DAreaFromLoc = (location, edgeLength) => {
    try {
        if (edgeLength <= 0)
            return undefined;
        const loc = getIntegerLocation(location);
        const length = edgeLength & 1 ? (edgeLength - 1) / 2 : edgeLength / 2;
        return {
            northWest: { x: loc.x - length, z: loc.z - length },
            southEast: { x: loc.x + length, z: loc.z + length },
        };
    }
    catch (error) {
        console.error(`Failed to get vertices.`);
        console.error(error);
        return undefined;
    }
};
/**
 * プレイヤーの座標を中心とした、一辺`edgeLength`マスの立方体エリアの頂点座標を取得する
 *
 * @param object プレイヤー
 * @param edgeLength 一辺の長さ。偶数の場合は1プラスされる。
 * @returns
 */
export const get3DArea = (object, edgeLength) => get3DAreaFromLoc(object.location, edgeLength);
/**
 * 中心座標から一辺`edgeLength`マスの立方体エリアの頂点座標を取得する
 *
 * @param location 中心座標
 * @param edgeLength 一辺の長さ。偶数の場合は1プラスされる。
 * @returns
 */
export const get3DAreaFromLoc = (location, edgeLength) => {
    try {
        if (edgeLength <= 0) {
            return undefined;
        }
        const loc = getIntegerLocation(location);
        const length = edgeLength & 1 ? (edgeLength - 1) / 2 : edgeLength / 2;
        return {
            northWest: { x: loc.x - length, y: loc.y - length, z: loc.z - length },
            southEast: { x: loc.x + length, y: loc.y + length, z: loc.z + length },
        };
    }
    catch (error) {
        console.error(`Failed to get vertices.`);
        console.error(error);
        return undefined;
    }
};
const isVector3 = (location) => "y" in location;
export const getIntegerLocation = (location) => isVector3(location)
    ? {
        x: Math.floor(location.x),
        y: Math.floor(location.y),
        z: Math.floor(location.z),
    }
    : {
        x: Math.floor(location.x),
        z: Math.floor(location.z),
    };
/**
 * 与えられたプレイヤーが拠点エリアに居るかどうかを判定する
 *
 * @param object プレイヤー
 * @returns
 */
export const isInBaseArea = (object) => !isInTownArea(object) && 0 < object.location.z;
/**
 * 与えられたプレイヤーが探索エリアに居るかどうかを判定する
 *
 * @param object プレイヤー
 * @returns
 */
export const isInExploringArea = (object) => !isInTownArea(object) && object.location.z < 0;
/**
 * 与えられたプレイヤーが街エリアに居るかどうかを判定する
 *
 * @param object プレイヤー
 * @returns
 */
export const isInTownArea = (object) => {
    const nw = { x: -6400, y: -64, z: -6400 };
    const se = { x: 6400, y: 319, z: 6400 };
    switch (object.dimension.id) {
        case "overworld":
            if (object.location.x < nw.x)
                return false;
            if (se.x < object.location.x)
                return false;
            if (object.location.z < nw.z)
                return false;
            if (se.z < object.location.x)
                return false;
            return true;
        case "nether":
            if (object.location.x < nw.x / 8)
                return false;
            if (se.x / 8 < object.location.x)
                return false;
            if (object.location.z < nw.z / 8)
                return false;
            if (se.z / 8 < object.location.x)
                return false;
            return true;
        default:
            return false;
    }
};
export const offsetLocation = (location, offset) => typeof offset === "number"
    ? isVector3(location)
        ? {
            x: location.x + offset,
            y: location.y + offset,
            z: location.z + offset,
        }
        : {
            x: location.x + offset,
            z: location.z + offset,
        }
    : isVector3(location) && isVector3(offset)
        ? {
            x: location.x + offset.x,
            y: location.y + offset.y,
            z: location.z + offset.z,
        }
        : {
            x: location.x + offset.x,
            z: location.z + offset.z,
        };
