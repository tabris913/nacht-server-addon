import { EasingType, TicksPerSecond, world } from '@minecraft/server';
import { Formatting, GAMERULE_DEFAULT, PREFIX_GAMERULE, PREFIX_MOVIE, SCOREBOARD_POINT } from '../const';
import { MinecraftCameraPresetsTypes, MinecraftDimensionTypes } from '../types/index';
import { Logger } from '../utils/logger';
const RESTORE_DATA = {
    'nacht:base_nacht9480_1': '{"edgeSize":51,"fixed":false,"id":"nacht:base_nacht9480_1","index":1,"owner":"nacht9480","participants":[],"showBorder":true}',
    'nacht:counter_base_nacht9480': 1,
    'nacht:counter_base_tosshie1216': 7,
    'nacht:counter_safe-area': 7,
    'nacht:counter_uneditable-areas': 7,
    'nacht:gamerule_autoRemoveFortuneEnchant': true,
    'nacht:gamerule_autoRemoveFortuneEnchantInterval': 20,
    'nacht:gamerule_baseMarketPrice': 20,
    'nacht:gamerule_baseMaximumRange': 501,
    'nacht:gamerule_prayPrice': 300,
    'nacht:gamerule_showAreaBorder': true,
    'nacht:gamerule_showAreaBorderInterval': 10,
    'nacht:gamerule_showAreaBorderRange': 101,
    'nacht:gamerule_showAreaBorderYRange': 5,
    'nacht:gamerule_teleportTargets': 6,
    'nacht:gamerule_watchCrossingArea': true,
    'nacht:gamerule_watchCrossingAreaInterval': 4,
    'nacht:location_nacht9480_pyramid': '{"displayName":"ピラミッド","dimension":"minecraft:overworld","id":"nacht:location_nacht9480_pyramid","location":{"z":-101173.09375,"y":68,"x":99819.3515625},"name":"pyramid","owner":"nacht9480"}',
    'nacht:location_tosshie1216_bdg': '{"displayName":"ビル建設地","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_bdg","location":{"x":-97.06463623046875,"y":85,"z":-153.21255493164062},"name":"bdg","owner":"tosshie1216"}',
    'nacht:location_tosshie1216_bdg_underground': '{"displayName":"ビル地下","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_bdg_underground","location":{"x":-72.82447814941406,"y":61,"z":-127.74052429199219},"name":"bdg_underground","owner":"tosshie1216"}',
    'nacht:location_tosshie1216_guild': '{"displayName":"ギルド","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_guild","location":{"x":108.49819946289062,"y":66,"z":-51.84348678588867},"name":"guild","owner":"tosshie1216"}',
    'nacht:location_tosshie1216_library': '{"displayName":"図書館","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_library","location":{"x":-55.075958251953125,"y":64,"z":-80.85492706298828},"name":"library","owner":"tosshie1216"}',
    'nacht:location_tosshie1216_live_house': '{"displayName":"ライヴハウス","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_live_house","location":{"x":-19.38410758972168,"y":65,"z":-133.0222625732422},"name":"live_house","owner":"tosshie1216"}',
    'nacht:location_tosshie1216_pyramid': '{"displayName":"ピラミッド","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_pyramid","location":{"z":-101177.140625,"y":68,"x":99820.828125},"name":"pyramid","owner":"tosshie1216"}',
    'nacht:location_tosshie1216_real_estate_agent': '{"displayName":"不動産屋","dimension":"minecraft:overworld","id":"nacht:location_tosshie1216_real_estate_agent","location":{"x":109.38980102539062,"y":64,"z":40.46123504638672},"name":"real_estate_agent","owner":"tosshie1216"}',
    'nacht:movie_ERSTE': '{"name":"nacht:movie_ERSTE","clearAfterFinishing":true,"commands":[{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":-15,"y":67,"z":0},"rotation":{"x":0,"y":-90}}},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":-15,"y":90,"z":0},"rotation":{"x":0,"y":-90},"easeOptions":{"easeTime":3,"easeType":"Linear"}},"waitTime":3},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":15,"y":67,"z":0},"rotation":{"x":0,"y":-90}}},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":80,"y":67,"z":0},"rotation":{"x":0,"y":-90},"easeOptions":{"easeTime":7,"easeType":"Linear"}},"waitTime":7},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":0,"y":67,"z":-15},"rotation":{"x":0,"y":180}}},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":0,"y":67,"z":-90},"rotation":{"x":0,"y":180},"easeOptions":{"easeTime":6,"easeType":"Linear"}},"waitTime":6},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":-25,"y":70,"z":0},"rotation":{"x":0,"y":90}}},{"title":"§e§oERSTE<エルステ>","options":{"fadeInDuration":10,"fadeOutDuration":30,"stayDuration":60,"subtitle":"～はじまりの街～"}},{"cameraPreset":"minecraft:free","setOptions":{"location":{"x":-50,"y":90,"z":0},"rotation":{"x":0,"y":90},"easeOptions":{"easeTime":4,"easeType":"Linear"}},"waitTime":5},{"location":{"x":-13,"y":63,"z":0},"dimension":"minecraft:overworld"}]}',
    'nacht:safearea_0': '{"dimension":"minecraft:overworld","id":"nacht:safearea_0","index":0,"min":{"x":-99594,"y":50,"z":-99495},"max":{"x":-99565,"y":80,"z":-99473}}',
    'nacht:safearea_1': '{"dimension":"minecraft:overworld","id":"nacht:safearea_1","index":1,"min":{"x":5165,"y":50,"z":-106047},"max":{"x":5176,"y":75,"z":-106036}}',
    'nacht:safearea_2': '{"dimension":"minecraft:overworld","id":"nacht:safearea_2","index":2,"min":{"x":99870,"y":60,"z":-100104},"max":{"x":99886,"y":90,"z":-100086}}',
    'nacht:safearea_3': '{"dimension":"minecraft:overworld","id":"nacht:safearea_3","index":3,"min":{"x":-114963,"y":60,"z":105032},"max":{"x":-114955,"y":100,"z":105040}}',
    'nacht:safearea_4': '{"dimension":"minecraft:overworld","id":"nacht:safearea_4","index":4,"min":{"x":4058,"y":60,"z":115102},"max":{"x":4078,"y":100,"z":115121}}',
    'nacht:safearea_5': '{"dimension":"minecraft:overworld","id":"nacht:safearea_5","index":5,"min":{"x":104464,"y":60,"z":101679},"max":{"x":104479,"y":90,"z":101707}}',
    'nacht:safearea_7': '{"dimension":"minecraft:overworld","id":"nacht:safearea_7","index":7,"max":{"z":-101174,"y":130,"x":99876},"min":{"z":-101288,"y":50,"x":99762}}',
    'nacht:uneditablearea_0': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_0","index":0,"max":{"x":5176,"y":75,"z":-106036},"min":{"x":5165,"y":50,"z":-106047}}',
    'nacht:uneditablearea_1': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_1","index":1,"max":{"x":-99565,"y":80,"z":-99473},"min":{"x":-99594,"y":50,"z":-99495}}',
    'nacht:uneditablearea_2': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_2","index":2,"max":{"x":99886,"y":90,"z":-100086},"min":{"x":99870,"y":60,"z":-100104}}',
    'nacht:uneditablearea_3': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_3","index":3,"max":{"x":-114955,"y":100,"z":105040},"min":{"x":-114963,"y":60,"z":105032}}',
    'nacht:uneditablearea_4': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_4","index":4,"max":{"x":4078,"y":100,"z":115121},"min":{"x":4058,"y":60,"z":115102}}',
    'nacht:uneditablearea_5': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_5","index":5,"max":{"x":104479,"y":90,"z":101707},"min":{"x":104464,"y":60,"z":101679}}',
    'nacht:uneditablearea_7': '{"dimension":"minecraft:overworld","id":"nacht:uneditablearea_7","index":7,"max":{"z":-101174,"y":130,"x":99876},"min":{"z":-101288,"y":50,"x":99762}}',
};
export default () => world.afterEvents.worldLoad.subscribe((event) => {
    // ポイント準備
    const point = world.scoreboard.getObjective(SCOREBOARD_POINT);
    if (point === undefined) {
        world.scoreboard.addObjective(SCOREBOARD_POINT);
        Logger.log(`${SCOREBOARD_POINT} is enabled.`);
    }
    else {
        Logger.log(`${SCOREBOARD_POINT} has already enabled.`);
    }
    // ゲームルール
    if (world.getDynamicPropertyIds().length === 0) {
        world.setDynamicProperties(RESTORE_DATA);
        Logger.log(`Succeeded to restore data.`);
    }
    Object.entries(GAMERULE_DEFAULT).forEach(([ruleName, value]) => {
        const id = `${PREFIX_GAMERULE}${ruleName}`;
        const current = world.getDynamicProperty(id);
        if (current === undefined) {
            world.setDynamicProperty(id, value);
            Logger.log(`Default value (${value}) set as ${ruleName} is not set.`);
        }
    });
    // カメラ
    if (world.getDynamicProperty(`${PREFIX_MOVIE}ERSTE`) === undefined) {
        world.setDynamicProperty(`${PREFIX_MOVIE}ERSTE`, JSON.stringify({
            name: `${PREFIX_MOVIE}ERSTE`,
            clearAfterFinishing: true,
            commands: [
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: { location: { x: -15, y: 67, z: 0 }, rotation: { x: 0, y: -90 } },
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: {
                        location: { x: -15, y: 90, z: 0 },
                        rotation: { x: 0, y: -90 },
                        easeOptions: { easeTime: 3, easeType: EasingType.Linear },
                    },
                    waitTime: 3,
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: { location: { x: 15, y: 67, z: 0 }, rotation: { x: 0, y: -90 } },
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: {
                        location: { x: 80, y: 67, z: 0 },
                        rotation: { x: 0, y: -90 },
                        easeOptions: { easeTime: 7, easeType: EasingType.Linear },
                    },
                    waitTime: 7,
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: { location: { x: 0, y: 67, z: -15 }, rotation: { x: 0, y: 180 } },
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: {
                        location: { x: 0, y: 67, z: -90 },
                        rotation: { x: 0, y: 180 },
                        easeOptions: { easeTime: 6, easeType: EasingType.Linear },
                    },
                    waitTime: 6,
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: { location: { x: -25, y: 70, z: 0 }, rotation: { x: 0, y: 90 } },
                },
                {
                    title: `${Formatting.Color.YELLOW}${Formatting.Italic}ERSTE<エルステ>`,
                    options: {
                        fadeInDuration: 0.5 * TicksPerSecond,
                        fadeOutDuration: 1.5 * TicksPerSecond,
                        stayDuration: 3 * TicksPerSecond,
                        subtitle: '～はじまりの街～',
                    },
                },
                {
                    cameraPreset: MinecraftCameraPresetsTypes.Free,
                    setOptions: {
                        location: { x: -50, y: 90, z: 0 },
                        rotation: { x: 0, y: 90 },
                        easeOptions: { easeTime: 4, easeType: EasingType.Linear },
                    },
                    waitTime: 5,
                },
                {
                    location: { x: -13, y: 63, z: 0 },
                    dimension: MinecraftDimensionTypes.Overworld,
                },
            ],
        }));
    }
});
