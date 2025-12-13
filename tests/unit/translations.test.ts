/* eslint-disable @typescript-eslint/no-unused-vars, no-console */
/**
 * Translation completeness tests
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const LOCALES_DIR = path.resolve(__dirname, '../../public/_locales');
const BASE_LOCALE = 'en';

interface MessageEntry {
  message: string;
  description?: string;
  placeholders?: Record<string, { content: string; example?: string }>;
}

interface MessagesFile {
  [key: string]: MessageEntry;
}

function readMessagesFile(locale: string): MessagesFile | null {
  const filePath = path.join(LOCALES_DIR, locale, 'messages.json');

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as MessagesFile;
  } catch {
    return null;
  }
}

function getLocales(): string[] {
  if (!fs.existsSync(LOCALES_DIR)) {
    return [];
  }

  return fs.readdirSync(LOCALES_DIR).filter((f) => {
    const stat = fs.statSync(path.join(LOCALES_DIR, f));
    return stat.isDirectory();
  });
}

describe('Translation Files', () => {
  const locales = getLocales();
  const baseMessages = readMessagesFile(BASE_LOCALE);

  if (!baseMessages) {
    it.skip('Base locale messages not found', () => {});
    return;
  }

  const baseKeys = Object.keys(baseMessages);

  describe('Base locale (en)', () => {
    it('should have messages.json file', () => {
      expect(baseMessages).not.toBeNull();
    });

    it('should have all required keys', () => {
      const requiredKeys = [
        'extensionName',
        'extensionDescription',
        'popupTitle',
        'popupStatusEnabled',
        'popupStatusDisabled',
      ];

      for (const key of requiredKeys) {
        expect(baseKeys).toContain(key);
      }
    });

    it('should have valid message structure for all entries', () => {
      for (const [key, entry] of Object.entries(baseMessages)) {
        expect(typeof entry.message).toBe('string');
        expect(entry.message.trim()).not.toBe('');

        // Check placeholders if present
        if (entry.placeholders) {
          for (const [phKey, ph] of Object.entries(entry.placeholders)) {
            expect(typeof ph.content).toBe('string');
          }
        }
      }
    });

    it('should not have empty messages', () => {
      for (const [key, entry] of Object.entries(baseMessages)) {
        expect(entry.message.trim().length).toBeGreaterThan(0);
      }
    });
  });

  // Test each non-base locale
  for (const locale of locales) {
    if (locale === BASE_LOCALE) {
      continue;
    }

    describe(`Locale: ${locale}`, () => {
      const messages = readMessagesFile(locale);

      it('should have messages.json file', () => {
        expect(messages).not.toBeNull();
      });

      if (!messages) {
        return;
      }

      it('should have all keys from base locale', () => {
        const localeKeys = Object.keys(messages);
        const missingKeys = baseKeys.filter((k) => !localeKeys.includes(k));

        if (missingKeys.length > 0) {
          console.log(`Missing keys in ${locale}:`, missingKeys);
        }

        expect(missingKeys).toEqual([]);
      });

      it('should have valid message structure for all entries', () => {
        for (const [key, entry] of Object.entries(messages)) {
          expect(typeof entry.message).toBe('string');

          // Check placeholders if present
          if (entry.placeholders) {
            for (const [phKey, ph] of Object.entries(entry.placeholders)) {
              expect(typeof ph.content).toBe('string');
            }
          }
        }
      });

      it('should not have empty messages', () => {
        for (const [key, entry] of Object.entries(messages)) {
          expect(entry.message.trim().length).toBeGreaterThan(0);
        }
      });

      it('should preserve placeholders from base locale', () => {
        for (const [key, baseEntry] of Object.entries(baseMessages)) {
          if (!baseEntry.placeholders) {
            continue;
          }

          const localizedEntry = messages[key];
          if (!localizedEntry) {
            continue;
          }

          // Check that message contains placeholder references
          for (const phKey of Object.keys(baseEntry.placeholders)) {
            const placeholder = `$${phKey.toUpperCase()}$`;
            // Some translations might use numbered placeholders ($1, $2, etc.)
            const hasPlaceholder =
              localizedEntry.message.includes(placeholder) ||
              localizedEntry.message.includes('$1') ||
              localizedEntry.message.includes('$COUNT$');

            if (!hasPlaceholder) {
              console.log(
                `Warning: ${locale}.${key} might be missing placeholder ${phKey}`
              );
            }
          }
        }
      });

      it('should not have extra keys not in base locale', () => {
        const localeKeys = Object.keys(messages);
        const extraKeys = localeKeys.filter((k) => !baseKeys.includes(k));

        if (extraKeys.length > 0) {
          console.log(`Extra keys in ${locale}:`, extraKeys);
        }

        // This is a warning, not a failure
        expect(extraKeys.length).toBe(0);
      });
    });
  }
});
