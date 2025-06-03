import { world } from "@minecraft/server";
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
            const score = (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.getScore(player.scoreboardIdentity);
            return score === undefined ? null : score;
        }
        return null;
    }
    catch (error) {
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
        console.error(error);
        return false;
    }
};
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
        console.error(error);
        return false;
    }
};
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
        console.error(error);
        return false;
    }
};
