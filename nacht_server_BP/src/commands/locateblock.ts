import {
  BlockVolume,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
  type Player,
  system,
  type BlockType,
  type CustomCommand,
  type CustomCommandOrigin,
  type CustomCommandResult,
  type VectorXZ,
  Vector3,
} from '@minecraft/server';

import { Formatting } from '../const';
import { NonPlayerSourceError } from '../errors/command';
import { MinecraftDimensionTypes } from '../types/index';
import LocationUtils from '../utils/LocationUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

const locateBlockCommand: CustomCommand = {
  name: 'nacht:locateblock',
  description: 'ブロックが存在する最も近いチャンクを表示する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'block', type: CustomCommandParamType.BlockType }],
  optionalParameters: [
    { name: 'chunkRange', type: CustomCommandParamType.Integer },
    { name: 'yMax', type: CustomCommandParamType.Integer },
    { name: 'yMin', type: CustomCommandParamType.Integer },
  ],
};

const commandProcess = (
  origin: CustomCommandOrigin,
  block: BlockType,
  chunkRange?: number,
  yMax?: number,
  yMin?: number
): CustomCommandResult => {
  const player = NonPlayerSourceError.validate(origin);

  const chunk = {
    x: LocationUtils.toChunkId(player.location.x),
    z: LocationUtils.toChunkId(player.location.z),
  };

  switch (player.dimension.id) {
    case MinecraftDimensionTypes.Overworld:
      system.runJob(
        searchBlock(block, chunk, player, yMax === undefined ? 320 : yMax, yMin === undefined ? -64 : yMin, chunkRange)
      );
      break;
    case MinecraftDimensionTypes.Nether:
      system.runJob(
        searchBlock(block, chunk, player, yMax === undefined ? 256 : yMax, yMin === undefined ? 0 : yMin, chunkRange)
      );
      break;
    case MinecraftDimensionTypes.TheEnd:
      system.runJob(
        searchBlock(block, chunk, player, yMax === undefined ? 256 : yMax, yMin === undefined ? 0 : yMin, chunkRange)
      );
  }

  return { status: CustomCommandStatus.Success };
};

function* searchBlock(
  blockType: BlockType,
  chunk: VectorXZ,
  player: Player,
  yMax: number,
  yMin: number,
  chunkRange: number = 3
) {
  try {
    let diff = 0;
    let beforeBV: BlockVolume | undefined = undefined;
    let foundBlockLocation: Vector3 | undefined = undefined;
    while (diff <= chunkRange) {
      const nw = LocationUtils.offsetLocation(chunk, -diff);
      const se = LocationUtils.offsetLocation(chunk, diff);
      PlayerUtils.sendMessageToOpPlayer(
        player,
        `${Formatting.Color.GRAY}chunk diff: ${diff} [(${nw.x} y ${nw.z}) to (${se.x} y ${se.z})]`
      );
      const coordinateNWX = LocationUtils.fromChunkId(nw.x),
        coordinateNWZ = LocationUtils.fromChunkId(nw.z),
        coordinateSEX = LocationUtils.fromChunkId(se.x),
        coordinateSEZ = LocationUtils.fromChunkId(se.z);
      const bv = new BlockVolume(
        { x: coordinateNWX.min, y: yMin, z: coordinateNWZ.min },
        { x: coordinateSEX.max, y: yMax, z: coordinateSEZ.max }
      );

      let yDiff = 0;
      let beforeYBV: BlockVolume | undefined = undefined;
      const yDiffMax = Math.max(yMax - player.location.y, player.location.y - yMin);
      while (yDiff <= yDiffMax) {
        const yHigh = Math.min(player.location.y + yDiff, yMax),
          yLow = Math.max(player.location.y - yDiff, yMin);
        PlayerUtils.sendMessageToOpPlayer(
          player,
          `${Formatting.Color.GRAY}height(y) diff: ${yDiff} [(${coordinateNWX.min} ${yLow} ${coordinateNWZ.min}) to (${coordinateSEX.max} ${yHigh} ${coordinateSEZ.max})]`
        );
        const yBV = new BlockVolume(
          { x: coordinateNWX.min, y: yLow, z: coordinateNWZ.min },
          { x: coordinateSEX.max, y: yHigh, z: coordinateSEZ.max }
        );

        for (const blockLocation of yBV.getBlockLocationIterator()) {
          if ((beforeBV && beforeBV.isInside(blockLocation)) || (beforeYBV && beforeYBV.isInside(blockLocation))) {
            // 探索済みブロック
            continue;
          }
          const block = player.dimension.getBlock(blockLocation);
          if (block?.typeId === blockType.id) {
            foundBlockLocation = blockLocation;
            PlayerUtils.sendMessageToOpPlayer(
              player,
              `found (${foundBlockLocation.x} ${foundBlockLocation.y} ${foundBlockLocation.z})`
            );
            break;
          }
          yield;
        }
        if (foundBlockLocation !== undefined) {
          break;
        }

        beforeYBV = yBV;
        yDiff++;
      }
      if (foundBlockLocation !== undefined) {
        break;
      }

      beforeBV = bv;
      diff++;
    }

    if (foundBlockLocation !== undefined) {
      player.sendMessage(
        `ブロックが見つかりました (${foundBlockLocation.x} ${foundBlockLocation.y} ${foundBlockLocation.z})。`
      );
    } else {
      player.sendMessage('ブロックが見つかりませんでした。');
    }

    yield;
  } catch (error) {
    Logger.error(error);
  }
}

export default () => system.beforeEvents.startup.subscribe(registerCommand(locateBlockCommand, commandProcess));
