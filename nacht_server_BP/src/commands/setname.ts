import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type Player,
  system,
  TicksPerSecond,
  world,
} from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';

import { PREFIX_PLAYERNAME } from '../const';
import { PlayerSelectorNotFoundError } from '../errors/command';
import { Logger } from '../utils/logger';

import { registerCommand } from './common';

const setNameCommand: CustomCommand = {
  name: 'nacht:setname',
  description: '表示名を設定する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'target', type: CustomCommandParamType.PlayerSelector }],
};

/**
 *
 * @param origin
 * @param targets
 * @returns
 */
const commandProcess = (origin: CustomCommandOrigin, targets: Array<Player>): CustomCommandResult => {
  if (targets.length === 0) throw new PlayerSelectorNotFoundError();

  const _jobId = system.runJob(
    (function* () {
      for (const target of targets) {
        const name = world.getDynamicProperty(PREFIX_PLAYERNAME + target.nameTag) as string | undefined;

        const form = new ModalFormData();
        form.title('表示名変更');
        form.label('※公序良俗に反する名前の場合、オペレーターにより解除される場合があります');
        form.textField('表示名', '表示名', { defaultValue: name });
        form.submitButton('決定');

        system.runTimeout(
          () =>
            form.show(target as any).then((response) => {
              if (response.canceled) {
                Logger.log(`[${target.nameTag}] canceled: ${response.cancelationReason}`);

                return;
              }

              world.setDynamicProperty(`${PREFIX_PLAYERNAME}${target.nameTag}`, response.formValues?.[1]);
            }),
          TicksPerSecond
        );

        yield;
      }
    })()
  );

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(setNameCommand, commandProcess));
