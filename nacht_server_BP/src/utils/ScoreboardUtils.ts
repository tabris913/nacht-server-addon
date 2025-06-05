import { type Entity, type Player, world } from "@minecraft/server";

/**
 * スコアを加える
 *
 * @param playerEntity プレイヤー
 * @param scoreName スコア名
 * @param value 値
 * @returns 成否を表すフラグ
 */
export const addScore = (
  playerEntity: Entity,
  scoreName: string,
  value: number
) => {
  try {
    if (playerEntity.scoreboardIdentity) {
      world.scoreboard
        .getObjective(scoreName)
        ?.addScore(playerEntity.scoreboardIdentity, value);

      return true;
    }

    return false;
  } catch (error) {
    console.error(
      `${playerEntity.nameTag} failed to add ${value} to the score named ${scoreName}.`
    );

    return false;
  }
};

/**
 * 指定したスコアボードが無効の場合は有効にする
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @param defaultValue デフォルト値
 */
const enableScoreboardIfDisabled = (
  player: Player,
  scoreName: string,
  defaultValue: number = 0
) => {
  try {
    const score = ScoreboardUtils.getScore(player, scoreName);

    if (score === undefined) {
      console.warn(
        `${player.nameTag}'s scoreboard named ${scoreName} was disabled.`
      );
      ScoreboardUtils.setScore(player, scoreName, defaultValue);

      player.sendMessage(
        `スコアボード${scoreName}が有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`
      );
    }
  } catch (error) {
    console.error(
      `${player.nameTag} failed to enable scoreboard ${scoreName}.`
    );

    throw error;
  }
};

/**
 * スコアを取得する
 *
 * @param playerEntity プレイヤー
 * @param scoreName スコア名
 * @returns スコアの値
 */
const getScore = (playerEntity: Entity, scoreName: string) => {
  try {
    if (playerEntity.scoreboardIdentity) {
      return world.scoreboard
        .getObjective(scoreName)
        ?.getScore(playerEntity.scoreboardIdentity);
    }

    return undefined;
  } catch (error) {
    console.error(
      `${playerEntity.nameTag} failed to get a value of the score named ${scoreName}.`
    );

    return undefined;
  }
};

/**
 * スコアを取得するが、無効の場合は有効化する
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @param defaultValue デフォルト値
 * @returns
 */
const getScoreOrEnable = (
  player: Player,
  scoreName: string,
  defaultValue: number = 0
) => {
  try {
    const score = ScoreboardUtils.getScore(player, scoreName);

    if (score === undefined) {
      console.warn(
        `${player.nameTag}'s scoreboard named ${scoreName} was disabled.`
      );
      ScoreboardUtils.setScore(player, scoreName, defaultValue);

      player.sendMessage(
        `スコアボード${scoreName}が有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`
      );
    }

    return score || defaultValue;
  } catch (error) {
    console.error(
      `${player.nameTag} failed to enable scoreboard ${scoreName}.`
    );

    throw error;
  }
};

/**
 * スコアをセットする
 *
 * @param playerEntity プレイヤー
 * @param scoreName スコア名
 * @param value 値
 * @returns 成否を表すフラグ
 */
const setScore = (playerEntity: Entity, scoreName: string, value: number) => {
  try {
    if (playerEntity.scoreboardIdentity) {
      world.scoreboard
        .getObjective(scoreName)
        ?.setScore(playerEntity.scoreboardIdentity, value);

      return true;
    }

    return false;
  } catch (error) {
    console.error(
      `${playerEntity.nameTag} failed to set a value to the score named ${scoreName}.`
    );

    return false;
  }
};

/**
 * スコアをリセットする
 *
 * @param playerEntity プレイヤー
 * @param scoreName スコア名
 * @returns 成否を表すフラグ
 */
export const resetScore = (playerEntity: Entity, scoreName: string) => {
  try {
    if (playerEntity.scoreboardIdentity) {
      world.scoreboard
        .getObjective(scoreName)
        ?.removeParticipant(playerEntity.scoreboardIdentity);

      return true;
    }

    return false;
  } catch (error) {
    console.error(
      `${playerEntity.nameTag} failed to reset the score named ${scoreName}.`
    );

    return false;
  }
};

const ScoreboardUtils = {
  addScore,
  enableScoreboardIfDisabled,
  getScore,
  getScoreOrEnable,
  setScore,
  resetScore,
};

export default ScoreboardUtils;
