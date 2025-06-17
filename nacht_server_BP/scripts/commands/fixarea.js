import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { COUNTER_UNEDITABLE, PREFIX_UNEDITABLEAREA } from '../const';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
const fixAreaCommand = {
    name: 'nacht:fixarea',
    description: '範囲を固定する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'from', type: CustomCommandParamType.Location },
        { name: 'to', type: CustomCommandParamType.Location },
    ],
};
/**
 * 編集不可範囲を設定するコマンドの処理
 *
 * @param origin
 * @param from 範囲の始点
 * @param to 範囲の終点
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin, from, to) => {
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    const blockVolume = new DimensionBlockVolume(from, to, player.dimension);
    system.runTimeout(() => {
        const index = DynamicPropertyUtils.getNextCounter(COUNTER_UNEDITABLE);
        const id = `${PREFIX_UNEDITABLEAREA}${index}`;
        world.setDynamicProperty(id, JSON.stringify({
            dimension: blockVolume.dimension.id,
            id,
            index,
            max: blockVolume.getMax(),
            min: blockVolume.getMin(),
        }));
        DynamicPropertyUtils.countUpCounter(COUNTER_UNEDITABLE);
        player.sendMessage('指定された範囲を編集不可に設定しました。');
    }, 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(fixAreaCommand, commandProcess));
