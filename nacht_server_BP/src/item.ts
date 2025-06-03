import { system, world } from "@minecraft/server";

export default () => {
  world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack.type.id === "nacht:nacht_feather") {
      const dpId = "nacht:location_Erste";
      if (world.getDynamicPropertyIds().includes(dpId)) {
        const dp = world.getDynamicProperty(dpId);
        if (typeof dp === "string") {
          const coordinate = dp.split("_").map(parseFloat);
          if (coordinate.length !== 3) {
            world.sendMessage(
              "なはとの羽根が使用されましたが、ERSTE の座標が無効な値になっています"
            );
            return;
          }
          event.source.sendMessage(
            `${event.source.name}は　なはとの羽根を　ほうりなげた！`
          );
          system.runTimeout(
            () =>
              event.source.dimension.runCommand(
                `tp ${event.source.name} ${coordinate[0]} ${coordinate[1]} ${coordinate[2]}`
              ),
            20
          );
        } else {
          world.sendMessage(
            "なはとの羽根が使用されましたが、ERSTE の座標が無効な値になっています"
          );
        }
      } else {
        world.sendMessage(
          "なはとの羽根が使用されましたが、ERSTE の座標(Erste)が設定されていません"
        );
        event.source.dimension.runCommand(
          `tell @a[tag=op] ERSTE の座標が設定されていないので、"/nacht:setlocation Erste <x> <y> <z>"で設定してください`
        );
      }
    }
  });
};
