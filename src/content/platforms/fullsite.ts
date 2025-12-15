/**
 * Full site blocker for video platforms
 * Blocks entire sites (YouTube, Instagram, TikTok) when full blocking is enabled
 */

import { BasePlatformDetector } from './base';
import type { Platform, FullSitePlatform } from '@/shared/types';
import {
  YOUTUBE_CONFIG,
  INSTAGRAM_CONFIG,
  TIKTOK_CONFIG,
  DEFAULT_BLOCK_PAGE,
} from '@/shared/constants';
import { createLogger } from '@/shared/utils/logger';
import { showBlockPage } from '../blockPage';

const logger = createLogger('fullsite');

/**
 * Configuration for full site blocking platforms
 */
const FULLSITE_CONFIGS: Record<FullSitePlatform, { hosts: readonly string[]; displayName: string }> = {
  youtube_full: {
    hosts: YOUTUBE_CONFIG.hosts,
    displayName: 'YouTube',
  },
  instagram_full: {
    hosts: INSTAGRAM_CONFIG.hosts,
    displayName: 'Instagram',
  },
  tiktok_full: {
    hosts: TIKTOK_CONFIG.hosts,
    displayName: 'TikTok',
  },
};

/**
 * Full site blocker - blocks entire site for video platforms
 */
export class FullSiteBlocker extends BasePlatformDetector {
  readonly platform: Platform;
  private readonly fullSitePlatform: FullSitePlatform;
  private readonly hosts: readonly string[];
  private readonly displayName: string;
  private hasBlocked = false;

  constructor(fullSitePlatform: FullSitePlatform) {
    super();
    this.fullSitePlatform = fullSitePlatform;
    this.platform = fullSitePlatform;
    const config = FULLSITE_CONFIGS[fullSitePlatform];
    this.hosts = config.hosts;
    this.displayName = config.displayName;
  }

  /**
   * Override isEnabled to check both global and platform-specific settings
   */
  override isEnabled(): boolean {
    if (this.settings === null) {
      return false; // Default to disabled if settings not loaded
    }

    // Check if the specific full site platform is enabled
    const platformEnabled = this.settings.platforms[this.fullSitePlatform];
    return this.settings.enabled && platformEnabled;
  }

  /**
   * Check if this detector supports the given hostname
   */
  isSupported(hostname: string): boolean {
    return this.hosts.includes(hostname);
  }

  /**
   * Scan DOM - for full site blocking, we block the entire page
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
    // Only log the block once per page load
    if (this.hasBlocked) {
      return;
    }

    logger.info('Blocking full site', {
      platform: this.platform,
      hostname: window.location.hostname,
    });

    const blockPageSettings = this.settings?.blockPage ?? DEFAULT_BLOCK_PAGE;

    showBlockPage(blockPageSettings, this.displayName, 'shortshield-fullsite-overlay');

    // Log the block only once
    this.hasBlocked = true;
    void this.logBlock(document.body, 'hide');
  }
}

/**
 * Create all full site blockers
 */
export function createFullSiteBlockers(): FullSiteBlocker[] {
  return [
    new FullSiteBlocker('youtube_full'),
    new FullSiteBlocker('instagram_full'),
    new FullSiteBlocker('tiktok_full'),
  ];
}
