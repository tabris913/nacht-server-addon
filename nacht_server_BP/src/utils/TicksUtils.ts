import { TicksPerDay } from '@minecraft/server';

export type TicksRange = { from: number; maxFrom: number; maxTo: number; to: number };

const TIME = {
  _WAKE_UP: 0,
  _MOON_HAD_SET: 167,
  DAY: 1_000,
  _STARTING_WORK: 2_000,
  NOON: 6_000,
  _MEETING: 9_000,
  _MOON_RISE: 11_834,
  SUNSET: 12_000,
  NIGHT: 13_000,
  _SUN_HAD_SET: 13_702,
  MIDNIGHT: 18_000,
  _SUN_RISE: 22_300,
  SUNRISE: 23_000,
  _SUN_HAD_RISEN: 23_216,
};

const calcRateWithTicks = (ticks: number, maxRate: number, range: TicksRange) => {
  const newRange = { ...range };
  let newTicks = ticks;
  if (range.maxFrom < range.from) {
    newRange.maxFrom += TicksPerDay;
    if (ticks <= range.maxFrom) newTicks = ticks + TicksPerDay;
  }
  if (range.maxTo < range.from) {
    newRange.maxTo += TicksPerDay;
    if (ticks <= range.maxTo) newTicks = ticks + TicksPerDay;
  }
  if (range.to < range.from) {
    newRange.to += TicksPerDay;
    if (ticks <= range.to) newTicks = ticks + TicksPerDay;
  }

  if (newTicks < newRange.from || newRange.to < newTicks) return 0;

  if (newRange.maxFrom <= newTicks) {
    if (newTicks <= newRange.maxTo) return maxRate - 1;

    return maxRate - 1 - ((newTicks - newRange.maxTo) * (maxRate - 1)) / (newRange.to - newRange.maxTo + 1);
  }

  return maxRate - 1 - ((newRange.maxFrom - newTicks) * (maxRate - 1)) / (newRange.maxFrom - newRange.from + 1);
};

/**
 * 太陽が地平線上にでていない時間帯であるか判断する。ゲーム内の夜とは異なる。
 *
 * @param ticks
 * @returns
 */
const isNight = (ticks: number) => TIME._SUN_HAD_SET <= ticks && ticks < TIME._SUN_RISE;

export default { calcRateWithTicks, isNight, TIME };
