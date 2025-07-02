import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  ItemStack,
  type ItemType,
  type Player,
  system,
} from '@minecraft/server';

import { MessageFormData, ModalFormData } from '@minecraft/server-ui';

import { CommandProcessError, UndefinedSourceOrInitiatorError } from '../errors/command';
import InventoryUtils from '../utils/InventoryUtils';
import { Logger } from '../utils/logger';

import { registerCommand } from './common';
import ScoreboardUtils from '../utils/ScoreboardUtils';
import { SCOREBOARD_POINT } from '../const';

const sellInDetailCommand: CustomCommand = {
  name: 'nacht:sellindetail',
  description: '',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'target', type: CustomCommandParamType.PlayerSelector },
    { name: 'item', type: CustomCommandParamType.ItemType },
    { name: 'point', type: CustomCommandParamType.Integer },
  ],
  optionalParameters: [
    { name: 'itemless_msg', type: CustomCommandParamType.String },
    { name: 'after_msg', type: CustomCommandParamType.String },
  ],
};

/**
 *
 * @param origin
 * @param target コマンド対象プレイヤー
 * @param item アイテム
 * @param point 1個あたりの金額
 * @param itemless_msg アイテムが不足している場合のメッセージ
 * @param after_msg 売却後のメッセージ
 * @returns
 * @throws This function can throw errors.
 */
const commandProcess = (
  origin: CustomCommandOrigin,
  target: Array<Player>,
  item: ItemType,
  point: number,
  itemless_msg?: string,
  after_msg?: string
): CustomCommandResult => {
  if (origin.sourceEntity === undefined) throw new UndefinedSourceOrInitiatorError();

  target.forEach((player) => {
    const buyerName = origin.sourceEntity?.nameTag;
    if (InventoryUtils.hasItem(player, item.id, { min: 0, max: 0 })) {
      player.sendMessage(`[${buyerName}] ${itemless_msg || 'アイテムを所持していません。'}`);

      throw new CommandProcessError(`${player.nameTag}は${item.id}を所持していません。`);
    }
    const count = InventoryUtils.countItem(player, item.id);
    if (count === undefined) {
      player.sendMessage(`[${buyerName}] インベントリが確認できませんでした。`);

      throw new CommandProcessError('インベントリの確認に失敗しました。');
    }

    const itemStack = new ItemStack(item);

    const modal = new ModalFormData();
    modal.title({ rawtext: [{ translate: itemStack.localizationKey }, { text: `売却 (1単位 ${point}P)` }] });
    modal.slider('数量', 1, count, { defaultValue: count, valueStep: 1 });
    modal.submitButton('決定');

    system.run(() =>
      modal
        .show(player as any)
        .then((response) => {
          if (response.canceled) {
            Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);

            return;
          }

          const amount = response.formValues?.[0] as number | undefined;
          if (amount === undefined) {
            return;
          }

          const confirm = new MessageFormData();
          confirm.title('売却確認');
          confirm.body({
            rawtext: [
              { translate: itemStack.localizationKey },
              { text: `${amount}単位を${amount * point}ポイントで売却してもよろしいですか？` },
            ],
          });
          confirm.button1('OK');
          confirm.button2('キャンセル');
          confirm
            .show(player as any)
            .then((response2) => {
              if (response2.canceled) {
                Logger.log(`[${player.nameTag}] canceled: ${response2.cancelationReason}`);

                return;
              }

              if (response2.selection === 0) {
                // OK
                InventoryUtils.removeItem(player, item.id, amount);
                ScoreboardUtils.addScore(player, SCOREBOARD_POINT, point);
                player.sendMessage(`[${buyerName}] ${after_msg || 'まいどあり！'}`);
              }
            })
            .catch(() => null);
        })
        .catch(() => null)
    );
  });

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(sellInDetailCommand, commandProcess));
