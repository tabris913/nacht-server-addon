import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { DynamicPropertyNotFoundError } from '../errors/dp';
import { registerCommand } from './common';
const clearDynamicPropertyCommand = {
    name: 'nacht:cleardp',
    description: 'Dynamic Propertyをクリアする',
    permissionLevel: CommandPermissionLevel.Admin,
    mandatoryParameters: [
        {
            name: 'nacht:dynamicPropertyIds',
            type: CustomCommandParamType.String,
        },
    ],
};
/**
 * グローバル変数を削除するコマンドの処理
 *
 * @param origin
 * @param id
 * @returns
 * @throws This function can throw error.
 *
 * {@link DynamicPropertyNotFoundError}
 */
const commandProcess = (origin, id) => {
    if (!world.getDynamicPropertyIds().includes(id)) {
        throw new DynamicPropertyNotFoundError(id);
    }
    world.setDynamicProperty(id, undefined);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(clearDynamicPropertyCommand, commandProcess));
