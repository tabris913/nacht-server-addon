import type { BaseAreaInfo, FixedBaseAreaInfo } from "../models/location";

/**
 * 確定された拠点範囲であることを判定する
 *
 * @param base
 * @returns
 */
export const isFixedBase = (base: BaseAreaInfo): base is FixedBaseAreaInfo =>
  base.dimension !== undefined && base.name !== undefined;
