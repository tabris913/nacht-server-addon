import { type Player, system, TicksPerSecond, world } from '@minecraft/server';

import { RuleName } from '../commands/enum';
import { Formatting, LOC_ERSTE, PREFIX_GAMERULE, TAG_AREA_BASE, TAG_AREA_EXPL, TAG_AREA_TOWN } from '../const';
import { MinecraftDimensionTypes } from '../types/index';
import AreaUtils from '../utils/AreaUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

const tagAreaAlert1 = 'ALERT_AREA1'; // アラート1回目
const tagAreaAlert2 = 'ALERT_AREA2'; // アラート2回目 (5秒後)
const tagAreaAlertTimeout = 'ALERT_TIMEOUT';

const COMMON_MSG_A1 = `${Formatting.Color.GOLD}20秒以内に元のエリアに戻らないと${Formatting.Color.DARK_PURPLE}Erste${Formatting.Color.GOLD}に強制テレポートされます`;
const COMMON_MSG_A2 = `${Formatting.Color.GOLD}10秒以内に元のエリアに戻らないと${Formatting.Color.DARK_PURPLE}Erste${Formatting.Color.GOLD}に強制テレポートされます`;

type Area = 'town' | 'base' | 'expr';

const getAreaName = (area: Area) => {
  switch (area) {
    case 'town':
      return '街エリア';
    case 'base':
      return '拠点エリア';
    case 'expr':
      return '探索エリア';
  }
};

const getAreaTag = (area: Area) => {
  switch (area) {
    case 'town':
      return TAG_AREA_TOWN;
    case 'base':
      return TAG_AREA_BASE;
    case 'expr':
      return TAG_AREA_EXPL;
  }
};

const getCallback = (area: Area) => {
  switch (area) {
    case 'town':
      return AreaUtils.existsInTownArea;
    case 'base':
      return AreaUtils.existsInBaseArea;
    case 'expr':
      return AreaUtils.existsInExploringArea;
  }
};

const getCallback2 = (area: Area) => {
  switch (area) {
    case 'town':
      return null;
    case 'base':
      return AreaUtils.existsInExploringArea;
    case 'expr':
      return AreaUtils.existsInBaseArea;
  }
};

/**
 * エリア違反したプレイヤーを所定の場所に転移させる
 *
 * @param player プレイヤー
 * @param tag 削除するタグ
 */
const tp = (player: Player, tag: string) => {
  // ブロックが存在するので転移可能
  // 先に違反タグを除去
  [tagAreaAlert2, tagAreaAlertTimeout, tag].forEach((t) => player.removeTag(t));
  player.addTag(TAG_AREA_TOWN);
  // ブロックの1マス上に転移
  player.teleport(LOC_ERSTE, {
    dimension: world.getDimension(MinecraftDimensionTypes.Overworld),
  });
  Logger.log(`teleported ${player.name} to Erste[-10 63 0]`);
};

/**
 * プレイヤーのエリア違反をチェックする
 *
 * @param area エリア種別
 */
const checkPlayers = async (area: Area) => {
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
          PlayerUtils.sendMessageToOps(`${player.name} が${areaName}に戻りました`);
        });

      continue;
    }
    if (!player.hasTag(tagAreaAlert1) && !player.hasTag(tagAreaAlert2)) {
      // 違反タグなし --> 初検出 --> 20 秒猶予を与える (10 秒後に警告)
      PlayerUtils.sendMessageToOps(
        `${Formatting.Color.GOLD}${player.name} が${areaName}から脱走しました${Formatting.Reset}`
      );
      player.addTag(tagAreaAlert1);
      player.sendMessage(msg);
      player.sendMessage(COMMON_MSG_A1);
      system.runTimeout(() => {
        player.addTag(tagAreaAlertTimeout);
      }, TicksPerSecond * 10);
    } else if (player.hasTag(tagAreaAlert1) && player.hasTag(tagAreaAlertTimeout)) {
      // 違反タグ1あり --> 二回目の検出 --> 10 秒猶予を与える
      player.addTag(tagAreaAlert2);
      player.removeTag(tagAreaAlertTimeout);
      player.removeTag(tagAreaAlert1);
      player.sendMessage(msg);
      player.sendMessage(COMMON_MSG_A2);
      system.runTimeout(() => {
        player.addTag(tagAreaAlertTimeout);
      }, TicksPerSecond * 10);
    } else if (player.hasTag(tagAreaAlert2) && player.hasTag(tagAreaAlertTimeout)) {
      // 違反タグ2あり --> 三回目の検出 --> 転移させる
      if (isInWrongArea) {
        // town 以外
        PlayerUtils.sendMessageToOps(`所定の時間内に ${player.name} が${areaName}に戻らなかったため、転移させます`);
        if (isInWrongArea(player)) {
          // 対称エリアにいる場合
          tp(player, areaTag);
        } else if (AreaUtils.existsInTownArea(player)) {
          tp(player, areaTag);
        }
      }
    }
  }
};

export default () => {
  system.runTimeout(() => {
    // 範囲チェック
    const watchCrossingAreaInterval = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingAreaInterval) as
      | number
      | undefined;

    system.runInterval(
      async () => {
        if (world.getDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingArea)) {
          // 街エリアから外に出ることは基本的にありえない
          // checkPlayers('town');
          checkPlayers('base');
          checkPlayers('expr');
        }
      },
      watchCrossingAreaInterval || TicksPerSecond / 5
    );
  }, 1);
};
