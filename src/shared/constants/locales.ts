/**
 * Supported locales configuration
 */

/**
 * Supported locale codes
 */
export type SupportedLocale = 'en' | 'ja';

/**
 * Locale metadata
 */
export interface LocaleInfo {
  readonly code: SupportedLocale;
  readonly name: string;
  readonly nativeName: string;
  readonly direction: 'ltr' | 'rtl';
}

/**
 * All supported locales with metadata
 */
export const SUPPORTED_LOCALES: Readonly<Record<SupportedLocale, LocaleInfo>> =
  {
    en: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr',
    },
    ja: {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      direction: 'ltr',
    },
  } as const;

/**
 * Default/fallback locale
 */
export const DEFAULT_LOCALE: SupportedLocale = 'en';

/**
 * Get locale info by code
 */
export function getLocaleInfo(code: string): LocaleInfo | undefined {
  if (code in SUPPORTED_LOCALES) {
    return SUPPORTED_LOCALES[code as SupportedLocale];
  }
  return undefined;
}

/**
 * Check if locale is supported
 */
export function isSupportedLocale(code: string): code is SupportedLocale {
  return code in SUPPORTED_LOCALES;
}

/**
 * Get all locale codes
 */
export function getLocales(): readonly SupportedLocale[] {
  return Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];
}

/**
 * Normalize browser locale to supported locale
 * e.g., 'en-US' -> 'en', 'ja-JP' -> 'ja'
 */
export function normalizeLocale(browserLocale: string): SupportedLocale {
  // Try exact match first
  if (isSupportedLocale(browserLocale)) {
    return browserLocale;
  }

  // Try language code only (e.g., 'en-US' -> 'en')
  const languageCode = browserLocale.split('-')[0];
  if (languageCode && isSupportedLocale(languageCode)) {
    return languageCode;
  }

  // Fallback to default
  return DEFAULT_LOCALE;
}
