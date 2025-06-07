import { BlockVolume, BlockVolumeIntersection, } from "@minecraft/server";
import { LengthError } from "../errors/locations";
import { DimensionBlockVolume } from "../models/DimensionBlockVolume";
import { Logger } from "./logger";
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
const calcDistances = (location1, location2) => new BlockVolume(location1, location2).getSpan();
/**
 * エリア内のすべてのブロックを取得する
 *
 * @param blockVolume
 * @param dimension
 * @returns
 */
export function* collectBlocksWithin(blockVolume, dimension) {
    try {
        for (const location of blockVolume.getBlockLocationIterator()) {
            const block = dimension.getBlock(location);
            if (block === undefined)
                continue;
            yield block;
        }
    }
    catch (error) {
        Logger.error("Failed to collect blocks within a give area because of", error);
        throw error;
    }
}
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
export const generateBlockVolume = (location, edgeLength) => {
    try {
        if (edgeLength <= 0) {
            throw new LengthError("edgeLength");
        }
        const loc = generateIntegerLocation(location);
        const length = (edgeLength & 1 ? edgeLength - 1 : edgeLength) / 2;
        return new BlockVolume({ x: loc.x - length, y: loc.y, z: loc.z - length }, { x: loc.x + length, y: loc.y, z: loc.z + length });
    }
    catch (error) {
        Logger.error("Failed to get vertices because of", error);
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
 * 2つのエリアが重なっているか判定する
 *
 * @param area1
 * @param area2
 * @param edgeLengthx
 */
export const isOverlapped = (area1, area2) => {
    const isOverlappedFlatly = area1.intersects(area2) !== BlockVolumeIntersection.Disjoint;
    if (area1 instanceof DimensionBlockVolume &&
        area2 instanceof DimensionBlockVolume) {
        return isOverlappedFlatly && area1.dimension === area2.dimension;
    }
    return isOverlappedFlatly;
};
export const isVector = (location) => "x" in location && "z" in location;
const isVector3 = (location) => "y" in location;
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
        Logger.error(`Failed to get vertices because of`, error);
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
    generateBlockVolume,
    generateIntegerLocation,
    isOverlapped,
    isVector,
    isVector3,
    make3DArea,
    make3DAreaFromLoc,
    makeArray,
    offsetLocation,
};
export default LocationUtils;
