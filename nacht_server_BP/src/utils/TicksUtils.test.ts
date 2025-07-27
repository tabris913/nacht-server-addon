import TicksUtils, { type TicksRange } from './TicksUtils';

test('calcRateWithTicks', () => {
  const cond1: TicksRange = { from: 4000, maxFrom: 10000, maxTo: 14000, to: 20000 };

  expect(TicksUtils.calcRateWithTicks(0, 2.5, cond1)).toBe(0);
  expect(TicksUtils.calcRateWithTicks(4000, 2.5, cond1)).toBeGreaterThan(0);
  expect(TicksUtils.calcRateWithTicks(10000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(14000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(20000, 2.5, cond1)).toBeGreaterThan(0);
  expect(TicksUtils.calcRateWithTicks(24000, 2.5, cond1)).toBe(0);
});

test('calcRateWithTicks2', () => {
  const cond1: TicksRange = { from: 12000, maxFrom: 18000, maxTo: 22000, to: 4000 };

  expect(TicksUtils.calcRateWithTicks(8000, 2.5, cond1)).toBe(0);
  expect(TicksUtils.calcRateWithTicks(12000, 2.5, cond1)).toBeGreaterThan(0);
  expect(TicksUtils.calcRateWithTicks(18000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(22000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(4000, 2.5, cond1)).toBeGreaterThan(0);
});

test('calcRateWithTicks3', () => {
  const cond1: TicksRange = { from: 16000, maxFrom: 22000, maxTo: 2000, to: 8000 };

  expect(TicksUtils.calcRateWithTicks(10000, 2.5, cond1)).toBe(0);
  expect(TicksUtils.calcRateWithTicks(16000, 2.5, cond1)).toBeGreaterThan(0);
  expect(TicksUtils.calcRateWithTicks(22000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(2000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(8000, 2.5, cond1)).toBeGreaterThan(0);
});

test('calcRateWithTicks4', () => {
  const cond1: TicksRange = { from: 20000, maxFrom: 2000, maxTo: 6000, to: 12000 };

  expect(TicksUtils.calcRateWithTicks(18000, 2.5, cond1)).toBe(0);
  expect(TicksUtils.calcRateWithTicks(20000, 2.5, cond1)).toBeGreaterThan(0);
  expect(TicksUtils.calcRateWithTicks(23000, 2.5, cond1)).toBeCloseTo(0.75, 3);
  expect(TicksUtils.calcRateWithTicks(2000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(6000, 2.5, cond1)).toBe(1.5);
  expect(TicksUtils.calcRateWithTicks(9000, 2.5, cond1)).toBeCloseTo(0.75, 3);
  expect(TicksUtils.calcRateWithTicks(12000, 2.5, cond1)).toBeGreaterThan(0);
});
