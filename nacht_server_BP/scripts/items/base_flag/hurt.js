import { EntityComponentTypes, world } from '@minecraft/server';
import { TAG_OPERATOR } from '../../const';
import { NachtServerAddonEntityTypes, NachtServerAddonItemTypes } from '../../enums';
import BaseUtils from '../../utils/BaseUtils';
import InventoryUtils from '../../utils/InventoryUtils';
import { Logger } from '../../utils/logger';
import PlayerUtils from '../../utils/PlayerUtils';
export default () => {
    world.afterEvents.entityHurt.subscribe((event) => {
        var _a, _b;
        if (event.hurtEntity.typeId !== NachtServerAddonEntityTypes.BaseFlag)
            return;
        const baseDp = BaseUtils.findByEntityId(event.hurtEntity.id);
        if (baseDp === undefined)
            return; // 破壊可能
        const playerEntity = event.damageSource.damagingEntity;
        if (playerEntity) {
            const player = PlayerUtils.convertToPlayer(playerEntity);
            if (player) {
                if (player.isOp() || player.hasTag(TAG_OPERATOR) || baseDp.owner === player.nameTag) {
                    // オペレーターまたは拠点の所有者
                    if (!InventoryUtils.hasItem(playerEntity, NachtServerAddonItemTypes.BaseFlag)) {
                        // 拠点の旗を所持していない
                        (_a = event.hurtEntity.getComponent(EntityComponentTypes.Health)) === null || _a === void 0 ? void 0 : _a.resetToMinValue();
                        return; // 破壊可能
                    }
                    player.sendMessage([{ translate: 'items.base_flag.name' }, 'を所持している状態では破壊できません。']);
                }
                else {
                    player.sendMessage('所有者しか破壊できません。');
                }
            }
            else {
                Logger.warning('Damage source entity cannot be converted to player.');
            }
        }
        else {
            Logger.warning('Damage source entity is undefined.');
        }
        // 破壊不可能 = 体力を全回復
        (_b = event.hurtEntity.getComponent(EntityComponentTypes.Health)) === null || _b === void 0 ? void 0 : _b.resetToMaxValue();
    });
};
