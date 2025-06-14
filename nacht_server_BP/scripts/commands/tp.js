import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from '@minecraft/server';
import teleportLogic from '../logic/teleportLogic';
import { registerCommand } from './common';
var DimensionTypes;
(function (DimensionTypes) {
    DimensionTypes["Overworld"] = "overworld";
    DimensionTypes["Nether"] = "nether";
    DimensionTypes["TheEnd"] = "the_end";
})(DimensionTypes || (DimensionTypes = {}));
const tpCommand = {
    name: 'nacht:tp',
    description: '転移する',
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
        { name: 'target', type: CustomCommandParamType.PlayerSelector },
        { name: 'location', type: CustomCommandParamType.Location },
    ],
    optionalParameters: [{ name: 'nacht:DimensionTypes', type: CustomCommandParamType.Enum }],
};
const commandProcess = (origin, target, location, dimension) => {
    system.runTimeout(() => target.forEach((player) => teleportLogic.teleport(player, location, (dimension ? `minecraft:${dimension}` : player.dimension.id))), 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:DimensionTypes', [
        DimensionTypes.Nether,
        DimensionTypes.Overworld,
        DimensionTypes.TheEnd,
    ]);
    registerCommand(tpCommand, commandProcess)(event);
});
