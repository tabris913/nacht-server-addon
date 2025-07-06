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
import { ModalFormData } from '@minecraft/server-ui';

import { PREFIX_PLAYERNAME } from '../const';
import { CommandProcessError } from '../errors/command';
import { Logger } from '../utils/logger';

import { registerCommand } from './common';

const setNameCommand: CustomCommand = {
  name: 'nacht:setname',
  description: '表示名を設定する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'target', type: CustomCommandParamType.PlayerSelector }],
};

const commandProcess = (origin: CustomCommandOrigin, targets: Array<Player>): CustomCommandResult => {
  if (targets.length === 0) throw new CommandProcessError('ターゲットが見つかりませんでした。');

  const _jobId = system.runJob(
    (function* () {
      for (const target of targets) {
        const form = new ModalFormData();
        form.title('表示名変更');
        form.label('※公序良俗に反する名前の場合、オペレーターにより解除される場合があります');
        form.textField('表示名', '表示名');
        form.submitButton('決定');

        form.show(target as any).then((response) => {
          if (response.canceled) {
            Logger.log(`[${target.nameTag}] canceled: ${response.cancelationReason}`);

            return;
          }

          world.setDynamicProperty(`${PREFIX_PLAYERNAME}${target.nameTag}`, response.formValues?.[0]);
        });

        yield;
      }
    })()
  );

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(setNameCommand, commandProcess));
