import type { Vector3 } from '@minecraft/server';
import type { BaseAreaInfo, FixedBaseAreaInfo } from '../models/location';

/**
 * 確定された拠点範囲であることを判定する
 *
 * @param base
 * @returns
 */
export const isFixedBase = (base: BaseAreaInfo): base is FixedBaseAreaInfo =>
  base.fixed && base.dimension !== undefined && base.name !== undefined && base.northWest !== undefined;

export const isVector3 = (arg: any): arg is Vector3 => 'x' in arg && 'y' in arg && 'z' in arg;
