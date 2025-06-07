import { BlockVolume, Direction, system, world, } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Formatting, TAG_OPERATOR } from "../const";
import { NachtServerAddonEntityTypes, NachtServerAddonItemTypes, } from "../enums";
import { BaseAreaDimensionBlockVolume } from "../models/BaseAreaDimensionBlockVolume";
import { MinecraftDimensionTypes } from "../types/index";
import AreaUtils from "../utils/AreaUtils";
import DynamicPropertyUtils from "../utils/DynamicPropertyUtils";
import InventoryUtils from "../utils/InventoryUtils";
import LocationUtils from "../utils/LocationUtils";
import { isFixedBase } from "../utils/TypeGuards";
import { Logger } from "../utils/logger";
/**
 * 与えられた平面が拠点エリアの範囲外にはみ出してないか確認する
 *
 * @param volume
 */
const isOutOfBaseArea = (volume) => {
    const { min, max } = volume.getBoundingBox();
    let minXZ, maxXZ;
    switch (volume.dimension.id) {
        case MinecraftDimensionTypes.Overworld:
            minXZ = -6400;
            maxXZ = 6400;
            break;
        case MinecraftDimensionTypes.Nether:
            minXZ = -800;
            maxXZ = 800;
            break;
        default:
            return false;
    }
    if (max.x < minXZ && min.z < 0)
        return true;
    if (minXZ <= max.x && min.x <= maxXZ && min.z <= maxXZ) {
        return true;
    }
    if (maxXZ < min.x && min.z < 0)
        return true;
    return false;
};
/**
 * 与えられた平面が既に確定された拠点と重複しているか確認する
 *
 * @param baseArea
 * @returns
 */
const hasOverlappingBlocks = (baseArea) => DynamicPropertyUtils.retrieveBases()
    .filter(isFixedBase)
    .some((baseDp) => {
    const base = new BaseAreaDimensionBlockVolume(baseDp.northWest, LocationUtils.offsetLocation(baseDp.northWest, baseDp.edgeSize - 1), baseDp.dimension);
    return LocationUtils.isOverlapped(baseArea, base);
});
/**
 * 既に存在する拠点範囲の中であるか判定する
 *
 * @param location
 * @returns
 */
const isInBaseArea = (location) => {
    const dimensions = {};
    return DynamicPropertyUtils.retrieveBases()
        .filter(isFixedBase)
        .map((baseDp) => {
        if (!(baseDp.dimension in dimensions)) {
            dimensions[baseDp.dimension] = world.getDimension(baseDp.dimension);
        }
        const from = Object.assign(Object.assign({}, baseDp.northWest), { y: dimensions[baseDp.dimension].heightRange.min });
        return new BlockVolume(from, LocationUtils.offsetLocation(from, baseDp.edgeSize));
    }, {})
        .some((blockVolume) => blockVolume.isInside(location));
};
/**
 * 拠点範囲を確定する
 *
 * @param player
 * @param dp
 */
const fixBaseZone = (player, flag, dp) => {
    if (dp.entityId === undefined) {
        player.sendMessage({});
        return;
    }
    const baseVolume = BaseAreaDimensionBlockVolume.from(LocationUtils.generateBlockVolume(flag.location, dp.edgeSize), flag.dimension);
    if (hasOverlappingBlocks(baseVolume)) {
        // 重複あり
        player.sendMessage(`${Formatting.Color.RED}既存の拠点と範囲が重なっています。`);
        return;
    }
    if (isOutOfBaseArea(baseVolume)) {
        player.sendMessage(`${Formatting.Color.RED}拠点エリアの範囲外に拠点はつくれません。`);
        return;
    }
    const form = new ActionFormData();
    form.title("拠点範囲を確定していいですか？");
    form.button("はい");
    form.button("いいえ");
    form.show(player).then((response) => {
        var _a;
        if (response.canceled)
            return;
        switch (response.selection) {
            case 0:
                (_a = world.getEntity(dp.entityId)) === null || _a === void 0 ? void 0 : _a.kill();
                world.setDynamicProperty(dp.id, JSON.stringify(Object.assign(Object.assign({}, dp), { entityId: undefined, northWest: {
                        x: flag.location.x - (dp.edgeSize - 1) / 2,
                        z: flag.location.z - (dp.edgeSize - 1) / 2,
                    } })));
                InventoryUtils.giveItem(player, NachtServerAddonItemTypes.BaseFlag);
                break;
        }
    });
};
/**
 * 拠点の設定を変更する
 *
 * @param player
 * @param dp
 */
const setConfig = (player, dp) => {
    const form = new ModalFormData();
    form.textField("拠点名", "", { defaultValue: dp.name });
    form.toggle("ボーダー表示", { defaultValue: dp.showBorder });
    form.submitButton("設定");
    form
        .show(player)
        .then((response) => {
        var _a, _b;
        if (response.canceled)
            return;
        const baseName = (_a = response.formValues) === null || _a === void 0 ? void 0 : _a[0];
        const showBorder = (_b = response.formValues) === null || _b === void 0 ? void 0 : _b[1];
        if (baseName.length === 0) {
            player.sendMessage(`${Formatting.Color.GOLD}拠点名が設定されていません。`);
            return;
        }
        world.setDynamicProperty(dp.id, JSON.stringify(Object.assign(Object.assign({}, dp), { name: baseName, showBorder })));
    })
        .catch((error) => {
        throw error;
    });
};
/**
 * 同居人を設定する
 *
 * @param player
 * @param dp
 */
const changeCoop = (player, dp) => {
    const form = new ModalFormData();
    form.title("同居人を選択してください");
    const candidates = world
        .getAllPlayers()
        .filter((pl) => pl.id !== player.id && !pl.isOp() && !pl.hasTag(TAG_OPERATOR))
        .map((pl) => pl.nameTag)
        .sort();
    candidates.forEach((nameTag) => form.toggle(nameTag, { defaultValue: dp.participants.includes(nameTag) }));
    form.submitButton("決定");
    form.show(player).then((response) => {
        var _a;
        if (response.canceled)
            return;
        const c = (_a = response.formValues) === null || _a === void 0 ? void 0 : _a.map((value, index) => value ? candidates[index] : undefined);
        world.setDynamicProperty(dp.id, JSON.stringify(Object.assign(Object.assign({}, dp), { participants: c })));
    });
};
export default () => {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
        var _a, _b, _c, _d, _e;
        try {
            if (event.block.dimension.id === "minecraft:the_end") {
                return;
            }
            if (isInBaseArea(event.block.location)) {
                // 既に存在する拠点範囲で使用した場合
                event.player.sendMessage("拠点には置けません。");
                return;
            }
            const noNameBase = DynamicPropertyUtils.retrieveBases(event.player.nameTag).filter((dp) => dp.name === undefined);
            if (noNameBase.length === 0) {
                event.player.sendMessage([
                    Formatting.Color.RED,
                    { translate: "items.base_flag.name" },
                    "の購入履歴がありません。",
                ]);
                return;
            }
            if (event.itemStack &&
                event.itemStack.typeId === NachtServerAddonItemTypes.BaseFlag &&
                event.isFirstEvent) {
                if (!AreaUtils.existsInBaseArea(event.player)) {
                    event.player.sendMessage([
                        Formatting.Color.RED,
                        { translate: "items.base_flag.name" },
                        "は拠点エリアでのみ使用可能です。",
                    ]);
                    return;
                }
                let canPlace = false;
                let next;
                switch (event.blockFace) {
                    case Direction.Down:
                        break;
                    case Direction.East:
                        next = event.block.east();
                        if ((next === null || next === void 0 ? void 0 : next.isAir) && ((_a = next.above()) === null || _a === void 0 ? void 0 : _a.isAir)) {
                            canPlace = true;
                        }
                        break;
                    case Direction.North:
                        next = event.block.north();
                        if ((next === null || next === void 0 ? void 0 : next.isAir) && ((_b = next.above()) === null || _b === void 0 ? void 0 : _b.isAir)) {
                            canPlace = true;
                        }
                        break;
                    case Direction.South:
                        next = event.block.south();
                        if ((next === null || next === void 0 ? void 0 : next.isAir) && ((_c = next.above()) === null || _c === void 0 ? void 0 : _c.isAir)) {
                            canPlace = true;
                        }
                        break;
                    case Direction.Up:
                        next = event.block.above();
                        if ((next === null || next === void 0 ? void 0 : next.isAir) && ((_d = event.block.above(2)) === null || _d === void 0 ? void 0 : _d.isAir)) {
                            canPlace = true;
                        }
                        break;
                    case Direction.West:
                        next = event.block.west();
                        if ((next === null || next === void 0 ? void 0 : next.isAir) && ((_e = next.above()) === null || _e === void 0 ? void 0 : _e.isAir)) {
                            canPlace = true;
                        }
                        break;
                }
                if (canPlace && next) {
                    // 置ける
                    const baseVolume = BaseAreaDimensionBlockVolume.from(LocationUtils.generateBlockVolume(next.location, noNameBase[0].edgeSize), next.dimension);
                    if (hasOverlappingBlocks(baseVolume)) {
                        // 重複あり
                        event.player.sendMessage(`${Formatting.Color.RED}既存の拠点と範囲が重なっています。`);
                        return;
                    }
                    if (isOutOfBaseArea(baseVolume)) {
                        // エリアをまたぐ
                        event.player.sendMessage(`${Formatting.Color.RED}拠点エリアの範囲外に拠点はつくれません。`);
                        return;
                    }
                    system.runTimeout(() => {
                        const entity = event.block.dimension.spawnEntity(NachtServerAddonEntityTypes.BaseFlag, next.location, {
                            initialPersistence: true,
                            initialRotation: 180 + event.player.getRotation().y,
                        });
                        world.setDynamicProperty(noNameBase[0].id, JSON.stringify(Object.assign(Object.assign({}, noNameBase[0]), { entityId: entity.id })));
                        // パーティクル表示
                    }, 1);
                }
                else {
                    // 置けない場合は何も起こらない
                }
            }
        }
        catch (error) {
            Logger.error(error);
        }
    });
    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
        try {
            const playerBases = DynamicPropertyUtils.retrieveBases(event.player.nameTag);
            if (!playerBases.some((dp) => dp.entityId === event.target.id)) {
                // 別の人の旗をインタラクトしても何も起きない
                return;
            }
            const noNameBase = playerBases.filter((dp) => dp.name === undefined);
            if (noNameBase.length === 0) {
                event.player.sendMessage([
                    Formatting.Color.RED,
                    { translate: "items.base_flag.name" },
                    "の購入履歴がありません。",
                ]);
                return;
            }
            if (event.target.typeId === NachtServerAddonItemTypes.BaseFlag) {
                const form = new ActionFormData();
                form.button("範囲を確定する");
                form.button("拠点の設定を変更する");
                form.button("同居人を登録する");
                form.show(event.player).then((response) => {
                    if (response.canceled) {
                        return;
                    }
                    switch (response.selection) {
                        case 0:
                            // 範囲確定
                            fixBaseZone(event.player, event.target, noNameBase[0]);
                            break;
                        case 1:
                            // 設定変更
                            setConfig(event.player, noNameBase[0]);
                            break;
                        case 2:
                            // 同居人登録
                            changeCoop(event.player, noNameBase[0]);
                            break;
                    }
                });
            }
        }
        catch (error) {
            Logger.error(error);
        }
    });
};
