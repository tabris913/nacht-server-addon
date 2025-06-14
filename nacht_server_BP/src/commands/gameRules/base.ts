import { CustomCommandStatus, world } from '@minecraft/server';

import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../gamerule';

/**
 * 拠点エリアの土地の相場を設定する
 *
 * @param value
 * @returns
 */
export const setBaseMarketPrice = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: '設定する値は整数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }
  const marketPrice = parseInt(value);

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.baseMarketPrice, marketPrice);

  return {
    message: `${RuleName.baseMarketPrice}に${marketPrice}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};

/**
 * 購入できる拠点範囲の最大値を設定する
 *
 * @param value
 * @returns
 */
export const setBaseMaximumRange = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: '設定する値は整数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }
  const maximumRange = parseInt(value);
  if ((maximumRange & 1) === 0) {
    return {
      message: '設定する値は奇数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.baseMaximumRange, maximumRange);

  return {
    message: `${RuleName.baseMaximumRange}に${maximumRange}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};
