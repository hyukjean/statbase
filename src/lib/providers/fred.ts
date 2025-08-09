import { getEnv } from '../env';
import { TimeSeriesPoint } from '../data';

interface FredObservation { date: string; value: string }
interface FredResponse { observations?: FredObservation[]; error_code?: number; error_message?: string }

export async function fetchFredSeries(seriesId: string, limitDays = 180): Promise<TimeSeriesPoint[]> {
  const { FRED_API_KEY } = getEnv();
  if (!FRED_API_KEY) { console.warn('FRED_API_KEY missing; skipping', seriesId); return []; }
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(seriesId)}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limitDays}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Statbase/0.1' } });
    if (!res.ok) { console.warn('FRED HTTP error', res.status); return []; }
    const json = await res.json() as FredResponse;
    if (json.error_code) { console.warn('FRED API error', json.error_code, json.error_message); return []; }
    const obs = json.observations || [];
    return obs.filter(o => o.value !== '.' && o.value !== undefined)
      .map(o => ({ date: o.date, value: Number(o.value) }))
      .filter(p => !Number.isNaN(p.value))
      .reverse();
  } catch (e) { console.warn('FRED fetch failed', e); return []; }
}
