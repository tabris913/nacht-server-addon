import { EntityComponentTypes, PlayerPermissionLevel, system, world } from '@minecraft/server';
import { MessageFormData } from '@minecraft/server-ui';

import { TAG_OPERATOR } from '../../const';
import { NachtServerAddonEntityTypes, NachtServerAddonItemTypes } from '../../enums';
import BaseUtils from '../../utils/BaseUtils';
import InventoryUtils from '../../utils/InventoryUtils';
import { Logger } from '../../utils/logger';
import PlayerUtils from '../../utils/PlayerUtils';

export default () => {
  world.afterEvents.entityHurt.subscribe(
    (event) => {
      let baseDp = BaseUtils.findByEntityId(event.hurtEntity.id);
      if (baseDp === undefined) {
        Logger.warning('Base dynamic property not found.');
        baseDp = BaseUtils.findByLocation({ ...event.hurtEntity.location, dimension: event.hurtEntity.dimension });
      }

      const playerEntity = event.damageSource.damagingEntity;
      if (playerEntity) {
        const player = PlayerUtils.convertToPlayer(playerEntity);
        if (player) {
          if (baseDp === undefined) {
            event.hurtEntity.remove();
            player.sendMessage('不正なエンティティを検出したため削除しました。');
            Logger.warning(`Invalid entity was detected and removed.`);

            return;
          }
          if (
            player.playerPermissionLevel === PlayerPermissionLevel.Operator ||
            player.hasTag(TAG_OPERATOR) ||
            baseDp.owner === player.nameTag
          ) {
            // オペレーターまたは拠点の所有者
            if (!InventoryUtils.hasItem(playerEntity, NachtServerAddonItemTypes.BaseFlag)) {
              // 拠点の旗を所持していない
              const form = new MessageFormData();
              form.title('拠点の旗を破壊する');
              form.body('拠点の旗をアイテム化すると転移先から解除されます。');
              form.button1('OK');
              form.button2('キャンセル');

              system.run(() =>
                form
                  .show(player as any)
                  .then((response) => {
                    if (response.canceled) {
                      Logger.log(`[${player.nameTag}] canceled: ${response.cancelationReason}`);
                      return;
                    }

                    switch (response.selection) {
                      case 0:
                        event.hurtEntity.getComponent(EntityComponentTypes.Health)?.setCurrentValue(0);
                        world.setDynamicProperty(baseDp.id, JSON.stringify({ ...baseDp, entityId: undefined }));
                        BaseUtils.removeFromTeleportTargets(baseDp);
                        InventoryUtils.giveItem(player, NachtServerAddonItemTypes.BaseFlag, 1);
                        break;
                      default:
                        event.hurtEntity.getComponent(EntityComponentTypes.Health)?.resetToMaxValue();
                    }
                  })
                  .catch(() => null)
              );

              return;
            } else {
              player.sendMessage([{ translate: 'items.base_flag.name' }, 'を所持している状態では破壊できません。']);
            }
          } else {
            player.sendMessage('所有者しか破壊できません。');
          }
        } else {
          Logger.warning('Damage source entity cannot be converted to player.');
        }
      } else {
        Logger.warning('Damage source entity is undefined.');
      }
      // 破壊不可能 = 体力を全回復
      event.hurtEntity.getComponent(EntityComponentTypes.Health)?.resetToMaxValue();
    },
    { entityTypes: [NachtServerAddonEntityTypes.BaseFlag] }
  );
};
