import { Entity, world } from "@minecraft/server";

/**
 * スコアを加える
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @param value 値
 * @returns 成否を表すフラグ
 */
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
    console.error(
      `Failed to add ${value} to the ${player.nameTag}'s score named ${scoreName}.`
    );
    console.error(error);

    return false;
  }
};

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
      return world.scoreboard
        .getObjective(scoreName)
        ?.getScore(player.scoreboardIdentity);
    }

    return undefined;
  } catch (error) {
    console.error(
      `Failed to get a value of the ${player.nameTag}'s score named ${scoreName}.`
    );
    console.error(error);

    return undefined;
  }
};

/**
 * スコアをセットする
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @param value 値
 * @returns 成否を表すフラグ
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
    console.error(
      `Failed to set a value to the ${player.nameTag}'s score named ${scoreName}.`
    );
    console.error(error);

    return false;
  }
};

/**
 * スコアをリセットする
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @returns 成否を表すフラグ
 */
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
    console.error(
      `Failed to reset the ${player.nameTag}'s score named ${scoreName}.`
    );
    console.error(error);

    return false;
  }
};
