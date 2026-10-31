import type { FormSettings } from '@chatflow/builder/api';
import type { SettingDescriptor } from '@/lib/fieldTypes';
import { appearanceDefaults } from '@chatflow/shared/appearanceDefaults';
import { languageChoices } from '@chatflow/shared/languages';
import { __ } from '@/lib/i18n';

/**
 * The form-level settings the builder's Design and Settings tabs show, as data (paths into
 * the form: "settings.appearance.theme", "schema.bot.name"), rendered by SettingField.
 * Privacy and spam settings inherit the site defaults (Settings → ChatFlow) while empty.
 */
type Group = 'design' | 'general' | 'privacy' | 'spam';
type FormSetting = Omit<SettingDescriptor, 'section' | 'types'> & { group: Group; heading: string };

const onOff = (value: unknown) => (typeof value === 'boolean' ? value : undefined);

export function formSettingDescriptors(defaults: FormSettings = {}, languages?: string[], locale = 'en'): FormSetting[] {
  const look = __('Look');
  const colours = __('Colours');
  const text = __('Text');
  const bot = __('Bot');
  const extras = __('Extras');
  const display = __('Where it shows');
  const sessions = __('Sessions and resume');
  const limits = __('Limits');
  const privacy = __('Privacy and retention');
  const spam = __('Spam protection');
  const colour = (path: string, label: string): FormSetting => ({ path: `settings.appearance.${path}`, label, kind: 'color', group: 'design', heading: colours });
  const p = defaults.privacy ?? {};
  const s = defaults.spam ?? {};

  return [
    {
      path: 'settings.appearance.style', label: __('Style'), kind: 'select', group: 'design', heading: look, fallback: appearanceDefaults.style,
      options: () => [{ value: 'classic', label: __('Classic: plain bubbles that blend into the page') }, { value: 'messaging', label: __('Messaging: wallpaper, bubble tails, keyboard-style answers') }],
    },
    {
      path: 'settings.appearance.theme', label: __('Light or dark'), kind: 'select', group: 'design', heading: look, inherited: () => defaults.appearance?.theme,
      options: () => [{ value: 'light', label: __('Light') }, { value: 'dark', label: __('Dark') }, { value: 'auto', label: __('Follow the visitor’s device') }],
    },
    { path: 'settings.appearance.radius', label: __('Corner radius (px)'), kind: 'number', group: 'design', heading: look, min: 0, max: 32, fallback: appearanceDefaults.radius },
    { path: 'settings.appearance.width', label: __('Chat width (px)'), kind: 'number', group: 'design', heading: look, min: 320, max: 1200, fallback: appearanceDefaults.width },
    {
      path: 'settings.appearance.wallpaper', label: __('Wallpaper (messaging style)'), kind: 'select', group: 'design', heading: look, fallback: appearanceDefaults.wallpaper,
      options: () => [{ value: 'none', label: __('None') }, { value: 'doodle', label: __('Doodle') }, { value: 'dots', label: __('Dots') }, { value: 'gradient', label: __('Gradient') }],
    },
    {
      path: 'settings.appearance.choiceStyle', label: __('Answer buttons (messaging style)'), kind: 'select', group: 'design', heading: look, fallback: appearanceDefaults.choiceStyle,
      options: () => [{ value: 'chips', label: __('Chips') }, { value: 'keyboard', label: __('Keyboard') }],
    },
    { path: 'settings.appearance.bubbleTails', label: __('Bubble tails'), kind: 'toggle', group: 'design', heading: look, fallback: appearanceDefaults.bubbleTails },
    colour('primary', __('Accent (buttons, links)')),
    colour('botBubbleBackground', __('Bot bubble')),
    colour('textColor', __('Bot text')),
    colour('userBubbleBackground', __('Visitor bubble')),
    colour('userTextColor', __('Visitor text')),
    colour('headerBackground', __('Header')),
    colour('headerText', __('Header text')),
    colour('chatBackground', __('Chat background')),
    {
      path: 'settings.appearance.googleFont', label: __('Font'), kind: 'select', group: 'design', heading: text, fallback: 'system',
      options: () => [{ value: 'system', label: __('Device default (no external requests)') }, { value: 'Inter', label: 'Inter' }, { value: 'Roboto', label: 'Roboto' }, { value: 'Open Sans', label: 'Open Sans' }],
      help: () => __('Inter, Roboto and Open Sans load from Google Fonts in the visitor’s browser.'),
    },
    { path: 'settings.appearance.inheritFont', label: __('Use the page’s font instead'), kind: 'toggle', group: 'design', heading: text, fallback: false },
    { path: 'settings.appearance.font', label: __('Custom font stack (CSS font-family)'), kind: 'text', group: 'design', heading: text },
    { path: 'schema.bot.name', label: __('Bot name'), kind: 'text', group: 'design', heading: bot },
    {
      path: 'schema.bot.typingSpeed', label: __('Typing speed'), kind: 'select', group: 'design', heading: bot, fallback: 'normal',
      options: () => [{ value: 'off', label: __('Off (instant)') }, { value: 'fast', label: __('Fast') }, { value: 'normal', label: __('Normal') }, { value: 'slow', label: __('Slow') }],
    },
    { path: 'settings.appearance.confetti', label: __('Confetti when the form is completed'), kind: 'toggle', group: 'design', heading: extras, fallback: false },
    { path: 'settings.appearance.customCss', label: __('Custom CSS (only inside this form)'), kind: 'textarea', group: 'design', heading: extras },

    {
      path: 'settings.display.mode', label: __('Display mode'), kind: 'select', group: 'general', heading: display, fallback: 'inline',
      options: () => [
        { value: 'inline', label: __('Inside the page content') }, { value: 'fullpage', label: __('Its own full page') },
        { value: 'launcher', label: __('Floating chat button') }, { value: 'popup', label: __('Pop-up') },
      ],
      help: () => __('How the embed code shows the form. The share link always opens it on its own page.'),
    },
    {
      path: 'settings.display.launcher.position', label: __('Button position'), kind: 'select', group: 'general', heading: display, fallback: 'right',
      options: () => [{ value: 'right', label: __('Bottom right') }, { value: 'left', label: __('Bottom left') }],
    },
    { path: 'settings.display.launcher.autoOpenSeconds', label: __('Open by itself after (seconds)'), kind: 'number', group: 'general', heading: display, min: 0, max: 3600 },
    { path: 'settings.display.launcher.scrollPercent', label: __('…or after scrolling (% of the page)'), kind: 'number', group: 'general', heading: display, min: 0, max: 100 },
    { path: 'settings.display.launcher.bottomOffset', label: __('Space below the button (px)'), kind: 'number', group: 'general', heading: display, min: 0, max: 400, fallback: 0, help: () => __('Raise the chat button above a cookie bar or another fixed bar.') },
    {
      path: 'settings.language', label: __('Language of built-in texts'), kind: 'select', group: 'general', heading: display, fallback: 'site',
      options: () => languageChoices(languages, locale, __('The site’s language')),
    },
    { path: 'settings.sessions.savePartial', label: __('Save answers before the form is finished'), kind: 'toggle', group: 'general', heading: sessions, fallback: true },
    { path: 'settings.sessions.resumeEnabled', label: __('Let visitors continue where they left off'), kind: 'toggle', group: 'general', heading: sessions, fallback: true },
    { path: 'settings.sessions.resumePrompt', label: __('Ask before continuing'), kind: 'toggle', group: 'general', heading: sessions, fallback: true },
    { path: 'settings.sessions.resumeDays', label: __('Keep a conversation resumable for (days)'), kind: 'number', group: 'general', heading: sessions, min: 1, max: 365, fallback: 30 },
    { path: 'settings.sessions.abandonDays', label: __('Mark unfinished as abandoned after (days)'), kind: 'number', group: 'general', heading: sessions, min: 1, max: 365, fallback: 30 },
    { path: 'settings.sessions.deletePartialOnRestart', label: __('Delete the unfinished answers when a visitor starts over'), kind: 'toggle', group: 'general', heading: sessions, fallback: false },
    { path: 'settings.sessions.storageNotice', label: __('Tell visitors their answers are kept on their device'), kind: 'toggle', group: 'general', heading: sessions, fallback: false },
    { path: 'settings.limits.total', label: __('Close after this many submissions'), kind: 'number', group: 'general', heading: limits, min: 1 },
    { path: 'settings.limits.closesAt', label: __('Close on'), kind: 'date', group: 'general', heading: limits },

    { path: 'settings.privacy.storeMeta', label: __('Store tracking details (page, referrer, UTM)'), kind: 'toggle', group: 'privacy', heading: privacy, inherited: () => onOff(p.storeMeta) },
    {
      path: 'settings.privacy.ipMode', label: __('IP addresses'), kind: 'select', group: 'privacy', heading: privacy, inherited: () => p.ipMode,
      options: () => [{ value: 'full', label: __('Store in full') }, { value: 'anonymized', label: __('Store anonymized') }, { value: 'none', label: __('Do not store') }],
    },
    { path: 'settings.privacy.storeUserAgent', label: __('Store browser and device'), kind: 'toggle', group: 'privacy', heading: privacy, inherited: () => onOff(p.storeUserAgent) },
    { path: 'settings.privacy.respectDnt', label: __('Respect Do Not Track'), kind: 'toggle', group: 'privacy', heading: privacy, inherited: () => onOff(p.respectDnt) },
    { path: 'settings.privacy.retentionEnabled', label: __('Delete old submissions automatically'), kind: 'toggle', group: 'privacy', heading: privacy, inherited: () => onOff(p.retentionEnabled) },
    { path: 'settings.privacy.retentionDays', label: __('Keep submissions for (days)'), kind: 'number', group: 'privacy', heading: privacy, min: 1, max: 36500, inherited: () => p.retentionDays },
    { path: 'settings.privacy.partialRetentionDays', label: __('Keep partial and abandoned ones for (days)'), kind: 'number', group: 'privacy', heading: privacy, min: 1, max: 36500, inherited: () => p.partialRetentionDays ?? undefined },

    { path: 'settings.spam.honeypotEnabled', label: __('Hidden honeypot field'), kind: 'toggle', group: 'spam', heading: spam, inherited: () => onOff(s.honeypotEnabled) },
    { path: 'settings.spam.minSeconds', label: __('Minimum seconds to answer'), kind: 'number', group: 'spam', heading: spam, min: 0, max: 3600, inherited: () => s.minSeconds },
    { path: 'settings.spam.rateLimit', label: __('Submissions per visitor IP per window'), kind: 'number', group: 'spam', heading: spam, min: 1, max: 10000, inherited: () => s.rateLimit },
    { path: 'settings.spam.rateWindowSeconds', label: __('Rate window (seconds)'), kind: 'number', group: 'spam', heading: spam, min: 1, max: 86400, inherited: () => s.rateWindowSeconds },
  ];
}

/** One group's settings under their headings, in order. */
export function formSettingSections(group: Group, defaults?: FormSettings, languages?: string[], locale?: string): { heading: string; settings: SettingDescriptor[] }[] {
  const sections = new Map<string, SettingDescriptor[]>();
  for (const { group: own, heading, ...setting } of formSettingDescriptors(defaults, languages, locale)) {
    if (own !== group) continue;
    sections.set(heading, [...(sections.get(heading) ?? []), { ...setting, section: 'content', types: 'all' }]);
  }
  return [...sections].map(([heading, settings]) => ({ heading, settings }));
}
