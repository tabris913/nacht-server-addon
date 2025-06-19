import { CommandPermissionLevel, CustomCommandStatus, system, world } from '@minecraft/server';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
export default () => system.beforeEvents.startup.subscribe(registerCommand({
    name: 'nacht:outputdata',
    description: 'データを出力する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
}, (origin) => {
    const player = PlayerUtils.convertToPlayer(origin.initiator || origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    const dps = world
        .getDynamicPropertyIds()
        .sort()
        .reduce((prev, cur) => (Object.assign(Object.assign({}, prev), { [cur]: world.getDynamicProperty(cur) })), {});
    Logger.info('------------------------------');
    Logger.info(JSON.stringify(dps));
    Logger.info('------------------------------');
    return { status: CustomCommandStatus.Success };
}));
