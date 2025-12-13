/**
 * Background script storage management
 * Handles all storage operations with validation and error handling
 */

import browser from 'webextension-polyfill';
import type {
  Settings,
  SettingsUpdate,
  LogEntry,
  WhitelistEntry,
  WhitelistId,
} from '@/shared/types';
import { isValidSettings } from '@/shared/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS, LIMITS } from '@/shared/constants';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('background-storage');

/**
 * Get current settings from storage
 */
export async function getSettings(): Promise<Settings> {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.SETTINGS);
    const settings = result[STORAGE_KEYS.SETTINGS];

    if (settings === undefined || settings === null) {
      logger.info('No settings found, using defaults');
      return DEFAULT_SETTINGS;
    }

    if (!isValidSettings(settings)) {
      logger.warn('Invalid settings in storage, using defaults');
      return DEFAULT_SETTINGS;
    }

    // At this point, settings is validated as Settings type
    const validSettings = settings;

    // Check if daily stats need reset
    const today = new Date().toISOString().split('T')[0] ?? '';
    if (validSettings.stats.lastResetDate !== today) {
      const resetSettings: Settings = {
        ...validSettings,
        stats: {
          ...validSettings.stats,
          blockedToday: 0,
          lastResetDate: today,
        },
      };
      await saveSettings(resetSettings);
      return resetSettings;
    }

    return validSettings;
  } catch (error) {
    logger.error('Failed to get settings', { error });
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to storage
 */
export async function saveSettings(settings: Settings): Promise<void> {
  try {
    if (!isValidSettings(settings)) {
      throw new Error('Invalid settings structure');
    }

    await browser.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: settings,
    });

    logger.debug('Settings saved successfully');
  } catch (error) {
    logger.error('Failed to save settings', { error });
    throw error;
  }
}

/**
 * Update settings partially
 */
export async function updateSettings(
  update: SettingsUpdate
): Promise<Settings> {
  const current = await getSettings();

  const updated: Settings = {
    ...current,
    enabled: update.enabled ?? current.enabled,
    platforms: {
      ...current.platforms,
      ...(update.platforms ?? {}),
    },
    preferences: {
      ...current.preferences,
      ...(update.preferences ?? {}),
    },
    stats: {
      ...current.stats,
      ...(update.stats ?? {}),
    },
    whitelist: update.whitelist ?? current.whitelist,
    version: current.version,
  };

  await saveSettings(updated);
  return updated;
}

/**
 * Increment block count
 */
export async function incrementBlockCount(platform: string): Promise<Settings> {
  const settings = await getSettings();

  const byPlatform = { ...settings.stats.byPlatform };
  byPlatform[platform as keyof typeof byPlatform] =
    (byPlatform[platform as keyof typeof byPlatform] ?? 0) + 1;

  const updated: Settings = {
    ...settings,
    stats: {
      ...settings.stats,
      blockedToday: settings.stats.blockedToday + 1,
      blockedTotal: settings.stats.blockedTotal + 1,
      byPlatform,
    },
  };

  await saveSettings(updated);
  return updated;
}

/**
 * Add whitelist entry
 */
export async function addWhitelistEntry(
  entry: Omit<WhitelistEntry, 'id' | 'createdAt'>
): Promise<Settings> {
  const settings = await getSettings();

  // Check limit
  if (settings.whitelist.length >= LIMITS.MAX_WHITELIST_ENTRIES) {
    throw new Error('Whitelist limit reached');
  }

  const newEntry: WhitelistEntry = {
    ...entry,
    id: `wl_${Date.now()}_${Math.random().toString(36).slice(2, 9)}` as WhitelistId,
    createdAt: Date.now(),
  };

  const updated: Settings = {
    ...settings,
    whitelist: [...settings.whitelist, newEntry],
  };

  await saveSettings(updated);
  logger.info('Whitelist entry added', {
    platform: entry.platform,
    type: entry.type,
  });
  return updated;
}

/**
 * Remove whitelist entry
 */
export async function removeWhitelistEntry(id: string): Promise<Settings> {
  const settings = await getSettings();

  const updated: Settings = {
    ...settings,
    whitelist: settings.whitelist.filter((entry) => entry.id !== id),
  };

  await saveSettings(updated);
  logger.info('Whitelist entry removed', { id });
  return updated;
}

/**
 * Get logs from storage
 */
export async function getLogs(): Promise<LogEntry[]> {
  try {
    const result = await browser.storage.local.get(STORAGE_KEYS.APP_LOGS);
    const logs = result[STORAGE_KEYS.APP_LOGS];

    if (!Array.isArray(logs)) {
      return [];
    }

    return logs as LogEntry[];
  } catch (error) {
    logger.error('Failed to get logs', { error });
    return [];
  }
}

/**
 * Add log entry
 */
export async function addLogEntry(
  entry: Omit<LogEntry, 'id' | 'timestamp'>
): Promise<void> {
  try {
    const logs = await getLogs();
    const settings = await getSettings();

    const newEntry: LogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add to beginning (most recent first)
    const updatedLogs = [newEntry, ...logs];

    // Trim to max size
    const trimmedLogs = updatedLogs.slice(0, LIMITS.MAX_LOG_ENTRIES);

    // Remove old logs based on retention policy
    const retentionMs =
      settings.preferences.logRetentionDays * 24 * 60 * 60 * 1000;
    const cutoffTime = Date.now() - retentionMs;
    const filteredLogs = trimmedLogs.filter(
      (log: LogEntry) => log.timestamp > cutoffTime
    );

    await browser.storage.local.set({
      [STORAGE_KEYS.APP_LOGS]: filteredLogs,
    });

    logger.debug('Log entry added', {
      platform: entry.platform,
      action: entry.action,
    });
  } catch (error) {
    logger.error('Failed to add log entry', { error });
  }
}

/**
 * Clear all logs
 */
export async function clearLogs(): Promise<void> {
  try {
    await browser.storage.local.set({
      [STORAGE_KEYS.APP_LOGS]: [],
    });
    logger.info('Logs cleared');
  } catch (error) {
    logger.error('Failed to clear logs', { error });
    throw error;
  }
}

/**
 * Clear all data (for reset functionality)
 */
export async function clearAllData(): Promise<void> {
  try {
    await browser.storage.local.clear();
    await saveSettings(DEFAULT_SETTINGS);
    logger.info('All data cleared');
  } catch (error) {
    logger.error('Failed to clear all data', { error });
    throw error;
  }
}

/**
 * Get storage usage info
 */
export async function getStorageInfo(): Promise<{
  bytesInUse: number;
  quota: number;
}> {
  try {
    // Save reference before type narrowing
    const localStorage = browser.storage.local;

    // Chrome provides getBytesInUse, Firefox doesn't
    type StorageWithBytesInUse = typeof localStorage & {
      getBytesInUse: (keys: string | string[] | null) => Promise<number>;
    };
    if ('getBytesInUse' in localStorage) {
      const bytesInUse = await (
        localStorage as StorageWithBytesInUse
      ).getBytesInUse(null);
      return {
        bytesInUse,
        quota: 10 * 1024 * 1024, // 10MB for local storage
      };
    }

    // Fallback: estimate from stringified data
    const data = await browser.storage.local.get(null);
    const bytesInUse = new Blob([JSON.stringify(data)]).size;
    return {
      bytesInUse,
      quota: 10 * 1024 * 1024,
    };
  } catch (error) {
    logger.error('Failed to get storage info', { error });
    return { bytesInUse: 0, quota: 10 * 1024 * 1024 };
  }
}
