import { BlockPermutation, BlockVolume, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from '@minecraft/server';
import { NonAdminSourceError, ParameterError } from '../errors/command';
import { parseBlockStates, registerCommand } from './common';
import { Direction, ExpandMode, VerticalDirection } from './enum';
const fillDiagonalCommand = {
    name: 'nacht:filldiagonalsection',
    description: '対角線上にブロックを設置する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'from', type: CustomCommandParamType.Location },
        { name: 'hight', type: CustomCommandParamType.Integer },
        { name: 'nacht:Direction', type: CustomCommandParamType.Enum },
        { name: 'nacht:VerticalDirection', type: CustomCommandParamType.Enum },
        { name: 'block', type: CustomCommandParamType.BlockType },
        { name: 'width', type: CustomCommandParamType.Integer },
    ],
    optionalParameters: [
        { name: 'nacht:ExpandMode', type: CustomCommandParamType.Enum },
        { name: 'blockStates', type: CustomCommandParamType.String },
    ],
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
const commandProcess = (origin, from, hight, direction, verticalDirection, block, width, expand, blockStates) => {
    const player = NonAdminSourceError.validate(origin);
    ParameterError.validatePositive('hight', hight, '高さ');
    const blockPermutation = BlockPermutation.resolve(block.id, blockStates ? parseBlockStates(blockStates) : undefined);
    if ([Direction.NorthEast, Direction.NorthWest, Direction.SouthEast, Direction.SouthWest].includes(direction)) {
        throw new ParameterError('direction', '配置種別がSectionの場合、方向は東西南北でなければなりません');
    }
    ParameterError.validatePositive('width', width, '幅');
    const blockVolumes = [];
    switch (direction) {
        case Direction.North:
            Array.from({ length: hight }).forEach((_, index) => {
                blockVolumes.push(new BlockVolume({
                    x: from.x + (expand === ExpandMode.Expand ? index : expand === ExpandMode.Shrink ? -index : 0),
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z - index,
                }, {
                    x: from.x - width + 1 + (expand === ExpandMode.Expand ? -index : expand === ExpandMode.Shrink ? index : 0),
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z - index,
                }));
            });
            break;
        case Direction.East:
            Array.from({ length: hight }).forEach((_, index) => {
                blockVolumes.push(new BlockVolume({
                    x: from.x + index,
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z + (expand === ExpandMode.Expand ? -index : expand === ExpandMode.Shrink ? index : 0),
                }, {
                    x: from.x + index,
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z + width - 1 + (expand === ExpandMode.Expand ? index : expand === ExpandMode.Shrink ? -index : 0),
                }));
            });
            break;
        case Direction.South:
            Array.from({ length: hight }).forEach((_, index) => {
                blockVolumes.push(new BlockVolume({
                    x: from.x + (expand === ExpandMode.Expand ? -index : expand === ExpandMode.Shrink ? index : 0),
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z + index,
                }, {
                    x: from.x + width - 1 + (expand === ExpandMode.Expand ? index : expand === ExpandMode.Shrink ? -index : 0),
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z + index,
                }));
            });
            break;
        case Direction.West:
            Array.from({ length: hight }).forEach((_, index) => {
                blockVolumes.push(new BlockVolume({
                    x: from.x - index,
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z + (expand === ExpandMode.Expand ? index : expand === ExpandMode.Shrink ? -index : 0),
                }, {
                    x: from.x - index,
                    y: from.y + (verticalDirection === VerticalDirection.UP ? index : -index),
                    z: from.z - width + 1 + (expand === ExpandMode.Expand ? -index : expand === ExpandMode.Shrink ? index : 0),
                }));
            });
            break;
    }
    system.runTimeout(() => blockVolumes.forEach((bv) => player.dimension.fillBlocks(bv, blockPermutation)), 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(fillDiagonalCommand, commandProcess));
