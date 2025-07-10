import { BlockVolume, ListBlockVolume, system, type BlockPermutation, type Player } from '@minecraft/server';

import { COMMAND_MODIFICATION_BLOCK_LIMIT } from '../../const';
import { Location } from '../../models/location';
import CommandUtils from '../../utils/CommandUtils';
import { Logger } from '../../utils/logger';

import type { DimensionBlockVolume } from '../../models/DimensionBlockVolume';

/**
 * 適用範囲を指定されたブロックですべて埋める
 *
 * @param player プレイヤー
 * @param fillArea 選択範囲
 * @param chunks チャンク群の配列
 * @param fillBlock 埋めるブロック
 */
export const fillDefault = (
  player: Player,
  fillArea: DimensionBlockVolume,
  chunks: Array<DimensionBlockVolume>,
  fillBlock: BlockPermutation
) => {
  Logger.debug('default mode');
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
              blockFilter: { excludePermutations: [fillBlock] },
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

      player.sendMessage(`${total} / ${fillArea.getCapacity()} ブロックを置き換えました。`);
    })()
  );
};
