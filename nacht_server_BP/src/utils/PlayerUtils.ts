import { type Entity, Player, PlayerPermissionLevel, type RawMessage, world } from '@minecraft/server';

import { TAG_OPERATOR } from '../const';

import { Logger } from './logger';

/**
 * 与えられたエンティティをプレイヤーに変換する
 *
 * @param entityOrPlayer エンティティまたはプレイヤー
 * @returns 与えられたエンティティと ID が一致するプレイヤー
 */
const convertToPlayer = (entityOrPlayer?: Entity | Player) => {
  try {
    if (entityOrPlayer === undefined) {
      Logger.warning('A given entity/player cannot be converted because it is undefined.');

      return undefined;
    }

    if (entityOrPlayer instanceof Player) {
      Logger.log('A given entity/player is already player.');

      return entityOrPlayer;
    }

    return world
      .getPlayers()
      .filter((player) => player.id === entityOrPlayer.id)
      .at(0);
  } catch (error) {
    Logger.error('Failed to convert a given entity to a player who has the same id because of', error);

    throw error;
  }
};

/**
 * 条件に合うプレイヤーを取得する
 *
 * @param condition 条件
 * @returns
 */
const findPlayer = (condition: { id?: string; nameTag?: string; isValid?: true }) => {
  try {
    return world
      .getPlayers()
      .filter((player) => (condition.id ? player.id === condition.id : true))
      .filter((player) => (condition.nameTag ? player.nameTag === condition.nameTag : true))
      .filter((player) => (condition.isValid ? player.isValid : true))
      .at(0);
  } catch (error) {
    Logger.error('Failed to get player because of', error);

    throw error;
  }
};

/**
 * (ログイン中の) オペレーターを取得する。
 *
 * ゲームのオペレーターレベル権限を持つプレイヤーおよび、OP タグが付与されたプレイヤー。
 *
 * @returns オペレータープレイヤーの配列
 */
const getOperators = () => {
  try {
    return world.getPlayers().filter((player) => isOperator(player));
  } catch (error) {
    Logger.warning('Failed to get players who have operator-level permissions because of', error);

    throw error;
  }
};

/**
 * プレイヤーがオペレーターであるか判別する
 *
 * @param player プレイヤー
 * @returns
 */
const isOperator = (player: Player) =>
  player.playerPermissionLevel === PlayerPermissionLevel.Operator || player.hasTag(TAG_OPERATOR);

/**
 * オペレーターにメッセージを送信する
 *
 * @param message メッセージ
 */
const sendMessageToOps = (message: Array<RawMessage | string> | RawMessage | string) => {
  try {
    getOperators().forEach((op) => op.sendMessage(message));
  } catch (error) {
    Logger.error('Failed to send message to operators because of', error);

    throw error;
  }
};

/**
 * プレイヤーがオペレーターの場合のみメッセージを通知する
 *
 * @param player プレイヤー
 * @param message メッセージ
 */
const sendMessageToOpPlayer = (player: Player, message: Array<RawMessage | string> | RawMessage | string) => {
  try {
    if (isOperator(player)) {
      player.sendMessage(message);
    }
  } catch (error) {
    Logger.error(`Failed to send message to the player ${player.nameTag} because of`, error);

    throw error;
  }
};

export default { convertToPlayer, findPlayer, getOperators, isOperator, sendMessageToOps, sendMessageToOpPlayer };
