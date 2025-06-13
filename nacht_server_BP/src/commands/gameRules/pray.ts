import { CustomCommandStatus, world } from '@minecraft/server';
import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../gamerule';

/**
 * 祈願料を設定する
 *
 * @param value 祈願料
 * @returns
 */
export const setPrayPrice = (value: string) => {
  if (!/^\d+$/.test(value)) {
    return {
      message: '設定する値は整数でなければなりません。',
      status: CustomCommandStatus.Failure,
    };
  }
  const interval = parseInt(value);

  world.setDynamicProperty(PREFIX_GAMERULE + RuleName.prayPrice, interval);

  return {
    message: `${RuleName.prayPrice}に${interval}を設定しました。`,
    status: CustomCommandStatus.Success,
  };
};
