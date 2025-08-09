// Numeric & financial helper utilities

export function pctChange(prev: number, curr: number): number {
  if (!isFinite(prev) || !isFinite(curr) || prev === 0) return NaN;
  return ((curr - prev) / prev) * 100;
}

export function formatSignedPercent(value: number, digits = 2): string {
  if (!isFinite(value)) return '0%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function safeNumber(n: unknown, fallback = NaN): number {
  const v = typeof n === 'string' ? Number(n) : (n as number);
  return typeof v === 'number' && isFinite(v) ? v : fallback;
}
