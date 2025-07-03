import { BlockPermutation, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system } from '@minecraft/server';
import { NonAdminSourceError, ParameterError } from '../errors/command';
import { parseBlockStates, registerCommand } from './common';
import { Direction, VerticalDirection } from './enum';
const fillDiagonalCommand = {
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
    optionalParameters: [
        { name: 'width', type: CustomCommandParamType.Integer },
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
    const startingBlock = player.dimension.getBlock(from);
    const blockLocations = [];
    switch (direction) {
        case Direction.North:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({ x: 0, y: verticalDirection === VerticalDirection.UP ? index : -index, z: -index })));
            break;
        case Direction.NorthEast:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({
                x: index,
                y: verticalDirection === VerticalDirection.UP ? index : -index,
                z: -index,
            })));
            break;
        case Direction.East:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({ x: index, y: verticalDirection === VerticalDirection.UP ? index : -index, z: 0 })));
            break;
        case Direction.SouthEast:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({
                x: index,
                y: verticalDirection === VerticalDirection.UP ? index : -index,
                z: index,
            })));
            break;
        case Direction.South:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({ x: 0, y: verticalDirection === VerticalDirection.UP ? index : -index, z: index })));
            break;
        case Direction.SouthWest:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({
                x: -index,
                y: verticalDirection === VerticalDirection.UP ? index : -index,
                z: index,
            })));
            break;
        case Direction.West:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({ x: -index, y: verticalDirection === VerticalDirection.UP ? index : -index, z: 0 })));
            break;
        case Direction.NorthWest:
            Array.from({ length: hight }).forEach((_, index) => blockLocations.push(startingBlock === null || startingBlock === void 0 ? void 0 : startingBlock.offset({
                x: -index,
                y: verticalDirection === VerticalDirection.UP ? index : -index,
                z: -index,
            })));
            break;
    }
    system.runTimeout(() => blockLocations.forEach((bl) => bl === null || bl === void 0 ? void 0 : bl.setPermutation(blockPermutation)), 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(fillDiagonalCommand, commandProcess));
