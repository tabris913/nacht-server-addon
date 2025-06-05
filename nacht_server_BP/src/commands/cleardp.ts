import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  world,
} from "@minecraft/server";

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    // event.customCommandRegistry.registerEnum(
    //   "nacht:dynamicPropertyIds",
    //   world.getDynamicPropertyIds()
    // );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:cleardp",
        description: "Dynamic Propertyをクリアする",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          {
            name: "nacht:dynamicPropertyIds",
            type: CustomCommandParamType.String,
          },
        ],
      },
      (origin, id: string) => {
        try {
          if (world.getDynamicPropertyIds().includes(id)) {
            world.setDynamicProperty(id, undefined);

            return { status: CustomCommandStatus.Success };
          }

          return {
            message: `${id} というDynamic Propertyは存在しません`,
            status: CustomCommandStatus.Failure,
          };
        } catch (error) {
          let message = "予期せぬエラーが発生しました";
          if (error instanceof Error) {
            message += `\n${error.message}`;
          }

          return { message, status: CustomCommandStatus.Failure };
        }
      }
    );
  });
