/**
 * Custom domain detector
 * Blocks entire sites for user-specified domains
 */

import { BasePlatformDetector } from './base';
import type { Platform, CustomBlockedDomain } from '@/shared/types';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('custom-domain');

/**
 * Custom domain detector - blocks user-specified domains
 */
export class CustomDomainDetector extends BasePlatformDetector {
  // Use 'youtube' as a placeholder platform for stats
  // Custom domains are tracked separately
  readonly platform: Platform = 'youtube';
  private customDomains: readonly CustomBlockedDomain[] = [];

  /**
   * Update the list of custom blocked domains
   */
  setCustomDomains(domains: readonly CustomBlockedDomain[]): void {
    this.customDomains = domains;
  }

  /**
   * Get the list of custom blocked domains
   */
  getCustomDomains(): readonly CustomBlockedDomain[] {
    return this.customDomains;
  }

  /**
   * Check if the current hostname matches any custom blocked domain
   */
  isSupported(hostname: string): boolean {
    return this.customDomains.some((entry) =>
      this.matchesDomain(hostname, entry.domain)
    );
  }

  /**
   * Check if a hostname matches a domain pattern
   */
  private matchesDomain(hostname: string, domain: string): boolean {
    const normalizedHostname = hostname.toLowerCase().replace(/^www\./, '');
    const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');

    // Exact match
    if (normalizedHostname === normalizedDomain) {
      return true;
    }

    // Subdomain match (e.g., m.example.com matches example.com)
    if (normalizedHostname.endsWith('.' + normalizedDomain)) {
      return true;
    }

    return false;
  }

  /**
   * Scan DOM - for custom domains, we block the entire page
   */
  scan(_root: HTMLElement): void {
    if (!this.isEnabled()) {
      return;
    }

    const hostname = window.location.hostname;
    const matchedDomain = this.customDomains.find((entry) =>
      this.matchesDomain(hostname, entry.domain)
    );

    if (matchedDomain) {
      this.blockEntirePage(matchedDomain);
    }
  }

  /**
   * Block the entire page content
   */
  private blockEntirePage(domain: CustomBlockedDomain): void {
    // Check if overlay already exists
    if (document.getElementById('shortshield-custom-overlay')) {
      return;
    }

    logger.info('Blocking custom domain', {
      domain: domain.domain,
      hostname: window.location.hostname,
    });

    // Hide the body content
    document.body.style.setProperty('visibility', 'hidden', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');

    // Create blocking overlay
    const overlay = document.createElement('div');
    overlay.id = 'shortshield-custom-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: white;
      visibility: visible !important;
    `;

    const displayDomain =
      domain.description !== undefined && domain.description !== ''
        ? domain.description
        : domain.domain;

    overlay.innerHTML = `
      <div style="text-align: center; max-width: 400px; padding: 40px;">
        <div style="font-size: 72px; margin-bottom: 24px;">&#x1F6E1;&#xFE0F;</div>
        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 12px 0;">ShortShield Active</h1>
        <p style="font-size: 18px; opacity: 0.9; margin: 0 0 24px 0;">
          ${this.escapeHtml(displayDomain)} is blocked to help you stay focused.
        </p>
        <p style="font-size: 14px; opacity: 0.6; margin: 0;">
          You can remove this domain from your block list in ShortShield settings.
        </p>
      </div>
    `;

    document.documentElement.appendChild(overlay);

    // Log the block (using youtube as placeholder platform)
    void this.logBlock(document.body, 'hide');
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * Create a custom domain detector instance
 */
export function createCustomDomainDetector(): CustomDomainDetector {
  return new CustomDomainDetector();
}
