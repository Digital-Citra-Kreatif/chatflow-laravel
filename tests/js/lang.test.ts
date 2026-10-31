import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { english, indonesian } from '../../resources/js/runtime/phrase-catalog';
import { php } from '../../scripts/sync-lang';

describe('Laravel lang files', () => {
  it.each([['en', english, 'English'], ['id', indonesian, 'Indonesian']] as const)('lang/%s/runtime.php matches the runtime catalog (npm run lang:sync)', (locale, phrases, language) => {
    expect(readFileSync(`lang/${locale}/runtime.php`, 'utf8')).toBe(php(phrases, language));
  });
  it('translates every phrase into Indonesian', () => {
    expect(Object.keys(indonesian).sort()).toEqual(Object.keys(english).sort());
  });
});
