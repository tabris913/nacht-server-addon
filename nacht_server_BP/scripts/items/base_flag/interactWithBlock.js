var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Direction, system, world } from '@minecraft/server';
import { MessageFormData } from '@minecraft/server-ui';
import { Formatting } from '../../const';
import { NachtServerAddonEntityTypes, NachtServerAddonItemTypes } from '../../enums';
import { BaseAreaDimensionBlockVolume } from '../../models/BaseAreaDimensionBlockVolume';
import { MinecraftDimensionTypes } from '../../types/index';
import AreaUtils from '../../utils/AreaUtils';
import BaseUtils from '../../utils/BaseUtils';
import InventoryUtils from '../../utils/InventoryUtils';
import LocationUtils from '../../utils/LocationUtils';
import { Logger } from '../../utils/logger';
import { isFixedBase } from '../../utils/TypeGuards';
// ----------------------------------------------------------------------------
// インタラクトイベント(ブロック)
//
// - 設置
// ----------------------------------------------------------------------------
export default () => {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
        var _a, _b, _c, _d, _e;
        try {
            if (event.itemStack === undefined || event.itemStack.typeId !== NachtServerAddonItemTypes.BaseFlag) {
                return;
            }
            if (!event.isFirstEvent)
                return;
            // オーバーワールドおよびネザーにのみ拠点を作成できる
            if (event.block.dimension.id === MinecraftDimensionTypes.TheEnd)
                return;
            /**
             * 設置可能フラグ
             *
             * 設置予定のブロックが空気 and 上のブロックも空気
             */
            let canPlace = false;
            /**
             * 設置予定のブロック
             */
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
            if (!canPlace || next === undefined) {
                // 設置不可能
                return;
            }
            /**
             * 設置ブロックを含む既存拠点
             */
            const existingBase = BaseUtils.findByLocation(Object.assign(Object.assign({}, next.location), { dimension: next.dimension }));
            /**
             * プレイヤーの未確定拠点
             */
            const unfixedBase = BaseUtils.retrieveBases(event.player.nameTag).filter((dp) => !isFixedBase(dp));
            // 既存の拠点内には設置できない
            if (existingBase !== undefined) {
                // 既存の拠点内である
                if (existingBase.owner !== event.player.nameTag || existingBase.entityId !== undefined) {
                    // 自分の拠点ではない、あるいは既に旗が設置済
                    event.player.sendMessage('拠点には置けません。');
                    return;
                }
            }
            else {
                // 既存の拠点内ではない=新規拠点の場合は、購入履歴がないと設置できない
                if (unfixedBase.length === 0) {
                    event.player.sendMessage([
                        Formatting.Color.RED,
                        { translate: 'items.base_flag.name' },
                        'の購入履歴がありません。',
                    ]);
                    return;
                }
            }
            // 拠点エリアにしか設置できない
            if (!AreaUtils.existsInBaseArea(next)) {
                event.player.sendMessage([
                    Formatting.Color.RED,
                    { translate: 'items.base_flag.name' },
                    'は拠点エリアでのみ使用可能です。',
                ]);
                return;
            }
            system.runTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                // 1つしか設置できない
                const baseDp = existingBase || unfixedBase.at(0);
                if (baseDp.entityId !== undefined) {
                    // 旗設置済み
                    const flagEntity = world.getEntity(baseDp.entityId);
                    if (flagEntity) {
                        // event.player.sendMessage([
                        //   Formatting.Color.RED,
                        //   { translate: "items.base_flag.name" },
                        //   "は1つしか設置できません。",
                        // ]);
                        const form = new MessageFormData();
                        form.body({
                            rawtext: [{ translate: 'items.base_flag.name' }, { text: 'は1つしか設置できません。移動させますか？' }],
                        });
                        form.button1('はい');
                        form.button2('いいえ');
                        const toReplace = yield form
                            .show(event.player)
                            .then((response) => {
                            if (response.canceled) {
                                Logger.log(`[${event.player.nameTag}] canceled: ${response.cancelationReason}`);
                                return false;
                            }
                            if (response.selection === 0)
                                return true;
                            return false;
                        })
                            .catch(() => false);
                        if (!toReplace) {
                            return;
                        }
                        flagEntity.remove();
                    }
                }
                const baseVolume = BaseAreaDimensionBlockVolume.from(LocationUtils.generateBlockVolume(next.location, baseDp.edgeSize), next.dimension);
                // 既存の拠点と重複していると確定できない
                if (BaseUtils.hasOverlappingBlocks(baseVolume)) {
                    // 拠点範囲が他の拠点と重複
                    if (!(baseDp.entityId === undefined && baseDp.owner === event.player.nameTag)) {
                        // 旗未設置かつ自分の拠点範囲内
                        event.player.sendMessage(`${Formatting.Color.RED}既存の拠点と範囲が重なっています。`);
                        return;
                    }
                }
                // 拠点エリアの外に範囲が及ぶ場合は確定できない
                if (AreaUtils.isOutOfBaseArea(baseVolume)) {
                    event.player.sendMessage(`${Formatting.Color.RED}拠点エリアの範囲外に拠点はつくれません。`);
                    return;
                }
                const entity = event.block.dimension.spawnEntity(NachtServerAddonEntityTypes.BaseFlag, next.location, { initialPersistence: true, initialRotation: 180 + event.player.getRotation().y });
                world.setDynamicProperty(baseDp.id, JSON.stringify(Object.assign(Object.assign({}, baseDp), { entityId: entity.id })));
                InventoryUtils.removeItem(event.player, NachtServerAddonItemTypes.BaseFlag, 1);
            }), 1);
        }
        catch (error) {
            Logger.error(error);
        }
    });
};
