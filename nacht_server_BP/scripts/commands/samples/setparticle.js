var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, system, TicksPerSecond, } from '@minecraft/server';
export default () => system.beforeEvents.startup.subscribe((event) => event.customCommandRegistry.registerCommand({
    name: 'nacht:setparticle',
    description: 'パーティクルを表示する',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ name: 'target', type: CustomCommandParamType.Location }],
    optionalParameters: [
        { name: 'seconds', type: CustomCommandParamType.Float },
        { name: 'interval', type: CustomCommandParamType.Integer },
    ],
}, ({ sourceEntity }, target, seconds = 1, interval = TicksPerSecond / 2) => {
    try {
        if (seconds <= 0) {
            return {
                message: 'seconds param must be positive',
                status: CustomCommandStatus.Failure,
            };
        }
        if (interval <= 0) {
            return {
                message: 'interval param must be positive',
                status: CustomCommandStatus.Failure,
            };
        }
        if (sourceEntity && sourceEntity.isValid) {
            let count = Math.trunc((seconds * TicksPerSecond) / interval);
            system.runTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                while (count--) {
                    sourceEntity.dimension.spawnParticle('minecraft:small_flame_particle', target);
                    yield system.waitTicks(interval);
                }
            }), 1);
        }
        else {
            return {
                message: 'source entity is undefined or invalid',
                status: CustomCommandStatus.Failure,
            };
        }
    }
    catch (error) {
        let message = '予期せぬエラーが発生しました';
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        return { message, status: CustomCommandStatus.Failure };
    }
}));
