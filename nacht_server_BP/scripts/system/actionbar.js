import { system, world } from '@minecraft/server';
import { PREFIX_PLAYERNAME } from '../const';
import { MinecraftEntityTypes } from '../types/index';
import AreaUtils from '../utils/AreaUtils';
import BaseUtils from '../utils/BaseUtils';
const show = (player) => {
    var _a, _b;
    const entity = (_a = player.getEntitiesFromViewDirection({ maxDistance: 10 })[0]) === null || _a === void 0 ? void 0 : _a.entity;
    const dimLoc = Object.assign(Object.assign({}, player.location), { dimension: player.dimension });
    const base = BaseUtils.findByLocation(dimLoc);
    const content = [
        {
            text: '現在地: ' +
                (AreaUtils.isInBaseArea(dimLoc)
                    ? '拠点エリア'
                    : AreaUtils.isInExploringArea(dimLoc)
                        ? '探索エリア'
                        : '街エリア'),
        },
        {
            text: base !== undefined
                ? `\n拠点: ${base.name} (所有者: ${world.getDynamicProperty(`${PREFIX_PLAYERNAME}${base.owner}`) || base.owner})`
                : '',
        },
    ];
    if (entity !== undefined && entity.isValid) {
        if (entity.typeId === MinecraftEntityTypes.Player) {
            content.push({
                text: `\n${entity.nameTag}: ${world.getDynamicProperty(`${PREFIX_PLAYERNAME}${entity.nameTag}`) || '未設定'}`,
            });
        }
        else {
            content.push({ text: `\nView at ` }, { translate: entity.localizationKey });
        }
    }
    else {
        const block = (_b = player.getBlockFromViewDirection({ maxDistance: 10 })) === null || _b === void 0 ? void 0 : _b.block;
        if (block !== undefined && block.isValid) {
            content.push({ text: '\nView at ' }, { translate: block.localizationKey });
        }
    }
    player.onScreenDisplay.setActionBar(content);
};
export default () => {
    system.runInterval(() => {
        system.runJob((function* () {
            for (const player of world.getAllPlayers()) {
                yield show(player);
            }
        })());
    });
};
