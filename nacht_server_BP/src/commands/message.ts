import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  world,
} from "@minecraft/server";
import { format } from "../utils/misc";

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:message",
        description: "メッセージを送信する",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
          { name: "target", type: CustomCommandParamType.EntitySelector },
          { name: "message", type: CustomCommandParamType.String },
        ],
        optionalParameters: [
          { name: "name", type: CustomCommandParamType.String },
        ],
      },
      (
        origin,
        target: { id: string; typeId: string }[],
        message: string,
        name?: string
      ) => {
        try {
          const msgFrom = name || origin.sourceEntity?.nameTag;
          const msg = format(message);
          world
            .getPlayers()
            .filter((player) =>
              target.some(
                (t) => t.id === player.id && t.typeId === player.typeId
              )
            )
            .forEach((player) => player.sendMessage(`[${msgFrom}] ${msg}`));

          return { status: CustomCommandStatus.Success };
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
