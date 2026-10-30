import { describe, expect, it } from 'vitest';
import type { Step } from '@chatflow/shared/contracts';
import { getPath, paletteGroups, setPath, settingsFor } from '@/lib/fieldTypes';

const step = { id: 's1', key: 'name', type: 'short_text', label: 'Name', messages: ['Hi'], required: true } as unknown as Step;

describe('field settings', () => {
  it('reads and writes nested paths without touching the original', () => {
    const next = setPath(step, 'settings.media.url', 'https://example.org/a.png');
    expect(getPath(next, 'settings.media.url')).toBe('https://example.org/a.png');
    expect((step as unknown as Record<string, unknown>).settings).toBeUndefined();
  });

  it('removes emptied values and their empty parents', () => {
    const withLimit = setPath(step, 'validation.maxLength', 10);
    expect(getPath(withLimit, 'validation.maxLength')).toBe(10);
    const cleared = setPath(withLimit, 'validation.maxLength', '');
    expect((cleared as unknown as Record<string, unknown>).validation).toBeUndefined();
    expect(setPath(step, 'placeholder', '')).not.toHaveProperty('placeholder');
  });

  it('keeps false booleans', () => {
    expect(getPath(setPath(step, 'settings.autoContinue', false), 'settings.autoContinue')).toBe(false);
  });

  it('offers settings by type and section', () => {
    const paths = (type: string, section: 'content' | 'validation' | 'advanced') => settingsFor(type, section).map((setting) => setting.path);
    expect(paths('short_text', 'validation')).toEqual(['validation.minLength', 'validation.maxLength', 'validation.format', 'validation.pattern']);
    expect(paths('statement', 'content')).toEqual(['helpText', 'settings.buttonLabel', 'settings.autoContinue']);
    expect(paths('statement', 'advanced')).toEqual(['hiddenByDefault']);
    expect(paths('date', 'validation')).toContain('validation.minAge');
  });

  it('groups the palette by the types the server offers', () => {
    const groups = paletteGroups(['short_text', 'email', 'rating', 'custom_type']);
    expect(groups.map((group) => [group.label, group.types])).toEqual([
      ['Basic', ['short_text', 'email']], ['Ratings', ['rating']], ['Other', ['custom_type']],
    ]);
  });
});
