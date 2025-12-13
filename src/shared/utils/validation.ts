/**
 * Input validation utilities
 * Security: Validates and sanitizes all user inputs
 */

import { LIMITS } from '@/shared/constants';
import type { Platform, WhitelistType } from '@/shared/types';

/**
 * Validate and sanitize user text input
 */
export function sanitizeTextInput(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); // Remove control characters
}

/**
 * Validate URL format
 */
export function isValidUrlFormat(url: string): boolean {
  if (typeof url !== 'string' || url.length > LIMITS.MAX_URL_LENGTH) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  if (typeof domain !== 'string' || domain.length > 253) {
    return false;
  }

  // Basic domain validation
  const domainPattern =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
  return domainPattern.test(domain);
}

/**
 * Validate YouTube channel ID format
 */
export function isValidChannelId(id: string): boolean {
  if (typeof id !== 'string') {
    return false;
  }

  // UC prefix + 22 characters
  if (/^UC[\w-]{22}$/.test(id)) {
    return true;
  }

  // @handle format (1-30 characters, alphanumeric with dots and underscores)
  if (/^@[\w.]{1,30}$/.test(id)) {
    return true;
  }

  return false;
}

/**
 * Validate platform value
 */
export function isValidPlatform(value: string): value is Platform {
  const validPlatforms: Platform[] = ['youtube', 'tiktok', 'instagram'];
  return validPlatforms.includes(value as Platform);
}

/**
 * Validate whitelist type
 */
export function isValidWhitelistType(value: string): value is WhitelistType {
  const validTypes: WhitelistType[] = ['channel', 'url', 'domain'];
  return validTypes.includes(value as WhitelistType);
}

/**
 * Validate CSS selector
 * Security: Prevents overly complex or malicious selectors
 */
export function isValidSelector(selector: string): boolean {
  if (typeof selector !== 'string') {
    return false;
  }

  if (selector.length > LIMITS.MAX_SELECTOR_LENGTH) {
    return false;
  }

  // Block potentially dangerous patterns
  const dangerousPatterns = [
    /javascript:/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /@import/i,
  ];

  if (dangerousPatterns.some((pattern) => pattern.test(selector))) {
    return false;
  }

  // Try to validate by using querySelector (catches syntax errors)
  try {
    document.createDocumentFragment().querySelector(selector);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate regex pattern
 * Security: Prevents ReDoS attacks
 */
export function isValidRegexPattern(pattern: string): boolean {
  if (typeof pattern !== 'string' || pattern.length > 500) {
    return false;
  }

  // Detect potentially catastrophic backtracking patterns
  const dangerousPatterns = [
    /\(\.\*\)\+/g, // (.*)+
    /\(\.\+\)\+/g, // (.+)+
    /\(\.\*\)\*/g, // (.*)*
    /\(\.\+\)\*/g, // (.+)*
    /\([^)]*\|[^)]*\)\+/g, // (a|b)+ style
  ];

  if (dangerousPatterns.some((dp) => dp.test(pattern))) {
    return false;
  }

  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate whitelist entry value based on type
 */
export function isValidWhitelistValue(
  value: string,
  type: WhitelistType
): boolean {
  const sanitized = sanitizeTextInput(value, 500);

  switch (type) {
    case 'url':
      return isValidUrlFormat(sanitized);
    case 'domain':
      return isValidDomain(sanitized);
    case 'channel':
      return isValidChannelId(sanitized);
    default:
      return false;
  }
}

/**
 * Validate import file size
 */
export function isValidImportSize(size: number): boolean {
  return typeof size === 'number' && size > 0 && size <= LIMITS.MAX_IMPORT_SIZE;
}

/**
 * Validate JSON structure
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON safely with validation
 */
export function safeJsonParse<T>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

/**
 * Validate and sanitize whitelist entry input
 */
export function validateWhitelistInput(input: {
  type: string;
  value: string;
  platform: string;
}): {
  valid: boolean;
  error?: string;
  sanitized?: { type: WhitelistType; value: string; platform: Platform };
} {
  // Validate type
  if (!isValidWhitelistType(input.type)) {
    return { valid: false, error: 'Invalid whitelist type' };
  }

  // Validate platform
  if (!isValidPlatform(input.platform)) {
    return { valid: false, error: 'Invalid platform' };
  }

  // Sanitize and validate value
  const sanitizedValue = sanitizeTextInput(input.value);
  if (!isValidWhitelistValue(sanitizedValue, input.type)) {
    return { valid: false, error: `Invalid ${input.type} format` };
  }

  return {
    valid: true,
    sanitized: {
      type: input.type,
      value: sanitizedValue,
      platform: input.platform,
    },
  };
}
