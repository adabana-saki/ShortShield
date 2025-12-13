/**
 * Storage key constants
 * Centralized keys to prevent typos and ensure consistency
 */

/**
 * Storage keys for extension data
 */
export const STORAGE_KEYS = {
  /** Main settings storage key */
  SETTINGS: 'shortshield_settings',
  /** Block logs storage key */
  BLOCK_LOGS: 'shortshield_block_logs',
  /** Application logs storage key */
  APP_LOGS: 'shortshield_app_logs',
  /** Custom rules storage key */
  CUSTOM_RULES: 'shortshield_custom_rules',
  /** Migration version key */
  MIGRATION_VERSION: 'shortshield_migration_version',
} as const;

/**
 * Storage key type
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Get all storage keys as array
 */
export function getAllStorageKeys(): readonly StorageKey[] {
  return Object.values(STORAGE_KEYS);
}
