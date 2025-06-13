import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from '@minecraft/server';
import { registerCommand } from './common';
var ExchangeTarget;
(function (ExchangeTarget) {
    ExchangeTarget["point"] = "point";
    ExchangeTarget["coin"] = "coin";
    ExchangeTarget["xp"] = "xp";
})(ExchangeTarget || (ExchangeTarget = {}));
var ExchangeSource;
(function (ExchangeSource) {
    ExchangeSource["point"] = "point";
    ExchangeSource["coin"] = "coin";
    ExchangeSource["xp"] = "xp";
})(ExchangeSource || (ExchangeSource = {}));
const pointCommand = {
    name: 'nacht:exchange',
    description: 'ポイントを交換する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'nacht:ExchangeSource', type: CustomCommandParamType.Enum },
        { name: 'nacht:ExchangeTarget', type: CustomCommandParamType.Enum },
        { name: 'target', type: CustomCommandParamType.Integer },
    ],
};
const commandProcess = () => {
    return { status: CustomCommandStatus.Success };
};
export default () => {
    system.beforeEvents.startup.subscribe((event) => {
        event.customCommandRegistry.registerEnum('nacht:PointSubCommand', [
            ExchangeTarget.coin,
            ExchangeTarget.point,
            ExchangeTarget.xp,
        ]);
        registerCommand(pointCommand, commandProcess)(event);
    });
};
