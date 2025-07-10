import { type BlockPermutation, BlockVolume, ListBlockVolume, type Player, system } from '@minecraft/server';

import { COMMAND_MODIFICATION_BLOCK_LIMIT } from '../../const';
import { Location } from '../../models/location';
import CommandUtils from '../../utils/CommandUtils';
import { Logger } from '../../utils/logger';

import type { DimensionBlockVolume } from '../../models/DimensionBlockVolume';

/**
 * 適用範囲のうち指定されたブロックで置換対象ブロックを置き換える
 *
 * @param player プレイヤー
 * @param fillArea 選択範囲
 * @param chunks チャンク群の配列
 * @param fillBlock 埋めるブロック
 * @param replaceBlock 置換対象ブロック
 */
export const fillReplace = (
  player: Player,
  fillArea: DimensionBlockVolume,
  chunks: Array<DimensionBlockVolume>,
  fillBlock: BlockPermutation,
  replaceBlock: BlockPermutation
) => {
  Logger.debug('replace mode');
  const { max: fillAreaMaxPoint, min: fillAreaMinPoint } = fillArea.getBoundingBox();

  system.runJob(
    (function* () {
      let index = 1;
      let total = 0;
      for (const chunksBV of chunks) {
        const { max: chunksMaxPoint, min: chunksMinPoint } = chunksBV.getBoundingBox();
        CommandUtils.buildCommand(player.dimension, 'tickingarea', 'add', chunksMinPoint, chunksMaxPoint, 'FILL', true);
        yield;
        const bv = new BlockVolume(
          new Location(chunksMinPoint).max(fillAreaMinPoint),
          new Location(chunksMaxPoint).min(fillAreaMaxPoint)
        );
        let volume = new ListBlockVolume([]);
        let capacity = 0;
        for (const blockLocation of bv.getBlockLocationIterator()) {
          volume.add([blockLocation]);

          if (volume.getCapacity() >= COMMAND_MODIFICATION_BLOCK_LIMIT) {
            const replaced = player.dimension.fillBlocks(volume, fillBlock, {
              blockFilter: { excludePermutations: [fillBlock], includePermutations: [replaceBlock] },
              ignoreChunkBoundErrors: true,
            });
            player.sendMessage(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
            Logger.debug(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
            index++;

            capacity += replaced.getCapacity();
            volume = new ListBlockVolume([]);
          }
          yield;
        }
        if (volume.getCapacity() > 0) {
          const replaced = player.dimension.fillBlocks(volume, fillBlock, {
            blockFilter: { excludePermutations: [fillBlock] },
            ignoreChunkBoundErrors: true,
          });
          player.sendMessage(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
          Logger.debug(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
          index++;

          capacity += replaced.getCapacity();
          yield;
        }
        player.dimension.runCommand('tickingarea remove FILL');
        total += capacity;
        yield;
      }

      player.sendMessage(`${total} / ${fillArea.getCapacity()} を置き換えました。`);
    })()
  );
};
