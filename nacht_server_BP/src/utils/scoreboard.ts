import { Entity, world } from "@minecraft/server";

/**
 * スコアを取得する
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @returns
 */
export const getScore = (player: Entity, scoreName: string) => {
  try {
    if (player.scoreboardIdentity) {
      const score = world.scoreboard
        .getObjective(scoreName)
        ?.getScore(player.scoreboardIdentity);

      return score === undefined ? null : score;
    }

    return null;
  } catch (error) {
    console.error(error);

    return null;
  }
};

/**
 *
 * @param player
 * @param scoreName
 * @param value
 * @returns 成功フラグ
 */
export const setScore = (player: Entity, scoreName: string, value: number) => {
  try {
    if (player.scoreboardIdentity) {
      world.scoreboard
        .getObjective(scoreName)
        ?.setScore(player.scoreboardIdentity, value);

      return true;
    }

    return false;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export const addScore = (player: Entity, scoreName: string, value: number) => {
  try {
    if (player.scoreboardIdentity) {
      world.scoreboard
        .getObjective(scoreName)
        ?.addScore(player.scoreboardIdentity, value);

      return true;
    }

    return false;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export const resetScore = (player: Entity, scoreName: string) => {
  try {
    if (player.scoreboardIdentity) {
      world.scoreboard
        .getObjective(scoreName)
        ?.removeParticipant(player.scoreboardIdentity);

      return true;
    }

    return false;
  } catch (error) {
    console.error(error);

    return false;
  }
};
