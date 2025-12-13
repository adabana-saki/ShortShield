/**
 * Platform detector registry
 * Manages platform-specific detectors
 */

import type { BasePlatformDetector } from './base';
import { YouTubeDetector } from './youtube';
import { TikTokDetector } from './tiktok';
import { InstagramDetector } from './instagram';
import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('platforms');

/**
 * All available platform detectors
 */
const detectors: BasePlatformDetector[] = [
  new YouTubeDetector(),
  new TikTokDetector(),
  new InstagramDetector(),
];

/**
 * Get detector for a hostname
 */
export function getDetectorForHostname(
  hostname: string
): BasePlatformDetector | null {
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
 * Export detector classes for direct use
 */
export { YouTubeDetector } from './youtube';
export { TikTokDetector } from './tiktok';
export { InstagramDetector } from './instagram';
export { BasePlatformDetector } from './base';
