import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { registerCommand } from './common';
import { migrateFromV2_0_0 } from './migration/v3.0.0';

const migrateCommand: CustomCommand = {
  name: 'nacht:migrate',
  description: 'アドオン更新によるマイグレートを行う',
  permissionLevel: CommandPermissionLevel.GameDirectors,
};

const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  system.runTimeout(() => {
    // from 0.2.0
    migrateFromV2_0_0();
  }, 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(migrateCommand, commandProcess));
