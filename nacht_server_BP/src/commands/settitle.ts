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
import { registerCommand } from './common';
import { PlayerSelectorNotFoundError } from '../errors/command';
import { ModalFormData } from '@minecraft/server-ui';
import { PREFIX_TITLE } from '../const';
import { Logger } from '../utils/logger';

const setTitleCommand: CustomCommand = {
  name: 'nacht:settitle',
  description: '表示する称号を設定する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'targets', type: CustomCommandParamType.PlayerSelector }],
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
        const tags = target.getTags().filter((tag) => tag.startsWith('TAG_'));

        const form = new ModalFormData();
        form.title('称号設定');
        form.label(
          '他のプレイヤーに見せる称号を設定します。設定しない場合、解除した場合は、ゲーム内時間で毎日表示されるものが変化します。'
        );
        form.dropdown('表示させる称号', ['(設定解除)'].concat(tags.sort()), { defaultValueIndex: 0 });
        form.submitButton('決定');

        system.runTimeout(
          () =>
            form
              .show(target as any)
              .then((response) => {
                if (response.canceled) {
                  Logger.log(`[${target.nameTag}] canceled: ${response.cancelationReason}`);

                  return;
                }

                const tagIndex = response.formValues?.[1] as number | undefined;
                if (tagIndex !== undefined) {
                  world.setDynamicProperty(PREFIX_TITLE + target.nameTag, tags[tagIndex - 1]);
                }
              })
              .catch(() => null),
          TicksPerSecond
        );

        yield;
      }
    })()
  );

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(setTitleCommand, commandProcess));
