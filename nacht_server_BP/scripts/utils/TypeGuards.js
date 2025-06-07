/**
 * 確定された拠点範囲であることを判定する
 *
 * @param base
 * @returns
 */
export const isFixedBase = (base) => base.dimension !== undefined && base.name !== undefined;
