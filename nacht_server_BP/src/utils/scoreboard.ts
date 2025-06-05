import { Entity, Player, world } from "@minecraft/server";

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
