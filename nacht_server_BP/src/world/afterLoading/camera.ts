import { EasingType, TicksPerSecond, world } from '@minecraft/server';

import { PREFIX_MOVIE, Formatting } from '../../const';
import { MinecraftCameraPresetsTypes, MinecraftDimensionTypes } from '../../types/index';

import type { CameraMovie } from '../../models/camera';

export default () => {
  const id_ERSTE = PREFIX_MOVIE + 'ERSTE';
  if (world.getDynamicProperty(id_ERSTE) === undefined) {
    world.setDynamicProperty(
      id_ERSTE,
      JSON.stringify({
        name: id_ERSTE,
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
};
