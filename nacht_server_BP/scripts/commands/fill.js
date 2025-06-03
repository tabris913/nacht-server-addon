import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, } from "@minecraft/server";
import { getPlayer } from "../utils/player";
var FillMode;
(function (FillMode) {
    FillMode["destroy"] = "destroy";
    FillMode["hollow"] = "hollow";
    FillMode["keep"] = "keep";
    FillMode["outline"] = "outline";
    FillMode["replace"] = "replace";
})(FillMode || (FillMode = {}));
const BLOCK_LIMIT = 32768;
const makeFillCommand = (fromX, fromY, fromZ, toX, toY, toZ, tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue) => {
    const mandatory = `fill ${fromX} ${fromY} ${fromZ} ${toX} ${toY} ${toZ} ${tileName.id}`;
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
export default () => system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("nacht:oldBlockHandling", [
        "destroy",
        "hollow",
        "keep",
        "outline",
        "replace",
    ]);
    event.customCommandRegistry.registerCommand({
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
    }, ({ sourceEntity }, from, to, tileName, tileData, oldBlockHandling, replaceTileName, replaceDataValue) => {
        var _a;
        try {
            if (sourceEntity && sourceEntity.isValid) {
                const x = Math.abs(from.x - to.x) + 1;
                const y = Math.abs(from.y - to.y) + 1;
                const z = Math.abs(from.z - to.z) + 1;
                const blocks = x * y * z;
                const options = [
                    tileName,
                    tileData,
                    oldBlockHandling,
                    replaceTileName,
                    replaceDataValue,
                ];
                if (blocks <= BLOCK_LIMIT) {
                    // 一回で実行できる範囲ブロック数
                    system.runTimeout(() => {
                        sourceEntity.dimension.runCommand(makeFillCommand(from.x, from.y, from.z, to.z, to.y, to.z, ...options));
                    }, 1);
                }
                else {
                    // 分割実行
                    let timesToRun = Math.floor(blocks / BLOCK_LIMIT);
                    const xy = x * y;
                    const yz = y * z;
                    const zx = z * x;
                    const min2d = Math.min(xy, yz, zx);
                    if (min2d === xy) {
                        const div = Math.floor(BLOCK_LIMIT / xy);
                        let start = Math.min(from.z, to.z);
                        system.runTimeout(() => {
                            while (timesToRun--) {
                                sourceEntity.dimension.runCommand(makeFillCommand(from.x, from.y, start, to.x, to.y, start + div - 1, ...options));
                                start += div;
                            }
                        }, 1);
                    }
                    else if (min2d === yz) {
                        const div = Math.floor(BLOCK_LIMIT / yz);
                        let start = Math.min(from.x, to.x);
                        system.runTimeout(() => {
                            while (timesToRun--) {
                                sourceEntity.dimension.runCommand(makeFillCommand(start, from.y, from.z, start + div - 1, to.y, to.z, ...options));
                                start += div;
                            }
                        }, 1);
                    }
                    else {
                        const div = Math.floor(BLOCK_LIMIT / zx);
                        let start = Math.min(from.y, to.y);
                        system.runTimeout(() => {
                            while (timesToRun--) {
                                sourceEntity.dimension.runCommand(makeFillCommand(from.x, start, from.z, to.x, start + div - 1, to.z, ...options));
                                start += div;
                            }
                        }, 1);
                    }
                }
                (_a = getPlayer(sourceEntity)) === null || _a === void 0 ? void 0 : _a.sendMessage(`${blocks}個のブロックで満たしました。`);
            }
            else {
                return {
                    message: "source entity is undefined or invalid",
                    status: CustomCommandStatus.Failure,
                };
            }
            return { status: CustomCommandStatus.Success };
        }
        catch (error) {
            let message = "予期せぬエラーが発生しました";
            if (error instanceof Error) {
                message += `\n${error.message}`;
            }
            return { message, status: CustomCommandStatus.Failure };
        }
    });
});
