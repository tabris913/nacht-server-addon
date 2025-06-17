import { world } from '@minecraft/server';
import { NachtServerAddonEntityTypes } from '../../enums';
import BaseUtils from '../../utils/BaseUtils';
// ----------------------------------------------------------------------------
// エンティティ削除イベント
//
// - Dynamic Property から紐づけを解除
// - 転移先から削除
// ----------------------------------------------------------------------------
export default () => {
    world.afterEvents.entityDie.subscribe((event) => {
        const entityDp = BaseUtils.findByEntityId(event.deadEntity.id);
        if (entityDp) {
            world.setDynamicProperty(entityDp.id, JSON.stringify(Object.assign(Object.assign({}, entityDp), { entityId: undefined })));
            BaseUtils.removeFromTeleportTargets(entityDp);
        }
    }, { entityTypes: [NachtServerAddonEntityTypes.BaseFlag] });
};
