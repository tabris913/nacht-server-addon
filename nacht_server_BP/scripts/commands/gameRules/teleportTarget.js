import { CustomCommandStatus, world } from '@minecraft/server';
import { PREFIX_GAMERULE } from '../../const';
import { RuleName } from '../enum';
/**
 * テレポート登録先の数を設定する
 *
 * @param value
 * @returns
 */
export const setTeleportTarget = (value) => {
    if (!/^\d+$/.test(value) || value === '0') {
        return {
            message: '設定する値は正整数でなければなりません。',
            status: CustomCommandStatus.Failure,
        };
    }
    const count = parseInt(value);
    world.setDynamicProperty(PREFIX_GAMERULE + RuleName.teleportTargets, count);
    return {
        message: `${RuleName.teleportTargets}に${count}を設定しました。`,
        status: CustomCommandStatus.Success,
    };
};
