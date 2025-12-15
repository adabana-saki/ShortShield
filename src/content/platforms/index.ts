/**
 * Platform detector registry
 * Manages platform-specific detectors
 */

import type { BasePlatformDetector } from './base';
import { YouTubeDetector } from './youtube';
import { TikTokDetector } from './tiktok';
import { InstagramDetector } from './instagram';
import { createSNSDetectors } from './sns';
import { createFullSiteBlockers } from './fullsite';
import { CustomDomainDetector, createCustomDomainDetector } from './custom';
import { createLogger } from '@/shared/utils/logger';
import type { CustomBlockedDomain } from '@/shared/types';

const logger = createLogger('platforms');

/**
 * Custom domain detector instance (singleton)
 */
const customDomainDetector = createCustomDomainDetector();

/**
 * Full site blockers (checked first, higher priority)
 */
const fullSiteBlockers = createFullSiteBlockers();

/**
 * All available platform detectors
 */
const detectors: BasePlatformDetector[] = [
  // Full site blockers (checked first - higher priority than short video detectors)
  ...fullSiteBlockers,
  // Short video platforms
  new YouTubeDetector(),
  new TikTokDetector(),
  new InstagramDetector(),
  // SNS platforms
  ...createSNSDetectors(),
];

/**
 * Get detector for a hostname
 */
export function getDetectorForHostname(
  hostname: string
): BasePlatformDetector | null {
  // Check custom domain detector first
  if (customDomainDetector.isSupported(hostname)) {
    logger.debug('Found custom domain detector for hostname', {
      hostname,
    });
    return customDomainDetector;
  }

  for (const detector of detectors) {
    if (detector.isSupported(hostname)) {
      logger.debug('Found detector for hostname', {
        hostname,
        platform: detector.platform,
      });
      return detector;
    }
  }

  logger.debug('No detector for hostname', { hostname });
  return null;
}

/**
 * Get all available detectors
 */
export function getAllDetectors(): readonly BasePlatformDetector[] {
  return detectors;
}

/**
 * Get the custom domain detector instance
 */
export function getCustomDomainDetector(): CustomDomainDetector {
  return customDomainDetector;
}

/**
 * Update custom blocked domains
 */
export function setCustomDomains(
  domains: readonly CustomBlockedDomain[]
): void {
  customDomainDetector.setCustomDomains(domains);
  logger.debug('Updated custom blocked domains', { count: domains.length });
}

/**
 * Export detector classes for direct use
 */
export { YouTubeDetector } from './youtube';
export { TikTokDetector } from './tiktok';
export { InstagramDetector } from './instagram';
export { SNSDetector, createSNSDetectors } from './sns';
export { FullSiteBlocker, createFullSiteBlockers } from './fullsite';
export { CustomDomainDetector, createCustomDomainDetector } from './custom';
export { BasePlatformDetector } from './base';
