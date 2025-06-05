import { CustomCommandStatus, } from "@minecraft/server";
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
            try {
                return callback(origin, ...args);
            }
            catch (error) {
                let message = "予期せぬエラーが発生しました。";
                if (error instanceof NachtServerAddonError) {
                    switch (error.logLevel) {
                        case "error":
                            console.error(error);
                            break;
                        case "warning":
                            console.warn(error);
                            break;
                    }
                    message = error.message;
                }
                else {
                    console.error(error);
                }
                return { message, status: CustomCommandStatus.Failure };
            }
        });
    }
    catch (error) {
        console.error(`Custom command named ${customCommand.name} registoration failed because of`, error);
        throw error;
    }
};
