/**
 * 与えられたプレイヤーが街エリアに居るかどうかを判定する
 *
 * @param player プレイヤー
 * @returns
 */
export const isInTownArea = (player) => {
    const nw = { x: -6400, y: -64, z: -6400 };
    const se = { x: 6400, y: 319, z: 6400 };
    switch (player.dimension.id) {
        case "overworld":
            if (player.location.x < nw.x)
                return false;
            if (se.x < player.location.x)
                return false;
            if (player.location.z < nw.z)
                return false;
            if (se.z < player.location.x)
                return false;
            return true;
        case "nether":
            if (player.location.x < nw.x / 8)
                return false;
            if (se.x / 8 < player.location.x)
                return false;
            if (player.location.z < nw.z / 8)
                return false;
            if (se.z / 8 < player.location.x)
                return false;
            return true;
        default:
            return false;
    }
};
/**
 * 与えられたプレイヤーが拠点エリアに居るかどうかを判定する
 *
 * @param player プレイヤー
 * @returns
 */
export const isInBaseArea = (player) => !isInTownArea(player) && 0 < player.location.z;
/**
 * 与えられたプレイヤーが探索エリアに居るかどうかを判定する
 *
 * @param player プレイヤー
 * @returns
 */
export const isInExploringArea = (player) => !isInTownArea(player) && player.location.z < 0;
