import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  type Vector3,
  world,
} from '@minecraft/server';

import { COUNTER_UNEDITABLE, PREFIX_UNEDITABLEAREA } from '../const';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import { UneditableAreas } from '../models/location';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';

import { registerCommand } from './common';

const fixAreaCommand: CustomCommand = {
  name: 'nacht:fixarea',
  description: '範囲を固定する',
  permissionLevel: CommandPermissionLevel.Admin,
  mandatoryParameters: [
    { name: 'from', type: CustomCommandParamType.Location },
    { name: 'to', type: CustomCommandParamType.Location },
  ],
};

const commandProcess = (origin: CustomCommandOrigin, from: Vector3, to: Vector3): CustomCommandResult => {
  if (origin.sourceEntity === undefined) throw new UndefinedSourceOrInitiatorError();

  const blockVolume = new DimensionBlockVolume(from, to, origin.sourceEntity.dimension);

  system.runTimeout(() => {
    const index = DynamicPropertyUtils.getNextCounter(COUNTER_UNEDITABLE);
    const id = `${PREFIX_UNEDITABLEAREA}${index}`;
    world.setDynamicProperty(
      id,
      JSON.stringify({
        dimension: blockVolume.dimension.id,
        id,
        index,
        max: blockVolume.getMax(),
        min: blockVolume.getMin(),
      } as UneditableAreas)
    );
    DynamicPropertyUtils.countUpCounter(COUNTER_UNEDITABLE);
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(fixAreaCommand, commandProcess));
