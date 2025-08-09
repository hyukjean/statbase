export interface TimeSeriesPoint { date: string; value: number }
export async function fetchEODPrice(): Promise<TimeSeriesPoint[]> { return [] }
export async function fetchFREDIndicator(): Promise<TimeSeriesPoint[]> { return [] }

import fs from 'fs/promises';
import path from 'path';
import { formatSignedPercent } from './math';
import { fetchEquitySummary } from './providers/alphaVantage';
import { fetchCryptoSummary } from './providers/coingecko';

interface StoredEquitySummary { kind: 'equity'; symbol: string; price: number; changePercent: number }
interface StoredCryptoSummary { kind: 'crypto'; id: string; price: number; changePercent: number }
interface SummariesFile { generatedAt: string; items: (StoredEquitySummary | StoredCryptoSummary)[] }

let cachedSummaries: { fileMtime: number; data: SummariesFile } | null = null;
let dataRootOverride: string | null = null;
export function __setDataRootForTesting(p: string | null) { dataRootOverride = p; cachedSummaries = null; }
const STALE_MS = 1000 * 60 * 60; // consider stale after 1h

async function loadSummaries(): Promise<SummariesFile | null> {
  try {
  const root = dataRootOverride ?? path.join(process.cwd(), 'public', 'data');
  const file = path.join(root, 'summaries.json');
    const stat = await fs.stat(file);
    if (cachedSummaries && cachedSummaries.fileMtime === stat.mtimeMs) return cachedSummaries.data;
    const text = await fs.readFile(file, 'utf-8');
    const json = JSON.parse(text) as SummariesFile | null;
    if (!json || !Array.isArray(json.items)) return null;
    cachedSummaries = { fileMtime: stat.mtimeMs, data: json };
    return json;
  } catch {
    return null;
  }
}


async function getSummaryFromFile(predicate: (item: StoredEquitySummary | StoredCryptoSummary) => boolean) {
  const summaries = await loadSummaries();
  if (!summaries) return null;
  const age = Date.now() - Date.parse(summaries.generatedAt);
  if (age > STALE_MS) return null; // stale
  return summaries.items.find(predicate) || null;
}

export async function getEquityDisplay(symbol: string) {
  const stored = await getSummaryFromFile(it => it.kind === 'equity' && it.symbol === symbol) as StoredEquitySummary | null;
  if (stored) return { value: stored.price.toLocaleString(undefined, { maximumFractionDigits: 2 }), change: formatSignedPercent(stored.changePercent) };
  // Fallback to live API if not present or stale
  const live = await fetchEquitySummary(symbol);
  if (!live) return { value: 'N/A', change: '0%' };
  return { value: live.price.toLocaleString(undefined, { maximumFractionDigits: 2 }), change: formatSignedPercent(live.changePercent) };
}

export async function getCryptoDisplay(id: string) {
  const stored = await getSummaryFromFile(it => it.kind === 'crypto' && it.id === id) as StoredCryptoSummary | null;
  if (stored) return { value: stored.price.toLocaleString(undefined, { maximumFractionDigits: 0 }), change: formatSignedPercent(stored.changePercent) };
  const live = await fetchCryptoSummary(id);
  if (!live) return { value: 'N/A', change: '0%' };
  return { value: live.price.toLocaleString(undefined, { maximumFractionDigits: 0 }), change: formatSignedPercent(live.changePercent24h) };
}

export async function getSummariesGeneratedAt(): Promise<string | null> {
  const summaries = await loadSummaries();
  return summaries?.generatedAt ?? null;
}

export async function loadSeriesForChart(): Promise<{ date: string; SPY?: number; BTC?: number }[]> {
  try {
  const root = dataRootOverride ?? path.join(process.cwd(), 'public', 'data');
  const equitiesDir = path.join(root, 'equities');
  const cryptoDir = path.join(root, 'crypto');
    const spyText = await fs.readFile(path.join(equitiesDir, 'SPY.json'), 'utf-8');
    const btcText = await fs.readFile(path.join(cryptoDir, 'bitcoin.json'), 'utf-8');
    const spy = JSON.parse(spyText) as { date: string; value: number }[];
    const btc = JSON.parse(btcText) as { date: string; value: number }[];
    // Normalize to last 30 days intersection
    const map = new Map<string, { date: string; SPY?: number; BTC?: number }>();
    for (const p of spy.slice(-30)) {
      map.set(p.date, { date: p.date, SPY: p.value });
    }
    for (const p of btc.slice(-30)) {
      const existing = map.get(p.date) || { date: p.date };
      existing.BTC = p.value;
      map.set(p.date, existing);
    }
    return Array.from(map.values()).sort((a,b)=>a.date.localeCompare(b.date));
  } catch (e) {
    console.warn('loadSeriesForChart failed', e);
    return [];
  }
}