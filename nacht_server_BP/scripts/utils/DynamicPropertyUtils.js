import { world } from '@minecraft/server';
import { PREFIX_UNEDITABLEAREA, PREFIX_LOCATION, PREFIX_COUNTER, PREFIX_TRANSFER } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { DynamicPropertyNotFoundError } from '../errors/dp';
import { Logger } from './logger';
/**
 * 指定されたカウンターを進める
 *
 * @param id
 * @throws This function can throw errors.
 *
 * {@link DynamicPropertyNotFoundError}
 *
 * {@link NachtServerAddonError}
 */
export const countUpCounter = (id) => {
    try {
        const counterId = PREFIX_COUNTER + id;
        const currentValue = world.getDynamicProperty(counterId);
        if (currentValue === undefined)
            throw new DynamicPropertyNotFoundError(counterId);
        if (typeof currentValue !== 'number')
            throw new NachtServerAddonError('数値ではないプロパティが指定されました。');
        world.setDynamicProperty(counterId, currentValue + 1);
    }
    catch (error) {
        Logger.error(`Failed to count up the value for counter ${id} because of`, error);
        throw error;
    }
};
/**
 * カウンターの次の値を取得する
 *
 * @param id
 * @returns
 */
export const getNextCounter = (id) => {
    try {
        return world.getDynamicProperty(PREFIX_COUNTER + id) || 0;
    }
    catch (error) {
        Logger.error(`Failed to get the next value for counter ${id} because of`, error);
        throw error;
    }
};
/**
 * 座標の Dynamic Property を検索する
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
export const retrieveTransferHistories = () => {
    try {
        return world
            .getDynamicPropertyIds()
            .filter((dpid) => dpid.startsWith(PREFIX_TRANSFER))
            .map((dpid) => world.getDynamicProperty(dpid))
            .filter((dp) => dp !== undefined)
            .map((dp) => JSON.parse(dp));
    }
    catch (error) {
        Logger.error('Failed to retrieve transfer histories because of', error);
        throw error;
    }
};
/**
 * 編集不可エリアの Dynamic Property を検索する
 *
 * @returns
 */
export const retrieveUneditableAreas = () => {
    try {
        return world
            .getDynamicPropertyIds()
            .filter((dpid) => dpid.startsWith(PREFIX_UNEDITABLEAREA))
            .map((dpid) => world.getDynamicProperty(dpid))
            .filter((dp) => dp !== undefined)
            .map((dp) => JSON.parse(dp));
    }
    catch (error) {
        Logger.error('Failed to retrieve fixed areas because of', error);
        throw error;
    }
};
const DynamicPropertyUtils = {
    countUpCounter,
    getNextCounter,
    retrieveLocations,
    retrieveTransferHistories,
    retrieveUneditableAreas,
};
export default DynamicPropertyUtils;
