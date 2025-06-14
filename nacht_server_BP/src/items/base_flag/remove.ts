import { world } from '@minecraft/server';

import { NachtServerAddonEntityTypes } from '../../enums';
import BaseUtils from '../../utils/BaseUtils';
import LocationUtils from '../../utils/LocationUtils';
import { Logger } from '../../utils/logger';
import PlayerUtils from '../../utils/PlayerUtils';

import type { BaseAreaInfo } from '../../models/location';

// ----------------------------------------------------------------------------
// エンティティ削除イベント
//
// - Dynamic Property から紐づけを解除
// - 転移先から削除
// ----------------------------------------------------------------------------

export default () => {
  world.beforeEvents.entityRemove.subscribe((event) => {
    if (event.removedEntity.typeId !== NachtServerAddonEntityTypes.BaseFlag) return;

    Logger.debug(
      `Removed entity was in (${event.removedEntity.location.x} ${event.removedEntity.location.y} ${event.removedEntity.location.z}).`
    );
    const entityDp = BaseUtils.findByEntityId(event.removedEntity.id);
    if (entityDp) {
      world.setDynamicProperty(
        entityDp.id,
        JSON.stringify({ ...entityDp, entityId: undefined } satisfies BaseAreaInfo)
      );

      LocationUtils.findDynamicPropertiesBySuffix(entityDp?.owner, entityDp.index).forEach((location) => {
        world.setDynamicProperty(location.id, undefined);
        const player = PlayerUtils.findPlayer({ nameTag: location.owner });
        if (player) {
          player.sendMessage([
            `${entityDp.owner}の拠点${entityDp.name}から`,
            { translate: 'items.base_flag.name' },
            'が削除されたため、',
            { translate: 'items.nacht_feather.name' },
            'の転移先から削除しました。',
          ]);
          Logger.info(`Removed a teleport target for ${entityDp.id} from ${player.nameTag}.`);
        }
      });
    }
  });
};
