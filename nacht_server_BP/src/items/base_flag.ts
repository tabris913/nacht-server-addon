import {
  Direction,
  type Player,
  system,
  type VectorXZ,
  world,
} from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Formatting, TAG_OPERATOR } from "../const";
import InventoryUtils from "../utils/InventoryUtils";
import type { AreaVertices, BaseAreaInfo } from "../models/location";
import DynamicPropertyUtils from "../utils/DynamicPropertyUtils";
import LocationUtils from "../utils/LocationUtils";
import AreaUtils from "../utils/AreaUtils";

const TYPE_ID = "nacht:base_flag";

/**
 * 与えられた平面が拠点エリアの範囲外にはみ出してないか確認する
 *
 * @param area2D
 */
const isOutOfBaseArea = (area2D: AreaVertices) => {
  if (area2D.southEast.x < -6400 && area2D.northWest.z < 0) return true;
  if (
    -6400 <= area2D.southEast.x &&
    area2D.northWest.x <= 6400 &&
    area2D.northWest.z <= 6400
  ) {
    return true;
  }
  if (6400 < area2D.northWest.x && area2D.northWest.z < 0) return true;

  return false;
};

/**
 * 与えられた平面が既に確定された拠点と重複しているか確認する
 *
 * @param area2D
 * @returns
 */
const hasOverlappingBlocks = (area2D: AreaVertices) =>
  DynamicPropertyUtils.retrieveBases()
    .filter((baseDp) => baseDp.name !== undefined)
    .some((baseDp) => {
      const baseArea: AreaVertices = {
        northWest: baseDp.northWest,
        southEast: LocationUtils.offsetLocation(
          baseDp.northWest,
          baseDp.edgeSize - 1
        ),
      };

      // const locations = gatherLocationsWithin({
      //   northWest: baseDp.northWest,
      //   southEast: offsetLocation(baseDp.northWest, baseDp.edgeSize - 1),
      // });
      // const locationSet = new Set(locations);
      // gatherLocationsWithin(area2D).forEach((val) => locationSet.add(val));

      // return locations.length !== locationSet.size;

      return LocationUtils.isOverlapped(area2D, baseArea, {
        area2: { x: baseDp.edgeSize, z: baseDp.edgeSize },
      });
    });

const isInBaseArea = (location: VectorXZ) =>
  DynamicPropertyUtils.retrieveBases()
    .filter((baseDp) => baseDp.name !== undefined)
    .some((baseDp) =>
      LocationUtils.isInArea(location, {
        northWest: baseDp.northWest,
        southEast: LocationUtils.offsetLocation(
          baseDp.northWest,
          baseDp.edgeSize - 1
        ),
      })
    );

/**
 * 拠点範囲を確定する
 *
 * @param player
 * @param dp
 */
const fixBaseZone = (
  player: Player,
  flagLocation: VectorXZ,
  dp: BaseAreaInfo
) => {
  if (dp.entityId === undefined) {
    player.sendMessage({});

    return;
  }
  const area2D = LocationUtils.make2DAreaFromLoc(flagLocation, dp.edgeSize);
  if (area2D) {
    if (hasOverlappingBlocks(area2D)) {
      // 重複あり
      player.sendMessage(
        `${Formatting.Color.RED}既存の拠点と範囲が重なっています。`
      );

      return;
    }
    if (isOutOfBaseArea(area2D)) {
      player.sendMessage(
        `${Formatting.Color.RED}拠点エリアの範囲外に拠点はつくれません。`
      );

      return;
    }
  }
  const form = new ActionFormData();
  form.title("拠点範囲を確定していいですか？");
  form.button("はい");
  form.button("いいえ");

  form.show(player).then((response) => {
    if (response.canceled) return;

    switch (response.selection) {
      case 0:
        world.getEntity(dp.entityId!)?.kill();
        world.setDynamicProperty(
          dp.id,
          JSON.stringify({
            ...dp,
            entityId: undefined,
            northWest: {
              x: flagLocation.x - (dp.edgeSize - 1) / 2,
              z: flagLocation.z - (dp.edgeSize - 1) / 2,
            },
          })
        );
        InventoryUtils.giveItem(player, TYPE_ID);
        break;
    }
  });
};

/**
 * 拠点の設定を変更する
 *
 * @param player
 * @param dp
 */
const setConfig = (player: Player, dp: BaseAreaInfo) => {
  const form = new ModalFormData();
  form.textField("拠点名", "", { defaultValue: dp.name });
  form.toggle("ボーダー表示", { defaultValue: dp.showBorder });
  form.submitButton("設定");

  form.show(player).then((response) => {
    if (response.canceled) return;

    const baseName = response.formValues?.[0] as string;
    const showBorder = response.formValues?.[1] as boolean;

    if (baseName.length === 0) {
      player.sendMessage(
        `${Formatting.Color.GOLD}拠点名が設定されていません。`
      );

      return;
    }

    world.setDynamicProperty(
      dp.id,
      JSON.stringify({ ...dp, name: baseName, showBorder })
    );
  });
};

/**
 * 同居人を設定する
 *
 * @param player
 * @param dp
 */
const changeCoop = (player: Player, dp: BaseAreaInfo) => {
  const form = new ModalFormData();
  form.title("同居人を選択してください");
  const candidates = world
    .getAllPlayers()
    .filter(
      (pl) => pl.id !== player.id && !pl.isOp() && !pl.hasTag(TAG_OPERATOR)
    )
    .map((pl) => pl.nameTag)
    .sort();
  candidates.forEach((nameTag) =>
    form.toggle(nameTag, { defaultValue: dp.participants.includes(nameTag) })
  );
  form.submitButton("決定");

  form.show(player).then((response) => {
    if (response.canceled) return;

    const c = response.formValues?.map((value, index) =>
      value ? candidates[index] : undefined
    );

    world.setDynamicProperty(dp.id, JSON.stringify({ ...dp, participants: c }));
  });
};

export default () => {
  world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    try {
      if (event.block.dimension.id !== "overworld") {
        return;
      }
      if (isInBaseArea(event.block.location)) {
        // 既に存在する拠点範囲で使用した場合
        event.player.sendMessage("拠点には置けません。");
        return;
      } else {
        const noNameBase = DynamicPropertyUtils.retrieveBases(
          event.player.nameTag
        ).filter((dp) => dp.name === undefined);
        if (noNameBase.length === 0) {
          event.player.sendMessage([
            Formatting.Color.RED,
            { translate: "items.base_flag.name" },
            "の購入履歴がありません。",
          ]);

          return;
        }

        if (
          event.itemStack &&
          event.itemStack.typeId === TYPE_ID &&
          event.isFirstEvent
        ) {
          if (!AreaUtils.existsInBaseArea(event.player)) {
            event.player.sendMessage([
              Formatting.Color.RED,
              { translate: "items.base_flag.name" },
              "は拠点エリアでのみ使用可能です。",
            ]);
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
          if (canPlace && next) {
            // 置ける
            const area2D = LocationUtils.make2DAreaFromLoc(
              next.location,
              noNameBase[0].edgeSize
            );
            if (area2D) {
              if (hasOverlappingBlocks(area2D)) {
                // 重複あり
                event.player.sendMessage(
                  `${Formatting.Color.RED}既存の拠点と範囲が重なっています。`
                );

                return;
              }
              if (isOutOfBaseArea(area2D)) {
                // エリアをまたぐ
                event.player.sendMessage(
                  `${Formatting.Color.RED}拠点エリアの範囲外に拠点はつくれません。`
                );

                return;
              }
            }

            system.runTimeout(() => {
              const entity = event.block.dimension.spawnEntity<typeof TYPE_ID>(
                TYPE_ID,
                next.location,
                {
                  initialPersistence: true,
                  initialRotation: 180 + event.player.getRotation().y,
                }
              );
              world.setDynamicProperty(
                noNameBase[0].id,
                JSON.stringify({ ...noNameBase[0], entityId: entity.id })
              );
              // パーティクル表示
            }, 1);
          } else {
            // 置けない場合は何も起こらない
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    try {
      const playerBases = DynamicPropertyUtils.retrieveBases(
        event.player.nameTag
      );
      if (!playerBases.some((dp) => dp.entityId === event.target.id)) {
        // 別の人の旗をインタラクトしても何も起きない
        return;
      }
      const noNameBase = playerBases.filter((dp) => dp.name === undefined);
      if (noNameBase.length === 0) {
        event.player.sendMessage([
          Formatting.Color.RED,
          { translate: "items.base_flag.name" },
          "の購入履歴がありません。",
        ]);

        return;
      }

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
              fixBaseZone(event.player, event.target.location, noNameBase[0]);
              break;
            case 1:
              // 設定変更
              setConfig(event.player, noNameBase[0]);
              break;
            case 2:
              // 同居人登録
              changeCoop(event.player, noNameBase[0]);
              break;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
};
