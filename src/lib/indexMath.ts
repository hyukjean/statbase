import { pctChange } from './math';

export interface SeriesPoint { date: string; value: number }
export interface WeightedAssetSeries { symbol: string; weight: number; series: SeriesPoint[] }

// Combine weighted series by forward-filling missing values and normalizing weights.
export function combineWeightedSeries(assets: WeightedAssetSeries[]): SeriesPoint[] {
  if (!assets.length) return [];
  const totalWeight = assets.reduce((s,a)=>s + a.weight, 0);
  if (totalWeight <= 0) return [];
  const normalized = assets.map(a => ({ ...a, norm: a.weight / totalWeight }));
  const allDates = new Set<string>();
  for (const a of assets) for (const p of a.series) allDates.add(p.date);
  const dates = Array.from(allDates).sort();
  const seriesMaps = new Map<string, SeriesPoint[]>();
  for (const a of assets) seriesMaps.set(a.symbol, [...a.series].sort((x,y)=>x.date.localeCompare(y.date)));
  const lastValue = new Map<string, number>();
  const out: SeriesPoint[] = [];
  for (const d of dates) {
    let composite = 0;
    let haveAny = false;
    for (const a of normalized) {
      const arr = seriesMaps.get(a.symbol)!;
      const direct = arr.find(p => p.date === d);
      if (direct) lastValue.set(a.symbol, direct.value);
      const v = lastValue.get(a.symbol);
      if (typeof v === 'number') { composite += v * a.norm; haveAny = true; }
    }
    if (haveAny) out.push({ date: d, value: composite });
  }
  return out;
}

export function computeReturn(series: SeriesPoint[]): number {
  if (series.length < 2) return NaN;
  return pctChange(series[0].value, series[series.length-1].value);
}
