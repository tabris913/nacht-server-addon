var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { system, TicksPerSecond, world, } from "@minecraft/server";
import { Formatting, LOC_ERSTE, PREFIX_GAMERULE } from "../const";
import { get3DArea, isInBaseArea3D, isInExploringArea3D, isInTownArea3D, } from "../utils/area";
import { sendMessageToOps } from "../utils/player";
import { RuleName } from "../commands/gamerule";
const tagTownArea = "AREA_TOWN"; // 街エリアにいる
const tagExploreArea = "AREA_EXP"; // 探索エリアにいる
const tagBaseArea = "AREA_BASE"; // 拠点エリアにいる
const tagAreaAlert1 = "ALERT_AREA1"; // アラート1回目
const tagAreaAlert2 = "ALERT_AREA2"; // アラート2回目 (5秒後)
const tagAreaAlertTimeout = "ALERT_TIMEOUT";
const COMMON_MSG_A1 = `${Formatting.Color.GOLD}20秒以内に元のエリアに戻らないと${Formatting.Color.DARK_PURPLE}Erste${Formatting.Color.GOLD}に強制テレポートされます`;
const COMMON_MSG_A2 = `${Formatting.Color.GOLD}10秒以内に元のエリアに戻らないと${Formatting.Color.DARK_PURPLE}Erste${Formatting.Color.GOLD}に強制テレポートされます`;
const getAreaName = (area) => {
    switch (area) {
        case "town":
            return "街エリア";
        case "base":
            return "拠点エリア";
        case "expr":
            return "探索エリア";
    }
};
const getAreaTag = (area) => {
    switch (area) {
        case "town":
            return tagTownArea;
        case "base":
            return tagBaseArea;
        case "expr":
            return tagExploreArea;
    }
};
const getCallback = (area) => {
    switch (area) {
        case "town":
            return isInTownArea3D;
        case "base":
            return isInBaseArea3D;
        case "expr":
            return isInExploringArea3D;
    }
};
const getCallback2 = (area) => {
    switch (area) {
        case "town":
            return null;
        case "base":
            return isInExploringArea3D;
        case "expr":
            return isInBaseArea3D;
    }
};
/**
 * エリア違反したプレイヤーを所定の場所に転移させる
 *
 * @param player プレイヤー
 * @param tag 削除するタグ
 */
const tp = (player, tag) => {
    // ブロックが存在するので転移可能
    // 先に違反タグを除去
    [tagAreaAlert2, tagAreaAlertTimeout, tag].forEach((t) => player.removeTag(t));
    player.addTag(tagTownArea);
    // ブロックの1マス上に転移
    player.teleport(LOC_ERSTE, {
        dimension: world.getDimension("minecraft:overworld"),
    });
    console.log(`teleported ${player.name} to Erste[-10 63 0]`);
};
/**
 * プレイヤーのエリア違反をチェックする
 *
 * @param area エリア種別
 */
const checkPlayers = (area) => __awaiter(void 0, void 0, void 0, function* () {
    const isInCorrectArea = getCallback(area);
    const isInWrongArea = getCallback2(area);
    const areaName = getAreaName(area);
    const areaTag = getAreaTag(area);
    const msg = `${Formatting.Color.GOLD}${areaName}の外にいます。エリアを移動する際にはアイテムを利用してください${Formatting.Reset}`;
    for (const player of world.getPlayers({ tags: [areaTag] })) {
        // タグを有したプレイヤーを一人ずつ処理
        if (isInCorrectArea(player)) {
            // エリア内にいるのにエリア外にいるタグが付いている場合は外す
            [tagAreaAlert1, tagAreaAlert2, tagAreaAlertTimeout]
                .filter((tag) => player.hasTag(tag))
                .forEach((tag) => {
                player.removeTag(tag);
                sendMessageToOps(`${player.name} が${areaName}に戻りました`);
            });
            continue;
        }
        if (!player.hasTag(tagAreaAlert1) && !player.hasTag(tagAreaAlert2)) {
            // 違反タグなし --> 初検出 --> 20 秒猶予を与える (10 秒後に警告)
            sendMessageToOps(`${Formatting.Color.GOLD}${player.name} が${areaName}から脱走しました${Formatting.Reset}`);
            player.addTag(tagAreaAlert1);
            player.sendMessage(msg);
            player.sendMessage(COMMON_MSG_A1);
            system.runTimeout(() => {
                player.addTag(tagAreaAlertTimeout);
            }, TicksPerSecond * 10);
        }
        else if (player.hasTag(tagAreaAlert1) &&
            player.hasTag(tagAreaAlertTimeout)) {
            // 違反タグ1あり --> 二回目の検出 --> 10 秒猶予を与える
            player.addTag(tagAreaAlert2);
            player.removeTag(tagAreaAlertTimeout);
            player.removeTag(tagAreaAlert1);
            player.sendMessage(msg);
            player.sendMessage(COMMON_MSG_A2);
            system.runTimeout(() => {
                player.addTag(tagAreaAlertTimeout);
            }, TicksPerSecond * 10);
        }
        else if (player.hasTag(tagAreaAlert2) &&
            player.hasTag(tagAreaAlertTimeout)) {
            // 違反タグ2あり --> 三回目の検出 --> 転移させる
            if (isInWrongArea) {
                // town 以外
                sendMessageToOps(`所定の時間内に ${player.name} が${areaName}に戻らなかったため、転移させます`);
                if (isInWrongArea(player)) {
                    // 対称エリアにいる場合
                    tp(player, areaTag);
                }
                else if (isInTownArea3D(player)) {
                    tp(player, areaTag);
                }
            }
        }
    }
});
/**
 * エリアの境界としてパーティクルを表示する
 */
const showAreaBorder = () => {
    try {
        const locs = {
            "minecraft:overworld": new Set(),
            "minecraft:nether": new Set(),
            "minecraft:the_end": new Set(),
        };
        const distance = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderRange);
        world
            .getAllPlayers()
            .filter((player) => player.isValid)
            .forEach((player) => {
            const area3D = get3DArea(player, distance || 101);
            if (area3D === undefined) {
                return;
            }
            const { northWest, southEast } = area3D;
            // y 座標は奇数のみ
            const yArray = Array(Math.abs(northWest.y - southEast.y) + 1)
                .fill(null)
                .map((_, index) => index + northWest.y)
                .filter((y) => y & 1);
            const locations = [];
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
                        xLength =
                            Math.abs(northWest.x - Math.min(southEast.x, -6401)) + 1;
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
                    console.error("Failed to gather block locations (base / expr).");
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
                    console.error(`Failed to gather block locations [town e-w] (${Math.abs(Math.max(northWest.z, -6401) - Math.min(southEast.z, 6401)) + 1}).`);
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
                    console.error(`Failed to gather block locations [town n-s] (${Math.abs(Math.max(northWest.x, -6401) - Math.min(southEast.x, 6401)) + 1}).`);
                    throw error;
                }
            }
            locations.forEach((location) => locs[player.dimension.id].add(location));
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
                    dimension.spawnParticle("minecraft:small_flame_particle", block.location);
                });
            }
            catch (error) {
                console.error(`Failed to spawn particles (${locations.size}).`);
                throw error;
            }
        });
    }
    catch (error) {
        console.error("Failed to show particles for area borders.");
        console.error(error);
    }
};
export default () => {
    system.runTimeout(() => {
        // 範囲チェック
        system.runInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            if (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingArea)) {
                // 街エリアから外に出ることは基本的にありえない
                // checkPlayers('town');
                checkPlayers("base");
                checkPlayers("expr");
            }
        }), world.getDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingAreaInterval) || TicksPerSecond / 5);
        // エリアボーダー
        system.runInterval(() => {
            if (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorder)) {
                showAreaBorder();
            }
        }, world.getDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderInterval) || TicksPerSecond / 2);
    }, 1);
};
