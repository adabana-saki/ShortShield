/**
 * Central export for all constants
 */

// Platform configurations
export {
  YOUTUBE_CONFIG,
  TIKTOK_CONFIG,
  INSTAGRAM_CONFIG,
  PLATFORM_CONFIGS,
  getPlatformByHostname,
  isSupportedHostname,
  getAllSupportedHostnames,
} from './platforms';

// Default settings
export {
  SETTINGS_VERSION,
  DEFAULT_PLATFORM_SETTINGS,
  DEFAULT_STATS,
  DEFAULT_PREFERENCES,
  DEFAULT_SETTINGS,
  LIMITS,
  PERFORMANCE,
} from './defaults';

// Locales
export type { SupportedLocale, LocaleInfo } from './locales';
export {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  getLocaleInfo,
  isSupportedLocale,
  getLocales,
  normalizeLocale,
} from './locales';

// Storage keys
export type { StorageKey } from './storage-keys';
export { STORAGE_KEYS, getAllStorageKeys } from './storage-keys';
