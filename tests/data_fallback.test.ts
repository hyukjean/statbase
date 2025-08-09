import { promises as fs } from 'fs';
import path from 'path';
import { getEquityDisplay, getCryptoDisplay, __setDataRootForTesting } from '../src/lib/data';

describe('data summaries fallback', () => {
  const tmpRoot = path.join(process.cwd(), 'public', 'data_test');
  const summariesFile = path.join(tmpRoot, 'summaries.json');
  const equitiesDir = path.join(tmpRoot, 'equities');
  const cryptoDir = path.join(tmpRoot, 'crypto');

  beforeAll(async () => {
    await fs.mkdir(equitiesDir, { recursive: true });
    await fs.mkdir(cryptoDir, { recursive: true });
    const summaries = {
      generatedAt: new Date().toISOString(),
      items: [
        { kind: 'equity', symbol: 'SPY', price: 500, changePercent: 1.23 },
        { kind: 'crypto', id: 'bitcoin', price: 100000, changePercent: -2.5 }
      ],
    };
    await fs.writeFile(summariesFile, JSON.stringify(summaries));
    await fs.writeFile(path.join(equitiesDir, 'SPY.json'), JSON.stringify([{ date: '2025-01-01', value: 500 }]));
    await fs.writeFile(path.join(cryptoDir, 'bitcoin.json'), JSON.stringify([{ date: '2025-01-01', value: 100000 }]));
    __setDataRootForTesting(tmpRoot);
  });

  afterAll(async () => {
    __setDataRootForTesting(null);
  });

  it('reads equity summary from file', async () => {
    const spy = await getEquityDisplay('SPY');
    expect(spy.value).toContain('500');
    expect(spy.change.startsWith('+1.23')).toBe(true);
  });

  it('reads crypto summary from file', async () => {
    const btc = await getCryptoDisplay('bitcoin');
    expect(btc.value).toContain('100,000');
    expect(btc.change.startsWith('-2.50')).toBe(true);
  });
});
