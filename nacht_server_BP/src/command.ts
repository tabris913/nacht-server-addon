import {
  CommandPermissionLevel,
  CustomCommandParamType,
  ItemStack,
  system,
  Vector3,
  world,
} from "@minecraft/server";
import { show_confirm } from "./dialog";
import { count_item, has_item } from "./utils";

export default () => {
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:buy",
        description: "アイテム購入コマンド",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
          { name: "item", type: CustomCommandParamType.ItemType },
          { name: "amount", type: CustomCommandParamType.Integer },
          { name: "point", type: CustomCommandParamType.Integer },
        ],
        optionalParameters: [
          { name: "pointless_msg", type: CustomCommandParamType.String },
          { name: "after_msg", type: CustomCommandParamType.String },
        ],
      },
      (
        origin,
        item,
        amount: number,
        point: number,
        pointless_msg?: string,
        after_msg?: string
      ) => {
        const initiator = origin.initiator;
        console.log(`initiator: ${initiator?.nameTag}`);
        if (initiator) {
          const initiatorPlayer = world.getPlayers({
            name: initiator.nameTag,
          })[0];
          if (
            initiator.matches({
              scoreOptions: [{ minScore: point, objective: "point" }],
            }) &&
            initiator.scoreboardIdentity
          ) {
            system.runTimeout(() => {
              origin.sourceEntity?.runCommand(
                `scoreboard players remove ${initiator.nameTag} point ${point}`
              );
              origin.sourceEntity?.runCommand(
                `give ${initiator.nameTag} ${item.id} ${amount}`
              );
              initiatorPlayer.sendMessage(after_msg || "まいどあり！");
            }, 1);
          } else {
            console.info(
              `${initiator.nameTag} failed to buy ${
                item.id
              } because of lack of point (${world.scoreboard
                .getObjective("point")
                ?.getScore(initiator)} < ${point})`
            );
            initiatorPlayer.sendMessage(
              pointless_msg || "ポイントが足りません"
            );
          }
        } else {
          world.sendMessage("このコマンドはNPCしか実行できません");
        }

        return undefined;
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:sell",
        description: "アイテム売却コマンド",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
          { name: "item", type: CustomCommandParamType.ItemType },
          { name: "amount", type: CustomCommandParamType.Integer },
          { name: "point", type: CustomCommandParamType.Integer },
        ],
        optionalParameters: [
          { name: "itemless_msg", type: CustomCommandParamType.String },
          { name: "after_msg", type: CustomCommandParamType.String },
        ],
      },
      (
        origin,
        item,
        amount: number,
        point: number,
        itemless_msg?: string,
        after_msg?: string
      ) => {
        const initiator = origin.initiator;
        console.log(`initiator: ${initiator?.nameTag}`);
        if (initiator) {
          const initiatorPlayer = world.getPlayers({
            name: initiator.nameTag,
          })[0];
          if (
            has_item(initiator, item.id, { min: amount }) &&
            initiator.scoreboardIdentity
          ) {
            system.runTimeout(() => {
              origin.sourceEntity?.runCommand(
                `clear ${initiator.nameTag} ${item.id} 0 ${amount}`
              );
              origin.sourceEntity?.runCommand(
                `scoreboard players add ${initiator.nameTag} point ${point}`
              );
              initiatorPlayer.sendMessage(after_msg || "まいどあり！");
            }, 1);
          } else {
            console.info(
              `${initiator.nameTag} failed to sell ${
                item.id
              } because of lack of amount (${count_item(
                initiator,
                item.id
              )} < ${amount})`
            );
            initiatorPlayer.sendMessage(itemless_msg || "アイテムが足りません");
          }
        } else {
          world.sendMessage("このコマンドはNPCしか実行できません");
        }

        return undefined;
      }
    );

    event.customCommandRegistry.registerCommand(
      {
        name: "nacht:setlocation",
        description: "名前をつけて座標を保存します",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
          {
            name: "name",
            type: CustomCommandParamType.String,
          },
          {
            name: "location",
            type: CustomCommandParamType.Location,
          },
        ],
      },
      (origin, arg1: string, arg2: Vector3) => {
        world.setDynamicProperty(
          `nacht:location_${arg1}`,
          `${arg2.x}_${arg2.y}_${arg2.z}`
        );

        system.runTimeout(
          () =>
            origin.initiator?.dimension.runCommand(
              `tell @a[tag=op] nacht:location_${arg1} に ${arg2.x}_${arg2.y}_${arg2.z} が設定されました`
            ),
          1
        );

        return undefined;
      }
    );
  });
};
