import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandSource,
  CustomCommandStatus,
  system,
  world,
} from '@minecraft/server';

import { SCOREBOARD_POINT } from '../const';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';
import ScoreboardUtils from '../utils/ScoreboardUtils';

import { registerCommand } from './common';

import type { TransferHistory } from '../models/point';

const withdrawCommand: CustomCommand = {
  name: 'nacht:withdraw',
  description: 'ポイントを引き出す',
  permissionLevel: CommandPermissionLevel.GameDirectors,
};

/**
 * ポイント出金コマンドの処理
 *
 * @param origin
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonNPCSourceError}
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (origin: CustomCommandOrigin): CustomCommandResult => {
  if (origin.sourceType !== CustomCommandSource.NPCDialogue) throw new NonNPCSourceError(origin.sourceType);
  const player = PlayerUtils.convertToPlayer(origin.initiator);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();

  const unwithdrawn = DynamicPropertyUtils.retrieveTransferHistories().filter(
    (dp) => dp.remittee === player.nameTag && !dp.isWithdrawn
  );
  if (unwithdrawn.length === 0) {
    player.sendMessage('どなたからもポイントが届いていませんよ。');
  } else {
    const total = unwithdrawn.reduce((prev, cur) => {
      player.sendMessage(`[${cur.datetime}] ${cur.remitter}から${cur.amount}ポイント届いています。`);

      return prev + cur.amount;
    }, 0);

    system.runTimeout(() => {
      ScoreboardUtils.addScore(player, SCOREBOARD_POINT, total);
      unwithdrawn.forEach((dp) => {
        world.setDynamicProperty(
          dp.id,
          JSON.stringify({
            ...dp,
            isWithdrawn: true,
            withdrawnDatetime: new Date().toISOString(),
          } satisfies TransferHistory)
        );
      });

      player.sendMessage(`出金が完了しました。`);
    }, 1);
  }

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(withdrawCommand, commandProcess));
