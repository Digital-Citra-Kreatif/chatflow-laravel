/**
 * Writes lang/{en,id}/runtime.php (the visitor chat's phrases as Laravel translations) from
 * resources/js/runtime/phrase-catalog.ts, the runtime's built-in copy. Run after changing the
 * catalog: npm run lang:sync. tests/js/lang.test.ts fails while the two differ.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { english, indonesian } from '../resources/js/runtime/phrase-catalog.ts';

const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
export function php(phrases: Record<string, string>, language: string): string {
  const width = Math.max(...Object.keys(phrases).map((key) => quote(key).length));
  const lines = Object.entries(phrases).map(([key, value]) => `\t${quote(key).padEnd(width)} => ${quote(value)},`);
  return `<?php\n\n// The visitor chat's text (${language}). Generated from resources/js/runtime/phrase-catalog.ts by\n// "npm run lang:sync". Apps change it in lang/vendor/chatflow/{locale}/runtime.php.\n\nreturn [\n${lines.join('\n')}\n];\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [locale, phrases, language] of [['en', english, 'English'], ['id', indonesian, 'Indonesian']] as const) {
    mkdirSync(`lang/${locale}`, { recursive: true });
    writeFileSync(`lang/${locale}/runtime.php`, php(phrases, language));
  }
}
