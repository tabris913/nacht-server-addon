import { EasingType, TicksPerSecond, world } from '@minecraft/server';

import { Formatting, GAMERULE_DEFAULT, PREFIX_GAMERULE, PREFIX_MOVIE, SCOREBOARD_POINT } from '../const';
import { MinecraftCameraPresetsTypes, MinecraftDimensionTypes } from '../types/index';
import { Logger } from '../utils/logger';

import type { CameraMovie } from '../models/camera';

const RESTORE_DATA = {};

export default () =>
  world.afterEvents.worldLoad.subscribe((event) => {
    // ポイント準備
    const point = world.scoreboard.getObjective(SCOREBOARD_POINT);
    if (point === undefined) {
      world.scoreboard.addObjective(SCOREBOARD_POINT);
      Logger.log(`${SCOREBOARD_POINT} is enabled.`);
    } else {
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
      world.setDynamicProperty(
        `${PREFIX_MOVIE}ERSTE`,
        JSON.stringify({
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
        } satisfies CameraMovie)
      );
    }
  });
