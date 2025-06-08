import {
  type BlockType,
  BlockVolume,
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  type Entity,
  system,
  type Vector3,
} from '@minecraft/server';

import { COMMAND_MODIFICATION_BLOCK_LIMIT } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';

import { registerCommand } from './common';

enum FillMode {
  destroy = 'destroy',
  hollow = 'hollow',
  keep = 'keep',
  outline = 'outline',
  replace = 'replace',
}

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
    { name: 'tileData', type: CustomCommandParamType.Integer },
    {
      name: 'nacht:oldBlockHandling',
      type: CustomCommandParamType.Enum,
    },
    { name: 'replaceTileName', type: CustomCommandParamType.BlockType },
    { name: 'replaceDataValue', type: CustomCommandParamType.Integer },
  ],
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
  replaceDataValue?: number,
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
        throw new NachtServerAddonError();
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
  replaceDataValue?: number,
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
  options: [BlockType, number | undefined, FillMode | undefined, BlockType | undefined, number | undefined],
) {
  const div = Math.floor(COMMAND_MODIFICATION_BLOCK_LIMIT / totalBlocks);
  let start: number = blockVolume.getMin()[dynamicAxis];
  let totalSuccessCount = 0;
  const timesToRun = Math.floor(blockVolume.getCapacity() / COMMAND_MODIFICATION_BLOCK_LIMIT) + 1;
  let count = timesToRun;

  while (count--) {
    const command = makeFillCommand(
      new BlockVolume(
        { ...blockVolume.from, [dynamicAxis]: start },
        {
          ...blockVolume.to,
          [dynamicAxis]: Math.min(start + div - 1, blockVolume.getMax()[dynamicAxis]),
        },
      ),
      ...options,
    );
    const successCount = player.dimension.runCommand(command).successCount;
    totalSuccessCount += successCount;
    start += div;
    Logger.log(`nacht:fill ${timesToRun - count}/${timesToRun} (${successCount}): ${command}`);
    // system.waitTicks(TicksPerSecond / 2);
    yield;
  }
  // Logger.log(`Run ${timesToRun} times and successed ${totalSuccessCount}.`);
}

export default () =>
  system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum('nacht:oldBlockHandling', [
      FillMode.destroy,
      FillMode.hollow,
      FillMode.keep,
      FillMode.outline,
      FillMode.replace,
    ]);

    registerCommand(fillCommand, commandProcess)(event);
  });
