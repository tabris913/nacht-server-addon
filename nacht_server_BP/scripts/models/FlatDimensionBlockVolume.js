import { DimensionBlockVolume } from "./DimensionBlockVolume";
export class FlatDimensionBlockVolume extends DimensionBlockVolume {
    constructor(from, to, dimension) {
        super(Object.assign(Object.assign({}, from), { y: 0 }), Object.assign(Object.assign({}, to), { y: 0 }), dimension);
    }
}
