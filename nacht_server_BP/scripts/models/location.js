import { Rotate } from '../commands/enum';
export class Location {
    constructor(location) {
        this.diff = (origin) => new Location({ x: this.x - origin.x, y: this.y - origin.y, z: this.z - origin.z });
        this.offset = (other) => {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            return this;
        };
        this.offsetNega = (other) => {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
            return this;
        };
        this.rotate = (deg) => {
            switch (deg) {
                case Rotate._90:
                    const _x = this.x;
                    this.x = this.z;
                    this.z = -_x;
                    break;
                case Rotate._180:
                    this.x *= -1;
                    this.z *= -1;
                    break;
                case Rotate._270:
                    const _z = this.z;
                    this.z = this.x;
                    this.x = -_z;
                    break;
            }
            return this;
        };
        this.x = location.x;
        this.y = location.y;
        this.z = location.z;
    }
}
