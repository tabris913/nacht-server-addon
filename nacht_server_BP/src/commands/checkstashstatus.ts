import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type Player,
  system,
  world,
} from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';

import { VAR_STASH } from '../const';
import { Logger } from '../utils/logger';

import { registerCommand } from './common';

const checkStashStatusCommand: CustomCommand = {
  name: 'nacht:checkstashstatus',
  description: '隠しスタッシュの発見状況を確認する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'target', type: CustomCommandParamType.PlayerSelector }],
};

const commandProcess = (origin: CustomCommandOrigin, targets: Array<Player>): CustomCommandResult => {
  const number_of_stashes = (world.getDynamicProperty(VAR_STASH) as number | undefined) || 0;

  targets.forEach((target) => {
    let counter = 0;
    const messages: Array<string> = [];
    Array.from({ length: number_of_stashes }).forEach((_, index) => {
      let msg = `${(index + 1).toString().padStart(2, '0')}: `;

      if (target.hasTag(`stash${index + 1}`)) {
        counter++;
        msg += '発見済';
      } else {
        msg += '未発見';
      }
      messages.push(msg);
    });

    const form = new ActionFormData();
    form.title('隠しスタッシュ発見状況');
    form.body(`現在隠しスタッシュは全部で ${number_of_stashes} 個存在します。`);
    form.body(`発見状況 [${counter} / ${number_of_stashes}]\n${messages.join('\n')}`);
    form.button('閉じる');

    form
      .show(target as any)
      .then((response) => {
        if (response.canceled) {
          Logger.log(`[${target.nameTag}] canceled: ${response.cancelationReason}`);

          return;
        }
      })
      .catch(() => null);
  });

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(checkStashStatusCommand, commandProcess));
