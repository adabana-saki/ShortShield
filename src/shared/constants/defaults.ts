/**
 * Default settings and configurations
 */

import type {
  Settings,
  PlatformSettings,
  BlockingStats,
  UserPreferences,
} from '@/shared/types';

/**
 * Current settings schema version
 * Increment when making breaking changes to settings structure
 */
export const SETTINGS_VERSION = 1;

/**
 * Default platform settings - all platforms enabled by default
 */
export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  youtube: true,
  tiktok: true,
  instagram: true,
} as const;

/**
 * Default blocking statistics
 */
export const DEFAULT_STATS: BlockingStats = {
  blockedToday: 0,
  blockedTotal: 0,
  lastResetDate: new Date().toISOString().split('T')[0] ?? '',
  byPlatform: {
    youtube: 0,
    tiktok: 0,
    instagram: 0,
  },
} as const;

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  showStats: true,
  showNotifications: false,
  redirectShortsToRegular: true,
  logRetentionDays: 7,
} as const;

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  platforms: DEFAULT_PLATFORM_SETTINGS,
  whitelist: [],
  stats: DEFAULT_STATS,
  preferences: DEFAULT_PREFERENCES,
  version: SETTINGS_VERSION,
} as const;

/**
 * Maximum limits for safety
 */
export const LIMITS = {
  /** Maximum whitelist entries */
  MAX_WHITELIST_ENTRIES: 500,
  /** Maximum log entries to keep */
  MAX_LOG_ENTRIES: 10000,
  /** Maximum custom rules */
  MAX_CUSTOM_RULES: 100,
  /** Maximum URL length to process */
  MAX_URL_LENGTH: 2048,
  /** Maximum selector length */
  MAX_SELECTOR_LENGTH: 500,
  /** Import file size limit in bytes (1MB) */
  MAX_IMPORT_SIZE: 1024 * 1024,
} as const;

/**
 * Performance settings
 */
export const PERFORMANCE = {
  /** Debounce time for mutation observer (ms) */
  MUTATION_DEBOUNCE_MS: 50,
  /** Maximum mutations to process per batch */
  MAX_MUTATIONS_PER_BATCH: 100,
  /** Interval for stats reset check (ms) */
  STATS_CHECK_INTERVAL_MS: 60000,
  /** Throttle time for storage writes (ms) */
  STORAGE_THROTTLE_MS: 1000,
} as const;
