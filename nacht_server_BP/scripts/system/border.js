import { BlockVolume, BlockVolumeIntersection, system, TicksPerSecond, world } from '@minecraft/server';
import { RuleName } from '../commands/enum';
import { PREFIX_GAMERULE } from '../const';
import { BaseAreaDimensionBlockVolume } from '../models/BaseAreaDimensionBlockVolume';
import { MinecraftDimensionTypes } from '../types/index';
import BaseUtils from '../utils/BaseUtils';
import LocationUtils from '../utils/LocationUtils';
import { Logger } from '../utils/logger';
import { isFixedBase } from '../utils/TypeGuards';
/**
 * エリアの境界としてパーティクルを表示する
 *
 * @param playerBV
 * @param yArray
 * @returns
 */
const collectAreaBorder = (playerBV, yArray) => {
    try {
        const locations = [];
        const { max: southEast, min: northWest } = playerBV.getBoundingBox();
        // Borders Between Base and Exploring Area
        if (northWest.z <= 0 && 0 <= southEast.z) {
            // 表示範囲の z 座標条件 (z = 0 のブロック)
            try {
                /**
                 * 表示するブロック数 (東西方向; z 軸に平行)
                 */
                let xLength = 0;
                if (northWest.x <= -6401) {
                    // western border
                    xLength = Math.abs(northWest.x - Math.min(southEast.x, -6401)) + 1;
                }
                if (6401 <= southEast.x) {
                    // eastern border
                    xLength = Math.abs(Math.max(northWest.x, 6401) - southEast.x) + 1;
                }
                if (0 < xLength) {
                    // 表示するブロックあり
                    /**
                     * x 座標の配列
                     *
                     * 10 の倍数のみ
                     */
                    const xArray = Array(xLength)
                        .fill(null)
                        .map((_, index) => index + northWest.x)
                        .filter((x) => x % 10 === 0);
                    yArray.forEach((y) => locations.push(...xArray.map((x) => ({ x, y, z: 0 }))));
                }
            }
            catch (error) {
                Logger.error('Failed to gather block locations (base / expr).');
                throw error;
            }
        }
        // Borders for Town Area
        if (-6401 <= southEast.z && northWest.z <= 6401) {
            // 東西のボーダー (z軸に平行 := x 座標が固定)
            try {
                let xIndex = 0;
                if (northWest.x <= -6401 && -6401 <= southEast.x) {
                    // western border
                    xIndex = -6401;
                }
                else if (northWest.x <= 6401 && 6401 <= southEast.x) {
                    // eastern border
                    xIndex = 6401;
                }
                if (xIndex !== 0) {
                    // 表示範囲に含まれる
                    /**
                     * 最小の z 座標
                     */
                    const minZ = Math.max(northWest.z, -6401);
                    /**
                     * z 座標の配列
                     *
                     * 10 の倍数のみ
                     */
                    const zArray = Array(Math.abs(minZ - Math.min(southEast.z, 6401)) + 1)
                        .fill(null)
                        .map((_, index) => minZ + index)
                        .filter((z) => z % 10 === 0);
                    yArray.forEach((y) => locations.push(...zArray.map((z) => ({ x: xIndex, y, z }))));
                }
            }
            catch (error) {
                Logger.error(`Failed to gather block locations [town e-w] (${Math.abs(Math.max(northWest.z, -6401) - Math.min(southEast.z, 6401)) + 1}).`);
                throw error;
            }
        }
        if (-6401 <= southEast.x && northWest.x <= 6401) {
            // 南北のボーダー (x 軸に平行 := z 座標が固定)
            try {
                let zIndex = 0;
                if (northWest.z <= -6401 && -6401 <= southEast.z) {
                    // northern border
                    zIndex = -6401;
                }
                if (northWest.z <= 6401 && 6401 <= southEast.z) {
                    // southern border
                    zIndex = 6401;
                }
                if (zIndex !== 0) {
                    // 表示範囲に含まれる
                    /**
                     * 最小の x 座標
                     */
                    const minX = Math.max(northWest.x, -6401);
                    /**
                     * x 座標の配列
                     */
                    const xArray = Array(Math.abs(minX - Math.min(southEast.x, 6401)) + 1)
                        .fill(null)
                        .map((_, index) => minX + index)
                        .filter((x) => x % 10 === 0);
                    yArray.forEach((y) => locations.push(...xArray.map((x) => ({ x, y, z: zIndex }))));
                }
            }
            catch (error) {
                Logger.error(`Failed to gather block locations [town n-s] (${Math.abs(Math.max(northWest.x, -6401) - Math.min(southEast.x, 6401)) + 1}).`);
                throw error;
            }
        }
        return locations;
    }
    catch (error) {
        Logger.error('Failed to gather locations to show border particles because of', error);
        throw error;
    }
};
/**
 * パーティクルを表示させる拠点の境界を集める
 *
 * @param playerBV
 * @param yArray
 * @param bases
 * @returns
 */
const collectBaseBorder = (playerBV, yArray, bases) => {
    try {
        const locations = [];
        const { max: southEast, min: northWest } = playerBV.getBoundingBox();
        bases
            .filter((baseBV) => playerBV.intersects(baseBV) !== BlockVolumeIntersection.Disjoint)
            .forEach((baseBV) => {
            const { max: { x: eastX, z: southZ }, min: { x: westX, z: northZ }, } = baseBV.getBoundingBox();
            // east
            if (northWest.x <= eastX && eastX <= southEast.x) {
                const zArray = LocationUtils.makeArray(Math.max(northWest.z, northZ), Math.min(southEast.z, southZ)).filter((z) => z % 5 === 0);
                yArray.forEach((y) => locations.push(...zArray.map((z) => ({ x: eastX, y, z }))));
            }
            // west
            if (northWest.x <= westX && westX <= southEast.x) {
                const zArray = LocationUtils.makeArray(Math.max(northWest.z, northZ), Math.min(southEast.z, southZ)).filter((z) => z % 5 === 0);
                yArray.forEach((y) => locations.push(...zArray.map((z) => ({ x: westX, y, z }))));
            }
            // south
            if (northWest.z <= southZ && southZ <= southEast.z) {
                const xArray = LocationUtils.makeArray(Math.max(northWest.x, westX), Math.min(southEast.x, eastX)).filter((x) => x % 5 === 0);
                yArray.forEach((y) => locations.push(...xArray.map((x) => ({ x, y, z: southZ }))));
            }
            // north
            if (northWest.z <= northZ && northZ <= southEast.z) {
                const xArray = LocationUtils.makeArray(Math.max(northWest.x, westX), Math.min(southEast.x, eastX)).filter((x) => x % 5 === 0);
                yArray.forEach((y) => locations.push(...xArray.map((x) => ({ x, y, z: northZ }))));
            }
        });
        return locations;
    }
    catch (error) {
        Logger.error('Failed to gather locations to show base particles because of', error);
        throw error;
    }
};
export default () => {
    system.runTimeout(() => {
        const showAreaBorderInterval = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderInterval);
        system.runInterval(() => {
            const showAreaBorderFlag = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorder);
            const distance = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderRange);
            const yDistance = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderYRange);
            const bases = BaseUtils.retrieveBases()
                .filter((base) => base.showBorder)
                .map((base) => {
                if (isFixedBase(base)) {
                    // 保存された座標を利用できる
                    return new BaseAreaDimensionBlockVolume(base.northWest, LocationUtils.offsetLocation(base.northWest, base.edgeSize), base.dimension);
                }
                else if (base.entityId) {
                    // 旗の座標を利用する
                    const entity = world.getEntity(base.entityId);
                    if (entity) {
                        return LocationUtils.generateBlockVolume(entity.location, base.edgeSize);
                    }
                }
            })
                .filter((bv) => bv !== undefined);
            const locs = {
                [MinecraftDimensionTypes.Overworld]: new Set(),
                [MinecraftDimensionTypes.Nether]: new Set(),
                [MinecraftDimensionTypes.TheEnd]: new Set(),
            };
            world
                .getAllPlayers()
                .filter((player) => player.isValid)
                .forEach((player) => {
                /**
                 * パーティクル表示範囲
                 */
                const area3D = LocationUtils.make3DArea(player, distance === undefined ? 101 : distance, yDistance === undefined ? 5 : yDistance);
                if (area3D === undefined)
                    return;
                const bv = new BlockVolume(area3D.northWest, area3D.southEast);
                const yArray = LocationUtils.makeArray(bv.getMin().y, bv.getMax().y);
                if (showAreaBorderFlag) {
                    collectAreaBorder(bv, yArray).forEach((location) => locs[player.dimension.id].add(location));
                }
                collectBaseBorder(bv, yArray, bases).forEach((location) => locs[player.dimension.id].add(location));
            });
            Object.entries(locs)
                .filter(([_, locations]) => locations.size > 0)
                .forEach(([dimensionId, locations]) => {
                const dimension = world.getDimension(dimensionId);
                try {
                    Array.from(locations)
                        .map((location) => dimension.getBlock(location))
                        .filter((block) => block !== undefined)
                        .filter((block) => block.isValid && (block.isAir || block.isLiquid))
                        .forEach((block) => {
                        dimension.spawnParticle('minecraft:small_flame_particle', block.location);
                    });
                }
                catch (error) {
                    Logger.error(`Failed to spawn particles (${locations.size}).`);
                    throw error;
                }
            });
        }, showAreaBorderInterval || TicksPerSecond / 2);
    }, 1);
};
