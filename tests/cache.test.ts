import { getOrFetch, clearCache } from '../src/lib/cache';

describe('cache:getOrFetch', () => {
  afterEach(() => clearCache());
  test('returns cached value on second call', async () => {
    let calls = 0;
    const fetcher = async () => { calls++; return { n: calls }; };
    const a = await getOrFetch('k', 5000, fetcher);
    const b = await getOrFetch('k', 5000, fetcher);
    expect(a.n).toBe(1);
    expect(b.n).toBe(1);
  });
});
