/**
 * Service Worker entry point
 * Handles extension lifecycle and message routing
 */

import browser from 'webextension-polyfill';
import { setupMessageListener } from './messaging';
import { createLogger } from '@/shared/utils/logger';
import { getSettings, updateSettings } from '@/shared/utils/storage';
import { PERFORMANCE } from '@/shared/constants';

const logger = createLogger('background');

/**
 * Check and reset daily stats if needed
 */
async function checkDailyReset(): Promise<void> {
  try {
    const settings = await getSettings();
    const today = new Date().toISOString().split('T')[0] ?? '';

    if (settings.stats.lastResetDate !== today) {
      logger.info('Resetting daily stats', {
        previousDate: settings.stats.lastResetDate,
        newDate: today,
      });

      await updateSettings({
        stats: {
          ...settings.stats,
          blockedToday: 0,
          lastResetDate: today,
        },
      });
    }
  } catch (error) {
    logger.error('Failed to check daily reset', { error: String(error) });
  }
}

/**
 * Initialize the extension
 */
async function initialize(): Promise<void> {
  logger.info('ShortShield initializing...');

  try {
    // Set up message listener
    setupMessageListener();

    // Check for daily stats reset
    await checkDailyReset();

    // Set up periodic stats check
    setInterval(() => {
      void checkDailyReset();
    }, PERFORMANCE.STATS_CHECK_INTERVAL_MS);

    logger.info('ShortShield initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize', { error: String(error) });
  }
}

/**
 * Handle extension installation or update
 */
browser.runtime.onInstalled.addListener((details) => {
  logger.info('Extension installed/updated', {
    reason: details.reason,
    previousVersion: details.previousVersion,
  });

  if (details.reason === 'install') {
    // First installation - settings are created by default
    logger.info('First installation complete');
  } else if (details.reason === 'update') {
    // Update - might need migration in the future
    logger.info('Extension updated', {
      from: details.previousVersion,
    });
  }
});

/**
 * Handle service worker startup
 */
browser.runtime.onStartup.addListener(() => {
  logger.info('Browser startup - reinitializing');
  void initialize();
});

// Initialize immediately
void initialize();
