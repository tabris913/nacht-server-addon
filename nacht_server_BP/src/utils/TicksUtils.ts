import { TicksPerDay } from '@minecraft/server';

export type TicksRange = { from: number; maxFrom: number; maxTo: number; to: number };

const calcRateWithTicks = (ticks: number, maxRate: number, range: TicksRange) => {
  // console.log(ticks);
  const newRange = { ...range };
  let newTicks = ticks;
  if (range.maxFrom < range.from) {
    newRange.maxFrom += TicksPerDay;
    if (ticks < range.maxFrom) newTicks = ticks + TicksPerDay;
  }
  if (range.maxTo < range.from) {
    newRange.maxTo += TicksPerDay;
    if (ticks < range.maxTo) newTicks = ticks + TicksPerDay;
  }
  if (range.to < range.from) {
    newRange.to += TicksPerDay;
    if (ticks < range.to) newTicks = ticks + TicksPerDay;
  }
  // if (ticks < range.from) newTicks += TicksPerDay;

  // console.debug(newTicks, newRange);
  if (newTicks < newRange.from || newRange.to < newTicks) return 0;

  if (newRange.maxFrom <= newTicks) {
    if (newTicks <= newRange.maxTo) return maxRate - 1;

    return maxRate - 1 - ((newTicks - newRange.maxTo) * (maxRate - 1)) / (newRange.to - newRange.maxTo + 1);
  }

  return maxRate - 1 - ((newRange.maxFrom - newTicks) * (maxRate - 1)) / (newRange.maxFrom - newRange.from + 1);
};

export default { calcRateWithTicks };
