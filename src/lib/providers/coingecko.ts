import { getOrFetch } from '../cache';

export interface CryptoSummary { id: string; price: number; changePercent24h: number }
const TTL_MS = 1000 * 60 * 2;

export async function fetchCryptoSummary(id: string, vs: string = 'usd'): Promise<CryptoSummary | null> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${vs}&include_24hr_change=true`;
  return getOrFetch(`coingecko:${id}:${vs}`, TTL_MS, async () => {
    const res = await fetch(url, { headers: { 'User-Agent': 'Statbase/0.1' } });
    if (!res.ok) { console.warn('CoinGecko HTTP error', res.status, await res.text()); return null; }
  const json = (await res.json()) as Record<string, Record<string, number>>;
  const entry = json[id]; if (!entry) return null;
    const price = entry[vs]; const changePercent24h = entry[`${vs}_24h_change`];
    if (typeof price !== 'number' || typeof changePercent24h !== 'number') return null;
    return { id, price, changePercent24h };
  });
}
