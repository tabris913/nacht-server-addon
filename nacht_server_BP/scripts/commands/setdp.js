import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, world, } from '@minecraft/server';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
const customCommand = {
    name: 'nacht:setdp',
    description: 'Dynamic Propertyを設定する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'id', type: CustomCommandParamType.String },
        { name: 'nacht:CustomCommandParamType', type: CustomCommandParamType.Enum },
        { name: 'value', type: CustomCommandParamType.String },
    ],
};
const commandProcess = (origin, id, paramType, value) => {
    switch (paramType) {
        case 'Boolean':
            world.setDynamicProperty(id, value.toLowerCase() === 'true');
            break;
        case 'Float':
            world.setDynamicProperty(id, parseFloat(value));
            break;
        case 'Integer':
            world.setDynamicProperty(id, parseInt(value));
            break;
        case 'String':
            world.setDynamicProperty(id, value);
            break;
        default:
            const players = [];
            switch (origin.sourceType) {
                case CustomCommandSource.NPCDialogue:
                    const player1 = PlayerUtils.convertToPlayer(origin.initiator);
                    if (player1) {
                        players.push(player1);
                    }
                    break;
                case CustomCommandSource.Entity:
                    const player2 = PlayerUtils.convertToPlayer(origin.sourceEntity);
                    if (player2) {
                        players.push(player2);
                    }
                    break;
                default:
                    players.push(...PlayerUtils.getOperators());
            }
            players.forEach((player) => player.sendMessage(`${paramType}をセットするには専用コマンドを利用してください。`));
            return { status: CustomCommandStatus.Failure };
    }
    return { message: 'Dynamic Propertyを設定しました。', status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:CustomCommandParamType', [
        'BlockType',
        'Boolean',
        'EntitySelector',
        'Float',
        'Integer',
        'ItemType',
        'Location',
        'PlayerSelector',
        'String',
    ]);
    registerCommand(customCommand, commandProcess)(event);
    registerCommand({
        name: 'nacht:setdpblock',
        description: 'Dynamic Propertyを設定する',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: 'id', type: CustomCommandParamType.String },
            { name: 'value', type: CustomCommandParamType.BlockType },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    })(event);
    registerCommand({
        name: 'nacht:setdpitem',
        description: 'Dynamic Propertyを設定する',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: 'id', type: CustomCommandParamType.String },
            { name: 'value', type: CustomCommandParamType.ItemType },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    })(event);
    registerCommand({
        name: 'nacht:setdpentity',
        description: 'Dynamic Propertyを設定する',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: 'id', type: CustomCommandParamType.String },
            { name: 'value', type: CustomCommandParamType.EntitySelector },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    })(event);
    registerCommand({
        name: 'nacht:setdpplayer',
        description: 'Dynamic Propertyを設定する',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: 'id', type: CustomCommandParamType.String },
            { name: 'value', type: CustomCommandParamType.PlayerSelector },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    })(event);
    registerCommand({
        name: 'nacht:setdplocation',
        description: 'Dynamic Propertyを設定する',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: 'id', type: CustomCommandParamType.String },
            { name: 'value', type: CustomCommandParamType.Location },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    })(event);
});
