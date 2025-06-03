import {
  BlockType,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  Entity,
  ItemType,
  Player,
  system,
  type Vector3,
} from "@minecraft/server";

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("nacht:sampleEnum", [
      "a",
      "b",
      "c",
    ]);

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:testparams",
        description: "コマンドパラメータの確認を行う (デバッグ用)",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
          { name: "blockType", type: CustomCommandParamType.BlockType },
          {
            name: "entitySelector",
            type: CustomCommandParamType.EntitySelector,
          },
          { name: "nacht:sampleEnum", type: CustomCommandParamType.Enum },
          { name: "itemType", type: CustomCommandParamType.ItemType },
          { name: "location", type: CustomCommandParamType.Location },
          {
            name: "playerSelector",
            type: CustomCommandParamType.PlayerSelector,
          },
        ],
      },
      (
        origin,
        blockType: BlockType,
        entitySelector: Array<Entity>,
        enumParam: string,
        itemType: ItemType,
        location: Vector3,
        playerSelector: Array<Player>
      ) => {
        try {
          console.log(blockType, JSON.stringify(blockType));
          console.log(
            entitySelector,
            JSON.stringify(entitySelector),
            entitySelector[0]?.isValid
          );
          console.log(enumParam, JSON.stringify(enumParam));
          console.log(itemType, JSON.stringify(itemType));
          console.log(location, JSON.stringify(location));
          console.log(
            playerSelector,
            JSON.stringify(playerSelector),
            playerSelector[0]?.isValid
          );

          return { status: CustomCommandStatus.Success };
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
