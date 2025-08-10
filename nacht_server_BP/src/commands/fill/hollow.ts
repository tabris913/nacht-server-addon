import { BlockVolume, ListBlockVolume, system, type BlockPermutation, type Player } from '@minecraft/server';

import { COMMAND_MODIFICATION_BLOCK_LIMIT } from '../../const';
import { Location } from '../../models/location';
import { MinecraftBlockTypes } from '../../types/index';
import CommandUtils from '../../utils/CommandUtils';
import LocationUtils from '../../utils/LocationUtils';
import { Logger } from '../../utils/logger';

import type { DimensionBlockVolume } from '../../models/DimensionBlockVolume';

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
  Logger.debug('hollow mode');
  const fillAreaMaxPoint = fillArea.getMax(),
    fillAreaMinPoint = fillArea.getMin();

  system.runJob(
    (function* () {
      let index = 1;
      let total = 0;
      for (const chunksBV of chunks) {
        const chunksMaxPoint = chunksBV.getMax(),
          chunksMinPoint = chunksBV.getMin();
        CommandUtils.buildCommand(player.dimension, 'tickingarea', 'add', chunksMinPoint, chunksMaxPoint, 'FILL', true);
        yield;
        const area = new BlockVolume(
          new Location(chunksMinPoint).max(fillAreaMinPoint),
          new Location(chunksMaxPoint).min(fillAreaMaxPoint)
        );
        let list = new ListBlockVolume([]);
        let airList = new ListBlockVolume([]);
        let capacity = 0;
        for (const blockLocation of area.getBlockLocationIterator()) {
          if (LocationUtils.isSurface(blockLocation, fillArea)) {
            list.add([blockLocation]);

            if (list.getCapacity() >= COMMAND_MODIFICATION_BLOCK_LIMIT) {
              const replaced = player.dimension.fillBlocks(list, fillBlock, {
                blockFilter: { excludePermutations: [fillBlock] },
                ignoreChunkBoundErrors: true,
              });
              player.sendMessage(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
              Logger.debug(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
              index++;
              capacity += replaced.getCapacity();
              list = new ListBlockVolume([]);
            }
          } else {
            airList.add([blockLocation]);

            if (airList.getCapacity() >= COMMAND_MODIFICATION_BLOCK_LIMIT) {
              const replaced = player.dimension.fillBlocks(airList, MinecraftBlockTypes.Air, {
                blockFilter: { excludeTypes: [MinecraftBlockTypes.Air] },
                ignoreChunkBoundErrors: true,
              });
              player.sendMessage(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
              Logger.debug(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
              index++;
              capacity += replaced.getCapacity();
              airList = new ListBlockVolume([]);
            }
          }
          yield;
        }
        if (list.getCapacity() > 0) {
          const replaced = player.dimension.fillBlocks(list, fillBlock, {
            blockFilter: { excludePermutations: [fillBlock] },
            ignoreChunkBoundErrors: true,
          });
          player.sendMessage(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
          Logger.debug(`${index}: ${replaced.getCapacity()}ブロックを置き換えました。`);
          index++;
          capacity += replaced.getCapacity();
          yield;
        }
        if (airList.getCapacity() > 0) {
          const replaced = player.dimension.fillBlocks(airList, MinecraftBlockTypes.Air, {
            blockFilter: { excludeTypes: [MinecraftBlockTypes.Air] },
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
