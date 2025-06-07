import { LengthError } from "../errors/locations";
/**
 * 2座標間の距離を計算する
 *
 * @param value1
 * @param value2
 * @returns
 */
const calcDistance = (value1, value2) => Math.abs(value1 - value2) + 1;
/**
 * 2座標間の距離を計算する
 *
 * @param location1
 * @param location2
 * @returns
 */
const calcDistances = (location1, location2) => ({
    x: calcDistance(location1.x, location2.x),
    y: calcDistance(location1.y, location2.y),
    z: calcDistance(location1.z, location2.z),
});
/**
 * エリア内のすべてのブロックを取得する
 *
 * @param area
 * @param dimension
 * @returns
 */
export const collectBlocksWithin = (area, dimension) => {
    try {
        const yArray = makeArray(area.northWest.y, area.southEast.y);
        const zArray = makeArray(area.northWest.z, area.southEast.z);
        return makeArray(area.northWest.x, area.southEast.z).flatMap((x) => yArray.flatMap((y) => zArray
            .map((z) => dimension.getBlock({ x, y, z }))
            .filter((b) => b !== undefined)));
    }
    catch (error) {
        console.error("Failed to collect blocks within a give area because of", error);
        throw error;
    }
};
/**
 * エリア内の整数座標を取得する
 *
 * @param area
 * @returns
 */
export const collectLocationsWithin = (area) => {
    try {
        const zArray = makeArray(area.northWest.z, area.southEast.z);
        if (isVector3(area.northWest) && isVector3(area.southEast)) {
            const yArray = makeArray(area.northWest.y, area.southEast.y);
            return makeArray(area.northWest.x, area.southEast.x).flatMap((x) => yArray.flatMap((y) => zArray.map((z) => ({ x, y, z }))));
        }
        if (!isVector3(area.northWest) && !isVector3(area.southEast)) {
            return makeArray(area.northWest.x, area.southEast.x).flatMap((x) => zArray.map((z) => ({ x, z })));
        }
        return [];
    }
    catch (error) {
        console.error("Failed to colelct locations within a give area because of", error);
        throw error;
    }
};
/**
 * 整数座標に変換する
 *
 * @param location
 * @returns
 */
export const generateIntegerLocation = (location) => isVector3(location)
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
 * 2つのエリアが重なっているか判定する
 *
 * @param area1
 * @param area2
 * @param edgeLength
 */
export const isOverlapped = (area1, area2, edgeLength) => {
    const area1EdgeLength = (edgeLength === null || edgeLength === void 0 ? void 0 : edgeLength.area1) || {
        x: calcDistance(area1.northWest.x, area1.southEast.x),
        z: calcDistance(area1.northWest.z, area1.southEast.z),
    };
    const area2EdgeLength = (edgeLength === null || edgeLength === void 0 ? void 0 : edgeLength.area2) || {
        x: calcDistance(area2.northWest.x, area2.southEast.x),
        z: calcDistance(area2.northWest.z, area2.southEast.z),
    };
    const total = {
        x: Math.max(calcDistance(area1.northWest.x, area2.southEast.x), calcDistance(area1.southEast.x, area2.northWest.x)),
        z: Math.max(calcDistance(area1.northWest.z, area2.southEast.z), calcDistance(area1.southEast.z, area2.northWest.z)),
    };
    return (area1EdgeLength.x + area2EdgeLength.x < total.x &&
        area1EdgeLength.z + area2EdgeLength.z < total.z);
};
export const isVector = (location) => "x" in location && "z" in location;
const isVector3 = (location) => "y" in location;
/**
 * 与えられた座標を中心とする、指定された長さの正方形の頂点座標を返す
 *
 * @param location 中心座標
 * @param edgeLength 一辺の長さ
 * @returns
 * @throws This function can throw error.
 *
 * {@link LengthError}
 */
export const make2DAreaFromLoc = (location, edgeLength) => {
    try {
        if (edgeLength <= 0) {
            throw new LengthError("edgeLength");
        }
        const loc = generateIntegerLocation(location);
        const length = (edgeLength & 1 ? edgeLength - 1 : edgeLength) / 2;
        return {
            northWest: { x: loc.x - length, z: loc.z - length },
            southEast: { x: loc.x + length, z: loc.z + length },
        };
    }
    catch (error) {
        console.error("Failed to get vertices because of", error);
        throw error;
    }
};
/**
 * プレイヤーまたはブロックを中心とする、与えられた長さの立方体エリアの頂点座標を取得する
 *
 * @param object プレイヤーまたはブロック
 * @param edgeLength 一辺の長さ。偶数の場合は1プラスされる。
 * @returns
 * @throws This function can throw error.
 *
 * {@link LengthError}
 */
export const make3DArea = (object, edgeLength) => make3DAreaFromLoc(object.location, edgeLength);
/**
 * 中心座標から一辺`edgeLength`マスの立方体エリアの頂点座標を取得する
 *
 * @param location 中心座標
 * @param edgeLength 一辺の長さ。偶数の場合は1プラスされる。
 * @returns
 * @throws This function can throw error.
 *
 * {@link LengthError}
 */
export const make3DAreaFromLoc = (location, edgeLength) => {
    try {
        if (edgeLength <= 0) {
            throw new LengthError("edgeLength");
        }
        const loc = generateIntegerLocation(location);
        const length = (edgeLength & 1 ? edgeLength - 1 : edgeLength) / 2;
        return {
            northWest: { x: loc.x - length, y: loc.y - length, z: loc.z - length },
            southEast: { x: loc.x + length, y: loc.y + length, z: loc.z + length },
        };
    }
    catch (error) {
        console.error(`Failed to get vertices because of`, error);
        throw error;
    }
};
/**
 *
 * @param value1
 * @param value2
 * @returns
 */
export const makeArray = (value1, value2) => {
    const value1Int = Math.floor(value1);
    const value2Int = Math.floor(value2);
    const minValue = Math.min(value1Int, value2Int);
    return Array(calcDistance(value1Int, value2Int))
        .fill(null)
        .map((_, index) => index + minValue);
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
const LocationUtils = {
    calcDistance,
    calcDistances,
    collectBlocksWithin,
    collectLocationsWithin,
    generateIntegerLocation,
    isInArea,
    isOverlapped,
    isVector,
    isVector3,
    make2DAreaFromLoc,
    make3DArea,
    make3DAreaFromLoc,
    makeArray,
    offsetLocation,
};
export default LocationUtils;
