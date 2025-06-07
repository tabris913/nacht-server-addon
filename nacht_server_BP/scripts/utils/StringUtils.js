import { flatFormatting } from "../const";
import { Logger } from "./logger";
/**
 * 文字列を装飾文字でフォーマットする
 *
 * @param message 文字列
 * @returns 装飾された文字列
 */
export const format = (message) => {
    try {
        return Object.entries(flatFormatting).reduce((prev, [curK, curV]) => prev.replace(`<${curK}>`, curV), message);
    }
    catch (error) {
        Logger.error("Failed to format the message because of", error);
        return message;
    }
};
const StringUtils = { format };
export default StringUtils;
