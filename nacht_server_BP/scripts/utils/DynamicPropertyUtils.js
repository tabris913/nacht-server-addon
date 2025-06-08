import { world } from "@minecraft/server";
import { PREFIX_LOCATION } from "../const";
import { Logger } from "./logger";
/**
 * 座標の Dynamic Propertyを検索する
 *
 * @returns
 */
export const retrieveLocations = (playerNameTag) => {
    try {
        const prefix = PREFIX_LOCATION + (playerNameTag ? `${playerNameTag}_` : '');
        const locations = world
            .getDynamicPropertyIds()
            .filter((dpId) => dpId.startsWith(prefix))
            .map((dpId) => world.getDynamicProperty(dpId))
            .filter((dp) => dp !== undefined)
            .map((dp) => JSON.parse(dp));
        // Logger.log(
        //   `${locations.length} dynamic properties filtered by ${prefix} are found.`
        // );
        return locations;
    }
    catch (error) {
        Logger.error('Failed to retrieve locations because of', error);
        throw error;
    }
};
const DynamicPropertyUtils = { retrieveLocations };
export default DynamicPropertyUtils;
