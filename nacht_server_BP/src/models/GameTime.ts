import { TicksPerDay, world } from '@minecraft/server';

/**
 * Represents in-game time
 */
export class GameTime {
  private _day: number = NaN;
  private _timeOfDay: number = NaN;

  constructor(day: number, timeOfDay: number = 0) {
    this._day = day;
    this._timeOfDay = timeOfDay;
  }

  get day() {
    return this._day;
  }

  get isNight() {
    return 13_702 <= this._timeOfDay && this._timeOfDay < 22_300;
  }

  get ticks() {
    return this._day * TicksPerDay + this._timeOfDay;
  }

  get timeOfDay() {
    return this._timeOfDay;
  }

  static now = () => new GameTime(world.getDay(), world.getTimeOfDay());

  diff = (other: GameTime) => {
    const diffTicks = this.ticks - other.ticks;
    const day = Math.trunc(diffTicks / TicksPerDay);

    return new GameTime(day, diffTicks - day * TicksPerDay);
  };
}
