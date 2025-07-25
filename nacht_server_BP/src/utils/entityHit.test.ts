import TicksUtils, { type TicksRange } from './TicksUtils';

test('calcRateWithTicks', () => {
  console.log('calcRateWithTicks');
  const cond1: TicksRange = { from: 10000, maxFrom: 15000, maxTo: 20000, to: 22000 };

  console.log(TicksUtils.calcRateWithTicks(0, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(9999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(10000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(10001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(11000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(12000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(13000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(14000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(14999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(15000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(15001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(19999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(20000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(20001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(21000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(21999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(22000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(22001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(23999, 2.5, cond1));
});

test('calcRateWithTicks2', () => {
  console.log('calcRateWithTicks2');
  const cond1: TicksRange = { from: 13000, maxFrom: 18000, maxTo: 23000, to: 1000 };

  console.log(TicksUtils.calcRateWithTicks(0, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(9999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(10000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(10001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(11000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(12000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(13000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(14000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(14999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(15000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(15001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(19999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(20000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(20001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(21000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(21999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(22000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(22001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(23999, 2.5, cond1));
});

test('calcRateWithTicks4', () => {
  console.log('calcRateWithTicks4');
  const cond1: TicksRange = { from: 20000, maxFrom: 0, maxTo: 5000, to: 10000 };

  console.log(TicksUtils.calcRateWithTicks(0, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(1, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(4999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(5000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(5001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(6000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(7000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(8000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(9000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(9999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(10000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(10001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(19999, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(20000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(20001, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(21000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(22000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(23000, 2.5, cond1));
  console.log(TicksUtils.calcRateWithTicks(24000, 2.5, cond1));
});
