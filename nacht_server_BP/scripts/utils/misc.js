import { flatFormatting } from "../const";
/**
 * 文字列を装飾文字でフォーマットする
 *
 * @param message 文字列
 */
export const format = (message) => Object.entries(flatFormatting).reduce((prev, [curK, curV]) => prev.replace(`<${curK}>`, curV), message);
