import { combineWeightedSeries, computeReturn, WeightedAssetSeries } from '../src/lib/indexMath';

describe('indexMath', () => {
  const a: WeightedAssetSeries = { symbol: 'AAA', weight: 1, series: [
    { date: '2025-01-01', value: 100 },
    { date: '2025-01-02', value: 110 },
  ]};
  const b: WeightedAssetSeries = { symbol: 'BBB', weight: 1, series: [
    { date: '2025-01-02', value: 200 },
    { date: '2025-01-03', value: 220 },
  ]};

  test('combine forward-fills and normalizes weights', () => {
    const out = combineWeightedSeries([a,b]);
    // Expect dates union
    expect(out.map(p=>p.date)).toEqual(['2025-01-01','2025-01-02','2025-01-03']);
    // Day1: only AAA (weight 0.5 each -> composite 100*0.5 = 50)
    expect(out[0].value).toBeCloseTo(50);
    // Day2: AAA 110, BBB 200 => (110+200)/2 = 155
    expect(out[1].value).toBeCloseTo(155);
    // Day3: AAA forward fill 110 + BBB 220 => (110+220)/2 = 165
    expect(out[2].value).toBeCloseTo(165);
  });

  test('computeReturn', () => {
    const out = combineWeightedSeries([a,b]);
    const r = computeReturn(out);
    // 50 -> 165 ≈ 230%
    expect(r).toBeCloseTo(((165-50)/50)*100);
  });
});
