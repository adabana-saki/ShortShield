/**
 * Base platform detector abstract class
 * Defines the interface for platform-specific detection
 */

import browser from 'webextension-polyfill';
import type {
  Platform,
  Settings,
  BlockingAction,
  LogBlockMessage,
} from '@/shared/types';
import { createMessage } from '@/shared/types';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('detector');

/**
 * Element info for logging
 */
export interface DetectedElement {
  readonly element: HTMLElement;
  readonly selector?: string;
  readonly action: BlockingAction;
}

/**
 * Abstract base class for platform detectors
 */
export abstract class BasePlatformDetector {
  /** Platform identifier */
  abstract readonly platform: Platform;

  /** Current settings */
  protected settings: Settings | null = null;

  /**
   * Check if this detector supports the given hostname
   */
  abstract isSupported(hostname: string): boolean;

  /**
   * Scan a DOM element for short-form content
   */
  abstract scan(root: HTMLElement): void;

  /**
   * Update settings
   */
  setSettings(settings: Settings): void {
    this.settings = settings;
  }

  /**
   * Check if the platform is enabled in settings
   */
  isEnabled(): boolean {
    if (!this.settings) {
      return true; // Default to enabled if settings not loaded
    }
    return this.settings.enabled && this.settings.platforms[this.platform];
  }

  /**
   * Check if a URL/channel is whitelisted
   */
  protected isWhitelisted(element: HTMLElement): boolean {
    if (!this.settings) {
      return false;
    }

    // Get relevant URL from element
    const url = this.extractUrl(element);
    if (url === null || url === '') {
      return false;
    }

    for (const entry of this.settings.whitelist) {
      if (entry.platform !== this.platform) {
        continue;
      }

      switch (entry.type) {
        case 'url':
          if (url === entry.value) {
            return true;
          }
          break;

        case 'domain':
          try {
            const parsed = new URL(url);
            if (parsed.hostname === entry.value) {
              return true;
            }
          } catch {
            // Invalid URL
          }
          break;

        case 'channel':
          if (this.matchesChannel(element, entry.value)) {
            return true;
          }
          break;
      }
    }

    return false;
  }

  /**
   * Extract URL from element (override in subclass)
   */
  protected extractUrl(element: HTMLElement): string | null {
    // Try to find a link in or around the element
    const link =
      element.querySelector<HTMLAnchorElement>('a[href]') ??
      element.closest<HTMLAnchorElement>('a[href]');
    return link?.href ?? null;
  }

  /**
   * Check if element matches a channel (override in subclass)
   */
  protected matchesChannel(_element: HTMLElement, _channelId: string): boolean {
    return false;
  }

  /**
   * Hide an element
   */
  protected hideElement(element: HTMLElement): void {
    // Use display:none with !important
    element.style.setProperty('display', 'none', 'important');
    element.dataset.shortshieldHidden = 'true';
  }

  /**
   * Remove an element from DOM
   */
  protected removeElement(element: HTMLElement): void {
    element.remove();
  }

  /**
   * Blur an element
   */
  protected blurElement(element: HTMLElement): void {
    element.style.setProperty('filter', 'blur(10px)', 'important');
    element.style.setProperty('pointer-events', 'none', 'important');
    element.dataset.shortshieldBlurred = 'true';
  }

  /**
   * Apply the specified action to an element
   */
  protected applyAction(element: HTMLElement, action: BlockingAction): void {
    // Skip if already processed
    if (
      element.dataset.shortshieldHidden === 'true' ||
      element.dataset.shortshieldBlurred === 'true'
    ) {
      return;
    }

    switch (action) {
      case 'hide':
        this.hideElement(element);
        break;
      case 'remove':
        this.removeElement(element);
        break;
      case 'blur':
        this.blurElement(element);
        break;
      case 'redirect':
        // Redirect is handled at URL level, not element level
        break;
    }
  }

  /**
   * Log a blocked element
   */
  protected async logBlock(
    element: HTMLElement,
    action: BlockingAction = 'hide'
  ): Promise<void> {
    const url = this.extractUrl(element) ?? window.location.href;

    try {
      await browser.runtime.sendMessage(
        createMessage<LogBlockMessage>({
          type: 'LOG_BLOCK',
          payload: {
            platform: this.platform,
            url,
            action,
            elementInfo: {
              tagName: element.tagName.toLowerCase(),
              className: element.className?.toString().slice(0, 100),
            },
          },
        })
      );
    } catch (error) {
      logger.warn('Failed to log block', { error: String(error) });
    }
  }
}
