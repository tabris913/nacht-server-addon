import { Direction, Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import {
  gatherLocationsWithin,
  get2DAreaFromLoc,
  get3DAreaFromLoc,
  isInBaseArea,
  offsetLocation,
  type BaseAreaInfo,
} from "../utils/area";
import { Formatting } from "../const";
import { getBaseDps } from "../utils/dp";

const TYPE_ID = "nacht:base_flag";

const fixBaseZone = (player: Player) => {
  const form = new ActionFormData();
  form.title("拠点範囲を確定していいですか？");
  form.button("はい");
  form.button("いいえ");

  form.show(player).then((response) => {
    if (response.canceled) return;

    switch (response.selection) {
      case 0:
        break;
    }
  });
};

const setConfig = (player: Player) => {
  const form = new ModalFormData();
  form.textField("拠点名", "");
  form.toggle("ボーダー表示", { defaultValue: true });
  form.submitButton("設定");

  form.show(player).then((response) => {
    if (response.canceled) return;

    const baseName = response.formValues?.[0] as string;
    const showBorder = response.formValues?.[1] as boolean;
  });
};

const changeCoop = (player: Player) => {
  const form = new ModalFormData();
  form.title("同居人を選択してください");
  const candidates = world
    .getAllPlayers()
    .filter((pl) => pl.id !== player.id)
    .map((pl) => pl.nameTag)
    .sort();
  candidates.forEach((nameTag) =>
    form.toggle(nameTag, { defaultValue: false })
  );
  form.submitButton("決定");

  form.show(player).then((response) => {
    if (response.canceled) return;
  });
};

export default () => {
  world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    if (
      event.itemStack &&
      event.itemStack.typeId === TYPE_ID &&
      event.isFirstEvent
    ) {
      if (!isInBaseArea(event.player)) {
        event.player.sendMessage(
          `${Formatting.Color.RED}拠点の旗は拠点エリアでのみ使用可能です。`
        );
        return;
      }

      let canPlace = false;
      let next;
      switch (event.blockFace) {
        case Direction.Down:
          break;
        case Direction.East:
          next = event.block.east();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.North:
          next = event.block.north();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.South:
          next = event.block.south();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.Up:
          next = event.block.above();
          if (next?.isAir && event.block.above(2)?.isAir) {
            canPlace = true;
          }
          break;
        case Direction.West:
          next = event.block.west();
          if (next?.isAir && next.above()?.isAir) {
            canPlace = true;
          }
          break;
      }
      // エリアをまたがないかチェック
      if (canPlace && next) {
        const area2D = get2DAreaFromLoc(next.location, 51);
        if (area2D) {
          // 他の範囲との競合チェック
          Object.values(getBaseDps())
            .filter((baseDp) => baseDp.name !== undefined)
            .some((baseDp) => {
              const locations = gatherLocationsWithin({
                northWest: baseDp.northWest,
                southEast: offsetLocation(
                  baseDp.northWest,
                  baseDp.edgeSize - 1
                ),
              });
              const locationSet = new Set(locations);
              gatherLocationsWithin(area2D).forEach((val) =>
                locationSet.add(val)
              );

              return locations.length !== locationSet.size;
            });
        }

        system.runTimeout(() => {
          event.block.dimension.spawnEntity<typeof TYPE_ID>(
            TYPE_ID,
            next.location,
            { initialRotation: 180 + event.player.getRotation().y }
          );
          // パーティクル表示
        }, 1);
      }
    }
  });

  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    if (event.target.typeId === TYPE_ID) {
      const form = new ActionFormData();
      form.button("範囲を確定する");
      form.button("拠点の設定を変更する");
      form.button("同居人を登録する");

      form.show(event.player).then((response) => {
        if (response.canceled) {
          return;
        }
        switch (response.selection) {
          case 0:
            // 範囲確定
            fixBaseZone(event.player);
            break;
          case 1:
            // 設定変更
            setConfig(event.player);
            break;
          case 2:
            // 同居人登録
            changeCoop(event.player);
            break;
        }
      });
    }
  });
};
