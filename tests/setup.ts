/**
 * Vitest test setup file
 * Configures global mocks and test environment
 */

import { vi, beforeEach, afterEach } from 'vitest';
import { mockBrowserApi } from './mocks/chrome-api';
import { mockI18n } from './mocks/i18n';

// Set up global __DEV__ flag
(globalThis as unknown as { __DEV__: boolean }).__DEV__ = true;
(globalThis as unknown as { __BROWSER__: string }).__BROWSER__ = 'chrome';

// Mock browser API globally
vi.mock('webextension-polyfill', () => mockBrowserApi);

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockI18n.reset();
});

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});

// Mock console methods in tests
vi.spyOn(console, 'debug').mockImplementation(() => undefined);
vi.spyOn(console, 'info').mockImplementation(() => undefined);
vi.spyOn(console, 'warn').mockImplementation(() => undefined);
vi.spyOn(console, 'error').mockImplementation(() => undefined);
