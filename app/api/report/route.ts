import { NextResponse } from 'next/server';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { logRequest, logResponse, logError, logOpenAIUsage } from 'src/lib/logger';

// Schema for validating the request body.
const ReportRequestSchema = z.object({
  question: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  symbols: z.array(z.string().min(1)).max(12).optional(),
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ReportRequestSchema.parse(body);
    const { question, startDate, endDate } = parsed;
    // Normalize symbols (default set if none provided)
    const DEFAULT_SYMBOLS = ['SPY','QQQ','bitcoin'];
    const normalized = (parsed.symbols && parsed.symbols.length ? parsed.symbols : DEFAULT_SYMBOLS)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.toLowerCase() === 'btc' ? 'bitcoin' : s) // alias
      .map(s => s.toUpperCase() === s && s !== 'BTC' ? s : s); // keep equities uppercase, crypto lowercase
    // Dedupe preserving order
    const symbols = Array.from(new Set(normalized));
    logRequest('report_api', { ...body, symbols });

    // Load system and user prompt templates from the prompts directory.
    const promptsDir = path.join(process.cwd(), 'prompts');
    const systemPrompt = await fs.readFile(path.join(promptsDir, 'system_report.md'), 'utf-8');
    const userTemplate = await fs.readFile(path.join(promptsDir, 'user_report.md'), 'utf-8');

    // Load data context (filtered summaries + recent time series for requested symbols)
    const dataRoot = path.join(process.cwd(), 'public', 'data');
    let dataContext = '';
    try {
      const summariesText = await fs.readFile(path.join(dataRoot, 'summaries.json'), 'utf-8');
  type EquityItem = { kind: 'equity'; symbol: string; price: number; changePercent: number };
  type CryptoItem = { kind: 'crypto'; id: string; price: number; changePercent: number };
  const summariesJson = JSON.parse(summariesText) as { generatedAt?: string; items?: (EquityItem | CryptoItem)[] };
      const eqDir = path.join(dataRoot, 'equities');
      const cryptoDir = path.join(dataRoot, 'crypto');
      async function lastNSeries(sym: string, n: number) {
        const isCrypto = sym.toLowerCase() === 'bitcoin' || sym.toLowerCase() === 'eth' || sym === sym.toLowerCase();
        const file = isCrypto ? path.join(cryptoDir, `${sym}.json`) : path.join(eqDir, `${sym.toUpperCase()}.json`);
        try {
          const txt = await fs.readFile(file, 'utf-8');
          const arr = JSON.parse(txt) as { date: string; value: number }[];
          return arr.slice(-n);
        } catch { return []; }
      }
      const seriesMap: Record<string, { date: string; value: number }[]> = {};
      await Promise.all(symbols.map(async s => { seriesMap[s] = await lastNSeries(s, 5); }));
      const fmt = (label: string, pts: { date: string; value: number }[]) => `${label}\n${pts.map(p=>p.date+','+p.value.toFixed(2)).join('\n')}`;
      const filteredSummaries = (summariesJson.items || []).filter((it) =>
        (it.kind === 'equity' && symbols.includes(it.symbol)) || (it.kind === 'crypto' && symbols.includes(it.id))
      );
      const seriesBlocks = symbols.map(s => fmt(s, seriesMap[s] || [])).join('\n\n');
      dataContext = `DATA_CONTEXT\nGeneratedAt: ${summariesJson.generatedAt || 'unknown'}\nSymbols: ${symbols.join(', ')}\nSummaries: ${JSON.stringify(filteredSummaries)}\nSeries:\n${seriesBlocks}\nEND_DATA_CONTEXT`;
    } catch (e) {
      console.warn('Failed to build data context', e);
    }

    // Populate the template with user inputs; fallback to empty strings if undefined.
  const userPrompt = `${dataContext}\n\n` + userTemplate
      .replace('{question}', question)
      .replace('{startDate}', startDate ?? '')
      .replace('{endDate}', endDate ?? '');

    // Call OpenAI with streaming enabled.  Use GPT-4o or other available model.
  const startTs = Date.now();
  const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      max_tokens: 2048,
      temperature: 0.5,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let tokensOut = 0;
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || '';
          tokensOut += token ? 1 : 0; // rough approximation (tokenization not exact)
          controller.enqueue(encoder.encode(token));
        }
        const latency = Date.now() - startTs;
        logOpenAIUsage({ model: 'gpt-4o', completionTokens: tokensOut, latencyMs: latency });
        logResponse('report_api', { latencyMs: latency, completionTokens: tokensOut });
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error';
  logError('report_api_error', err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}