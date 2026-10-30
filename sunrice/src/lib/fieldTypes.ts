import type { Step } from '@chatflow/shared/contracts';
import { __ } from '@/lib/i18n';

/**
 * What the builder knows about each field type: its name, its palette group, and the
 * settings the inspector shows for it. Settings are described here as data (a path into
 * the step, a label and a control) and rendered by one generic component, so a setting is
 * added or changed in one place. Choices, messages, keys and rules have their own editors.
 */

export function fieldTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    short_text: __('Short text'), long_text: __('Long text'), email: __('Email'), phone: __('Phone'), number: __('Number'),
    rating: __('Rating (1–5)'), scale: __('Scale (1–10)'), nps: __('NPS (0–10)'), slider: __('Slider'), calculated: __('Calculated number'),
    file_upload: __('File upload'), address: __('Address'), media: __('Media'), date: __('Date'), single_choice: __('Single choice'),
    multi_choice: __('Multiple choice'), yes_no: __('Yes / No'), consent: __('Consent'), hidden: __('Hidden field'),
    statement: __('Statement'), summary: __('Summary'),
  };
  return labels[type] ?? type;
}

/** Palette groups, limited to the types the server offers (config chatflow.field_types); others go to "Other". */
export function paletteGroups(available: readonly string[]): { label: string; types: string[] }[] {
  const groups = [
    { label: __('Basic'), types: ['statement', 'short_text', 'long_text', 'email', 'phone', 'number', 'date'] },
    { label: __('Choices'), types: ['single_choice', 'multi_choice', 'yes_no', 'consent'] },
    { label: __('Ratings'), types: ['rating', 'scale', 'nps', 'slider'] },
    { label: __('Advanced'), types: ['address', 'media', 'file_upload', 'calculated', 'hidden', 'summary'] },
  ];
  const grouped = new Set(groups.flatMap((group) => group.types));
  return [
    ...groups.map((group) => ({ ...group, types: group.types.filter((type) => available.includes(type)) })),
    { label: __('Other'), types: available.filter((type) => !grouped.has(type)) },
  ].filter((group) => group.types.length > 0);
}

/** Types that take an answer from the visitor (the rest only show something or compute a value). */
export function acceptsInput(type: string): boolean {
  return !['statement', 'summary', 'media', 'hidden', 'calculated'].includes(type);
}

export type SettingKind = 'text' | 'textarea' | 'number' | 'date' | 'toggle' | 'select' | 'checklist' | 'list';

export interface SettingDescriptor {
  /** Dotted path into the step: "placeholder", "settings.unit", "validation.minLength", "settings.media.url". */
  path: string;
  label: string;
  kind: SettingKind;
  section: 'content' | 'validation' | 'advanced';
  types: readonly string[] | 'all' | 'input';
  options?: () => { value: string; label: string }[];
  help?: () => string;
  /** Shown while the step has no value (and used by toggles and selects as their value then). */
  fallback?: string | number | boolean | string[];
  /** A toggle that stores the opposite of what it shows ("Wait for a button" stores autoContinue: false). */
  invert?: boolean;
  /** Upper-cases text (country codes). */
  upper?: boolean;
}

const TEXT_INPUT = ['short_text', 'long_text', 'email', 'phone'];

export function settingDescriptors(): SettingDescriptor[] {
  return [
    { path: 'helpText', label: __('Help text'), kind: 'textarea', section: 'content', types: 'all' },
    { path: 'placeholder', label: __('Placeholder'), kind: 'text', section: 'content', types: 'input' },
    {
      path: 'settings.layout', label: __('Choice layout'), kind: 'select', section: 'content', types: ['single_choice', 'multi_choice'], fallback: 'chips',
      options: () => [{ value: 'chips', label: __('Chips') }, { value: 'cards', label: __('Cards') }, { value: 'dropdown', label: __('Dropdown') }],
    },
    { path: 'settings.expression', label: __('Formula'), kind: 'text', section: 'content', types: ['calculated'], help: () => __('For example answer.price * answer.quantity + variable.score') },
    { path: 'settings.country', label: __('Default country (ISO code)'), kind: 'text', section: 'content', types: ['phone'], fallback: 'ID', upper: true },
    {
      path: 'settings.addressFields', label: __('Address parts'), kind: 'checklist', section: 'content', types: ['address'], fallback: ['street', 'city', 'postcode', 'country'],
      options: () => [{ value: 'street', label: __('Street') }, { value: 'city', label: __('City') }, { value: 'postcode', label: __('Postcode') }, { value: 'country', label: __('Country') }],
    },
    {
      path: 'settings.media.type', label: __('Media type'), kind: 'select', section: 'content', types: ['media'], fallback: 'image',
      options: () => [{ value: 'image', label: __('Image') }, { value: 'video', label: __('Video') }, { value: 'gif', label: __('GIF') }],
    },
    { path: 'settings.media.url', label: __('HTTPS media URL'), kind: 'text', section: 'content', types: ['media'] },
    { path: 'settings.media.alt', label: __('Alternative text'), kind: 'text', section: 'content', types: ['media'] },
    { path: 'settings.buttonLabel', label: __('Continue / submit button'), kind: 'text', section: 'content', types: ['statement', 'summary'] },
    { path: 'settings.autoContinue', label: __('Wait for the visitor to press a button'), kind: 'toggle', section: 'content', types: ['statement'], fallback: true, invert: true },
    { path: 'settings.consentText', label: __('Consent text'), kind: 'textarea', section: 'content', types: ['consent'] },
    { path: 'settings.privacyUrl', label: __('Privacy policy URL'), kind: 'text', section: 'content', types: ['consent'] },
    {
      path: 'settings.source', label: __('Where the value comes from'), kind: 'select', section: 'content', types: ['hidden'], fallback: 'default',
      options: () => [
        { value: 'default', label: __('Default value') }, { value: 'url', label: __('URL parameter') }, { value: 'cookie', label: __('Cookie') },
        { value: 'meta', label: __('Page metadata') }, { value: 'merge', label: __('Merge tag') },
      ],
      help: () => __('Cookies are limited to utm_source, utm_medium, utm_campaign, utm_term, utm_content, campaign, tracking, cff_locale and cff_theme.'),
    },
    { path: 'settings.sourceKey', label: __('Parameter or cookie name (blank = field key)'), kind: 'text', section: 'content', types: ['hidden'] },
    { path: 'defaultValue', label: __('Default value'), kind: 'text', section: 'content', types: ['hidden'] },

    { path: 'validation.minLength', label: __('Minimum length'), kind: 'number', section: 'validation', types: TEXT_INPUT },
    { path: 'validation.maxLength', label: __('Maximum length'), kind: 'number', section: 'validation', types: TEXT_INPUT },
    {
      path: 'validation.format', label: __('Format'), kind: 'select', section: 'validation', types: TEXT_INPUT, fallback: 'text',
      options: () => [{ value: 'text', label: __('Any text') }, { value: 'url', label: __('URL') }, { value: 'email', label: __('Email address') }],
    },
    { path: 'validation.pattern', label: __('Custom pattern (regular expression)'), kind: 'text', section: 'validation', types: TEXT_INPUT },
    { path: 'validation.min', label: __('Minimum'), kind: 'number', section: 'validation', types: ['number', 'slider'] },
    { path: 'validation.max', label: __('Maximum'), kind: 'number', section: 'validation', types: ['number', 'slider'] },
    { path: 'validation.step', label: __('Increment'), kind: 'number', section: 'validation', types: ['number', 'slider'] },
    { path: 'settings.unit', label: __('Unit suffix'), kind: 'text', section: 'validation', types: ['number', 'slider'] },
    { path: 'validation.min', label: __('Earliest date'), kind: 'date', section: 'validation', types: ['date'] },
    { path: 'validation.max', label: __('Latest date'), kind: 'date', section: 'validation', types: ['date'] },
    { path: 'validation.minAge', label: __('Minimum age (years)'), kind: 'number', section: 'validation', types: ['date'] },
    { path: 'validation.minSelections', label: __('Minimum selections'), kind: 'number', section: 'validation', types: ['multi_choice'] },
    { path: 'validation.maxSelections', label: __('Maximum selections'), kind: 'number', section: 'validation', types: ['multi_choice'] },
    { path: 'validation.maxBytes', label: __('Maximum bytes per file (blank = 10 MiB)'), kind: 'number', section: 'validation', types: ['file_upload'] },
    { path: 'validation.mimeTypes', label: __('Allowed file types (comma separated)'), kind: 'list', section: 'validation', types: ['file_upload'] },

    { path: 'hiddenByDefault', label: __('Hidden until a rule shows it'), kind: 'toggle', section: 'advanced', types: 'all', fallback: false },
    { path: 'settings.autocomplete', label: __('Autocomplete'), kind: 'text', section: 'advanced', types: 'input', help: () => __('A browser autocomplete token, such as name, email or tel.') },
    {
      path: 'settings.inputMode', label: __('Keyboard hint'), kind: 'select', section: 'advanced', types: 'input', fallback: 'text',
      options: () => [
        { value: 'text', label: __('Standard keyboard') }, { value: 'numeric', label: __('Numbers') }, { value: 'tel', label: __('Telephone keypad') },
        { value: 'decimal', label: __('Decimal numbers') }, { value: 'email', label: __('Email keyboard') }, { value: 'url', label: __('URL keyboard') },
        { value: 'search', label: __('Search keyboard') }, { value: 'none', label: __('No on-screen keyboard') },
      ],
    },
  ];
}

/** The descriptors that apply to a step type in one inspector section. */
export function settingsFor(type: string, section: SettingDescriptor['section']): SettingDescriptor[] {
  return settingDescriptors().filter((setting) => setting.section === section && (
    setting.types === 'all' || (setting.types === 'input' ? acceptsInput(type) : setting.types.includes(type))
  ));
}

export function getPath(step: Step, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined), step);
}

/**
 * A copy of the step with the value at `path` set; undefined or '' removes the key, so
 * an emptied setting falls back to its default instead of storing an empty value.
 * Emptied parent objects are removed too.
 */
export function setPath(step: Step, path: string, value: unknown): Step {
  const keys = path.split('.');
  const write = (target: Record<string, unknown> | undefined, index: number): Record<string, unknown> | undefined => {
    const copy = { ...(target ?? {}) };
    const key = keys[index]!;
    if (index === keys.length - 1) {
      if (value === undefined || value === '') delete copy[key];
      else copy[key] = value;
    } else {
      const child = write(copy[key] as Record<string, unknown> | undefined, index + 1);
      if (child && Object.keys(child).length) copy[key] = child;
      else delete copy[key];
    }
    return copy;
  };
  return write(step as unknown as Record<string, unknown>, 0) as unknown as Step;
}
