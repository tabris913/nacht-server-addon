import { system, world, TicksPerSecond, Player } from "@minecraft/server";
import { isInBaseArea, isInExploringArea, isInTownArea } from "../utils/area";
import { sendMessageToOps } from "../utils/player";
import { Formatting, LOC_ERSTE } from "../const";

const tagTownArea = "AREA_TOWN"; // 街エリアにいる
const tagExploreArea = "AREA_EXP"; // 探索エリアにいる
const tagBaseArea = "AREA_BASE"; // 拠点エリアにいる
const tagAreaAlert1 = "ALERT_AREA1"; // アラート1回目
const tagAreaAlert2 = "ALERT_AREA2"; // アラート2回目 (5秒後)
const tagAreaAlertTimeout = "ALERT_TIMEOUT";

const COMMON_MSG_A1 = `${Formatting.Color.GOLD}20秒以内に元のエリアに戻らないと${Formatting.Color.DARK_PURPLE}Erste${Formatting.Color.GOLD}に強制テレポートされます`;
const COMMON_MSG_A2 = `${Formatting.Color.GOLD}10秒以内に元のエリアに戻らないと${Formatting.Color.DARK_PURPLE}Erste${Formatting.Color.GOLD}に強制テレポートされます`;

type Area = "town" | "base" | "expr";

const getAreaName = (area: Area) => {
  switch (area) {
    case "town":
      return "街エリア";
    case "base":
      return "拠点エリア";
    case "expr":
      return "探索エリア";
  }
};

const getAreaTag = (area: Area) => {
  switch (area) {
    case "town":
      return tagTownArea;
    case "base":
      return tagBaseArea;
    case "expr":
      return tagExploreArea;
  }
};

const getCallback = (area: Area) => {
  switch (area) {
    case "town":
      return isInTownArea;
    case "base":
      return isInBaseArea;
    case "expr":
      return isInExploringArea;
  }
};

const getCallback2 = (area: Area) => {
  switch (area) {
    case "town":
      return null;
    case "base":
      return isInExploringArea;
    case "expr":
      return isInBaseArea;
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
  player.addTag(tagTownArea);
  // ブロックの1マス上に転移
  player.teleport(LOC_ERSTE, { dimension: world.getDimension("overworld") });
  console.log(`teleported ${player.name} to Erste[-10 63 0]`);
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
          sendMessageToOps(`${player.name} が${areaName}に戻りました`);
        });

      continue;
    }
    if (!player.hasTag(tagAreaAlert1) && !player.hasTag(tagAreaAlert2)) {
      // 違反タグなし --> 初検出 --> 20 秒猶予を与える (10 秒後に警告)
      sendMessageToOps(
        `${Formatting.Color.GOLD}${player.name} が${areaName}から脱走しました${Formatting.Reset}`
      );
      player.addTag(tagAreaAlert1);
      player.sendMessage(msg);
      player.sendMessage(COMMON_MSG_A1);
      system.runTimeout(() => {
        player.addTag(tagAreaAlertTimeout);
      }, TicksPerSecond * 10);
    } else if (
      player.hasTag(tagAreaAlert1) &&
      player.hasTag(tagAreaAlertTimeout)
    ) {
      // 違反タグ1あり --> 二回目の検出 --> 10 秒猶予を与える
      player.addTag(tagAreaAlert2);
      player.removeTag(tagAreaAlertTimeout);
      player.removeTag(tagAreaAlert1);
      player.sendMessage(msg);
      player.sendMessage(COMMON_MSG_A2);
      system.runTimeout(() => {
        player.addTag(tagAreaAlertTimeout);
      }, TicksPerSecond * 10);
    } else if (
      player.hasTag(tagAreaAlert2) &&
      player.hasTag(tagAreaAlertTimeout)
    ) {
      // 違反タグ2あり --> 三回目の検出 --> 転移させる
      if (isInWrongArea) {
        // town 以外
        sendMessageToOps(
          `所定の時間内に ${player.name} が${areaName}に戻らなかったため、転移させます`
        );
        if (isInWrongArea(player)) {
          // 対称エリアにいる場合
          tp(player, areaTag);
        } else if (isInTownArea(player)) {
          tp(player, areaTag);
        }
      }
    }
  }
};

export default () =>
  system.runInterval(async () => {
    // 街エリアから外に出ることは基本的にありえない
    // checkPlayers('town');
    checkPlayers("base");
    checkPlayers("expr");
  }, TicksPerSecond / 5);
