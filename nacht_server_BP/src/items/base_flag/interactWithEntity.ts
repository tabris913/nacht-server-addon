import {
  PlayerPermissionLevel,
  system,
  world,
  type Entity,
  type Player,
  type PlayerInteractWithEntityBeforeEvent,
} from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';

import { Formatting, TAG_OPERATOR } from '../../const';
import { NachtServerAddonEntityTypes, NachtServerAddonItemTypes } from '../../enums';
import teleportLogic from '../../logic/teleportLogic';
import { BaseAreaDimensionBlockVolume } from '../../models/BaseAreaDimensionBlockVolume';
import { MinecraftDimensionTypes } from '../../types/index';
import AreaUtils from '../../utils/AreaUtils';
import BaseUtils from '../../utils/BaseUtils';
import InventoryUtils from '../../utils/InventoryUtils';
import LocationUtils from '../../utils/LocationUtils';
import { Logger } from '../../utils/logger';

import type { BaseAreaInfo, FixedBaseAreaInfo } from '../../models/location';

/**
 * 同居人を設定する
 *
 * @param player
 * @param dp
 */
const changeCoop = (player: Player, dp: BaseAreaInfo) => {
  const form = new ModalFormData();
  form.title('協力者を選択してください');
  const candidates = world
    .getPlayers()
    .filter(
      (pl) =>
        pl.id !== player.id && pl.playerPermissionLevel !== PlayerPermissionLevel.Operator && !pl.hasTag(TAG_OPERATOR)
    )
    .map((pl) => pl.nameTag)
    .sort();
  if (candidates.length === 0) {
    player.sendMessage('協力者として設定可能なプレイヤーが見つかりませんでした。');

    return;
  }
  candidates.forEach((nameTag) => form.toggle(nameTag, { defaultValue: dp.participants.includes(nameTag) }));
  form.submitButton('決定');

  form.show(player as any).then((response) => {
    if (response.canceled) {
      Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
      return;
    }

    const c = response.formValues?.map((value, index) => (value ? candidates[index] : undefined));

    world.setDynamicProperty(dp.id, JSON.stringify({ ...dp, participants: c }));
  });
};

/**
 * 拠点範囲を確定する
 *
 * @param player
 * @param dp
 */
const fixBaseZone = (player: Player, flag: Entity, dp: BaseAreaInfo) => {
  if (dp.entityId === undefined) {
    player.sendMessage({});

    return;
  }
  if (dp.name === undefined) {
    player.sendMessage(`${Formatting.Color.GOLD}先に拠点名を設定してください。確定後でも変更可能です。`);

    return;
  }
  const baseVolume = BaseAreaDimensionBlockVolume.from(
    LocationUtils.generateBlockVolume(flag.location, dp.edgeSize),
    flag.dimension
  );
  if (BaseUtils.hasOverlappingBlocks(baseVolume)) {
    // 重複あり
    player.sendMessage(`${Formatting.Color.RED}既存の拠点と範囲が重なっています。`);

    return;
  }
  if (AreaUtils.isOutOfBaseArea(baseVolume)) {
    player.sendMessage(`${Formatting.Color.RED}拠点エリアの範囲外に拠点はつくれません。`);

    return;
  }

  const form = new MessageFormData();
  form.body('拠点範囲を確定していいですか？');
  form.button1('はい');
  form.button2('いいえ');

  form.show(player as any).then((response) => {
    if (response.canceled) {
      Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
      return;
    }

    if (response.selection === 0) {
      world.setDynamicProperty(
        dp.id,
        JSON.stringify({
          ...dp,
          dimension: flag.dimension.id as MinecraftDimensionTypes,
          fixed: true,
          name: dp.name!,
          northWest: {
            x: flag.location.x - (dp.edgeSize - 1) / 2,
            z: flag.location.z - (dp.edgeSize - 1) / 2,
          },
        } satisfies FixedBaseAreaInfo)
      );
      player.sendMessage(`${dp.name}の拠点範囲を確定しました。`);
    }
  });
};

/**
 * 拠点の設定を変更する
 *
 * @param player
 * @param dp
 */
const setConfig = (player: Player, dp: BaseAreaInfo) => {
  const form = new ModalFormData();
  form.textField('拠点名', '', { defaultValue: dp.name });
  form.toggle('ボーダー表示', { defaultValue: dp.showBorder });
  form.submitButton('設定');

  form
    .show(player as any)
    .then((response) => {
      if (response.canceled) {
        Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
        return;
      }

      const baseName = response.formValues?.[0] as string;
      const showBorder = response.formValues?.[1] as boolean;

      if (baseName.length === 0) {
        player.sendMessage(`${Formatting.Color.GOLD}拠点名が設定されていません。`);

        return;
      }

      world.setDynamicProperty(dp.id, JSON.stringify({ ...dp, name: baseName, showBorder }));
    })
    .catch((error) => {
      throw error;
    });
};

/**
 * 拠点範囲を解放する
 *
 * @param player
 * @param dp
 */
const releaseBaseZone = (player: Player, dp: BaseAreaInfo) => {
  const form = new MessageFormData();
  form.body('拠点を解放していいですか？');
  form.button1('はい');
  form.button2('いいえ');

  form.show(player as any).then((response) => {
    if (response.canceled) {
      Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
      return;
    }

    if (response.selection === 0) {
      world.setDynamicProperty(dp.id, JSON.stringify({ ...dp, fixed: false } satisfies BaseAreaInfo));
      player.sendMessage(`${dp.name}の拠点範囲を解放しました。`);
    }
  });
};

/**
 * 別のプレイヤーの旗をインタラクト
 *
 * @param base
 * @param eventPlayer
 */
const nonOwnerEvent = (base: BaseAreaInfo, eventPlayer: Player) => {
  // 別の人の旗をインタラクトすると登録ダイアログ
  const form = new MessageFormData();
  form.body({
    rawtext: [{ text: `${base.name}を` }, { translate: 'items.nacht_feather.name' }, { text: 'に登録しますか?' }],
  });
  form.button1('はい');
  form.button2('いいえ');

  system.run(() =>
    form
      .show(eventPlayer as any)
      .then((response) => {
        if (response.canceled) {
          Logger.log(`[${eventPlayer.nameTag}] canceled: ${response.cancelationReason}`);
          return;
        }

        if (response.selection === 0) {
          teleportLogic.registerTeleportTarget(eventPlayer, `${base.owner}_${base.index}`, base.name || '');
        }
      })
      .catch(() => null)
  );
};

const ownerEvent = (base: BaseAreaInfo, event: PlayerInteractWithEntityBeforeEvent) => {
  const form = new ActionFormData();
  form.button(base.fixed ? '拠点を廃止する' : '範囲を確定する');
  form.button('拠点の設定を変更する');
  form.button('協力者を登録する');
  form.button('アイテム化する');
  form.label('※アイテム化すると転移先が解除されます');
  form.button('転移先に登録する');

  system.run(() =>
    form.show(event.player as any).then((response) => {
      if (response.canceled) {
        Logger.log(`[${event.player.nameTag}] canceled: ${response.cancelationReason}`);
        return;
      }
      switch (response.selection) {
        case 0:
          // 範囲確定
          if (base.fixed) {
            releaseBaseZone(event.player, base);
          } else {
            fixBaseZone(event.player, event.target, base);
          }
          break;
        case 1:
          // 設定変更
          setConfig(event.player, base);
          break;
        case 2:
          // 同居人登録
          changeCoop(event.player, base);
          break;
        case 3:
          // アイテム化
          event.target.remove();
          world.setDynamicProperty(base.id, JSON.stringify({ ...base, entityId: undefined } satisfies BaseAreaInfo));
          BaseUtils.removeFromTeleportTargets(base);
          if (!InventoryUtils.hasItem(event.player, NachtServerAddonItemTypes.BaseFlag)) {
            InventoryUtils.giveItem(event.player, NachtServerAddonItemTypes.BaseFlag, 1);
          }
          break;
        case 5:
          // 登録
          teleportLogic.registerTeleportTarget(event.player, `${base.owner}_${base.index}`, base.name || '');
          break;
      }
    })
  );
};

export default () => {
  /**
   * playerInteractWithEntity の beforeEvent
   */
  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    try {
      if (event.target.typeId !== NachtServerAddonEntityTypes.BaseFlag) return;
      if (event.itemStack?.typeId === NachtServerAddonItemTypes.NachtFeather) return;

      const base = BaseUtils.findByEntityId(event.target.id);
      if (base === undefined) {
        // 未登録
        event.player.sendMessage(`${Formatting.Color.RED}拠点登録されていません。`);

        return;
      }
      if (base.owner !== event.player.nameTag) {
        // 別の人の旗をインタラクトすると登録ダイアログ
        nonOwnerEvent(base, event.player);
      } else {
        ownerEvent(base, event);
      }
    } catch (error) {
      Logger.error(error);
    }
  });
};
