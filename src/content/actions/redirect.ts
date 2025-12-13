/**
 * Redirect action module
 * Handles redirecting from short-form to regular content
 */

import { createLogger } from '@/shared/utils/logger';

const logger = createLogger('redirect-action');

/**
 * URL patterns for redirection
 */
interface RedirectPattern {
  /** Pattern to match (supports simple wildcards) */
  match: RegExp;
  /** Function to generate redirect URL */
  redirect: (match: RegExpMatchArray) => string;
  /** Platform identifier */
  platform: string;
}

/**
 * Redirect patterns for each platform
 */
const REDIRECT_PATTERNS: RedirectPattern[] = [
  // YouTube Shorts -> Regular video
  {
    match: /^https?:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    redirect: (match) => `https://www.youtube.com/watch?v=${match[2]}`,
    platform: 'youtube',
  },
  // YouTube Shorts embed
  {
    match: /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)\?.*shorts/,
    redirect: (match) => `https://www.youtube.com/watch?v=${match[2]}`,
    platform: 'youtube',
  },
];

/**
 * Check if a URL can be redirected
 */
export function canRedirect(url: string): boolean {
  for (const pattern of REDIRECT_PATTERNS) {
    if (pattern.match.test(url)) {
      return true;
    }
  }
  return false;
}

/**
 * Get redirect URL for a given URL
 */
export function getRedirectUrl(url: string): string | null {
  for (const pattern of REDIRECT_PATTERNS) {
    const match = url.match(pattern.match);
    if (match) {
      const redirectUrl = pattern.redirect(match);
      logger.debug('Redirect URL generated', {
        from: url.slice(0, 50),
        to: redirectUrl,
        platform: pattern.platform,
      });
      return redirectUrl;
    }
  }
  return null;
}

/**
 * Perform redirect to regular content
 */
export function performRedirect(url?: string): boolean {
  const currentUrl = url ?? window.location.href;
  const redirectUrl = getRedirectUrl(currentUrl);

  if (!redirectUrl) {
    logger.debug('No redirect available for URL', { url: currentUrl.slice(0, 50) });
    return false;
  }

  logger.info('Performing redirect', {
    from: currentUrl.slice(0, 50),
    to: redirectUrl,
  });

  // Use replace to prevent back button returning to shorts
  window.location.replace(redirectUrl);
  return true;
}

/**
 * Check if current page should be redirected
 */
export function shouldRedirectCurrentPage(): boolean {
  return canRedirect(window.location.href);
}

/**
 * Redirect current page if applicable
 */
export function redirectIfApplicable(): boolean {
  if (shouldRedirectCurrentPage()) {
    return performRedirect();
  }
  return false;
}

/**
 * Transform links in the DOM to redirect URLs
 */
export function transformLinks(root: HTMLElement = document.body): number {
  let count = 0;

  const links = root.querySelectorAll<HTMLAnchorElement>('a[href]');

  for (const link of links) {
    const href = link.href;
    const redirectUrl = getRedirectUrl(href);

    if (redirectUrl && link.dataset.shortshieldTransformed !== 'true') {
      // Store original URL
      link.dataset.shortshieldOriginalHref = href;
      link.dataset.shortshieldTransformed = 'true';

      // Update href to redirect URL
      link.href = redirectUrl;

      // Add click handler to log the redirect
      link.addEventListener('click', () => {
        logger.debug('Link click redirected', {
          original: href.slice(0, 50),
          redirect: redirectUrl,
        });
      });

      count++;
    }
  }

  if (count > 0) {
    logger.debug('Links transformed', { count });
  }

  return count;
}

/**
 * Restore transformed links to original URLs
 */
export function restoreLinks(root: HTMLElement = document.body): number {
  let count = 0;

  const links = root.querySelectorAll<HTMLAnchorElement>(
    'a[data-shortshield-transformed="true"]'
  );

  for (const link of links) {
    const originalHref = link.dataset.shortshieldOriginalHref;

    if (originalHref) {
      link.href = originalHref;
      delete link.dataset.shortshieldOriginalHref;
      delete link.dataset.shortshieldTransformed;
      count++;
    }
  }

  if (count > 0) {
    logger.debug('Links restored', { count });
  }

  return count;
}

/**
 * Add redirect pattern dynamically
 */
export function addRedirectPattern(pattern: RedirectPattern): void {
  REDIRECT_PATTERNS.push(pattern);
  logger.debug('Redirect pattern added', { platform: pattern.platform });
}

/**
 * Get all available redirect patterns
 */
export function getRedirectPatterns(): readonly RedirectPattern[] {
  return REDIRECT_PATTERNS;
}

/**
 * Extract video ID from URL
 */
export function extractVideoId(url: string): string | null {
  // YouTube Shorts
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }

  // YouTube regular video
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  // YouTube embed
  const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) {
    return embedMatch[1];
  }

  return null;
}

/**
 * Check if two URLs point to the same video
 */
export function isSameVideo(url1: string, url2: string): boolean {
  const id1 = extractVideoId(url1);
  const id2 = extractVideoId(url2);

  if (!id1 || !id2) {
    return false;
  }

  return id1 === id2;
}
