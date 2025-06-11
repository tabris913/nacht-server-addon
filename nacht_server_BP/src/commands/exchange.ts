import {
  CommandPermissionLevel,
  CustomCommand,
  CustomCommandParamType,
  CustomCommandResult,
  CustomCommandStatus,
  system,
} from '@minecraft/server';

import { registerCommand } from './common';

enum ExchangeTarget {
  point = 'point',
  coin = 'coin',
  xp = 'xp',
}

enum ExchangeSource {
  point = 'point',
  coin = 'coin',
  xp = 'xp',
}

const pointCommand: CustomCommand = {
  name: 'nacht:exchange',
  description: 'ポイントを交換する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'nacht:ExchangeSource', type: CustomCommandParamType.Enum },
    { name: 'nacht:ExchangeTarget', type: CustomCommandParamType.Enum },
    { name: 'target', type: CustomCommandParamType.Integer },
  ],
};

const commandProcess = (): CustomCommandResult => {
  return { status: CustomCommandStatus.Success };
};

export default () => {
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:PointSubCommand', [
      ExchangeTarget.coin,
      ExchangeTarget.point,
      ExchangeTarget.xp,
    ]);

    registerCommand(pointCommand, commandProcess)(event);
  });
};
