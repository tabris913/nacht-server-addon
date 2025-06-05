import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, TicksPerSecond, } from "@minecraft/server";
import { COMMAND_MODIFICATION_BLOCK_LIMIT } from "../const";
import { UndefinedSourceOrInitiatorError } from "../errors/command";
import AreaUtils from "../utils/AreaUtils";
import PlayerUtils from "../utils/PlayerUtils";
import { registerCommand } from "./common";
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
    const { x, y, z } = AreaUtils.calcDistances(from, to);
    const blocks = x * y * z;
    const options = [tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue];
    if (blocks <= COMMAND_MODIFICATION_BLOCK_LIMIT) {
        // 一回で実行できる範囲ブロック数
        system.runTimeout(() => {
            player.dimension.runCommand(makeFillCommand(from, to, ...options));
        }, 1);
    }
    else {
        // 分割実行
        // 一番面積が小さい平面を繰り返す
        const timesToRun = Math.floor(blocks / COMMAND_MODIFICATION_BLOCK_LIMIT) + 1;
        const xy = x * y;
        const yz = y * z;
        const zx = z * x;
        switch (Math.min(xy, yz, zx)) {
            case xy:
                callFillCommand("z", player, from, to, timesToRun, xy, Math.min(from.z, to.z), Math.max(from.z, to.z), options);
                break;
            case yz:
                callFillCommand("x", player, from, to, timesToRun, xy, Math.min(from.x, to.x), Math.max(from.x, to.x), options);
                break;
            case zx:
                callFillCommand("y", player, from, to, timesToRun, xy, Math.min(from.y, to.y), Math.max(from.y, to.y), options);
                break;
        }
    }
    player.sendMessage(`${blocks}個のブロックで満たしました。`);
    return { status: CustomCommandStatus.Success };
};
/**
 * fill コマンドを構築する
 *
 * @param from
 * @param to
 * @param tileName
 * @param tileData
 * @param oldBlockHandling
 * @param replaceTileName
 * @param replaceDataValue
 * @returns
 */
const makeFillCommand = (from, to, tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue) => {
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
const callFillCommand = (dynamicAxis, player, from, to, timesToRun, totalBlocks, startIndex, endIndex, options) => {
    const div = Math.floor(COMMAND_MODIFICATION_BLOCK_LIMIT / totalBlocks);
    let start = startIndex;
    let totalSuccessCount = 0;
    let count = timesToRun;
    system.runTimeout(() => {
        while (count--) {
            const command = makeFillCommand(Object.assign(Object.assign({}, from), { [dynamicAxis]: start }), Object.assign(Object.assign({}, to), { [dynamicAxis]: Math.min(start + div - 1, endIndex) }), ...options);
            const successCount = player.dimension.runCommand(command).successCount;
            totalSuccessCount += successCount;
            start += div;
            console.log(`nacht:fill ${timesToRun - count}/${timesToRun} (${successCount}): ${command}`);
            system.waitTicks(TicksPerSecond / 2);
        }
        console.log(`Run ${timesToRun} times and successed ${totalSuccessCount}.`);
    }, 1);
};
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
