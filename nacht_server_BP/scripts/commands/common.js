import { CustomCommandSource, CustomCommandStatus, } from "@minecraft/server";
import { NachtServerAddonError } from "../errors/base";
/**
 * 共通エラー処理を組み込んだカスタムコマンド登録
 *
 * @param customCommand カスタムコマンド情報
 * @param callback コマンドが実行されたときにトリガーされるコールバック
 * @returns
 */
export const registerCommand = (customCommand, callback) => (arg0) => {
    try {
        arg0.customCommandRegistry.registerCommand(customCommand, (origin, ...args) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            let sourceName;
            try {
                switch (origin.sourceType) {
                    case CustomCommandSource.Block:
                        sourceName = `CommandBlock(${(_a = origin.sourceBlock) === null || _a === void 0 ? void 0 : _a.x},${(_b = origin.sourceBlock) === null || _b === void 0 ? void 0 : _b.y},${(_c = origin.sourceBlock) === null || _c === void 0 ? void 0 : _c.z})`;
                        break;
                    case CustomCommandSource.Server:
                        sourceName = "Server";
                        break;
                    case CustomCommandSource.NPCDialogue:
                        sourceName = `NPC(${(_d = origin.sourceEntity) === null || _d === void 0 ? void 0 : _d.nameTag}/${(_e = origin.sourceEntity) === null || _e === void 0 ? void 0 : _e.location.x},${(_f = origin.sourceEntity) === null || _f === void 0 ? void 0 : _f.location.y},${(_g = origin.sourceEntity) === null || _g === void 0 ? void 0 : _g.location.z})`;
                        break;
                    case CustomCommandSource.Entity:
                        sourceName = (_h = origin.sourceEntity) === null || _h === void 0 ? void 0 : _h.nameTag;
                        break;
                }
            }
            catch (error) {
                console.warn("Failed to get source name because of", error);
                sourceName = "undefined";
            }
            try {
                console.log(`[start] ${sourceName} ran command: ${customCommand.name} ${args
                    .map((arg) => JSON.stringify(arg))
                    .join(" ")}`);
                return callback(origin, ...args);
            }
            catch (error) {
                let message = "予期せぬエラーが発生しました。";
                if (error instanceof NachtServerAddonError) {
                    switch (error.logLevel) {
                        case "warning":
                            console.warn(error);
                            break;
                        default:
                            console.error(error);
                            break;
                    }
                    message = error.message;
                }
                else {
                    console.error(error);
                }
                return { message, status: CustomCommandStatus.Failure };
            }
            finally {
                console.log(`[finish] ${sourceName} has run command: ${customCommand.name}`);
            }
        });
    }
    catch (error) {
        console.error(`Custom command named ${customCommand.name} registoration failed because of`, error);
        throw error;
    }
};
