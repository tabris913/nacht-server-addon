import {
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  ItemComponentTypes,
  type Player,
  system,
  TicksPerSecond,
} from '@minecraft/server';
import { MessageFormData, ModalFormData } from '@minecraft/server-ui';

import { EnchantmentNames, Formatting, SCOREBOARD_POINT } from '../const';
import { PlayerSelectorNotFoundError } from '../errors/command';
import { MinecraftEnchantmentTypes } from '../types/index';
import InventoryUtils from '../utils/InventoryUtils';
import { Logger } from '../utils/logger';
import ScoreboardUtils from '../utils/ScoreboardUtils';

import { registerCommand } from './common';

const removeEnchantCommand: CustomCommand = {
  name: 'nacht:removeenchant',
  description: 'エンチャントを除去する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'target', type: CustomCommandParamType.PlayerSelector }],
};

const commandProcess = (origin: CustomCommandOrigin, target: Array<Player>): CustomCommandResult => {
  if (target.length === 0) throw new PlayerSelectorNotFoundError();

  system.runJob(
    (function* () {
      for (const player of target) {
        const selectedSlot = InventoryUtils.getSelected(player);
        if (selectedSlot === undefined) {
          player.sendMessage(`${Formatting.Color.RED}イベントリが確認できませんでした。`);
          return;
        }

        const selectedItem = selectedSlot.getItem();
        if (selectedItem === undefined) {
          player.sendMessage(`${Formatting.Color.GOLD}アイテムを持っていません。`);
          return;
        }
        const itemEnchantable = selectedItem.getComponent(ItemComponentTypes.Enchantable);
        if (itemEnchantable === undefined) {
          player.sendMessage(`${Formatting.Color.RED}エンチャント情報が取得できませんでした。`);
          return;
        }
        const enchantments = itemEnchantable.getEnchantments();
        if (enchantments.length === 0) {
          player.sendMessage(`${Formatting.Color.GOLD}エンチャントされていません。`);
          return;
        }

        const form = new ModalFormData();
        form.title('エンチャント除去');
        form.label('エンチャント種別およびレベルによって消費ポイントが変わります。');
        form.dropdown(
          'エンチャント',
          enchantments.map((enchantment) => ({
            rawtext: [
              {
                translate: EnchantmentNames[enchantment.type.id as MinecraftEnchantmentTypes],
              },
              { text: ' ' },
              { translate: `enchantment.level.${enchantment.level}` },
            ],
          }))
        );
        form.submitButton('決定');

        system.runTimeout(
          () =>
            form
              .show(player as any)
              .then((response) => {
                if (response.canceled) {
                  Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);

                  return;
                }

                const selectedEnchantmentIndex = response.formValues?.[1] as number;
                const selectedEnchantment = enchantments[selectedEnchantmentIndex];

                let point = 10000 * selectedEnchantment.level;
                if (
                  [MinecraftEnchantmentTypes.Binding, MinecraftEnchantmentTypes.Vanishing].includes(
                    selectedEnchantment.type.id as MinecraftEnchantmentTypes
                  )
                ) {
                  // 呪い
                  point *= 10;
                }

                const confirmForm = new MessageFormData();
                confirmForm.title('エンチャント除去');
                confirmForm.body({
                  rawtext: [
                    { text: `${point}ポイントで` },
                    { translate: selectedItem.localizationKey },
                    { text: 'から' },
                    {
                      translate: EnchantmentNames[selectedEnchantment.type.id as MinecraftEnchantmentTypes],
                    },
                    { text: ' ' },
                    { translate: `enchantment.level.${selectedEnchantment.level}` },
                    { text: 'を除去してもよろしいですか？' },
                  ],
                });
                confirmForm.button1('OK');
                confirmForm.button2('キャンセル');

                confirmForm
                  .show(player as any)
                  .then((response2) => {
                    if (response2.canceled) {
                      Logger.log(`[${player.nameTag}] canceled: ${response2.cancelationReason}`);

                      return;
                    }

                    const score = ScoreboardUtils.getScore(player, SCOREBOARD_POINT);
                    if (score === undefined || score < point) {
                      player.sendMessage(`${Formatting.Color.GOLD}ポイントが足りません。`);
                      return;
                    }
                    ScoreboardUtils.addScore(player, SCOREBOARD_POINT, -point);
                    itemEnchantable.removeEnchantment(selectedEnchantment.type);
                    // set?
                  })
                  .catch(() => null);
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

export default () => system.beforeEvents.startup.subscribe(registerCommand(removeEnchantCommand, commandProcess));
