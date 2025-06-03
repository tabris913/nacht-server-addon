import { Direction, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { gatherLocationsWithin, get2DAreaFromLoc, isInBaseArea, offsetLocation, } from "../utils/area";
import { Formatting } from "../const";
import { getBaseDps } from "../utils/dp";
const TYPE_ID = "nacht:base_flag";
const fixBaseZone = (player) => {
    const form = new ActionFormData();
    form.title("拠点範囲を確定していいですか？");
    form.button("はい");
    form.button("いいえ");
    form.show(player).then((response) => {
        if (response.canceled)
            return;
        switch (response.selection) {
            case 0:
                break;
        }
    });
};
const setConfig = (player) => {
    const form = new ModalFormData();
    form.textField("拠点名", "");
    form.toggle("ボーダー表示", { defaultValue: true });
    form.submitButton("設定");
    form.show(player).then((response) => {
        var _a, _b;
        if (response.canceled)
            return;
        const baseName = (_a = response.formValues) === null || _a === void 0 ? void 0 : _a[0];
        const showBorder = (_b = response.formValues) === null || _b === void 0 ? void 0 : _b[1];
    });
};
const changeCoop = (player) => {
    const form = new ModalFormData();
    form.title("同居人を選択してください");
    const candidates = world
        .getAllPlayers()
        .filter((pl) => pl.id !== player.id)
        .map((pl) => pl.nameTag)
        .sort();
    candidates.forEach((nameTag) => form.toggle(nameTag, { defaultValue: false }));
    form.submitButton("決定");
    form.show(player).then((response) => {
        if (response.canceled)
            return;
    });
};
export default () => {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
        var _a, _b, _c, _d, _e;
        if (event.itemStack &&
            event.itemStack.typeId === TYPE_ID &&
            event.isFirstEvent) {
            if (!isInBaseArea(event.player)) {
                event.player.sendMessage(`${Formatting.Color.RED}拠点の旗は拠点エリアでのみ使用可能です。`);
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
            // エリアをまたがないかチェック
            if (canPlace && next) {
                const area2D = get2DAreaFromLoc(next.location, 51);
                if (area2D) {
                    // 他の範囲との競合チェック
                    Object.values(getBaseDps())
                        .filter((baseDp) => baseDp.name !== undefined)
                        .some((baseDp) => {
                        const locations = gatherLocationsWithin({
                            northWest: baseDp.northWest,
                            southEast: offsetLocation(baseDp.northWest, baseDp.edgeSize - 1),
                        });
                        const locationSet = new Set(locations);
                        gatherLocationsWithin(area2D).forEach((val) => locationSet.add(val));
                        return locations.length !== locationSet.size;
                    });
                }
                system.runTimeout(() => {
                    event.block.dimension.spawnEntity(TYPE_ID, next.location, { initialRotation: 180 + event.player.getRotation().y });
                    // パーティクル表示
                }, 1);
            }
        }
    });
    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
        if (event.target.typeId === TYPE_ID) {
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
                        fixBaseZone(event.player);
                        break;
                    case 1:
                        // 設定変更
                        setConfig(event.player);
                        break;
                    case 2:
                        // 同居人登録
                        changeCoop(event.player);
                        break;
                }
            });
        }
    });
};
