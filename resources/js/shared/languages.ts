/**
 * The choices for a form's language: the site's own, then each locale the app has the chat's
 * text for (AdminConfig.languages), named in the admin's language ("Bahasa Indonesia" stays
 * as is; zh shows as "Chinese" for an English admin).
 */
export function languageChoices(languages: string[] | undefined, adminLocale: string, siteLabel: string): { value: string; label: string }[] {
  const names = (() => { try { return new Intl.DisplayNames([adminLocale.replace('_', '-'), 'en'], { type: 'language' }); } catch { return null; } })();
  const own: Record<string, string> = { en: 'English', id: 'Bahasa Indonesia' };
  const name = (code: string) => { try { return names?.of(code.replace('_', '-')) ?? code; } catch { return code; } };
  const label = (code: string) => own[code] ?? (name(code) === code ? code : `${name(code)} (${code})`);
  return [{ value: 'site', label: siteLabel }, ...(languages?.length ? languages : ['en', 'id']).map(code => ({ value: code, label: label(code) }))];
}
