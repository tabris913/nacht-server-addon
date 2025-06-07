import { BlockVolume, world, } from "@minecraft/server";
import { MinecraftDimensionTypes } from "../types/index";
import { Logger } from "./logger";
/**
 * ネザーの街エリアの BlockVolume を生成する
 *
 * @returns `BlockVolume`
 */
export const createNetherTownArea = () => {
    try {
        const nether = world.getDimension(MinecraftDimensionTypes.Nether);
        return new BlockVolume({ x: -800, y: nether.heightRange.min, z: -800 }, { x: 800, y: nether.heightRange.max, z: 800 });
    }
    catch (error) {
        Logger.error("Failed to create BlockVolume for town area in nether because of", error);
        throw error;
    }
};
/**
 * オーバーワールドの街エリアの BlockVolume を生成する
 *
 * @returns `BlockVolume`
 */
export const createOverworldTownArea = () => {
    try {
        const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);
        return new BlockVolume({ x: -6400, y: overworld.heightRange.min, z: -6400 }, { x: 6400, y: overworld.heightRange.max, z: 6400 });
    }
    catch (error) {
        Logger.error("Failed to create BlockVolume for town area in overworld because of", error);
        throw error;
    }
};
/**
 * 与えられたエンティティまたはブロックが拠点エリアに居るかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInBaseArea = (object) => isInBaseArea(Object.assign({ dimension: object.dimension }, object.location));
/**
 * 与えられたエンティティまたはブロックが街エリアに存在するかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInTownArea = (object) => isInTownArea(Object.assign({ dimension: object.dimension }, object.location));
/**
 * 与えられたエンティティまたはブロックが探索エリアに居るかどうかを判定する
 *
 * @param object エンティティまたはブロック
 * @returns
 */
export const existsInExploringArea = (object) => isInExploringArea(Object.assign({ dimension: object.dimension }, object.location));
/**
 * 与えられた座標が拠点エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInBaseArea = (location) => !isInTownArea(location) && 0 < location.z;
/**
 * 与えられた座標が探索エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInExploringArea = (location) => !isInTownArea(location) && location.z < 0;
/**
 * 与えられた座標が街エリアに含まれるかどうか判定する
 *
 * @param location 座標
 * @param dimension ディメンション
 * @returns
 */
export const isInTownArea = (location) => {
    switch (location.dimension.id) {
        case MinecraftDimensionTypes.Overworld:
            const overworld = createOverworldTownArea();
            return overworld.isInside(location);
        case MinecraftDimensionTypes.Nether:
            const nether = createNetherTownArea();
            return nether.isInside(location);
        default:
            return false;
    }
};
const AreaUtils = {
    createNetherTownArea,
    createOverworldTownArea,
    existsInBaseArea,
    existsInTownArea,
    existsInExploringArea,
    isInBaseArea,
    isInExploringArea,
    isInTownArea,
};
export default AreaUtils;
