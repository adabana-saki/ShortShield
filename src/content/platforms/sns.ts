/**
 * Generic SNS detector
 * Blocks entire sites for SNS platforms
 */

import { BasePlatformDetector } from './base';
import type { Platform, SNSPlatform } from '@/shared/types';
import {
  TWITTER_CONFIG,
  FACEBOOK_CONFIG,
  LINKEDIN_CONFIG,
  THREADS_CONFIG,
  SNAPCHAT_CONFIG,
  REDDIT_CONFIG,
} from '@/shared/constants';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('sns');

/**
 * Configuration for SNS platforms
 */
const SNS_CONFIGS: Record<SNSPlatform, { hosts: readonly string[] }> = {
  twitter: TWITTER_CONFIG,
  facebook: FACEBOOK_CONFIG,
  linkedin: LINKEDIN_CONFIG,
  threads: THREADS_CONFIG,
  snapchat: SNAPCHAT_CONFIG,
  reddit: REDDIT_CONFIG,
};

/**
 * Generic SNS platform detector - blocks entire site
 */
export class SNSDetector extends BasePlatformDetector {
  readonly platform: Platform;
  private readonly snsPlatform: SNSPlatform;
  private readonly hosts: readonly string[];

  constructor(snsPlatform: SNSPlatform) {
    super();
    this.snsPlatform = snsPlatform;
    this.platform = snsPlatform;
    // eslint-disable-next-line security/detect-object-injection -- snsPlatform is typed as SNSPlatform
    this.hosts = SNS_CONFIGS[snsPlatform].hosts;
  }

  /**
   * Check if this detector supports the given hostname
   */
  isSupported(hostname: string): boolean {
    return this.hosts.includes(hostname);
  }

  /**
   * Scan DOM - for SNS, we block the entire page
   */
  scan(_root: HTMLElement): void {
    if (!this.isEnabled()) {
      return;
    }

    this.blockEntirePage();
  }

  /**
   * Block the entire page content
   */
  private blockEntirePage(): void {
    // Check if overlay already exists
    if (document.getElementById('shortshield-sns-overlay')) {
      return;
    }

    logger.info('Blocking SNS page', {
      platform: this.platform,
      hostname: window.location.hostname,
    });

    // Hide the body content
    document.body.style.setProperty('visibility', 'hidden', 'important');
    document.body.style.setProperty('overflow', 'hidden', 'important');

    // Create blocking overlay
    const overlay = document.createElement('div');
    overlay.id = 'shortshield-sns-overlay';
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

    const platformName = this.getPlatformDisplayName();

    overlay.innerHTML = `
      <div style="text-align: center; max-width: 400px; padding: 40px;">
        <div style="font-size: 72px; margin-bottom: 24px;">&#x1F6E1;&#xFE0F;</div>
        <h1 style="font-size: 28px; font-weight: 600; margin: 0 0 12px 0;">ShortShield Active</h1>
        <p style="font-size: 18px; opacity: 0.9; margin: 0 0 24px 0;">
          ${platformName} is blocked to help you stay focused.
        </p>
        <p style="font-size: 14px; opacity: 0.6; margin: 0;">
          You can disable this in the ShortShield settings.
        </p>
      </div>
    `;

    document.documentElement.appendChild(overlay);

    // Log the block
    void this.logBlock(document.body, 'hide');
  }

  /**
   * Get display name for the platform
   */
  private getPlatformDisplayName(): string {
    const names: Record<SNSPlatform, string> = {
      twitter: 'Twitter/X',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      threads: 'Threads',
      snapchat: 'Snapchat',
      reddit: 'Reddit',
    };
    return names[this.snsPlatform];
  }
}

/**
 * Create all SNS detectors
 */
export function createSNSDetectors(): SNSDetector[] {
  return [
    new SNSDetector('twitter'),
    new SNSDetector('facebook'),
    new SNSDetector('linkedin'),
    new SNSDetector('threads'),
    new SNSDetector('snapchat'),
    new SNSDetector('reddit'),
  ];
}
