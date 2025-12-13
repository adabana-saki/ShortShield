/**
 * TikTok detector unit tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TikTokDetector } from '@/content/platforms/tiktok';

// Mock the logger
vi.mock('@/shared/utils/logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock browser API
vi.mock('webextension-polyfill', () => ({
  default: {
    runtime: {
      sendMessage: vi.fn().mockResolvedValue({ success: true }),
    },
    storage: {
      local: {
        get: vi.fn().mockResolvedValue({
          shortshield_settings: {
            enabled: true,
            platforms: { youtube: true, tiktok: true, instagram: true },
            whitelist: [],
          },
        }),
      },
    },
  },
}));

describe('TikTokDetector', () => {
  let detector: TikTokDetector;
  const originalLocation = window.location;

  beforeEach(() => {
    detector = new TikTokDetector();
    document.body.innerHTML = '';
    // Mock location to avoid shouldBlockCurrentPage() returning true
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, pathname: '/search' },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    vi.clearAllMocks();
  });

  describe('isSupported', () => {
    it('should support tiktok.com', () => {
      expect(detector.isSupported('www.tiktok.com')).toBe(true);
      expect(detector.isSupported('tiktok.com')).toBe(true);
    });

    it('should not support other domains', () => {
      expect(detector.isSupported('youtube.com')).toBe(false);
      expect(detector.isSupported('instagram.com')).toBe(false);
      expect(detector.isSupported('example.com')).toBe(false);
    });
  });

  describe('platform property', () => {
    it('should return "tiktok"', () => {
      expect(detector.platform).toBe('tiktok');
    });
  });

  describe('scan', () => {
    it('should handle empty root element', () => {
      const root = document.createElement('div');
      expect(() => detector.scan(root)).not.toThrow();
    });

    it('should detect recommend list items', () => {
      document.body.innerHTML = `
        <div>
          <div data-e2e="recommend-list-item-container">
            <video src="video.mp4"></video>
          </div>
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const element = document.querySelector(
        '[data-e2e="recommend-list-item-container"]'
      );
      expect(element?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should detect search card containers', () => {
      document.body.innerHTML = `
        <div>
          <div data-e2e="search-card-container">
            <a href="/video/123">Video</a>
          </div>
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const element = document.querySelector(
        '[data-e2e="search-card-container"]'
      );
      expect(element?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should detect user post items', () => {
      document.body.innerHTML = `
        <div>
          <div data-e2e="user-post-item">
            <a href="/@user/video/123">Video</a>
          </div>
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const element = document.querySelector('[data-e2e="user-post-item"]');
      expect(element?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should detect following items', () => {
      document.body.innerHTML = `
        <div>
          <div data-e2e="following-item">
            <a href="/@following/video/456">Following Video</a>
          </div>
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const element = document.querySelector('[data-e2e="following-item"]');
      expect(element?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should not process already hidden elements', () => {
      document.body.innerHTML = `
        <div>
          <div data-e2e="recommend-list-item-container" data-shortshield-hidden="true">
            <video src="video.mp4"></video>
          </div>
        </div>
      `;

      const root = document.body;
      // Should not throw and element should stay as is
      expect(() => detector.scan(root)).not.toThrow();
    });
  });

  describe('element hiding', () => {
    it('should apply hide action to elements', () => {
      document.body.innerHTML = `
        <div data-e2e="recommend-list-item-container" style="display: block;">
          Content
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const element = document.querySelector(
        '[data-e2e="recommend-list-item-container"]'
      ) as HTMLElement;
      expect(element?.style.display).toBe('none');
    });
  });
});
