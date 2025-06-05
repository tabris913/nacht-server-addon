import { Entity, Player, world } from "@minecraft/server";
import { TAG_OPERATOR } from "../const";

/**
 * オペレーターを取得する。
 *
 * ゲームのオペレーターレベル権限を持つプレイヤーおよび、OP タグが付与されたプレイヤー。
 *
 * @returns オペレータープレイヤーの配列
 */
export const getOperators = () => {
  try {
    return world
      .getAllPlayers()
      .filter((player) => player.isOp() || player.hasTag(TAG_OPERATOR));
  } catch (error) {
    console.error("Failed to get players who have operator-level permissions.");
    console.error(error);

    return [];
  }
};

/**
 * オペレーターにメッセージを送信する
 *
 * @param msg メッセージ
 * @returns 処理の成否を表すフラグ
 */
export const sendMessageToOps = (msg: string) => {
  try {
    getOperators().forEach((op) => op.sendMessage(msg));

    return true;
  } catch (error) {
    console.error("Failed to send message to operators.");
    console.error(error);

    return false;
  }
};

export const PlayerUtils = {};
