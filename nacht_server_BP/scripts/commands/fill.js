import { BlockVolume, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { COMMAND_MODIFICATION_BLOCK_LIMIT } from "../const";
import { UndefinedSourceOrInitiatorError } from "../errors/command";
import PlayerUtils from "../utils/PlayerUtils";
import { registerCommand } from "./common";
import { NachtServerAddonError } from "../errors/base";
import { Logger } from "../utils/logger";
var FillMode;
(function (FillMode) {
    FillMode["destroy"] = "destroy";
    FillMode["hollow"] = "hollow";
    FillMode["keep"] = "keep";
    FillMode["outline"] = "outline";
    FillMode["replace"] = "replace";
})(FillMode || (FillMode = {}));
const fillCommand = {
    name: "nacht:fill",
    description: "領域の一部または全体を指定したブロックで埋める。",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: "from", type: CustomCommandParamType.Location },
        { name: "to", type: CustomCommandParamType.Location },
        { name: "tileName", type: CustomCommandParamType.BlockType },
    ],
    optionalParameters: [
        { name: "tileData", type: CustomCommandParamType.Integer },
        {
            name: "nacht:oldBlockHandling",
            type: CustomCommandParamType.Enum,
        },
        { name: "replaceTileName", type: CustomCommandParamType.BlockType },
        { name: "replaceDataValue", type: CustomCommandParamType.Integer },
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
const commandProcess = ({ sourceEntity }, from, to, tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue) => {
    const player = PlayerUtils.convertToPlayer(sourceEntity);
    if (player === undefined) {
        throw new UndefinedSourceOrInitiatorError();
    }
    const blockVolume = new BlockVolume(from, to);
    const options = [tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue];
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
                generator = callFillCommand("z", player, blockVolume, xy, options);
                break;
            case yz:
                generator = callFillCommand("x", player, blockVolume, yz, options);
                break;
            case zx:
                generator = callFillCommand("y", player, blockVolume, zx, options);
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
    let optional = "";
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
    const timesToRun = Math.floor(blockVolume.getCapacity() / COMMAND_MODIFICATION_BLOCK_LIMIT) +
        1;
    let count = timesToRun;
    while (count--) {
        const command = makeFillCommand(new BlockVolume(Object.assign(Object.assign({}, blockVolume.from), { [dynamicAxis]: start }), Object.assign(Object.assign({}, blockVolume.to), { [dynamicAxis]: Math.min(start + div - 1, blockVolume.getMax()[dynamicAxis]) })), ...options);
        const successCount = player.dimension.runCommand(command).successCount;
        totalSuccessCount += successCount;
        start += div;
        Logger.log(`nacht:fill ${timesToRun - count}/${timesToRun} (${successCount}): ${command}`);
        // system.waitTicks(TicksPerSecond / 2);
        yield;
    }
    // Logger.log(`Run ${timesToRun} times and successed ${totalSuccessCount}.`);
}
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("nacht:oldBlockHandling", [
        FillMode.destroy,
        FillMode.hollow,
        FillMode.keep,
        FillMode.outline,
        FillMode.replace,
    ]);
    registerCommand(fillCommand, commandProcess)(event);
});
