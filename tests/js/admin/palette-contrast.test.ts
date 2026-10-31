import { describe, expect, it } from 'vitest';
import { messagingDefaults, palettes } from '../../../resources/js/builder/themePalettes';

const luminance = (hex: string) => {
  const channel = (offset: number) => { const value = parseInt(hex.slice(offset, offset + 2), 16) / 255; return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};
const contrast = (a: string, b: string) => { const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (light! + 0.05) / (dark! + 0.05); };
// The runtime writes black or white on the accent, whichever reads better.
const onAccent = (accent: string) => Math.max(contrast(accent, '#ffffff'), contrast(accent, '#171717'));

describe('theme palettes', () => {
  it.each([{ id: 'default', colors: messagingDefaults }, ...palettes()].map(palette => [palette.id, palette.colors] as const))('%s meets WCAG AA for text', (_id, colors) => {
    expect(contrast(colors.userTextColor, colors.userBubbleBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.textColor, colors.botBubbleBackground)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.headerText, colors.headerBackground)).toBeGreaterThanOrEqual(4.5);
    // Buttons (Continue, Submit) and selected choices carry their label on the accent.
    expect(onAccent(colors.primary)).toBeGreaterThanOrEqual(4.5);
  });
});
