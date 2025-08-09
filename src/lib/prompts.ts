import fs from 'fs';
import path from 'path';

/**
 * Load a prompt template from the `prompts` directory.
 * @param name File name (e.g. 'system_report.md')
 */
export function loadPrompt(name: string): string {
  const filePath = path.join(process.cwd(), 'prompts', name);
  return fs.readFileSync(filePath, 'utf-8');
}