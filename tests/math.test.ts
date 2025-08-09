import { pctChange, formatSignedPercent, safeNumber } from '../src/lib/math';

describe('math utilities', () => {
  test('pctChange happy path', () => {
    expect(pctChange(100, 105)).toBeCloseTo(5);
  });
  test('pctChange zero prev -> NaN', () => {
    expect(Number.isNaN(pctChange(0, 50))).toBe(true);
  });
  test('formatSignedPercent +', () => {
    expect(formatSignedPercent(5)).toBe('+5.00%');
  });
  test('formatSignedPercent -', () => {
    expect(formatSignedPercent(-2.345, 1)).toBe('-2.3%');
  });
  test('safeNumber works with string', () => {
    expect(safeNumber('42')).toBe(42);
  });
  test('safeNumber fallback', () => {
    expect(Number.isNaN(safeNumber('abc'))).toBe(true);
  });
});
