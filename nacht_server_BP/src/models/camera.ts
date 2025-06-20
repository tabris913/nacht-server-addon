import type {
  CameraDefaultOptions,
  CameraFixedBoomOptions,
  CameraSetFacingOptions,
  CameraSetLocationOptions,
  CameraSetPosOptions,
  CameraSetRotOptions,
  CameraTargetOptions,
  Vector3,
} from '@minecraft/server';

import type { MinecraftCameraPresetsTypes } from '../types/index';

export type Position = {
  location: Vector3;
  xRot: number;
  yRot: number;
};

export type CameraCommandOption =
  | CameraDefaultOptions
  | CameraFixedBoomOptions
  | CameraSetFacingOptions
  | CameraSetLocationOptions
  | CameraSetPosOptions
  | CameraSetRotOptions
  | CameraTargetOptions;

// export type Command = { start: Position; duration?: number; preset?: MinecraftCameraPresetsTypes; to?: Position };
export type Command = {
  cameraPreset?: MinecraftCameraPresetsTypes;
  setOptions: CameraCommandOption;
  waitTime?: number;
};

export type CameraMovie = {
  clearAfterFinishing?: boolean;
  name: string;
  commands: Array<Command>;
};
