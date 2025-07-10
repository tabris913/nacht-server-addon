import { BlockVolume, ListBlockVolume, system, type BlockPermutation, type Player } from '@minecraft/server';

import { Location } from '../../models/location';
import CommandUtils from '../../utils/CommandUtils';

import type { DimensionBlockVolume } from '../../models/DimensionBlockVolume';
import LocationUtils from '../../utils/LocationUtils';

/**
 * 適用範囲の表面のみを指定されたブロックで埋め、内側は維持する
 *
 * @param player プレイヤー
 * @param fillArea 選択範囲
 * @param chunks チャンク群の配列
 * @param fillBlock 埋めるブロック
 */
export const fillOutline = (
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
        for (const blockLocation of area.getBlockLocationIterator()) {
          if (LocationUtils.isSurface(blockLocation, fillArea)) {
            list.add([blockLocation]);
          }
        }
        const replaced = player.dimension.fillBlocks(list, fillBlock, {
          blockFilter: { excludePermutations: [fillBlock] },
          ignoreChunkBoundErrors: true,
        });
        yield;
        player.dimension.runCommand('tickingarea remove FILL');
        const capacity = replaced.getCapacity();
        player.sendMessage(`step: ${index} / ${chunks.length}; blocks: ${capacity} / ${chunksBV.getCapacity()}`);
        index++;
        total += capacity;
        yield;
      }

      player.sendMessage(`${total} / ${fillArea.getCapacity()} を置き換えました。`);
    })()
  );
};
