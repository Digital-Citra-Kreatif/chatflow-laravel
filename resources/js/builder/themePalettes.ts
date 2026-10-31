import { __ } from '@wordpress/i18n';
import type { FormSettings } from './api';

/** Theme palettes and colour defaults, shared by the standalone and the Sunrice panel builders. */
export type Appearance = NonNullable<FormSettings['appearance']>;
export type ColorKey = 'primary' | 'headerBackground' | 'headerText' | 'chatBackground' | 'botBubbleBackground' | 'textColor' | 'userBubbleBackground' | 'userTextColor';

/** Defaults the visitor runtime uses for messaging style when a colour is left empty. */
export const messagingDefaults: Record<ColorKey, string> = {
  primary: '#3390ec', headerBackground: '#ffffff', headerText: '#000000', chatBackground: '#dbe6ee',
  botBubbleBackground: '#ffffff', textColor: '#000000', userBubbleBackground: '#e1fec6', userTextColor: '#000000',
};
/** Built-in messaging dark mode colours (mirrors the runtime stylesheet). */
export const messagingDarkColors: Record<ColorKey, string> = {
  primary: '#5eb5f7', headerBackground: '#17212b', headerText: '#f5f5f5', chatBackground: '#0e1621',
  botBubbleBackground: '#182533', textColor: '#f5f5f5', userBubbleBackground: '#2b5278', userTextColor: '#ffffff',
};
export const classicDefaults: Record<ColorKey, string> = {
  primary: '#171717', headerBackground: '#ffffff', headerText: '#171717', chatBackground: '#ffffff',
  botBubbleBackground: '#f1f1f1', textColor: '#171717', userBubbleBackground: '#e5e5e5', userTextColor: '#171717',
};

export interface Palette { id: string; label: string; theme: 'light' | 'dark'; wallpaper: NonNullable<Appearance['wallpaper']>; colors: Record<ColorKey, string> }
export const palettes = (): Palette[] => [
  { id: 'sky', label: __('Sky', 'chatflow-forms'), theme: 'light', wallpaper: 'doodle', colors: { ...messagingDefaults, primary: '#2271b1' } },
  { id: 'meadow', label: __('Meadow', 'chatflow-forms'), theme: 'light', wallpaper: 'doodle', colors: { primary: '#008069', headerBackground: '#008069', headerText: '#ffffff', chatBackground: '#efe7de', botBubbleBackground: '#ffffff', textColor: '#111b21', userBubbleBackground: '#d9fdd3', userTextColor: '#111b21' } },
  { id: 'lavender', label: __('Lavender', 'chatflow-forms'), theme: 'light', wallpaper: 'gradient', colors: { primary: '#7b5cff', headerBackground: '#ffffff', headerText: '#1e1b3a', chatBackground: '#ece8ff', botBubbleBackground: '#ffffff', textColor: '#1e1b3a', userBubbleBackground: '#7b5cff', userTextColor: '#ffffff' } },
  { id: 'sunset', label: __('Sunset', 'chatflow-forms'), theme: 'light', wallpaper: 'dots', colors: { primary: '#f0602b', headerBackground: '#fff4ec', headerText: '#3a1d0e', chatBackground: '#fde6d5', botBubbleBackground: '#ffffff', textColor: '#3a1d0e', userBubbleBackground: '#f0602b', userTextColor: '#ffffff' } },
  { id: 'graphite', label: __('Graphite', 'chatflow-forms'), theme: 'light', wallpaper: 'none', colors: { primary: '#18181b', headerBackground: '#ffffff', headerText: '#18181b', chatBackground: '#f4f4f5', botBubbleBackground: '#ffffff', textColor: '#18181b', userBubbleBackground: '#18181b', userTextColor: '#ffffff' } },
  { id: 'night', label: __('Night', 'chatflow-forms'), theme: 'dark', wallpaper: 'doodle', colors: { primary: '#5eb5f7', headerBackground: '#17212b', headerText: '#f5f5f5', chatBackground: '#0e1621', botBubbleBackground: '#182533', textColor: '#f5f5f5', userBubbleBackground: '#2b5278', userTextColor: '#ffffff' } },
];

/** Apply a palette: colours, light/dark and the palette's wallpaper, keeping every other choice. */
export function applyPalette(appearance: Appearance, palette: Palette): Appearance {
  return { ...appearance, ...palette.colors, style: 'messaging', theme: palette.theme, wallpaper: palette.wallpaper };
}
