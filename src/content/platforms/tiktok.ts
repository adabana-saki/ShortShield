/**
 * TikTok detector
 * Detects and blocks TikTok video content
 */

import { BasePlatformDetector } from './base';
import type { Platform } from '@/shared/types';
import { TIKTOK_CONFIG } from '@/shared/constants';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('tiktok');

/**
 * TikTok video content detector
 */
export class TikTokDetector extends BasePlatformDetector {
  readonly platform: Platform = 'tiktok';

  /**
   * CSS selectors for TikTok video elements
   */
  private readonly selectors = [
    // For You page video items
    '[data-e2e="recommend-list-item-container"]',
    // Video feed items
    '[class*="DivItemContainer"]',
    // Video card in search/explore
    '[data-e2e="search-card-container"]',
    // User video list items
    '[data-e2e="user-post-item"]',
    // Following feed items
    '[data-e2e="following-item"]',
    // Video player container
    '[class*="DivVideoContainer"]',
  ] as const;

  /**
   * Check if TikTok is supported
   */
  isSupported(hostname: string): boolean {
    return TIKTOK_CONFIG.hosts.includes(hostname);
  }

  /**
   * Scan DOM for TikTok videos
   */
  scan(root: HTMLElement): void {
    if (!this.isEnabled()) {
      return;
    }

    // Check URL-based blocking
    if (this.shouldBlockCurrentPage()) {
      this.blockCurrentPage();
      return;
    }

    // DOM-based detection
    for (const selector of this.selectors) {
      try {
        const elements = root.querySelectorAll<HTMLElement>(selector);

        for (const element of elements) {
          this.processElement(element);
        }
      } catch {
        // Selector might not be valid in some cases
        logger.debug('Selector query failed', { selector });
      }
    }

    // Also scan for video links
    this.scanVideoLinks(root);
  }

  /**
   * Check if current page should be blocked entirely
   */
  private shouldBlockCurrentPage(): boolean {
    const pathname = window.location.pathname;

    // Block For You page
    if (pathname === '/foryou' || pathname === '/') {
      return true;
    }

    // Block individual video pages
    if (pathname.match(/^\/@[\w.-]+\/video\/\d+/)) {
      return true;
    }

    return false;
  }

  /**
   * Block the current page content
   */
  private blockCurrentPage(): void {
    logger.info('Blocking TikTok page', { pathname: window.location.pathname });

    // Find main content area and hide it
    const mainContent = document.querySelector<HTMLElement>(
      '[id="main-content-homepage_hot"],' +
        '[class*="DivMainContainer"],' +
        '[class*="DivBodyContainer"]'
    );

    if (mainContent) {
      this.applyAction(mainContent, 'blur');
      void this.logBlock(mainContent, 'blur');
    }

    // Show a message overlay
    this.showBlockedOverlay();
  }

  /**
   * Show an overlay indicating content is blocked
   */
  private showBlockedOverlay(): void {
    // Check if overlay already exists
    if (document.getElementById('shortshield-tiktok-overlay')) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'shortshield-tiktok-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    overlay.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px;">🛡️</div>
      <h2 style="font-size: 24px; margin-bottom: 8px;">ShortShield Active</h2>
      <p style="font-size: 16px; opacity: 0.8;">TikTok content is being blocked</p>
    `;

    document.body.appendChild(overlay);
  }

  /**
   * Process a detected element
   */
  private processElement(element: HTMLElement): void {
    // Skip if already processed
    if (element.dataset.shortshieldHidden === 'true') {
      return;
    }

    // Check whitelist
    if (this.isWhitelisted(element)) {
      return;
    }

    // Apply action
    this.applyAction(element, 'hide');

    // Log the block
    void this.logBlock(element, 'hide');

    logger.debug('Blocked TikTok element', {
      className: element.className?.toString().slice(0, 50),
    });
  }

  /**
   * Scan for video links
   */
  private scanVideoLinks(root: HTMLElement): void {
    // Find links to video pages
    const videoLinks =
      root.querySelectorAll<HTMLAnchorElement>('a[href*="/video/"]');

    for (const link of videoLinks) {
      const parent = this.findParentContainer(link);

      if (parent && parent.dataset.shortshieldHidden !== 'true') {
        if (this.isWhitelisted(link)) {
          continue;
        }

        this.applyAction(parent, 'hide');
        void this.logBlock(link, 'hide');
      }
    }
  }

  /**
   * Find parent container for a link
   */
  private findParentContainer(link: HTMLAnchorElement): HTMLElement | null {
    // Try to find a suitable parent container
    let current: HTMLElement | null = link;

    for (let i = 0; i < 10 && current !== null; i++) {
      current = current.parentElement;

      if (current === null) {
        break;
      }

      // Check for common container patterns
      const className = current.className?.toString() ?? '';

      if (
        className.includes('ItemContainer') ||
        className.includes('VideoCard') ||
        className.includes('DivWrapper')
      ) {
        return current;
      }

      // Check for data attributes
      if (
        (current.dataset.e2e !== undefined &&
          current.dataset.e2e.includes('item')) ||
        (current.dataset.e2e !== undefined &&
          current.dataset.e2e.includes('card'))
      ) {
        return current;
      }
    }

    return null;
  }

  /**
   * Extract URL from element
   */
  protected override extractUrl(element: HTMLElement): string | null {
    const link = element.querySelector<HTMLAnchorElement>(
      'a[href*="/video/"], a[href*="/@"]'
    );

    if (link !== null && link.href !== '') {
      return link.href;
    }

    if (element instanceof HTMLAnchorElement) {
      return element.href;
    }

    return super.extractUrl(element);
  }

  /**
   * Check if element matches a channel/user
   */
  protected override matchesChannel(
    element: HTMLElement,
    channelId: string
  ): boolean {
    // Try to find user link
    const userLink = element.querySelector<HTMLAnchorElement>('a[href*="/@"]');

    if (userLink === null || userLink.href === '') {
      return false;
    }

    try {
      const url = new URL(userLink.href);
      const username = url.pathname.split('/@')[1]?.split('/')[0];

      return `@${username ?? ''}` === channelId || username === channelId;
    } catch {
      return false;
    }
  }
}
