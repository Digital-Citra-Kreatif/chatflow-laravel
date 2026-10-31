/**
 * Stands in for @wordpress/i18n in ChatFlow's shared modules (and is what the
 * pages use): the English text is the key, looked up with the panel's t(), so
 * translations ship as lang/{code}.json like any panel plugin's. The text domain
 * argument is ignored. sprintf supports %s, %d and numbered %1$s placeholders.
 */
import { t } from '@imajiner/admin-sdk';

function lookup(text: string): string {
  try {
    return t(text);
  } catch {
    return text; // Outside the panel (unit tests).
  }
}

export function __(text: string, _domain?: string): string {
  return lookup(text);
}

export function _x(text: string, _context: string, _domain?: string): string {
  return lookup(text);
}

export function _n(single: string, plural: string, count: number, _domain?: string): string {
  return lookup(count === 1 ? single : plural);
}

export function sprintf(format: string, ...args: unknown[]): string {
  let next = 0;
  return format.replace(/%(?:(\d+)\$)?([sd%])/g, (match, position: string | undefined, type: string) => {
    if (type === '%') return '%';
    const value = args[position ? Number(position) - 1 : next++];
    return type === 'd' ? String(Math.trunc(Number(value))) : String(value ?? '');
  });
}
