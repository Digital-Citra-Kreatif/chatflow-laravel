import { __ } from '@/lib/i18n';

/** Dates and numbers in the browser's locale. Server times are UTC ("2026-10-30 13:48:49"). */
export function parseUtc(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value.replace(' ', 'T')}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: string | null | undefined): string {
  const date = parseUtc(value);
  return date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date) : '—';
}

/** "3 hours ago", "in 2 days"; "" without a date. */
export function relativeTime(value: string | null | undefined, now: Date = new Date()): string {
  const date = parseUtc(value);
  if (!date) return '';
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(0, 'minute');
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value)}%`;
}

/** An answer for reading: yes/no answers as words; lists and objects as the shared displayValue() writes them. */
export function answerText(value: unknown, display: (value: unknown) => string): string {
  if (value === true) return __('Yes');
  if (value === false) return __('No');
  return display(value);
}
