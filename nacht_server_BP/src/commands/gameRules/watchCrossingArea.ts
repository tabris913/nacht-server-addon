import { world, CustomCommandStatus } from '@minecraft/server';

import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../gamerule';

/**
 * エリア監視のオンオフを設定する
 *
 * @param value
 * @returns
 */
export const setWatchCrossingArea = (value: string) => {
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
export const setWatchCrossingAreaInterval = (value: string) => {
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
