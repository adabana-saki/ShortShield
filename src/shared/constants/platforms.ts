/**
 * Platform detection patterns and configurations
 * Security: All patterns are readonly and validated at compile time
 */

import type { Platform, PlatformRules } from '@/shared/types';

/**
 * YouTube Shorts detection configuration
 */
export const YOUTUBE_CONFIG: PlatformRules = {
  platform: 'youtube',
  hosts: ['www.youtube.com', 'youtube.com', 'm.youtube.com'],
  urlRules: [
    {
      type: 'url',
      pattern: '^\\/shorts\\/[\\w-]+',
      action: 'redirect',
      priority: 100,
    },
  ],
  selectorRules: [
    {
      type: 'selector',
      selector: 'ytd-reel-video-renderer',
      action: 'hide',
      priority: 90,
    },
    {
      type: 'selector',
      selector: 'ytd-rich-item-renderer[is-shorts]',
      action: 'hide',
      priority: 90,
    },
    {
      type: 'selector',
      selector: 'ytd-rich-shelf-renderer[is-shorts]',
      action: 'hide',
      priority: 85,
    },
    {
      type: 'selector',
      selector: 'ytd-video-renderer[is-shorts]',
      action: 'hide',
      priority: 85,
    },
    {
      type: 'selector',
      selector: 'ytd-grid-video-renderer[is-shorts]',
      action: 'hide',
      priority: 85,
    },
    {
      type: 'selector',
      selector: '[overlay-style="SHORTS"]',
      action: 'hide',
      priority: 80,
      parentSelector: 'ytd-rich-item-renderer',
    },
  ],
  attributeRules: [
    {
      type: 'attribute',
      selector: 'a[href]',
      attribute: 'href',
      pattern: '^\\/shorts\\/',
      action: 'hide',
      priority: 70,
    },
  ],
} as const;

/**
 * TikTok detection configuration
 */
export const TIKTOK_CONFIG: PlatformRules = {
  platform: 'tiktok',
  hosts: ['www.tiktok.com', 'tiktok.com'],
  urlRules: [
    {
      type: 'url',
      pattern: '^\\/@[\\w.-]+\\/video\\/\\d+',
      action: 'hide',
      priority: 100,
    },
    {
      type: 'url',
      pattern: '^\\/foryou',
      action: 'hide',
      priority: 95,
    },
  ],
  selectorRules: [
    {
      type: 'selector',
      selector: '[data-e2e="recommend-list-item-container"]',
      action: 'hide',
      priority: 90,
    },
    {
      type: 'selector',
      selector: '[class*="DivItemContainer"]',
      action: 'hide',
      priority: 85,
    },
  ],
  attributeRules: [],
} as const;

/**
 * Instagram Reels detection configuration
 */
export const INSTAGRAM_CONFIG: PlatformRules = {
  platform: 'instagram',
  hosts: ['www.instagram.com', 'instagram.com'],
  urlRules: [
    {
      type: 'url',
      pattern: '^\\/reels\\/',
      action: 'hide',
      priority: 100,
    },
    {
      type: 'url',
      pattern: '^\\/reel\\/',
      action: 'hide',
      priority: 100,
    },
  ],
  selectorRules: [
    {
      type: 'selector',
      selector: 'a[href*="/reels/"]',
      action: 'hide',
      priority: 90,
      parentSelector: 'article',
    },
    {
      type: 'selector',
      selector: 'a[href*="/reel/"]',
      action: 'hide',
      priority: 90,
      parentSelector: 'article',
    },
  ],
  attributeRules: [],
} as const;

/**
 * All platform configurations
 */
export const PLATFORM_CONFIGS: Readonly<Record<Platform, PlatformRules>> = {
  youtube: YOUTUBE_CONFIG,
  tiktok: TIKTOK_CONFIG,
  instagram: INSTAGRAM_CONFIG,
} as const;

/**
 * Get platform config by hostname
 */
export function getPlatformByHostname(
  hostname: string
): PlatformRules | undefined {
  for (const config of Object.values(PLATFORM_CONFIGS)) {
    if (config.hosts.includes(hostname)) {
      return config;
    }
  }
  return undefined;
}

/**
 * Check if hostname belongs to a supported platform
 */
export function isSupportedHostname(hostname: string): boolean {
  return getPlatformByHostname(hostname) !== undefined;
}

/**
 * Get all supported hostnames
 */
export function getAllSupportedHostnames(): readonly string[] {
  return Object.values(PLATFORM_CONFIGS).flatMap((config) => config.hosts);
}
