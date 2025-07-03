import {
  BlockPermutation,
  BlockType,
  BlockVolume,
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type Entity,
  HudVisibility,
  ItemComponentTypes,
  LocationInUnloadedChunkError,
  system,
  TicksPerSecond,
  type Vector3,
  world,
} from '@minecraft/server';

import { COMMAND_MODIFICATION_BLOCK_LIMIT } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { CommandProcessError, UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import { BlockStateSuperset, MinecraftBlockTypes } from '../types/index';
import LocationUtils from '../utils/LocationUtils';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import { parseBlockStates, registerCommand } from './common';
import { FillMode } from './enum';

const fillCommand: CustomCommand = {
  name: 'nacht:fill',
  description: '領域の一部または全体を指定したブロックで埋める。',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'from', type: CustomCommandParamType.Location },
    { name: 'to', type: CustomCommandParamType.Location },
    { name: 'tileName', type: CustomCommandParamType.BlockType },
  ],
  optionalParameters: [
    { name: 'blockStates', type: CustomCommandParamType.String },
    {
      name: 'nacht:oldBlockHandling',
      type: CustomCommandParamType.Enum,
    },
    { name: 'secondaryTileName', type: CustomCommandParamType.BlockType },
    { name: 'secondaryBlockStates', type: CustomCommandParamType.String },
  ],
};

const commandProcessNew = (
  origin: CustomCommandOrigin,
  from: Vector3,
  to: Vector3,
  tileName: BlockType,
  blockStates?: string,
  oldBlockHandling?: FillMode,
  secondaryTileName?: BlockType,
  secondaryBlockStates?: string
): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
  if (player === undefined) throw new UndefinedSourceOrInitiatorError();
  if (oldBlockHandling === FillMode.replace && secondaryTileName === undefined) {
    Logger.error('replaceTileName was not given.');

    throw new CommandProcessError('置換対象ブロックが指定されていません。');
  }

  /**
   * 適用範囲
   */
  const blockVolume = new DimensionBlockVolume(from, to, player.dimension);
  const { max, min } = blockVolume.getBoundingBox();
  const blockPermutation = BlockPermutation.resolve(
    tileName.id,
    blockStates ? parseBlockStates(blockStates) : undefined
  );
  const chunkIndices = {
    x: { min: Math.floor(min.x / 16), max: Math.floor(max.x / 16) },
    z: { min: Math.floor(min.z / 16), max: Math.floor(max.z / 16) },
  };
  const chunkDistances = {
    x: LocationUtils.calcDistance(chunkIndices.x.min, chunkIndices.x.max),
    z: LocationUtils.calcDistance(chunkIndices.z.min, chunkIndices.z.max),
  };
  if (chunkDistances.x > 100 && chunkDistances.z > 100) throw new CommandProcessError('範囲が広すぎます。');
  const mod = { x: 100 % chunkDistances.x, z: 100 % chunkDistances.z };
  if (mod.x <= mod.z) {
    // x
    const step = Math.floor(100 / chunkDistances.x);
  } else {
    // z
    const step = Math.floor(100 / chunkDistances.z);
  }

  let counter = 0;
  let failedCounter = 0;
  switch (oldBlockHandling) {
    case undefined:
      // 適用範囲を指定されたブロックですべて埋める
      system.runTimeout(async () => {
        // player.dimension.fillBlocks(blockVolume, blockPermutation);
        for (const blockLocation of blockVolume.getBlockLocationIterator()) {
          try {
            try {
              player.dimension.setBlockPermutation(blockLocation, blockPermutation);
            } catch (error) {
              if (error instanceof LocationInUnloadedChunkError) {
                try {
                  player.dimension.runCommand(`tickingarea remove FILL`);
                } catch {
                  //
                }
                player.dimension.runCommand(
                  `tickingarea add circle ${blockLocation.x} ${blockLocation.y} ${blockLocation.z} 1 FILL true`
                );
                await system.waitTicks(1);
                player.dimension.setBlockPermutation(blockLocation, blockPermutation);
              }
            }
            counter++;
            if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0) await system.waitTicks(TicksPerSecond / 2);
          } catch {
            failedCounter++;
          }

          try {
            player.dimension.runCommand(`tickingarea remove FILL`);
          } catch {
            //
          }
        }
      }, 1);

      break;
    case FillMode.hollow:
      // 適用範囲の表面のみを指定されたブロックで埋め、内側を空気で満たす
      for (const blockLocation of blockVolume.getBlockLocationIterator()) {
        try {
          if (
            [max.x, min.x].includes(blockLocation.x) ||
            [max.y, min.y].includes(blockLocation.y) ||
            [max.z, min.z].includes(blockLocation.z)
          ) {
            system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
            counter++;
            if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0) system.waitTicks(TicksPerSecond / 2);
          } else {
            player.dimension.setBlockType(blockLocation, MinecraftBlockTypes.Air);
          }
        } catch {
          failedCounter++;
        }
      }
      break;
    case FillMode.keep:
      // 適用範囲の空気ブロックのみを指定されたブロックで置き換える
      for (const blockLocation of blockVolume.getBlockLocationIterator()) {
        try {
          const thisBlock = player.dimension.getBlock(blockLocation);
          if (thisBlock === undefined) {
            failedCounter++;
            continue;
          }
          if (thisBlock.isAir) {
            system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
            counter++;
            if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0) system.waitTicks(TicksPerSecond / 2);
          }
        } catch {
          failedCounter++;
        }
      }
      break;
    case FillMode.outline:
      // 適用範囲の表面のみを指定されたブロックで埋め、内側は維持する
      for (const blockLocation of blockVolume.getBlockLocationIterator()) {
        try {
          if (
            [max.x, min.x].includes(blockLocation.x) ||
            [max.y, min.y].includes(blockLocation.y) ||
            [max.z, min.z].includes(blockLocation.z)
          ) {
            system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
            counter++;
            if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0) system.waitTicks(TicksPerSecond / 2);
          }
        } catch {
          failedCounter++;
        }
      }
      break;
    case FillMode.replace:
      // 適用範囲のうち指定されたブロックで置換対象ブロックを置き換える
      for (const blockLocation of blockVolume.getBlockLocationIterator()) {
        try {
          const thisBlock = player.dimension.getBlock(blockLocation)?.permutation;
          if (thisBlock === undefined) {
            failedCounter++;
            continue;
          }
          if (thisBlock.type.id === secondaryTileName!.id) {
            const states = secondaryBlockStates ? parseBlockStates(secondaryBlockStates) : undefined;
            if (
              states
                ? !Object.entries(states).some(([k, v]) => thisBlock.getState(k as keyof BlockStateSuperset) !== v)
                : true
            ) {
              system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
              counter++;
              if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0) system.waitTicks(TicksPerSecond / 2);
            }
          }
        } catch {
          failedCounter++;
        }
      }
  }

  player.sendMessage(`${counter}/${blockVolume.getCapacity()} を置き換えました (失敗: ${failedCounter} ブロック)。`);

  return { status: CustomCommandStatus.Success };
};

/**
 * fill コマンドの処理
 *
 * @param origin
 * @param from
 * @param to
 * @param tileName
 * @param tileData
 * @param oldBlockHandling
 * @param replaceTileName
 * @param replaceDataValue
 * @returns
 * @throws This function can throw error.
 *
 * {@link UndefinedSourceOrInitiatorError}
 */
const commandProcess = (
  { sourceEntity }: CustomCommandOrigin,
  from: Vector3,
  to: Vector3,
  tileName: BlockType,
  tileData?: number,
  oldBlockHandling?: FillMode,
  replaceTileName?: BlockType,
  replaceDataValue?: number
): CustomCommandResult => {
  const player = PlayerUtils.convertToPlayer(sourceEntity);
  if (player === undefined) {
    throw new UndefinedSourceOrInitiatorError();
  }

  const blockVolume = new BlockVolume(from, to);
  const options: [BlockType, number | undefined, FillMode | undefined, BlockType | undefined, number | undefined] = [
    tileName,
    tileData,
    oldBlockHandling,
    replaceTileName,
    replaceDataValue,
  ];

  const capacity = blockVolume.getCapacity();
  if (capacity <= COMMAND_MODIFICATION_BLOCK_LIMIT) {
    // 一回で実行できる範囲ブロック数
    system.runTimeout(() => {
      player.dimension.runCommand(makeFillCommand(blockVolume, ...options));
    }, 1);
  } else {
    // 分割実行
    const { x, y, z } = blockVolume.getSpan();
    // 一番面積が小さい平面を繰り返す
    const xy = x * y;
    const yz = y * z;
    const zx = z * x;

    let generator: Generator<void, void, void>;
    switch (Math.min(xy, yz, zx)) {
      case xy:
        generator = callFillCommand('z', player, blockVolume, xy, options);
        break;
      case yz:
        generator = callFillCommand('x', player, blockVolume, yz, options);
        break;
      case zx:
        generator = callFillCommand('y', player, blockVolume, zx, options);
        break;
      default:
        throw new CommandProcessError();
    }
    system.runJob(generator);
  }

  player.sendMessage(`${capacity}個のブロックで満たしました。`);

  return { status: CustomCommandStatus.Success };
};

/**
 * fill コマンドを構築する
 *
 * @param blockVolume
 * @param tileName
 * @param tileData
 * @param oldBlockHandling
 * @param replaceTileName
 * @param replaceDataValue
 * @returns
 */
const makeFillCommand = (
  blockVolume: BlockVolume,
  tileName: BlockType,
  tileData?: number,
  oldBlockHandling?: FillMode,
  replaceTileName?: BlockType,
  replaceDataValue?: number
) => {
  const { from, to } = blockVolume;
  const mandatory = `fill ${from.x} ${from.y} ${from.z} ${to.x} ${to.y} ${to.z} ${tileName.id}`;

  let optional = '';
  if (tileData !== undefined) {
    optional += ` ${tileData}`;
  }
  if (oldBlockHandling !== undefined) {
    optional += ` ${oldBlockHandling}`;
  }
  if (oldBlockHandling === FillMode.replace) {
    if (replaceTileName !== undefined) {
      optional += ` ${replaceTileName.id}`;

      if (replaceDataValue !== undefined) {
        optional += `${replaceDataValue}`;
      }
    }
  }

  return mandatory + optional;
};

function* callFillCommand(
  dynamicAxis: 'x' | 'y' | 'z',
  player: Entity,
  blockVolume: BlockVolume,
  totalBlocks: number,
  options: [BlockType, number | undefined, FillMode | undefined, BlockType | undefined, number | undefined]
) {
  const div = Math.floor(COMMAND_MODIFICATION_BLOCK_LIMIT / totalBlocks);
  let start: number = blockVolume.getMin()[dynamicAxis];
  let totalSuccessCount = 0;
  const timesToRun = Math.floor(blockVolume.getCapacity() / COMMAND_MODIFICATION_BLOCK_LIMIT) + 1;
  let count = timesToRun;

  while (count--) {
    const bv = new BlockVolume(
      { ...blockVolume.from, [dynamicAxis]: start },
      {
        ...blockVolume.to,
        [dynamicAxis]: Math.min(start + div - 1, blockVolume.getMax()[dynamicAxis]),
      }
    );
    const command = makeFillCommand(bv, ...options);
    player.dimension.runCommand(`tickingarea add ${bv.from.x} 0 ${bv.from.z} ${bv.to.x} 0 ${bv.to.z} FILL true`);
    Logger.log(`/tickingarea add ${bv.from.x} 0 ${bv.from.z} ${bv.to.x} 0 ${bv.to.z} FILL true`);
    const successCount = player.dimension.runCommand(command).successCount;
    player.dimension.runCommand('tickingarea remove FILL');
    totalSuccessCount += successCount;
    start += div;
    Logger.log(`nacht:fill ${timesToRun - count}/${timesToRun} (${successCount}): ${command}`);
    // system.waitTicks(TicksPerSecond / 2);
    yield;
  }
  // Logger.log(`Run ${timesToRun} times and successed ${totalSuccessCount}.`);
}

export default () => system.beforeEvents.startup.subscribe(registerCommand(fillCommand, commandProcess));
