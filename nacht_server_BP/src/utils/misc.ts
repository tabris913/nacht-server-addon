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
