import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';
// Manually load .env.local (dotenv doesn't auto-load it by default)
import fsSync from 'fs';
import dotenv from 'dotenv';
const localEnvPath = path.join(process.cwd(), '.env.local');
if (fsSync.existsSync(localEnvPath)) dotenv.config({ path: localEnvPath, override: false });
// NOTE: This script should be run via `npm run update` (tsx) so TypeScript paths resolve.
import { getEnv } from '../src/lib/env';
import { fetchFredSeries } from '../src/lib/providers';
import { shouldSkipSnapshot } from '../src/lib/snapshot';

async function fetchAlphaDaily(symbol: string): Promise<{ date: string; value: number }[]> {
  const { ALPHAVANTAGE_API_KEY } = getEnv();
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${ALPHAVANTAGE_API_KEY}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Statbase/0.1' } });
  if (!res.ok) { console.warn('Alpha daily HTTP error', symbol, res.status); return []; }
  interface AlphaDailyResponse { [k: string]: unknown; 'Time Series (Daily)'?: Record<string, Record<string,string>> }
  const json = (await res.json()) as AlphaDailyResponse;
  const ts = json['Time Series (Daily)'];
  if (!ts) return [];
  return Object.keys(ts)
    .slice(0,100)
    .map(d => ({ date: d, value: Number(ts[d]['4. close']) }))
    .filter(p=>!Number.isNaN(p.value))
    .reverse();
}

async function fetchCoinGeckoDaily(id: string): Promise<{ date: string; value: number }[]> {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Statbase/0.1' } });
  if (!res.ok) { console.warn('CoinGecko market_chart HTTP error', res.status); return []; }
  const json = (await res.json()) as { prices?: [number, number][] };
  const prices: [number, number][] = json.prices || [];
  const byDate = new Map<string, number>();
  for (const [ts, price] of prices) {
    const date = new Date(ts).toISOString().substring(0,10);
    byDate.set(date, price);
  }
  return Array.from(byDate.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([date, value])=>({date, value}));
}

async function ensureDir(p: string) { await fs.mkdir(p, { recursive: true }); }
async function writeJSON(file: string, data: unknown) { await fs.writeFile(file, JSON.stringify(data, null, 2)); }

async function updateData() {
  const start = Date.now();
  const root = path.join(process.cwd(), 'public', 'data');
  // Skip logic here (inside function scope)
  try {
    const summariesPath = path.join(root, 'summaries.json');
    const existing = await fs.readFile(summariesPath, 'utf-8');
    const json = JSON.parse(existing) as { generatedAt?: string };
    const { TIMEZONE } = getEnv();
    if (json.generatedAt && shouldSkipSnapshot({ generatedAt: json.generatedAt }, TIMEZONE)) {
      console.log('Snapshot skipped: already generated today in timezone', TIMEZONE);
      return;
    }
  } catch {/* proceed */}
  const equitiesDir = path.join(root, 'equities');
  const cryptoDir = path.join(root, 'crypto');
  const fredDir = path.join(root, 'fred');
  await Promise.all([ensureDir(equitiesDir), ensureDir(cryptoDir), ensureDir(fredDir)]);

  const equitySymbols = ['SPY','QQQ'];
  const fredSeries = ['DGS10'];
  const cryptoIds = ['bitcoin'];

  // Fetch time series first (avoids extra Alpha Vantage GLOBAL_QUOTE calls)
  const equitySeries = await Promise.all(equitySymbols.map(s => fetchAlphaDaily(s).then(data => ({ symbol: s, data }))));
  const fredSeriesData: { series: string; data: { date: string; value: number }[] }[] = await Promise.all(
    fredSeries.map(id => fetchFredSeries(id).then((data: { date: string; value: number }[]) => ({ series: id, data })))
  );
  const cryptoSeries = await Promise.all(cryptoIds.map(id => fetchCoinGeckoDaily(id).then(data => ({ id, data }))));

  interface EquitySummary { kind: 'equity'; symbol: string; price: number; changePercent: number }
  interface CryptoSummary { kind: 'crypto'; id: string; price: number; changePercent: number }

  function buildEquitySummary(series: { symbol: string; data: { date: string; value: number }[] }): EquitySummary | null {
    const n = series.data.length;
    if (n < 2) return null;
    const last = series.data[n-1].value;
    const prev = series.data[n-2].value;
    if (prev === 0) return null;
    const changePercent = ((last - prev) / prev) * 100;
    return { kind: 'equity', symbol: series.symbol, price: last, changePercent };
  }

  function buildCryptoSummary(series: { id: string; data: { date: string; value: number }[] }): CryptoSummary | null {
    const n = series.data.length;
    if (n < 2) return null;
    const last = series.data[n-1].value;
    const prev = series.data[n-2].value;
    if (prev === 0) return null;
    const changePercent = ((last - prev) / prev) * 100;
    return { kind: 'crypto', id: series.id, price: last, changePercent };
  }

  const summaries = [
    ...equitySeries.map(buildEquitySummary).filter(Boolean),
    ...cryptoSeries.map(buildCryptoSummary).filter(Boolean),
  ];

  // Include a lightweight metadata wrapper so we can test freshness by generatedAt
  await writeJSON(path.join(root, 'summaries.json'), { generatedAt: new Date().toISOString(), items: summaries });

  await Promise.all([
    ...equitySeries.map(es => writeJSON(path.join(equitiesDir, es.symbol + '.json'), es.data)),
    ...fredSeriesData.map((fsObj) => writeJSON(path.join(fredDir, fsObj.series + '.json'), fsObj.data)),
    ...cryptoSeries.map(cs => writeJSON(path.join(cryptoDir, cs.id + '.json'), cs.data)),
  ]);

  console.log('Daily update complete in', ((Date.now()-start)/1000).toFixed(2), 's');
}

updateData().catch(err => { console.error('daily_update failed', err); process.exit(1); });