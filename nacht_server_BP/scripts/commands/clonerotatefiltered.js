import { BlockVolume, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from '@minecraft/server';
import { NonAdminSourceError } from '../errors/command';
import { Location } from '../models/location';
import { MinecraftBlockTypes } from '../types/index';
import { parseBlockStates, registerCommand } from './common';
import { CloneMode } from './enum';
const cloneRotateCommand = {
    name: 'nacht:clonerotatefiltered',
    description: 'filteredモードで回転させてコピーする',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'begin', type: CustomCommandParamType.Location },
        { name: 'end', type: CustomCommandParamType.Location },
        { name: 'destination', type: CustomCommandParamType.Location },
        { name: 'nacht:Rotate', type: CustomCommandParamType.Enum },
        { name: 'nacht:CloneMode', type: CustomCommandParamType.Enum },
        { name: 'tileName', type: CustomCommandParamType.BlockType },
    ],
    optionalParameters: [{ name: 'blockStates', type: CustomCommandParamType.String }],
};
const commandProcess = (origin, begin, end, destination, rotate, cloneMode, tileName, blockStates) => {
    const player = NonAdminSourceError.validate(origin);
    const blockVolume = new BlockVolume(begin, end);
    const { min } = blockVolume.getBoundingBox();
    const offset = { x: destination.x - min.x, y: destination.y - min.y, z: destination.z - min.z };
    system.runTimeout(() => {
        for (const blockLocation of blockVolume.getBlockLocationIterator()) {
            const block = player.dimension.getBlock(blockLocation);
            if (block === undefined || block.typeId !== tileName.id)
                continue;
            const bs = blockStates ? parseBlockStates(blockStates) : undefined;
            if (!Object.entries(bs || {}).every(([k, v]) => block.permutation.getState(k) === v)) {
                continue;
            }
            const moved = new Location(blockLocation).offset(offset);
            player.dimension.setBlockPermutation(moved.offset(moved.diff(destination).rotate(rotate)), block.permutation);
            if (cloneMode === CloneMode.Move)
                player.dimension.setBlockType(blockLocation, MinecraftBlockTypes.Air);
        }
    }, 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(cloneRotateCommand, commandProcess));
