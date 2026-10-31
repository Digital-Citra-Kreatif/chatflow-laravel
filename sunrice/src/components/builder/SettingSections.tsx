import { Card, CardContent, CardHeader, CardTitle } from '@imajiner/admin-sdk/ui';
import type { FormDTO, FormSettings } from '@chatflow/builder/api';
import { SettingField } from '@/components/builder/SettingField';
import { formSettingSections } from '@/lib/formSettings';

/** A group of form-level settings (Design, General, Privacy, Spam) as cards per heading. */
export function SettingSections({ form, group, defaults, languages, locale, onChange }: {
  form: FormDTO;
  group: 'design' | 'general' | 'privacy' | 'spam';
  /** The site defaults privacy and spam settings inherit (the page config's `defaults`). */
  defaults?: FormSettings;
  /** Locales a form's language can be set to, and the admin's own (the page config's). */
  languages?: string[] | undefined;
  locale?: string | undefined;
  onChange: (form: FormDTO) => void;
}) {
  return (
    <div className="cf:flex cf:flex-col cf:gap-4">
      {formSettingSections(group, defaults, languages, locale).map(({ heading, settings }) => (
        <Card key={heading}>
          <CardHeader><CardTitle>{heading}</CardTitle></CardHeader>
          <CardContent className="cf:grid cf:gap-4 cf:sm:grid-cols-2">
            {settings.map((setting) => <SettingField key={setting.path} target={form} setting={setting} onChange={onChange} />)}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
