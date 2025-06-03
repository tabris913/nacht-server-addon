import {
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  system,
  world,
} from "@minecraft/server";
import { TAG_OPERATOR } from "../const";
import { format } from "../utils/misc";

export default () =>
  system.beforeEvents.startup.subscribe((event) =>
    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:messageop",
        description: "オペレーターにメッセージを送信する",
        permissionLevel: CommandPermissionLevel.Any,
        mandatoryParameters: [
          { name: "message", type: CustomCommandParamType.String },
        ],
      },
      (origin, message: string) => {
        try {
          const msg = format(message);
          world
            .getPlayers({ tags: [TAG_OPERATOR] })
            .forEach((player) =>
              player.sendMessage(`[${origin.sourceEntity?.nameTag}] ${msg}`)
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
    )
  );
