import { formatKST, sanitizeTicker } from '../src/lib/format';

describe('format utilities', () => {
  test('formatKST returns empty on invalid', () => {
    expect(formatKST('invalid-date')).toBe('');
  });
  test('formatKST returns KST string', () => {
    const iso = '2025-08-10T00:00:00.000Z';
    const out = formatKST(iso);
    expect(out).toMatch(/2025/);
  });
  test('sanitizeTicker valid', () => {
    expect(sanitizeTicker('aapl')).toBe('AAPL');
  });
  test('sanitizeTicker invalid', () => {
    expect(sanitizeTicker('DROP TABLE')).toBeNull();
  });
});
