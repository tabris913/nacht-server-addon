import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  Vector3,
  world,
} from "@minecraft/server";
import { Logger } from "../utils/logger";

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpstring",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.String },
        ],
      },
      (origin, id: string, value: string) => {
        world.setDynamicProperty(id, value);

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpblock",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.BlockType },
        ],
      },
      (origin, id: string, value) => {
        Logger.log(JSON.stringify(value));
        world.setDynamicProperty(id, JSON.stringify(value));

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpitem",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.ItemType },
        ],
      },
      (origin, id: string, value: { id: string }) => {
        world.setDynamicProperty(id, value.id);

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpfloat",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.Float },
        ],
      },
      (origin, id: string, value: number) => {
        world.setDynamicProperty(id, value);

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpinteger",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.Integer },
        ],
      },
      (origin, id: string, value: number) => {
        world.setDynamicProperty(id, value);

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpboolean",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.Boolean },
        ],
      },
      (origin, id: string, value: boolean) => {
        world.setDynamicProperty(id, value);

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpentity",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.EntitySelector },
        ],
      },
      (origin, id: string, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdpplayer",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.PlayerSelector },
        ],
      },
      (origin, id: string, value) => {
        world.setDynamicProperty(id, JSON.stringify(value));

        return { status: CustomCommandStatus.Success };
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setdplocation",
        description: "Dynamic Propertyを設定する",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "id", type: CustomCommandParamType.String },
          { name: "value", type: CustomCommandParamType.Location },
        ],
      },
      (origin, id: string, value: Vector3) => {
        world.setDynamicProperty(id, value);

        return { status: CustomCommandStatus.Success };
      }
    );

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
