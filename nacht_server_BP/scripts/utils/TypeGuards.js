/**
 * 確定された拠点範囲であることを判定する
 *
 * @param base
 * @returns
 */
export const isFixedBase = (base) => base.fixed && base.dimension !== undefined && base.name !== undefined && base.northWest !== undefined;
