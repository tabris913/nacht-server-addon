import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  world,
} from "@minecraft/server";

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:getdp",
        description: "Dynamic Propertyを取得する",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [
          { name: "filter", type: CustomCommandParamType.String },
        ],
      },
      (origin, filter?: string) => {
        try {
          const message = world
            .getDynamicPropertyIds()
            .filter((dpId) => dpId.includes(filter || ""))
            .map(
              (dpId) =>
                `${dpId}: ${JSON.stringify(world.getDynamicProperty(dpId))}`
            )
            .join("\n");

          return { message, status: CustomCommandStatus.Success };
        } catch (error) {
          let message = "予期せぬエラーが発生しました";
          if (error instanceof Error) {
            message += `\n${error.message}`;
          }

          return { message, status: CustomCommandStatus.Failure };
        }
      }
    )
  );
