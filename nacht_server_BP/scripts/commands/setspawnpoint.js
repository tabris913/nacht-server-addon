import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { registerCommand } from './common';
const setSpawnPointCommand = {
    name: 'nacht:setspawnpoint',
    description: 'スポーン地点を設定する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'target', type: CustomCommandParamType.PlayerSelector },
        { name: 'location', type: CustomCommandParamType.Location },
    ],
    optionalParameters: [{ name: 'nacht:DimensionTypes', type: CustomCommandParamType.Enum }],
};
const commandProcess = ({ sourceEntity }, targets, location, dimension) => {
    if (sourceEntity === undefined)
        throw new UndefinedSourceOrInitiatorError();
    targets.forEach((target) => {
        system.runTimeout(() => target.setSpawnPoint(Object.assign(Object.assign({}, location), { dimension: dimension ? world.getDimension(dimension) : sourceEntity.dimension })), 1);
    });
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(setSpawnPointCommand, commandProcess));
