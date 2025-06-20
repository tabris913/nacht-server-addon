import type { MinecraftCameraPresetsTypes, MinecraftDimensionTypes } from '../types/index';
import type {
  CameraFixedBoomOptions,
  CameraSetFacingOptions,
  CameraSetLocationOptions,
  CameraSetPosOptions,
  CameraSetRotOptions,
  CameraTargetOptions,
  DimensionLocation,
  RawMessage,
  TitleDisplayOptions,
  Vector3,
} from '@minecraft/server';

export type Position = {
  location: Vector3;
  xRot: number;
  yRot: number;
};

export type CameraCommandOption =
  | CameraFixedBoomOptions
  | CameraSetFacingOptions
  | CameraSetLocationOptions
  | CameraSetPosOptions
  | CameraSetRotOptions
  | CameraTargetOptions;

// export type Command = { start: Position; duration?: number; preset?: MinecraftCameraPresetsTypes; to?: Position };
export type CameraCommand = {
  cameraPreset?: MinecraftCameraPresetsTypes;
  setOptions: CameraCommandOption;
  waitTime?: number;
};

export type TitleCommand = {
  title: Array<RawMessage | string> | RawMessage | string;
  options?: TitleDisplayOptions;
};

export type TpCommand = {
  location: Vector3;
  dimension: MinecraftDimensionTypes;
};

export type CameraMovie = {
  clearAfterFinishing?: boolean;
  name: string;
  commands: Array<CameraCommand | TitleCommand | TpCommand>;
};
