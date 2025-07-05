import {
  BlockVolume,
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  type Vector3,
} from '@minecraft/server';

import { NonAdminSourceError } from '../errors/command';
import { Location } from '../models/location';
import { MinecraftBlockTypes } from '../types/index';

import { registerCommand } from './common';
import { CloneMode, MaskMode, Rotate } from './enum';

const cloneRotateCommand: CustomCommand = {
  name: 'nacht:clonerotate',
  description: '回転させてコピーする',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'begin', type: CustomCommandParamType.Location },
    { name: 'end', type: CustomCommandParamType.Location },
    { name: 'destination', type: CustomCommandParamType.Location },
    { name: 'nacht:Rotate', type: CustomCommandParamType.Enum },
  ],
  optionalParameters: [
    { name: 'nacht:MaskMode', type: CustomCommandParamType.Enum },
    { name: 'nacht:CloneMode', type: CustomCommandParamType.Enum },
  ],
};

const commandProcess = (
  origin: CustomCommandOrigin,
  begin: Vector3,
  end: Vector3,
  destination: Vector3,
  rotate: Rotate,
  maskMode: MaskMode = MaskMode.Replace,
  cloneMode: CloneMode = CloneMode.Normal
): CustomCommandResult => {
  const player = NonAdminSourceError.validate(origin);

  const blockVolume = new BlockVolume(begin, end);
  const { min } = blockVolume.getBoundingBox();

  const offset = new Location(destination).offsetNega(min);
  system.runTimeout(() => {
    for (const blockLocation of blockVolume.getBlockLocationIterator()) {
      const block = player.dimension.getBlock(blockLocation);
      if (block === undefined) continue;
      if (maskMode === MaskMode.Masked && block.isAir) continue;
      const moved = new Location(blockLocation).offset(offset);
      player.dimension.setBlockPermutation(
        new Location(destination).offset(moved.diff(destination).rotate(rotate)),
        block.permutation
      );
      if (cloneMode === CloneMode.Move) player.dimension.setBlockType(blockLocation, MinecraftBlockTypes.Air);
    }
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(cloneRotateCommand, commandProcess));
