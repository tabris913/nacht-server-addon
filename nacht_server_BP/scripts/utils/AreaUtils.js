/**
 * 2座標間の距離を計算する
 *
 * @param value1
 * @param value2
 * @returns
 */
const calcDistance = (value1, value2) => Math.abs(value1 - value2) + 1;
/**
 * 2座標間の距離を計算する
 * @param location1
 * @param location2
 * @returns
 */
const calcDistances = (location1, location2) => ({
    x: calcDistance(location1.x, location2.x),
    y: calcDistance(location1.y, location2.y),
    z: calcDistance(location1.z, location2.z),
});
const AreaUtils = { calcDistance, calcDistances };
export default AreaUtils;
