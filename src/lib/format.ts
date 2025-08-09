export function formatKST(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

const TICKER_RE = /^[A-Z0-9._-]{1,10}$/;
export function sanitizeTicker(input: string): string | null {
  const trimmed = input.trim().toUpperCase();
  if (!TICKER_RE.test(trimmed)) return null;
  return trimmed;
}
