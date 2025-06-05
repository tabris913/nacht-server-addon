import { makeArray } from "./misc";
import AreaUtils from "./AreaUtils";
export const isVector = (location) => "x" in location && "z" in location;
const isVector3 = (location) => "y" in location;
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
 * 座標がエリアに含まれるか判定する
 *
 * @param location
 * @param area
 * @returns
 */
export const isInArea = (location, area) => area.northWest.x <= location.x &&
    location.x <= area.southEast.x &&
    area.northWest.z <= location.z &&
    location.z <= area.southEast.x;
/**
 * 与えられたプレイヤーが拠点エリアに居るかどうかを判定する
 *
 * @param object プレイヤー
 * @returns
 */
export const isInBaseArea3D = (object) => isInBaseArea2D(object.location, object.dimension);
export const isInBaseArea2D = (location, dimension) => !isInTownArea2D(location, dimension) && 0 < location.z;
/**
 * 与えられたプレイヤーが探索エリアに居るかどうかを判定する
 *
 * @param object プレイヤー
 * @returns
 */
export const isInExploringArea3D = (object) => isInExploringArea2D(object.location, object.dimension);
export const isInExploringArea2D = (location, dimension) => !isInTownArea2D(location, dimension) && location.z < 0;
/**
 * 与えられたプレイヤーが街エリアに居るかどうかを判定する
 *
 * @param object プレイヤー
 * @returns
 */
export const isInTownArea3D = (object) => {
    // const nw: Vector3 = { x: -6400, y: -64, z: -6400 };
    // const se: Vector3 = { x: 6400, y: 319, z: 6400 };
    return isInTownArea2D(object.location, object.dimension);
};
export const isInTownArea2D = (location, dimension) => {
    const nw = { x: -6400, z: -6400 };
    const se = { x: 6400, z: 6400 };
    switch (dimension.id) {
        case "overworld":
            if (se.x < location.x)
                return false;
            if (location.x < nw.x)
                return false;
            if (se.z < location.z)
                return false;
            if (location.z < nw.z)
                return false;
            return true;
        case "nether":
            if (se.x < location.x / 8)
                return false;
            if (location.x / 8 < nw.x)
                return false;
            if (se.z < location.z / 8)
                return false;
            if (location.z / 8 < nw.z)
                return false;
            return true;
        default:
            return false;
    }
};
/**
 * 2つのエリアが重なっているか判定する
 *
 * @param area1
 * @param area2
 * @param edgeLength
 */
export const isOverlapped = (area1, area2, edgeLength) => {
    const area1EdgeLength = (edgeLength === null || edgeLength === void 0 ? void 0 : edgeLength.area1) || {
        x: AreaUtils.calcDistance(area1.northWest.x, area1.southEast.x),
        z: AreaUtils.calcDistance(area1.northWest.z, area1.southEast.z),
    };
    const area2EdgeLength = (edgeLength === null || edgeLength === void 0 ? void 0 : edgeLength.area2) || {
        x: AreaUtils.calcDistance(area2.northWest.x, area2.southEast.x),
        z: AreaUtils.calcDistance(area2.northWest.z, area2.southEast.z),
    };
    const total = {
        x: Math.max(AreaUtils.calcDistance(area1.northWest.x, area2.southEast.x), AreaUtils.calcDistance(area1.southEast.x, area2.northWest.x)),
        z: Math.max(AreaUtils.calcDistance(area1.northWest.z, area2.southEast.z), AreaUtils.calcDistance(area1.southEast.z, area2.northWest.z)),
    };
    return (area1EdgeLength.x + area2EdgeLength.x < total.x &&
        area1EdgeLength.z + area2EdgeLength.z < total.z);
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
