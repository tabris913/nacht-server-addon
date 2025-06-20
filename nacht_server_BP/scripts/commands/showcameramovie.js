var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CommandPermissionLevel, CustomCommandParamType, CustomCommandSource, CustomCommandStatus, system, TicksPerSecond, world, } from '@minecraft/server';
import { PREFIX_MOVIE } from '../const';
import { NachtServerAddonError } from '../errors/base';
import { NonNPCSourceError, UndefinedSourceOrInitiatorError } from '../errors/command';
import teleportLogic from '../logic/teleportLogic';
import { MinecraftCameraPresetsTypes } from '../types/index';
import PlayerUtils from '../utils/PlayerUtils';
import { registerCommand } from './common';
const showCameraMovieCommand = {
    name: 'nacht:showcameramovie',
    description: 'カメラ操作で動画風の映像を見せる',
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [
        { name: 'target', type: CustomCommandParamType.PlayerSelector },
        { name: 'moviename', type: CustomCommandParamType.String },
    ],
};
const commandProcess = (origin, target, moviename) => {
    if (origin.sourceType !== CustomCommandSource.NPCDialogue)
        throw new NonNPCSourceError();
    const player = PlayerUtils.convertToPlayer(origin.initiator);
    if (player === undefined)
        throw new UndefinedSourceOrInitiatorError();
    if (target.some((p) => !p.camera.isValid)) {
        player.sendMessage('カメラが有効ではありません。');
        throw new NachtServerAddonError('カメラが有効ではありません。');
    }
    const dp = world.getDynamicProperty(`${PREFIX_MOVIE}${moviename}`);
    if (dp === undefined) {
        player.sendMessage('動画が見つかりませんでした。');
        throw new NachtServerAddonError('動画が見つかりませんでした。');
    }
    const cm = JSON.parse(dp);
    system.runTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        for (const cmd of cm.commands) {
            if ('setOptions' in cmd) {
                target.forEach((t) => t.camera.setCamera(cmd.cameraPreset || MinecraftCameraPresetsTypes.Free, cmd.setOptions));
                if (cmd.waitTime) {
                    yield system.waitTicks(TicksPerSecond * cmd.waitTime);
                }
            }
            else if ('location' in cmd) {
                target.forEach((t) => teleportLogic.teleport(t, cmd.location, cmd.dimension));
            }
            else {
                target.forEach((t) => t.onScreenDisplay.setTitle(cmd.title, cmd.options));
            }
        }
        if (cm.clearAfterFinishing) {
            player.camera.clear();
            target.forEach((t) => t.camera.clear());
        }
    }), 1);
    return { status: CustomCommandStatus.Success };
};
export default () => system.beforeEvents.startup.subscribe(registerCommand(showCameraMovieCommand, commandProcess));
