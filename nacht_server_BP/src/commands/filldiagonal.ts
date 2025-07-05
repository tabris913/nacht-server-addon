import {
  type Block,
  BlockPermutation,
  type BlockType,
  CommandPermissionLevel,
  type CustomCommand,
  type CustomCommandOrigin,
  CustomCommandParamType,
  type CustomCommandResult,
  CustomCommandStatus,
  system,
  type Vector3,
} from '@minecraft/server';

import { NonAdminSourceError, ParameterError } from '../errors/command';

import { parseBlockStates, registerCommand } from './common';
import { Direction, VerticalDirection } from './enum';

const fillDiagonalCommand: CustomCommand = {
  name: 'nacht:filldiagonal',
  description: '対角線上にブロックを設置する',
  permissionLevel: CommandPermissionLevel.GameDirectors,
  mandatoryParameters: [
    { name: 'from', type: CustomCommandParamType.Location },
    { name: 'hight', type: CustomCommandParamType.Integer },
    { name: 'nacht:Direction', type: CustomCommandParamType.Enum },
    { name: 'nacht:VerticalDirection', type: CustomCommandParamType.Enum },
    { name: 'block', type: CustomCommandParamType.BlockType },
  ],
  optionalParameters: [{ name: 'blockStates', type: CustomCommandParamType.String }],
};

/**
 *
 * @param origin
 * @param from 起点
 * @param hight 高さ
 * @param direction 方向
 * @param verticalDirection 鉛直方向
 * @param block ブロック
 * @param width 幅
 * @param expand 拡張フラグ
 * @param blockStates
 * @returns
 * @throws This function can throw errors.
 *
 * {@link NonAdminSourceError} 実行ソースがエンティティ(プレイヤー)ではない場合
 *
 * {@link ParameterError} パラメータが不正な場合
 */
const commandProcess = (
  origin: CustomCommandOrigin,
  from: Vector3,
  hight: number,
  direction: Direction,
  verticalDirection: VerticalDirection,
  block: BlockType,
  blockStates?: string
): CustomCommandResult => {
  const player = NonAdminSourceError.validate(origin);
  ParameterError.validatePositive('hight', hight, '高さ');

  const blockPermutation = BlockPermutation.resolve(block.id, blockStates ? parseBlockStates(blockStates) : undefined);

  const startingBlock = player.dimension.getBlock(from);
  const blockLocations: Array<Block | undefined> = [];

  switch (direction) {
    case Direction.North:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({ x: 0, y: verticalDirection === VerticalDirection.UP ? index : -index, z: -index })
        )
      );
      break;
    case Direction.NorthEast:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({
            x: index,
            y: verticalDirection === VerticalDirection.UP ? index : -index,
            z: -index,
          })
        )
      );
      break;
    case Direction.East:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({ x: index, y: verticalDirection === VerticalDirection.UP ? index : -index, z: 0 })
        )
      );
      break;
    case Direction.SouthEast:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({
            x: index,
            y: verticalDirection === VerticalDirection.UP ? index : -index,
            z: index,
          })
        )
      );
      break;
    case Direction.South:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({ x: 0, y: verticalDirection === VerticalDirection.UP ? index : -index, z: index })
        )
      );
      break;
    case Direction.SouthWest:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({
            x: -index,
            y: verticalDirection === VerticalDirection.UP ? index : -index,
            z: index,
          })
        )
      );
      break;
    case Direction.West:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({ x: -index, y: verticalDirection === VerticalDirection.UP ? index : -index, z: 0 })
        )
      );
      break;
    case Direction.NorthWest:
      Array.from({ length: hight }).forEach((_, index) =>
        blockLocations.push(
          startingBlock?.offset({
            x: -index,
            y: verticalDirection === VerticalDirection.UP ? index : -index,
            z: -index,
          })
        )
      );
      break;
  }
  system.runTimeout(() => blockLocations.forEach((bl) => bl?.setPermutation(blockPermutation)), 1);

  return { status: CustomCommandStatus.Success };
};

export default () => system.beforeEvents.startup.subscribe(registerCommand(fillDiagonalCommand, commandProcess));
