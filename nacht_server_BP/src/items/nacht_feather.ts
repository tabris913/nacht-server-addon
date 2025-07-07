import { system, TicksPerSecond, world } from '@minecraft/server';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';

import { RuleName } from '../commands/enum';
import {
  Formatting,
  LOC_ERSTE,
  PREFIX_GAMERULE,
  PREFIX_PLAYERNAME,
  PREFIX_TELEPORTRUNID,
  TAG_OPERATOR,
} from '../const';
import { NachtServerAddonItemTypes } from '../enums';
import teleportLogic from '../logic/teleportLogic';
import { MinecraftDimensionTypes } from '../types/index';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import type { LocationInfo } from '../models/location';

// なはとの羽根

export default () =>
  world.afterEvents.itemUse.subscribe((event) => {
    try {
      if (event.itemStack.type.id === NachtServerAddonItemTypes.NachtFeather) {
        event.source.sendMessage([
          `${world.getDynamicProperty(PREFIX_PLAYERNAME + event.source.name) || event.source.name}は `,
          { translate: 'items.nacht_feather.name' },
          'を 空高く掲げた！',
        ]);
        const tpTargets: Array<LocationInfo> = [
          {
            dimension: MinecraftDimensionTypes.Overworld,
            displayName: 'Erste',
            id: '',
            location: LOC_ERSTE,
            name: '',
            owner: '',
          },
        ];
        DynamicPropertyUtils.retrieveLocations(event.source.nameTag).forEach((locationInfo) =>
          tpTargets.push(locationInfo)
        );
        const choices = tpTargets.map((tt) => tt.displayName);
        const timeout = world.getDynamicProperty(PREFIX_GAMERULE + RuleName.teleportTimeout) as number | undefined;

        const form = new ModalFormData();
        form.title('テレポート');
        form.label(`${timeout}秒後にテレポートします。一度決定するとキャンセルはできません。`);
        form.dropdown('転移先', choices, { defaultValueIndex: 0 });
        form.toggle('削除');
        form.submitButton('決定');

        form.show(event.source as any).then((response) => {
          if (response.canceled) {
            Logger.log(`[${event.source.nameTag}] canceled: ${response.cancelationReason}`);
            return;
          }
          const selectedIndex = response.formValues?.[1] as number;
          const deleteFlag = response.formValues?.[2] as boolean;
          const target = tpTargets[selectedIndex];
          if (target) {
            if (deleteFlag) {
              if (target.id !== '') {
                const deleteForm = new ActionFormData();
                deleteForm.title(`${target.displayName} を削除しますか?`);
                deleteForm.button('はい');
                deleteForm.button('いいえ');

                deleteForm.show(event.source as any).then((deleteResponse) => {
                  if (deleteResponse.canceled) {
                    Logger.log(`[${event.source.nameTag}] canceled: ${deleteResponse.cancelationReason}`);
                    return;
                  }
                  switch (deleteResponse.selection) {
                    case 0:
                      // はい
                      world.setDynamicProperty(target.id!, undefined);
                      event.source.sendMessage(`${target.displayName}を削除しました`);
                      break;
                    case 1:
                      // いいえ
                      event.source.sendMessage(`${target.displayName}の削除を取り消しました`);
                  }
                });
              } else {
                event.source.sendMessage(`${Formatting.Color.RED}${target.displayName}は削除できません`);
              }
            } else if (event.source.hasTag(TAG_OPERATOR)) {
              system.runTimeout(() => {
                teleportLogic.teleport(event.source, target.location, target.dimension);
              }, 1);
            } else {
              const dpid = PREFIX_TELEPORTRUNID + event.source.nameTag;
              const runId = system.runTimeout(
                () => {
                  teleportLogic.teleport(event.source, target.location, target.dimension);
                  world.setDynamicProperty(dpid, undefined);
                },
                TicksPerSecond * (timeout || 5)
              );
              world.setDynamicProperty(dpid, runId);
            }
          } else {
            // みつからないよ
            event.source.sendMessage(
              `${Formatting.Color.GOLD}${choices[selectedIndex]}が見つかりませんでした。オペレーターにもメッセージを送りますがログインしてない際は届きません。見落とす場合もあるので対応がない場合は別途ご連絡ください`
            );
            PlayerUtils.sendMessageToOps(
              `${Formatting.Color.GOLD}${event.source.nameTag}が転移先「${choices[selectedIndex]}」の操作に失敗しました`
            );
          }
        });
      }
    } catch (error) {
      Logger.error(error);
    }
  });
