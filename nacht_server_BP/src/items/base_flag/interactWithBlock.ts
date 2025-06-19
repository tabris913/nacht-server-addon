import { type Block, Direction, system, world } from '@minecraft/server';
import { MessageFormData } from '@minecraft/server-ui';

import { Formatting } from '../../const';
import { NachtServerAddonEntityTypes, NachtServerAddonItemTypes } from '../../enums';
import { BaseAreaDimensionBlockVolume } from '../../models/BaseAreaDimensionBlockVolume';
import { BaseAreaInfo } from '../../models/location';
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
    try {
      if (event.itemStack === undefined || event.itemStack.typeId !== NachtServerAddonItemTypes.BaseFlag) {
        return;
      }
      if (!event.isFirstEvent) return;
      // オーバーワールドおよびネザーにのみ拠点を作成できる
      if (event.block.dimension.id === MinecraftDimensionTypes.TheEnd) return;

      /**
       * 設置可能フラグ
       *
       * 設置予定のブロックが空気 and 上のブロックも空気
       */
      let canPlace = false;
      /**
       * 設置予定のブロック
       */
      let next: Block | undefined;
      switch (event.blockFace) {
        case Direction.Down:
          break;
        case Direction.East:
          next = event.block.east();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.North:
          next = event.block.north();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.South:
          next = event.block.south();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.Up:
          next = event.block.above();
          if (next?.isAir && event.block.above(2)?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.West:
          next = event.block.west();
          if (next?.isAir && next.above()?.isAir) {
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
      const existingBase = BaseUtils.findByLocation({ ...next.location, dimension: next.dimension });
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
      } else {
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

      system.runTimeout(async () => {
        // 1つしか設置できない
        const baseDp = existingBase || unfixedBase.at(0)!;
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

            const toReplace = await form
              .show(event.player as any)
              .then((response) => {
                if (response.canceled) {
                  Logger.log(`[${event.player.nameTag}] canceled: ${response.cancelationReason}`);
                  return false;
                }

                if (response.selection === 0) return true;

                return false;
              })
              .catch(() => false);

            if (!toReplace) {
              return;
            }
            flagEntity.remove();
          }
        }

        const baseVolume = BaseAreaDimensionBlockVolume.from(
          LocationUtils.generateBlockVolume(next.location, baseDp.edgeSize),
          next.dimension
        );
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

        const entity = event.block.dimension.spawnEntity<NachtServerAddonEntityTypes>(
          NachtServerAddonEntityTypes.BaseFlag,
          next.location,
          { initialPersistence: true, initialRotation: 180 + event.player.getRotation().y }
        );
        world.setDynamicProperty(baseDp.id, JSON.stringify({ ...baseDp, entityId: entity.id } satisfies BaseAreaInfo));
        InventoryUtils.removeItem(event.player, NachtServerAddonItemTypes.BaseFlag, 1);
      }, 1);
    } catch (error) {
      Logger.error(error);
    }
  });
};
