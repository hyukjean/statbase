import { getEnv } from '../env';
import { getOrFetch } from '../cache';

interface GlobalQuoteRaw {
  '01. symbol': string;
  '05. price': string;
  '10. change percent': string;
}
interface GlobalQuoteResponse { 'Global Quote'?: GlobalQuoteRaw; Note?: string; Information?: string }
export interface EquitySummary { symbol: string; price: number; changePercent: number }

const TTL_MS = 1000 * 60 * 5;

export async function fetchEquitySummary(symbol: string): Promise<EquitySummary | null> {
  const { ALPHAVANTAGE_API_KEY } = getEnv();
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHAVANTAGE_API_KEY}`;
  return getOrFetch(`alpha:quote:${symbol}`, TTL_MS, async () => {
    const res = await fetch(url, { headers: { 'User-Agent': 'Statbase/0.1' } });
    if (!res.ok) { console.warn('AlphaVantage HTTP error', res.status, await res.text()); return null; }
    const json = (await res.json()) as GlobalQuoteResponse;
    if (json.Note || json.Information) { console.warn('AlphaVantage rate/info', json.Note || json.Information); return null; }
    const q = json['Global Quote']; if (!q) return null;
    const price = parseFloat(q['05. price']);
    const cpRaw = q['10. change percent'];
    const changePercent = parseFloat(cpRaw.replace('%',''));
    if (Number.isNaN(price) || Number.isNaN(changePercent)) return null;
    return { symbol, price, changePercent };
  });
}
