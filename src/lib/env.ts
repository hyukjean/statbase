import { z } from 'zod';

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  ALPHAVANTAGE_API_KEY: z.string().min(1),
  FRED_API_KEY: z.string().optional(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  TIMEZONE: z.string().default('Asia/Seoul'),
  DATA_CACHE_DIR: z.string().default('./data_cache'),
});

let cachedEnv: z.infer<typeof EnvSchema> | null = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error('Environment validation failed: ' + JSON.stringify(parsed.error.format()));
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}

export type AppEnv = ReturnType<typeof getEnv>;
