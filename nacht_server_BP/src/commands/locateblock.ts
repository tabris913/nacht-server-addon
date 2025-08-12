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

import { NonPlayerSourceError } from '../errors/command';
import LocationUtils from '../utils/LocationUtils';
import { Logger } from '../utils/logger';

import { registerCommand } from './common';

const locateBlockCommand: CustomCommand = {
  name: 'nacht:locateblock',
  description: 'ブロックが存在する最も近いチャンクを表示する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [{ name: 'block', type: CustomCommandParamType.BlockType }],
  optionalParameters: [{ name: 'chunkRange', type: CustomCommandParamType.Integer }],
};

const commandProcess = (origin: CustomCommandOrigin, block: BlockType, chunkRange?: number): CustomCommandResult => {
  const player = NonPlayerSourceError.validate(origin);

  const chunk = {
    x: LocationUtils.toChunkId(player.location.x),
    z: LocationUtils.toChunkId(player.location.z),
  };

  system.runJob(searchBlock(block, chunk, player, chunkRange));

  return { status: CustomCommandStatus.Success };
};

function* searchBlock(blockType: BlockType, chunk: VectorXZ, player: Player, chunkRange: number = 3) {
  try {
    let diff = 0;
    let beforeBV: BlockVolume | undefined = undefined;
    let foundBlockLocation: Vector3 | undefined = undefined;
    while (diff <= chunkRange) {
      const nw = LocationUtils.offsetLocation(chunk, -diff);
      const se = LocationUtils.offsetLocation(chunk, diff);
      const bv = new BlockVolume(
        { x: LocationUtils.fromChunkId(nw.x).min, y: -64, z: LocationUtils.fromChunkId(nw.z).min },
        { x: LocationUtils.fromChunkId(se.x).max, y: 320, z: LocationUtils.fromChunkId(se.z).max }
      );

      let yDiff = 0;
      let beforeYBV: BlockVolume | undefined = undefined;
      while (true) {
        const yBV = new BlockVolume(
          {
            x: LocationUtils.fromChunkId(nw.x).min,
            y: player.location.y - yDiff,
            z: LocationUtils.fromChunkId(nw.z).min,
          },
          {
            x: LocationUtils.fromChunkId(se.x).max,
            y: player.location.y + yDiff,
            z: LocationUtils.fromChunkId(se.z).max,
          }
        );

        for (const blockLocation of yBV.getBlockLocationIterator()) {
          if ((beforeBV && beforeBV.isInside(blockLocation)) || (beforeYBV && beforeYBV.isInside(blockLocation))) {
            // 探索済みブロック
            continue;
          }
          const block = player.dimension.getBlock(blockLocation);
          if (block?.typeId === blockType.id) {
            foundBlockLocation = blockLocation;
            Logger.info(`found (${foundBlockLocation.x} ${foundBlockLocation.y} ${foundBlockLocation.z})`);
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
