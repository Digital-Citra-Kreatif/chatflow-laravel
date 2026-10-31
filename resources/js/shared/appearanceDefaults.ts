/**
 * What the visitor runtime uses when a form leaves these appearance settings unset. The
 * builders show the same values, so what the admin sees is what visitors get.
 */
export const appearanceDefaults = {
  style: 'classic',
  wallpaper: 'doodle',
  choiceStyle: 'keyboard',
  bubbleTails: true,
  radius: 12,
  width: 720,
} as const;
