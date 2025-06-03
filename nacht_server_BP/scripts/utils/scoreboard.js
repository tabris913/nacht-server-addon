import { world } from "@minecraft/server";
/**
 * スコアを加える
 *
 * @param player プレイヤー
 * @param scoreName スコア名
 * @param value 値
 * @returns 成否を表すフラグ
 */
export const addScore = (player, scoreName, value) => {
    var _a;
    try {
        if (player.scoreboardIdentity) {
            (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.addScore(player.scoreboardIdentity, value);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`Failed to add ${value} to the ${player.nameTag}'s score named ${scoreName}.`);
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
export const getScore = (player, scoreName) => {
    var _a;
    try {
        if (player.scoreboardIdentity) {
            return (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.getScore(player.scoreboardIdentity);
        }
        return undefined;
    }
    catch (error) {
        console.error(`Failed to get a value of the ${player.nameTag}'s score named ${scoreName}.`);
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
export const setScore = (player, scoreName, value) => {
    var _a;
    try {
        if (player.scoreboardIdentity) {
            (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.setScore(player.scoreboardIdentity, value);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`Failed to set a value to the ${player.nameTag}'s score named ${scoreName}.`);
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
export const resetScore = (player, scoreName) => {
    var _a;
    try {
        if (player.scoreboardIdentity) {
            (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.removeParticipant(player.scoreboardIdentity);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`Failed to reset the ${player.nameTag}'s score named ${scoreName}.`);
        console.error(error);
        return false;
    }
};
