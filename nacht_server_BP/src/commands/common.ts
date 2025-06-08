import {
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  CustomCommandSource,
  CustomCommandStatus,
  type StartupEvent,
} from '@minecraft/server';

import { NachtServerAddonError } from '../errors/base';
import { Logger } from '../utils/logger';

type CallbackType = (origin: CustomCommandOrigin, ...args: Array<any>) => CustomCommandResult;

/**
 * 共通エラー処理を組み込んだカスタムコマンド登録
 *
 * @param customCommand カスタムコマンド情報
 * @param callback コマンドが実行されたときにトリガーされるコールバック
 * @returns
 */
export const registerCommand = (customCommand: CustomCommand, callback: CallbackType) => (arg0: StartupEvent) => {
  try {
    arg0.customCommandRegistry.registerCommand(
      customCommand,
      (origin: CustomCommandOrigin, ...args: Array<any>): CustomCommandResult => {
        let sourceName;
        try {
          switch (origin.sourceType) {
            case CustomCommandSource.Block:
              sourceName = `CommandBlock(${origin.sourceBlock?.x},${origin.sourceBlock?.y},${origin.sourceBlock?.z})`;
              break;
            case CustomCommandSource.Server:
              sourceName = 'Server';
              break;
            case CustomCommandSource.NPCDialogue:
              sourceName = `NPC(${origin.sourceEntity?.nameTag}/${origin.sourceEntity?.location.x},${origin.sourceEntity?.location.y},${origin.sourceEntity?.location.z})`;
              break;
            case CustomCommandSource.Entity:
              sourceName = origin.sourceEntity?.nameTag;
              break;
          }
        } catch (error) {
          Logger.warning('Failed to get source name because of', error);
          sourceName = 'undefined';
        }

        try {
          Logger.log(
            `[start] ${sourceName} ran command: ${customCommand.name} ${args
              .map((arg) => JSON.stringify(arg))
              .join(' ')}`,
          );
          return callback(origin, ...args);
        } catch (error) {
          let message = '予期せぬエラーが発生しました。';

          if (error instanceof NachtServerAddonError) {
            switch (error.logLevel) {
              case 'warning':
                Logger.warning(error);
                break;
              default:
                Logger.error(error);
                break;
            }
            message = error.message;
          } else {
            Logger.error(error);
          }

          return { message, status: CustomCommandStatus.Failure };
        } finally {
          Logger.log(`[finish] ${sourceName} has run command: ${customCommand.name}`);
        }
      },
    );
  } catch (error) {
    Logger.error(`Custom command named ${customCommand.name} registoration failed because of`, error);

    throw error;
  }
};
