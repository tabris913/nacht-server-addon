import { world, CustomCommandStatus } from '@minecraft/server';

import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../gamerule';

/**
 * エリアボーダーオンオフを設定する
 *
 * @param value
 * @returns
 */
export const setShowAreaBorder = (value: string) => {
  const converted = value.toLowerCase() === 'true';

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorder, converted);

  return {
    message: `${RuleName.showAreaBorder}に${converted}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};

/**
 * エリアボーダー表示の実行間隔を設定する
 *
 * @param value インターバル [ticks]
 * @returns
 */
export const setShowAreaBorderInterval = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: '設定する値は整数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }
  const interval = parseInt(value);

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderInterval, interval);

  return {
    message: `${RuleName.showAreaBorderInterval}に${interval}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};

/**
 * エリアボーダーを表示する範囲を設定する
 *
 * @param value
 * @returns
 */
export const setShowAreaBorderRange = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: '設定する値は整数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }
  const interval = parseInt(value);
  if ((interval & 1) === 0) {
    return {
      message: '設定する値は奇数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderRange, interval);

  return {
    message: `${RuleName.showAreaBorderRange}に${interval}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};

/**
 * エリアボーダーを表示するy軸範囲を設定する
 *
 * @param value
 * @returns
 */
export const setShowAreaBorderYRange = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: '設定する値は整数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }
  const interval = parseInt(value);
  if ((interval & 1) === 0) {
    return {
      message: '設定する値は奇数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.showAreaBorderYRange, interval);

  return {
    message: `${RuleName.showAreaBorderYRange}に${interval}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};
