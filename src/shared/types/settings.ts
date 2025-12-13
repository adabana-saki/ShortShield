/**
 * Core settings types for ShortShield
 * All types use readonly properties for immutability
 */

/**
 * Branded type for type-safe identifiers
 */
export type ChannelId = string & { readonly __brand: 'ChannelId' };
export type VideoId = string & { readonly __brand: 'VideoId' };
export type WhitelistId = string & { readonly __brand: 'WhitelistId' };

/**
 * Supported platforms for blocking
 */
export type Platform = 'youtube' | 'tiktok' | 'instagram';

/**
 * Platform-specific settings
 */
export interface PlatformSettings {
  readonly youtube: boolean;
  readonly tiktok: boolean;
  readonly instagram: boolean;
}

/**
 * Whitelist entry types
 */
export type WhitelistType = 'channel' | 'url' | 'domain';

/**
 * Individual whitelist entry
 */
export interface WhitelistEntry {
  readonly id: WhitelistId;
  readonly type: WhitelistType;
  readonly value: string;
  readonly platform: Platform;
  readonly createdAt: number;
  readonly description?: string;
}

/**
 * Blocking statistics
 */
export interface BlockingStats {
  readonly blockedToday: number;
  readonly blockedTotal: number;
  readonly lastResetDate: string; // ISO date string YYYY-MM-DD
  readonly byPlatform: Readonly<Record<Platform, number>>;
}

/**
 * User preferences
 */
export interface UserPreferences {
  readonly showStats: boolean;
  readonly showNotifications: boolean;
  readonly redirectShortsToRegular: boolean;
  readonly logRetentionDays: number;
}

/**
 * Main settings interface
 */
export interface Settings {
  readonly enabled: boolean;
  readonly platforms: PlatformSettings;
  readonly whitelist: readonly WhitelistEntry[];
  readonly stats: BlockingStats;
  readonly preferences: UserPreferences;
  readonly version: number; // Schema version for migrations
}

/**
 * Partial settings for updates
 */
export type SettingsUpdate = Partial<{
  enabled: boolean;
  platforms: Partial<PlatformSettings>;
  preferences: Partial<UserPreferences>;
  whitelist: readonly WhitelistEntry[];
  stats: Partial<BlockingStats>; // Internal use only for stat resets
}>;

/**
 * Type guard for Settings validation
 */
export function isValidSettings(value: unknown): value is Settings {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.enabled === 'boolean' &&
    typeof obj.platforms === 'object' &&
    obj.platforms !== null &&
    typeof obj.version === 'number'
  );
}

/**
 * Type guard for WhitelistEntry validation
 */
export function isValidWhitelistEntry(value: unknown): value is WhitelistEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const validTypes: WhitelistType[] = ['channel', 'url', 'domain'];
  const validPlatforms: Platform[] = ['youtube', 'tiktok', 'instagram'];

  return (
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' &&
    validTypes.includes(obj.type as WhitelistType) &&
    typeof obj.value === 'string' &&
    typeof obj.platform === 'string' &&
    validPlatforms.includes(obj.platform as Platform) &&
    typeof obj.createdAt === 'number'
  );
}
