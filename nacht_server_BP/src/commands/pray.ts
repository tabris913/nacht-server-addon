import {
  CommandPermissionLevel,
  CustomCommand,
  CustomCommandResult,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { registerCommand } from './common';
import { MinecraftEnchantmentTypes } from '../types';

const prayCommand: CustomCommand = {
  name: 'nacht:pray',
  description: '教会でお祈りを捧げる',
  permissionLevel: CommandPermissionLevel.GameDirectors,
};

const commadProcess = (): CustomCommandResult => {
  // MinecraftEnchantmentTypes;
  return { status: CustomCommandStatus.Success };
};

export default () => {
  system.beforeEvents.startup.subscribe(registerCommand(prayCommand, commadProcess));
};
