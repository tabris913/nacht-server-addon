import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { COUNTER_UNEDITABLE, PREFIX_UNEDITABLEAREA } from '../const';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { registerCommand } from './common';
const fixAreaCommand = {
    name: 'nacht:fixarea',
    description: '範囲を固定する',
    permissionLevel: CommandPermissionLevel.Admin,
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
    if (origin.sourceEntity === undefined)
        throw new UndefinedSourceOrInitiatorError();
    const blockVolume = new DimensionBlockVolume(from, to, origin.sourceEntity.dimension);
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
    }, 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(fixAreaCommand, commandProcess));
