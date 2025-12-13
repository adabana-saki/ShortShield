/**
 * Instagram Reels detector
 * Detects and blocks Instagram Reels content
 */

import { BasePlatformDetector } from './base';
import type { Platform } from '@/shared/types';
import { INSTAGRAM_CONFIG } from '@/shared/constants';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('instagram');

/**
 * Instagram Reels content detector
 */
export class InstagramDetector extends BasePlatformDetector {
  readonly platform: Platform = 'instagram';

  /**
   * CSS selectors for Instagram Reels elements
   */
  private readonly selectors = [
    // Reels tab content
    '[href*="/reels/"]',
    // Reel video container
    '[href*="/reel/"]',
    // Reels section in explore
    'a[href^="/reels"]',
    // Individual reel posts
    'article a[href*="/reel/"]',
  ] as const;

  /**
   * Check if Instagram is supported
   */
  isSupported(hostname: string): boolean {
    return INSTAGRAM_CONFIG.hosts.includes(hostname);
  }

  /**
   * Scan DOM for Instagram Reels
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
        logger.debug('Selector query failed', { selector });
      }
    }

    // Scan for reels in feed
    this.scanFeedReels(root);
  }

  /**
   * Check if current page is a Reels page
   */
  private shouldBlockCurrentPage(): boolean {
    const pathname = window.location.pathname;

    // Block /reels/ pages
    if (pathname.startsWith('/reels/') || pathname.startsWith('/reel/')) {
      return true;
    }

    return false;
  }

  /**
   * Block the current Reels page
   */
  private blockCurrentPage(): void {
    logger.info('Blocking Instagram Reels page', {
      pathname: window.location.pathname,
    });

    // Find main content and hide/blur it
    const mainContent = document.querySelector<HTMLElement>(
      'main, [role="main"], section'
    );

    if (mainContent) {
      this.applyAction(mainContent, 'blur');
      void this.logBlock(mainContent, 'blur');
    }

    // Show overlay
    this.showBlockedOverlay();
  }

  /**
   * Show blocked content overlay
   */
  private showBlockedOverlay(): void {
    if (document.getElementById('shortshield-instagram-overlay')) {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'shortshield-instagram-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #833AB4, #FD1D1D, #F77737);
      color: white;
      padding: 40px;
      border-radius: 16px;
      text-align: center;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;

    overlay.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px;">🛡️</div>
      <h2 style="font-size: 24px; margin-bottom: 8px;">ShortShield Active</h2>
      <p style="font-size: 16px; opacity: 0.9;">Instagram Reels content is being blocked</p>
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

    // Find the parent article or container to hide
    const target = this.findHideTarget(element);

    // Apply action
    this.applyAction(target, 'hide');

    // Log the block
    void this.logBlock(element, 'hide');

    logger.debug('Blocked Instagram Reels element');
  }

  /**
   * Find the appropriate parent element to hide
   */
  private findHideTarget(element: HTMLElement): HTMLElement {
    // Try to find article parent
    const article = element.closest<HTMLElement>('article');
    if (article) {
      return article;
    }

    // Try to find a container div
    let current: HTMLElement | null = element;
    for (let i = 0; i < 5 && current !== null; i++) {
      current = current.parentElement;

      if (current === null) {
        break;
      }

      // Instagram uses specific class patterns
      const className = current.className?.toString() ?? '';

      if (
        className.includes('_aagw') || // Explore grid item
        className.includes('_aabd') || // Feed item container
        className.includes('x1lliihq') // New class pattern
      ) {
        return current;
      }
    }

    return element;
  }

  /**
   * Scan for Reels in the main feed
   */
  private scanFeedReels(root: HTMLElement): void {
    // Find all articles in feed
    const articles = root.querySelectorAll<HTMLElement>('article');

    for (const article of articles) {
      // Check if article contains a reel link
      const reelLink = article.querySelector<HTMLAnchorElement>(
        'a[href*="/reel/"], a[href*="/reels/"]'
      );

      if (reelLink !== null && article.dataset.shortshieldHidden !== 'true') {
        if (this.isWhitelisted(article)) {
          continue;
        }

        // Reel link found - apply action
        this.applyAction(article, 'hide');
        void this.logBlock(article, 'hide');
      }
    }

    // Also hide Reels navigation tab/button
    this.hideReelsNavigation(root);
  }

  /**
   * Check if article has Reels indicator
   */
  private hasReelsIndicator(article: HTMLElement): boolean {
    // Check for clip/reels icon SVG
    const svgs = article.querySelectorAll('svg');

    for (const svg of svgs) {
      const ariaLabel = svg.getAttribute('aria-label')?.toLowerCase() ?? '';

      if (ariaLabel.includes('reel') || ariaLabel.includes('clip')) {
        return true;
      }
    }

    // Check for "Reels" text
    const text = article.textContent?.toLowerCase() ?? '';

    return text.includes('reels');
  }

  /**
   * Hide Reels navigation elements
   */
  private hideReelsNavigation(root: HTMLElement): void {
    // Find and hide Reels nav link
    const reelsNavLinks = root.querySelectorAll<HTMLElement>(
      'a[href="/reels/"], a[href^="/reels"]'
    );

    for (const link of reelsNavLinks) {
      // Only hide navigation links, not content links
      const isNavLink =
        link.closest('nav') !== null ||
        link.getAttribute('role') === 'link' ||
        link.closest('[role="navigation"]') !== null;

      if (isNavLink && link.dataset.shortshieldHidden !== 'true') {
        // Hide the parent nav item
        const navItem = link.closest('div, li');

        if (navItem instanceof HTMLElement) {
          this.applyAction(navItem, 'hide');
        }
      }
    }
  }

  /**
   * Extract URL from element
   */
  protected override extractUrl(element: HTMLElement): string | null {
    const link = element.querySelector<HTMLAnchorElement>(
      'a[href*="/reel/"], a[href*="/reels/"], a[href*="/p/"]'
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
   * Check if element matches a user account
   */
  protected override matchesChannel(
    element: HTMLElement,
    channelId: string
  ): boolean {
    // Try to find username link
    const userLink = element.querySelector<HTMLAnchorElement>(
      'a[href^="/"][href$="/"]'
    );

    if (userLink === null || userLink.href === '') {
      return false;
    }

    try {
      const url = new URL(userLink.href);
      const username = url.pathname.replace(/\//g, '');

      return username === channelId || `@${username}` === channelId;
    } catch {
      return false;
    }
  }
}
