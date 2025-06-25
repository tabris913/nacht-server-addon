import { EntityComponentTypes, PlayerPermissionLevel, world } from '@minecraft/server';

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
              event.hurtEntity.getComponent(EntityComponentTypes.Health)?.setCurrentValue(0);
              return; // 破壊可能
            }
            player.sendMessage([{ translate: 'items.base_flag.name' }, 'を所持している状態では破壊できません。']);
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
