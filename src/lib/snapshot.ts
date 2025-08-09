export interface SummariesFileMeta { generatedAt: string }

function formatDateInTZ(date: Date, timeZone: string): string {
  // Returns YYYY-MM-DD in given timezone
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function shouldSkipSnapshot(meta: SummariesFileMeta, timeZone: string, now: Date = new Date()): boolean {
  if (!meta.generatedAt) return false;
  const generated = new Date(meta.generatedAt);
  if (Number.isNaN(generated.getTime())) return false;
  const today = formatDateInTZ(now, timeZone);
  const generatedDay = formatDateInTZ(generated, timeZone);
  return today === generatedDay;
}

export function getTodayInTZ(timeZone: string, now: Date = new Date()): string {
  return formatDateInTZ(now, timeZone);
}
