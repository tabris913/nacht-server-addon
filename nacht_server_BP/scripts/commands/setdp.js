import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, world, } from "@minecraft/server";
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpstring",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.String },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, value);
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpblock",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.BlockType },
        ],
    }, (origin, id, value) => {
        console.log(JSON.stringify(value));
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpitem",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.ItemType },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, value.id);
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpfloat",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.Float },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, value);
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpinteger",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.Integer },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, value);
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpboolean",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.Boolean },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, value);
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpentity",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.EntitySelector },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdpplayer",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.PlayerSelector },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));
        return { status: CustomCommandStatus.Success };
    });
    event.customCommandRegistry.registerCommand({
        name: "nacht:setdplocation",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "value", type: CustomCommandParamType.Location },
        ],
    }, (origin, id, value) => {
        world.setDynamicProperty(id, value);
        return { status: CustomCommandStatus.Success };
    });
    // event.customCommandRegistry.registerCommand(
    //   {
    //     name: "nacht:setdpenum",
    //     description: "Dynamic Propertyを設定する",
    //     permissionLevel: CommandPermissionLevel.Admin,
    //     mandatoryParameters: [
    //       { name: "id", type: CustomCommandParamType.String },
    //       { name: "value", type: CustomCommandParamType.Enum },
    //     ],
    //   },
    //   (origin, id: string, value) => {
    //     world.setDynamicProperty(id, JSON.stringify(value));
    //     return void 0;
    //   }
    // );
});
