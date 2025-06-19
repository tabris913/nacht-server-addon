import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  TicksPerSecond,
  world,
} from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';

import { COUNTER_TRANSFER, Formatting, PREFIX_TRANSFER, SCOREBOARD_POINT } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { PointlessError } from '../errors/market';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';

import { registerCommand } from './common';

import type { TransferHistory } from '../models/point';

const transferCommand: CustomCommand = {
  name: 'nacht:transfer',
  description: '別プレイヤーにポイントを送る',
  permissionLevel: CommandPermissionLevel.GameDirectors,
};

/**
 * ポイントを送るコマンドの処理
 *
 * @param origin
 * @returns
 * @throws This function can throw errors.
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link NachtServerAddonError}
 */
const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  const remitter = PlayerUtils.convertToPlayer(origin.initiator);
  if (remitter === undefined || origin.sourceEntity === undefined) throw new UndefinedSourceOrInitiatorError();

  const remittees = world.getPlayers().filter((player) => player.id !== remitter.id);

  if (remittees.length === 0) {
    remitter.sendMessage('送金できるプレイヤーが見つかりませんでした。');

    throw new NachtServerAddonError('送金できるプレイヤーが見つかりませんでした。');
  }

  const form = new ModalFormData();
  form.title('');
  form.dropdown(
    '送金先',
    remittees.map((player) => player.nameTag)
  );
  form.textField('ポイント数', '');
  form.submitButton('送金する');

  system.runTimeout(() => {
    form
      .show(remitter as any)
      .then((response) => {
        if (response.canceled) {
          Logger.log(`[${remitter.nameTag}] canceled: ${response.cancelationReason}`);

          return;
        }

        const remitteeIndex = response.formValues?.[0] as number;
        const amountString = response.formValues?.[1] as string;

        if (!/\d+/.test(amountString)) {
          remitter.sendMessage(`${Formatting.Color.RED}ポイント数には整数を入力してください。`);

          throw new NachtServerAddonError('ポイント数には整数を入力してください。');
        }

        const amount = parseInt(amountString);
        const remittee = remittees[remitteeIndex];

        if (remittee === undefined) {
          remitter.sendMessage(`${Formatting.Color.RED}送金先が見つかりませんでした。`);
          throw new NachtServerAddonError('送金先が見つかりませんでした。');
        }
        if (amount <= 0) {
          remitter.sendMessage(`${Formatting.Color.RED}ポイント数が不正です。`);
          throw new NachtServerAddonError('ポイント数が不正です。');
        }
        if (!Number.isSafeInteger(amount)) {
          remitter.sendMessage(`${Formatting.Color.RED}ポイント数が不正です。`);
          throw new NachtServerAddonError('ポイント数が不正です。');
        }

        const score = ScoreboardUtils.getScoreOrEnable(remitter, SCOREBOARD_POINT);
        if (score < amount) {
          remitter.sendMessage(`[${origin.sourceEntity?.nameTag}] ポイントが足りません。`);
          throw new PointlessError();
        }
        ScoreboardUtils.addScore(remitter, SCOREBOARD_POINT, -amount);
        if (remittee.isValid) {
          remittee.sendMessage(
            `${remitter.nameTag}から${amount}ポイント送られました。受け取るためには銀行の窓口までお越しください。`
          );
        }
        const index = DynamicPropertyUtils.getNextCounter(COUNTER_TRANSFER);
        const id = `${PREFIX_TRANSFER}${index}`;
        world.setDynamicProperty(
          id,
          JSON.stringify({
            amount,
            datetime: new Date().toISOString(),
            hasSentMessage: remittee.isValid,
            id,
            index,
            isWithdrawn: false,
            remittee: remittee.nameTag,
            remitter: remitter.nameTag,
          } satisfies TransferHistory)
        );
        DynamicPropertyUtils.countUpCounter(COUNTER_TRANSFER);
      })
      .catch(() => null);
  }, TicksPerSecond);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(transferCommand, commandProcess));
