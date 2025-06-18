import { world, CustomCommandStatus } from '@minecraft/server';
import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../enum';
/**
 * エリア監視のオンオフを設定する
 *
 * @param value
 * @returns
 */
export const setWatchCrossingArea = (value) => {
    const converted = value.toLowerCase() === 'true';
    world.setDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingArea, converted);
    return {
        message: `${RuleName.watchCrossingArea}に${converted}を設定しました。`,
        status: CustomCommandStatus.Success,
    };
};
/**
 * エリア監視の実行間隔を設定する
 *
 * @param value インターバル [ticks]
 * @returns
 */
export const setWatchCrossingAreaInterval = (value) => {
    if (!/^\d+$/.test(value)) {
        return {
            message: '設定する値は整数でなければなりません。',
            status: CustomCommandStatus.Failure,
        };
    }
    const interval = parseInt(value);
    world.setDynamicProperty(PREFIX_GAMERULE + RuleName.watchCrossingAreaInterval, interval);
    return {
        message: `${RuleName.watchCrossingAreaInterval}に${interval}を設定しました。`,
        status: CustomCommandStatus.Success,
    };
};
