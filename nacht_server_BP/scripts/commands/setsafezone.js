import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from '@minecraft/server';
import { COUNTER_SAFE_AREA, PREFIX_SAFEAREA } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import DynamicPropertyUtils from '../utils/DynamicPropertyUtils';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
export var Mode;
(function (Mode) {
    Mode["cancel"] = "cancel";
    Mode["set"] = "set";
})(Mode || (Mode = {}));
const setSafeZoneCommand = {
    name: 'nacht:setsafezone',
    description: '安全地帯を設定する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ name: 'nacht:AreaSetMode', type: CustomCommandParamType.Enum }],
    optionalParameters: [
        { name: 'from', type: CustomCommandParamType.Location },
        { name: 'to', type: CustomCommandParamType.Location },
    ],
};
/**
 *
 * @param origin
 * @param mode
 * @param from
 * @param to
 * @returns
 * @throws This function can throw errors.
 *
 * {@link UndefinedSourceOrInitiatorError}
 *
 * {@link NachtServerAddonError}
 */
const commandProcess = (origin, mode, from, to) => {
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    switch (mode) {
        case Mode.set:
            if (from === undefined || to === undefined)
                throw new NachtServerAddonError('座標が設定されていません。');
            const blockVolume = new DimensionBlockVolume(from, to, player.dimension);
            system.runTimeout(() => {
                const index = DynamicPropertyUtils.getNextCounter(COUNTER_SAFE_AREA);
                const id = `${PREFIX_SAFEAREA}${index}`;
                world.setDynamicProperty(id, JSON.stringify(Object.assign({ dimension: blockVolume.dimension.id, id,
                    index }, blockVolume.getBoundingBox())));
                DynamicPropertyUtils.countUpCounter(COUNTER_SAFE_AREA);
                player.sendMessage('指定された範囲を安全地帯に設定しました。');
            }, 1);
            break;
        case Mode.cancel:
            system.runTimeout(() => {
                const here = DynamicPropertyUtils.retrieveSafeAreas().find((dp) => {
                    const blockVolume = new DimensionBlockVolume(dp.min, dp.max, dp.dimension);
                    return (blockVolume.isInside(player.location) ||
                        blockVolume.isInside(Object.assign(Object.assign({}, player.location), { y: player.location.y - 1 })));
                });
                if (here === undefined) {
                    player.sendMessage('今いる場所は安全地帯ではありません。');
                    return;
                }
                world.setDynamicProperty(here.id, undefined);
                player.sendMessage('安全地帯を解除しました。');
            }, 1);
            break;
    }
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:AreaSetMode', [Mode.cancel, Mode.set]);
    registerCommand(setSafeZoneCommand, commandProcess)(event);
});
