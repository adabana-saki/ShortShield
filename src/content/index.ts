/**
 * Content Script entry point
 * Initializes platform detection and DOM observation
 */

import browser from 'webextension-polyfill';
import { getDetectorForHostname } from './platforms';
import { createManagedObserver } from './observer';
import { createLogger } from '@/shared/utils/logger';
import { createMessage } from '@/shared/types';
import type { Settings } from '@/shared/types';

const logger = createLogger('content');

/**
 * Check if extension context is valid
 */
function isExtensionContextValid(): boolean {
  try {
    return (
      typeof browser !== 'undefined' &&
      typeof browser.runtime !== 'undefined' &&
      typeof browser.runtime.id !== 'undefined'
    );
  } catch {
    return false;
  }
}

/**
 * Get settings from background script
 */
async function getSettingsSafely(): Promise<Settings | null> {
  try {
    const response = await browser.runtime.sendMessage(
      createMessage({ type: 'GET_SETTINGS' })
    );

    if (response && typeof response === 'object' && 'success' in response) {
      const typedResponse = response as { success: boolean; data?: Settings };
      if (typedResponse.success && typedResponse.data) {
        return typedResponse.data;
      }
    }

    return null;
  } catch (error) {
    logger.warn('Failed to get settings', { error: String(error) });
    return null;
  }
}

/**
 * Initialize the content script
 */
async function initialize(): Promise<void> {
  // Check if extension context is valid
  if (!isExtensionContextValid()) {
    logger.error('Invalid extension context');
    return;
  }

  const hostname = window.location.hostname;
  logger.debug('Initializing content script', { hostname });

  // Get detector for this hostname
  const detector = getDetectorForHostname(hostname);

  if (!detector) {
    logger.debug('No detector for this hostname');
    return;
  }

  // Get settings
  const settings = await getSettingsSafely();

  if (!settings) {
    logger.warn('Could not load settings, using defaults');
  } else {
    detector.setSettings(settings);
  }

  // Check if blocking is enabled
  if (!detector.isEnabled()) {
    logger.debug('Blocking disabled for this platform');
    return;
  }

  logger.info('Starting content detection', { platform: detector.platform });

  // Create observer
  const observer = createManagedObserver(detector);

  // Initial scan of existing content
  detector.scan(document.body);

  // Start observing for new content
  observer.observe(document.body);

  // Listen for settings changes
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.shortshield_settings) {
      const newSettings = changes.shortshield_settings.newValue as Settings | undefined;
      if (newSettings) {
        detector.setSettings(newSettings);
        logger.debug('Settings updated');

        // Re-scan if still enabled
        if (detector.isEnabled()) {
          detector.scan(document.body);
        }
      }
    }
  });

  // Cleanup on unload
  window.addEventListener('unload', () => {
    observer.disconnect();
    logger.debug('Content script unloaded');
  });

  // Handle visibility changes (for SPAs)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && detector.isEnabled()) {
      detector.scan(document.body);
    }
  });

  // Handle SPA navigation (for YouTube's client-side routing)
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      logger.debug('URL changed, rescanning');

      if (detector.isEnabled()) {
        // Small delay for DOM to update
        setTimeout(() => {
          detector.scan(document.body);
        }, 100);
      }
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  logger.info('Content script initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void initialize();
  });
} else {
  void initialize();
}
