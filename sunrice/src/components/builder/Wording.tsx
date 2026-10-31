import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@imajiner/admin-sdk/ui';
import { english, indonesian } from '@chatflow/runtime/phrase-catalog';
import type { FormDTO } from '@chatflow/builder/api';
import { __, sprintf } from '@/lib/i18n';

/**
 * The chat's built-in texts ("Continue", "Start over"…) for this form. Each shows the
 * default as its placeholder, so wording is changed without knowing phrase keys;
 * emptying a field goes back to the default. Changed ones are listed first.
 */
export function Wording({ form, locale, onChange }: { form: FormDTO; locale: string; onChange: (form: FormDTO) => void }) {
  const [search, setSearch] = useState('');
  const language = form.settings.language ?? 'site';
  const defaults = language === 'id' || (language === 'site' && /^id(?:[-_]|$)/i.test(locale)) ? indonesian : english;
  const overrides = form.settings.phrases ?? {};
  const query = search.trim().toLowerCase();
  const keys = Object.keys(english)
    .filter((key) => !query || [defaults[key], english[key], overrides[key]].some((text) => text?.toLowerCase().includes(query)))
    .sort((a, b) => Number(b in overrides) - Number(a in overrides));

  const set = (key: string, value: string) => {
    const phrases = { ...overrides };
    if (value.trim()) phrases[key] = value;
    else delete phrases[key];
    onChange({ ...form, settings: { ...form.settings, phrases } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{__('Chat texts')}</CardTitle>
        <CardDescription>{sprintf(__('%d changed. Empty fields use the built-in text, shown in grey.'), Object.keys(overrides).length)}</CardDescription>
      </CardHeader>
      <CardContent className="cf:flex cf:flex-col cf:gap-4">
        <Input aria-label={__('Search texts')} placeholder={__('Search texts…')} value={search} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} className="cf:max-w-sm" />
        <div className="cf:grid cf:gap-3 cf:sm:grid-cols-2">
          {keys.map((key) => (
            <div key={key} className="cf:flex cf:flex-col cf:gap-1.5">
              <Label htmlFor={`cf-phrase-${key}`} className="cf:font-normal cf:text-muted-foreground">{english[key]}</Label>
              <Input id={`cf-phrase-${key}`} value={overrides[key] ?? ''} placeholder={defaults[key]} onChange={(event: React.ChangeEvent<HTMLInputElement>) => set(key, event.target.value)} />
            </div>
          ))}
        </div>
        {Object.keys(overrides).length > 0 && (
          <Button variant="outline" size="sm" className="cf:self-start" onClick={() => onChange({ ...form, settings: { ...form.settings, phrases: {} } })}>{__('Reset all texts')}</Button>
        )}
      </CardContent>
    </Card>
  );
}
