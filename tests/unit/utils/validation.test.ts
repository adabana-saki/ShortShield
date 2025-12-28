/**
 * Validation utilities tests
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeTextInput,
  isValidUrlFormat,
  isValidDomain,
  isValidChannelId,
  isValidPlatform,
  isValidSelector,
  isValidRegexPattern,
  isValidImportSize,
  isValidJson,
  safeJsonParse,
} from '@/shared/utils/validation';

describe('sanitizeTextInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeTextInput('  hello  ')).toBe('hello');
  });

  it('should remove HTML tags', () => {
    expect(sanitizeTextInput('<script>alert("xss")</script>')).toBe(
      'scriptalert("xss")/script'
    );
  });

  it('should truncate long strings', () => {
    const longString = 'a'.repeat(2000);
    expect(sanitizeTextInput(longString, 100)).toHaveLength(100);
  });

  it('should remove control characters', () => {
    expect(sanitizeTextInput('hello\x00world')).toBe('helloworld');
  });

  it('should handle non-string input', () => {
    expect(sanitizeTextInput(null as unknown as string)).toBe('');
    expect(sanitizeTextInput(123 as unknown as string)).toBe('');
  });
});

describe('isValidUrlFormat', () => {
  it('should accept valid HTTP URLs', () => {
    expect(isValidUrlFormat('http://example.com')).toBe(true);
    expect(isValidUrlFormat('https://example.com')).toBe(true);
    expect(isValidUrlFormat('https://www.youtube.com/shorts/abc123')).toBe(
      true
    );
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrlFormat('not-a-url')).toBe(false);
    expect(isValidUrlFormat('ftp://example.com')).toBe(false);
    // eslint-disable-next-line no-script-url
    expect(isValidUrlFormat('javascript:alert(1)')).toBe(false);
    expect(isValidUrlFormat('')).toBe(false);
  });

  it('should reject URLs that are too long', () => {
    const longUrl = `https://example.com/${'a'.repeat(3000)}`;
    expect(isValidUrlFormat(longUrl)).toBe(false);
  });
});

describe('isValidDomain', () => {
  it('should accept valid domains', () => {
    expect(isValidDomain('example.com')).toBe(true);
    expect(isValidDomain('www.youtube.com')).toBe(true);
    expect(isValidDomain('sub.domain.example.co.uk')).toBe(true);
  });

  it('should reject invalid domains', () => {
    expect(isValidDomain('not a domain')).toBe(false);
    expect(isValidDomain('-invalid.com')).toBe(false);
    expect(isValidDomain('example')).toBe(false);
    expect(isValidDomain('')).toBe(false);
  });
});

describe('isValidChannelId', () => {
  it('should accept valid YouTube channel IDs', () => {
    // UC + 22 characters = 24 total
    expect(isValidChannelId('UCxxxxxxxxxxxxxxxxxx1234')).toBe(true);
    expect(isValidChannelId('UC-AbCdEfGhIjKlMnOpQrStU')).toBe(true);
  });

  it('should accept valid @handle format', () => {
    expect(isValidChannelId('@username')).toBe(true);
    expect(isValidChannelId('@user.name_123')).toBe(true);
  });

  it('should reject invalid channel IDs', () => {
    expect(isValidChannelId('invalid')).toBe(false);
    expect(isValidChannelId('UCshort')).toBe(false);
    expect(isValidChannelId('@')).toBe(false);
    expect(isValidChannelId('')).toBe(false);
  });
});

describe('isValidPlatform', () => {
  it('should accept valid platforms', () => {
    expect(isValidPlatform('youtube')).toBe(true);
    expect(isValidPlatform('tiktok')).toBe(true);
    expect(isValidPlatform('instagram')).toBe(true);
  });

  it('should reject invalid platforms', () => {
    expect(isValidPlatform('facebook')).toBe(false);
    expect(isValidPlatform('')).toBe(false);
    expect(isValidPlatform('YOUTUBE')).toBe(false);
  });
});

describe('isValidSelector', () => {
  it('should accept valid CSS selectors', () => {
    expect(isValidSelector('div')).toBe(true);
    expect(isValidSelector('.class-name')).toBe(true);
    expect(isValidSelector('#id')).toBe(true);
    expect(isValidSelector('[data-attr="value"]')).toBe(true);
    expect(isValidSelector('ytd-rich-item-renderer')).toBe(true);
  });

  it('should reject dangerous selectors', () => {
    expect(isValidSelector('div:url(javascript:alert(1))')).toBe(false);
    expect(isValidSelector('@import "evil.css"')).toBe(false);
  });

  it('should reject selectors that are too long', () => {
    const longSelector = 'div'.repeat(200);
    expect(isValidSelector(longSelector)).toBe(false);
  });

  it('should reject invalid selector syntax', () => {
    expect(isValidSelector('[')).toBe(false);
    expect(isValidSelector('div[')).toBe(false);
  });
});

describe('isValidRegexPattern', () => {
  it('should accept valid regex patterns', () => {
    expect(isValidRegexPattern('^\\/shorts\\/[\\w-]+')).toBe(true);
    expect(isValidRegexPattern('[a-z]+')).toBe(true);
    expect(isValidRegexPattern('.*')).toBe(true);
  });

  it('should reject catastrophic backtracking patterns', () => {
    expect(isValidRegexPattern('(.*)+$')).toBe(false);
    expect(isValidRegexPattern('(.+)+$')).toBe(false);
  });

  it('should reject invalid regex syntax', () => {
    expect(isValidRegexPattern('[')).toBe(false);
    expect(isValidRegexPattern('*invalid')).toBe(false);
  });

  it('should reject patterns that are too long', () => {
    const longPattern = 'a'.repeat(600);
    expect(isValidRegexPattern(longPattern)).toBe(false);
  });
});

describe('isValidImportSize', () => {
  it('should accept valid file sizes', () => {
    expect(isValidImportSize(1024)).toBe(true);
    expect(isValidImportSize(1024 * 1024)).toBe(true); // 1MB
  });

  it('should reject invalid file sizes', () => {
    expect(isValidImportSize(0)).toBe(false);
    expect(isValidImportSize(-1)).toBe(false);
    expect(isValidImportSize(1024 * 1024 * 2)).toBe(false); // 2MB
  });
});

describe('isValidJson', () => {
  it('should accept valid JSON', () => {
    expect(isValidJson('{}')).toBe(true);
    expect(isValidJson('{"key": "value"}')).toBe(true);
    expect(isValidJson('[]')).toBe(true);
    expect(isValidJson('"string"')).toBe(true);
  });

  it('should reject invalid JSON', () => {
    expect(isValidJson('not json')).toBe(false);
    expect(isValidJson('{key: value}')).toBe(false);
    expect(isValidJson('')).toBe(false);
  });
});

describe('safeJsonParse', () => {
  it('should parse valid JSON', () => {
    expect(safeJsonParse('{"key": "value"}')).toEqual({ key: 'value' });
    expect(safeJsonParse('[1, 2, 3]')).toEqual([1, 2, 3]);
  });

  it('should return null for invalid JSON', () => {
    expect(safeJsonParse('not json')).toBeNull();
    expect(safeJsonParse('')).toBeNull();
  });
});
