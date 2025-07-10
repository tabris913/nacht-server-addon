import { type BlockPermutation, BlockVolume, type Player, system } from '@minecraft/server';

import { Location } from '../../models/location';
import { MinecraftBlockTypes } from '../../types/index';
import CommandUtils from '../../utils/CommandUtils';

import type { DimensionBlockVolume } from '../../models/DimensionBlockVolume';

/**
 * 適用範囲の空気ブロックのみを指定されたブロックで置き換える
 *
 * @param player プレイヤー
 * @param fillArea 選択範囲
 * @param chunks チャンク群の配列
 * @param fillBlock 埋めるブロック
 */
export const fillKeep = (
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
        const replaced = player.dimension.fillBlocks(
          new BlockVolume(
            new Location(chunksMinPoint).max(fillAreaMinPoint),
            new Location(chunksMaxPoint).min(fillAreaMaxPoint)
          ),
          fillBlock,
          {
            blockFilter: { excludePermutations: [fillBlock], includeTypes: [MinecraftBlockTypes.Air] },
            ignoreChunkBoundErrors: true,
          }
        );
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
