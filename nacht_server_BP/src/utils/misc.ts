import { flatFormatting } from "../const";

/**
 *
 * @param value1
 * @param value2
 * @returns
 */
export const makeArray = (value1: number, value2: number) => {
  const value1Int = Math.floor(value1);
  const value2Int = Math.floor(value2);
  const minValue = Math.min(value1Int, value2Int);

  return Array(Math.abs(value1Int - value2Int) + 1)
    .fill(null)
    .map((_, index) => index + minValue);
};

/**
 * 文字列を装飾文字でフォーマットする
 *
 * @param message 文字列
 * @returns 装飾された文字列
 */
export const format = (message: string) => {
  try {
    return Object.entries(flatFormatting).reduce(
      (prev, [curK, curV]) => prev.replace(`<${curK}>`, curV),
      message
    );
  } catch (error) {
    console.error("Failed to format the message.");
    console.error(error);

    return message;
  }
};
