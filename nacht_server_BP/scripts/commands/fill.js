import { BlockPermutation, BlockVolume, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, LocationInUnloadedChunkError, system, TicksPerSecond, } from '@minecraft/server';
import { COMMAND_MODIFICATION_BLOCK_LIMIT } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { UndefinedSourceOrInitiatorError } from '../errors/command';
import { DimensionBlockVolume } from '../models/DimensionBlockVolume';
import { MinecraftBlockTypes } from '../types/index';
import { Logger } from '../utils/logger';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
import { FillMode } from './enum';
const fillCommand = {
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
const parseBlockStates = (blockStates) => {
    if (!/^\[.*\]$/.test(blockStates))
        throw new NachtServerAddonError('ブロック状態が不正です。');
    const parsed = {};
    for (const stateItem of blockStates.slice(1, -1).split(/,\s*/)) {
        if (!/^.+=.+$/.test(stateItem))
            throw new NachtServerAddonError('ブロック状態が不正です。');
        const [key, value] = stateItem.split('=');
        Object.assign(parsed, { [key]: value });
    }
    return parsed;
};
const commandProcessNew = (origin, from, to, tileName, blockStates, oldBlockHandling, secondaryTileName, secondaryBlockStates) => {
    var _a;
    const player = PlayerUtils.convertToPlayer(origin.sourceEntity);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    if (oldBlockHandling === FillMode.replace && secondaryTileName === undefined) {
        Logger.error('replaceTileName was not given.');
        throw new NachtServerAddonError('置換対象ブロックが指定されていません。');
    }
    /**
     * 適用範囲
     */
    const blockVolume = new DimensionBlockVolume(from, to, player.dimension);
    const { max, min } = blockVolume.getBoundingBox();
    const blockPermutation = BlockPermutation.resolve(tileName.id, blockStates ? parseBlockStates(blockStates) : undefined);
    // const chunkIndices = {
    //   x: { min: Math.floor(min.x / 16), max: Math.floor(max.x / 16) },
    //   z: { min: Math.floor(min.z / 16), max: Math.floor(max.z / 16) },
    // };
    // const chunkDistances = {
    //   x: LocationUtils.calcDistance(chunkIndices.x.min, chunkIndices.x.max),
    //   z: LocationUtils.calcDistance(chunkIndices.z.min, chunkIndices.z.max),
    // };
    // if (chunkDistances.x > 100 && chunkDistances.z > 100) throw new CommandProcessError('範囲が広すぎます。');
    // const mod = { x: 100 % chunkDistances.x, z: 100 % chunkDistances.z };
    // if (mod.x <= mod.z) {
    //   // x
    //   const step = Math.floor(100 / chunkDistances.x);
    // } else {
    //   // z
    //   const step = Math.floor(100 / chunkDistances.z);
    // }
    let counter = 0;
    let failedCounter = 0;
    switch (oldBlockHandling) {
        case undefined:
            // 適用範囲を指定されたブロックですべて埋める
            system.runJob((function* () {
                // player.dimension.fillBlocks(blockVolume, blockPermutation);
                for (const blockLocation of blockVolume.getBlockLocationIterator()) {
                    try {
                        try {
                            player.dimension.setBlockPermutation(blockLocation, blockPermutation);
                        }
                        catch (error) {
                            if (error instanceof LocationInUnloadedChunkError) {
                                try {
                                    player.dimension.runCommand(`tickingarea remove FILL`);
                                }
                                catch (_a) {
                                    //
                                }
                                player.dimension.runCommand(`tickingarea add circle ${blockLocation.x} ${blockLocation.y} ${blockLocation.z} 1 FILL true`);
                                player.dimension.setBlockPermutation(blockLocation, blockPermutation);
                            }
                        }
                        counter++;
                        // if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0) await system.waitTicks(TicksPerSecond / 2);
                    }
                    catch (_b) {
                        failedCounter++;
                    }
                    try {
                        player.dimension.runCommand(`tickingarea remove FILL`);
                    }
                    catch (_c) {
                        //
                    }
                    yield;
                }
            })());
            break;
        case FillMode.hollow:
            // 適用範囲の表面のみを指定されたブロックで埋め、内側を空気で満たす
            for (const blockLocation of blockVolume.getBlockLocationIterator()) {
                try {
                    if ([max.x, min.x].includes(blockLocation.x) ||
                        [max.y, min.y].includes(blockLocation.y) ||
                        [max.z, min.z].includes(blockLocation.z)) {
                        system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
                        counter++;
                        if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0)
                            system.waitTicks(TicksPerSecond / 2);
                    }
                    else {
                        player.dimension.setBlockType(blockLocation, MinecraftBlockTypes.Air);
                    }
                }
                catch (_b) {
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
                        if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0)
                            system.waitTicks(TicksPerSecond / 2);
                    }
                }
                catch (_c) {
                    failedCounter++;
                }
            }
            break;
        case FillMode.outline:
            // 適用範囲の表面のみを指定されたブロックで埋め、内側は維持する
            for (const blockLocation of blockVolume.getBlockLocationIterator()) {
                try {
                    if ([max.x, min.x].includes(blockLocation.x) ||
                        [max.y, min.y].includes(blockLocation.y) ||
                        [max.z, min.z].includes(blockLocation.z)) {
                        system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
                        counter++;
                        if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0)
                            system.waitTicks(TicksPerSecond / 2);
                    }
                }
                catch (_d) {
                    failedCounter++;
                }
            }
            break;
        case FillMode.replace:
            // 適用範囲のうち指定されたブロックで置換対象ブロックを置き換える
            for (const blockLocation of blockVolume.getBlockLocationIterator()) {
                try {
                    const thisBlock = (_a = player.dimension.getBlock(blockLocation)) === null || _a === void 0 ? void 0 : _a.permutation;
                    if (thisBlock === undefined) {
                        failedCounter++;
                        continue;
                    }
                    if (thisBlock.type.id === secondaryTileName.id) {
                        const states = secondaryBlockStates ? parseBlockStates(secondaryBlockStates) : undefined;
                        if (states
                            ? !Object.entries(states).some(([k, v]) => thisBlock.getState(k) !== v)
                            : true) {
                            system.run(() => player.dimension.setBlockPermutation(blockLocation, blockPermutation));
                            counter++;
                            if (counter % COMMAND_MODIFICATION_BLOCK_LIMIT === 0)
                                system.waitTicks(TicksPerSecond / 2);
                        }
                    }
                }
                catch (_e) {
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
const commandProcess = ({ sourceEntity }, from, to, tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue) => {
    const player = PlayerUtils.convertToPlayer(sourceEntity);
    if (player === undefined) {
        throw new UndefinedSourceOrInitiatorError();
    }
    const blockVolume = new BlockVolume(from, to);
    const options = [
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
    }
    else {
        // 分割実行
        const { x, y, z } = blockVolume.getSpan();
        // 一番面積が小さい平面を繰り返す
        const xy = x * y;
        const yz = y * z;
        const zx = z * x;
        let generator;
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
const makeFillCommand = (blockVolume, tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue) => {
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
function* callFillCommand(dynamicAxis, player, blockVolume, totalBlocks, options) {
    const div = Math.floor(COMMAND_MODIFICATION_BLOCK_LIMIT / totalBlocks);
    let start = blockVolume.getMin()[dynamicAxis];
    let totalSuccessCount = 0;
    const timesToRun = Math.floor(blockVolume.getCapacity() / COMMAND_MODIFICATION_BLOCK_LIMIT) + 1;
    let count = timesToRun;
    while (count--) {
        const bv = new BlockVolume(Object.assign(Object.assign({}, blockVolume.from), { [dynamicAxis]: start }), Object.assign(Object.assign({}, blockVolume.to), { [dynamicAxis]: Math.min(start + div - 1, blockVolume.getMax()[dynamicAxis]) }));
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
export default () => system.beforeEvents.startup.subscribe(registerCommand(fillCommand, commandProcessNew));
