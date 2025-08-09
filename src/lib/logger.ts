type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface BaseLog { level: LogLevel; ts: string; msg: string; [k: string]: unknown }

function ts() { return new Date().toISOString(); }

function emit(obj: BaseLog) {
  const line = JSON.stringify(obj);
  // Route by level
  if (obj.level === 'error') console.error(line);
  else if (obj.level === 'warn') console.warn(line);
  else if (obj.level === 'info') console.info(line);
  else console.debug(line);
}

export function log(level: LogLevel, msg: string, extra?: Record<string, unknown>) {
  emit({ level, ts: ts(), msg, ...(extra || {}) });
}

export function logRequest(name: string, payload: unknown) {
  log('debug', 'request', { name, payload });
}

export function logResponse(name: string, response: unknown) {
  log('debug', 'response', { name, response });
}

export function logError(msg: string, err: unknown, meta?: Record<string, unknown>) {
  const detail = err instanceof Error ? { error: err.message, stack: err.stack } : { error: err };
  log('error', msg, { ...meta, ...detail });
}

export interface OpenAIUsageLog {
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
}

export function logOpenAIUsage(u: OpenAIUsageLog) { log('info', 'openai_usage', { ...u }); }