import { world } from "@minecraft/server";
import { Logger } from "./logger";
/**
 * スコアを加える
 *
 * @param playerEntity プレイヤー
 * @param scoreName スコア名
 * @param value 値
 * @returns 成否を表すフラグ
 */
export const addScore = (playerEntity, scoreName, value) => {
    var _a;
    try {
        if (playerEntity.scoreboardIdentity) {
            (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.addScore(playerEntity.scoreboardIdentity, value);
            return true;
        }
        return false;
    }
    catch (error) {
        Logger.error(`${playerEntity.nameTag} failed to add ${value} to the score named ${scoreName}.`);
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
const enableScoreboardIfDisabled = (player, scoreName, defaultValue = 0) => {
    try {
        const score = ScoreboardUtils.getScore(player, scoreName);
        if (score === undefined) {
            Logger.warning(`${player.nameTag}'s scoreboard named ${scoreName} was disabled.`);
            ScoreboardUtils.setScore(player, scoreName, defaultValue);
            player.sendMessage(`スコアボード${scoreName}が有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`);
        }
    }
    catch (error) {
        Logger.error(`${player.nameTag} failed to enable scoreboard ${scoreName}.`);
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
const getScore = (playerEntity, scoreName) => {
    var _a;
    try {
        if (playerEntity.scoreboardIdentity) {
            return (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.getScore(playerEntity.scoreboardIdentity);
        }
        return undefined;
    }
    catch (error) {
        Logger.error(`${playerEntity.nameTag} failed to get a value of the score named ${scoreName}.`);
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
const getScoreOrEnable = (player, scoreName, defaultValue = 0) => {
    try {
        const score = ScoreboardUtils.getScore(player, scoreName);
        if (score === undefined) {
            Logger.warning(`${player.nameTag}'s scoreboard named ${scoreName} was disabled.`);
            ScoreboardUtils.setScore(player, scoreName, defaultValue);
            player.sendMessage(`スコアボード${scoreName}が有効になっていませんでした。もう一度試しても継続する場合はオペレーターにご連絡ください`);
        }
        return score || defaultValue;
    }
    catch (error) {
        Logger.error(`${player.nameTag} failed to enable scoreboard ${scoreName}.`);
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
const setScore = (playerEntity, scoreName, value) => {
    var _a;
    try {
        if (playerEntity.scoreboardIdentity) {
            (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.setScore(playerEntity.scoreboardIdentity, value);
            return true;
        }
        return false;
    }
    catch (error) {
        Logger.error(`${playerEntity.nameTag} failed to set a value to the score named ${scoreName}.`);
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
export const resetScore = (playerEntity, scoreName) => {
    var _a;
    try {
        if (playerEntity.scoreboardIdentity) {
            (_a = world.scoreboard
                .getObjective(scoreName)) === null || _a === void 0 ? void 0 : _a.removeParticipant(playerEntity.scoreboardIdentity);
            return true;
        }
        return false;
    }
    catch (error) {
        Logger.error(`${playerEntity.nameTag} failed to reset the score named ${scoreName}.`);
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
