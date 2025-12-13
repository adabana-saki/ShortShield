/**
 * Internationalization utilities
 * Uses WebExtensions i18n API with Intl for formatting
 */

import browser from 'webextension-polyfill';

/**
 * Get localized message with optional substitutions
 * Falls back to message name if translation not found
 */
export function t(
  messageName: string,
  substitutions?: string | string[]
): string {
  try {
    const message = browser.i18n.getMessage(messageName, substitutions);

    if (!message) {
      // Log warning in development
      if (__DEV__) {
        console.warn(`[i18n] Missing translation: ${messageName}`);
      }
      return messageName;
    }

    return message;
  } catch {
    // Return message name as fallback
    return messageName;
  }
}

/**
 * Get current UI language
 */
export function getUILanguage(): string {
  try {
    return browser.i18n.getUILanguage();
  } catch {
    return 'en';
  }
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale?: string): string {
  const lang = locale ?? getUILanguage();
  try {
    return new Intl.NumberFormat(lang).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
  locale?: string
): string {
  const lang = locale ?? getUILanguage();
  try {
    return new Intl.DateTimeFormat(lang, options).format(date);
  } catch {
    return date.toISOString();
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date, locale?: string): string {
  const lang = locale ?? getUILanguage();

  try {
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const now = Date.now();
    const diffMs = date.getTime() - now;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (Math.abs(diffSec) < 60) {
      return rtf.format(diffSec, 'second');
    } else if (Math.abs(diffMin) < 60) {
      return rtf.format(diffMin, 'minute');
    } else if (Math.abs(diffHour) < 24) {
      return rtf.format(diffHour, 'hour');
    } else {
      return rtf.format(diffDay, 'day');
    }
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Format duration in human-readable form
 */
export function formatDuration(seconds: number, locale?: string): string {
  const lang = locale ?? getUILanguage();

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  try {
    const nf = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2 });

    if (hours > 0) {
      parts.push(nf.format(hours));
    }
    parts.push(nf.format(minutes));
    parts.push(nf.format(secs));

    return parts.join(':');
  } catch {
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }
}
