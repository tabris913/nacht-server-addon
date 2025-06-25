import { CommandPermissionLevel, CustomCommandStatus, system } from '@minecraft/server';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
export default () => system.beforeEvents.startup.subscribe(registerCommand({
    name: 'nacht:version',
    description: 'アドオンバージョンを表示する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
}, (origin) => {
    const player = PlayerUtils.convertToPlayer(origin.initiator || origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    player.sendMessage('0.8.0');
    return { status: CustomCommandStatus.Success };
}));
