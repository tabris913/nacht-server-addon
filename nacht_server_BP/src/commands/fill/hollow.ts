import { BlockVolume, ListBlockVolume, system, type BlockPermutation, type Player } from '@minecraft/server';

import { Location } from '../../models/location';
import { MinecraftBlockTypes } from '../../types/index';
import CommandUtils from '../../utils/CommandUtils';

import type { DimensionBlockVolume } from '../../models/DimensionBlockVolume';
import LocationUtils from '../../utils/LocationUtils';

/**
 * 適用範囲の表面のみを指定されたブロックで埋め、内側を空気で満たす
 *
 * @param player プレイヤー
 * @param fillArea 選択範囲
 * @param chunks チャンク群の配列
 * @param fillBlock 埋めるブロック
 */
export const fillHollow = (
  player: Player,
  fillArea: DimensionBlockVolume,
  chunks: Array<DimensionBlockVolume>,
  fillBlock: BlockPermutation
) => {
  const { max: fillAreaMaxPoint, min: fillAreaMinPoint } = fillArea.getBoundingBox();

  system.runJob(
    (function* () {
      let index = 1;
      let total = 0;
      for (const chunksBV of chunks) {
        const { max: chunksMaxPoint, min: chunksMinPoint } = chunksBV.getBoundingBox();
        CommandUtils.buildCommand(player.dimension, 'tickingarea', 'add', chunksMinPoint, chunksMaxPoint, 'FILL', true);
        yield;
        const area = new BlockVolume(
          new Location(chunksMinPoint).max(fillAreaMinPoint),
          new Location(chunksMaxPoint).min(fillAreaMaxPoint)
        );
        const list = new ListBlockVolume([]);
        const airList = new ListBlockVolume([]);
        for (const blockLocation of area.getBlockLocationIterator()) {
          if (LocationUtils.isSurface(blockLocation, fillArea)) {
            list.add([blockLocation]);
          } else {
            airList.add([blockLocation]);
          }
        }
        const replaced = player.dimension.fillBlocks(list, fillBlock, {
          blockFilter: { excludePermutations: [fillBlock] },
          ignoreChunkBoundErrors: true,
        });
        const replacedAir = player.dimension.fillBlocks(airList, MinecraftBlockTypes.Air, {
          blockFilter: { excludeTypes: [MinecraftBlockTypes.Air] },
          ignoreChunkBoundErrors: true,
        });
        // /**
        //  * 内側の領域
        //  */
        // const insideArea = new BlockVolume(
        //   new Location(chunksMinPoint).max(new Location(fillAreaMinPoint).offset(1)),
        //   new Location(chunksMaxPoint).min(new Location(fillAreaMaxPoint).offsetNega(1))
        // );
        // // 内側を空気で置換
        // const replacedAir = player.dimension.fillBlocks(insideArea, MinecraftBlockTypes.Air, {
        //   blockFilter: { excludeTypes: [MinecraftBlockTypes.Air] },
        //   ignoreChunkBoundErrors: true,
        // });
        // yield;
        // // 全領域を埋める (内側も)
        // // --> 空気以外を置換するようにすると表面の空気が埋められないため
        // const replaced = player.dimension.fillBlocks(
        //   new BlockVolume(
        //     new Location(chunksMinPoint).max(fillAreaMinPoint),
        //     new Location(chunksMaxPoint).min(fillAreaMaxPoint)
        //   ),
        //   fillBlock,
        //   { blockFilter: { excludePermutations: [fillBlock] }, ignoreChunkBoundErrors: true }
        // );
        // yield;
        // // 内側を再度空気で置換
        // player.dimension.fillBlocks(insideArea, MinecraftBlockTypes.Air, { ignoreChunkBoundErrors: true });
        // yield;
        player.dimension.runCommand('tickingarea remove FILL');
        // const capacity = replaced.getCapacity() - insideArea.getCapacity() + replacedAir.getCapacity();
        const capacity = replaced.getCapacity() + replacedAir.getCapacity();
        player.sendMessage(`step: ${index} / ${chunks.length}; blocks: ${capacity} / ${chunksBV.getCapacity()}`);
        index++;
        total += capacity;
        yield;
      }

      player.sendMessage(`${total} / ${fillArea.getCapacity()} を置き換えました。`);
    })()
  );
};
