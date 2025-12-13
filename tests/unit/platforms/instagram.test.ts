/**
 * Instagram Reels detector unit tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InstagramDetector } from '@/content/platforms/instagram';

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

describe('InstagramDetector', () => {
  let detector: InstagramDetector;

  beforeEach(() => {
    detector = new InstagramDetector();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('isSupported', () => {
    it('should support instagram.com', () => {
      expect(detector.isSupported('www.instagram.com')).toBe(true);
      expect(detector.isSupported('instagram.com')).toBe(true);
    });

    it('should not support other domains', () => {
      expect(detector.isSupported('youtube.com')).toBe(false);
      expect(detector.isSupported('tiktok.com')).toBe(false);
      expect(detector.isSupported('example.com')).toBe(false);
    });
  });

  describe('platform property', () => {
    it('should return "instagram"', () => {
      expect(detector.platform).toBe('instagram');
    });
  });

  describe('scan', () => {
    it('should handle empty root element', () => {
      const root = document.createElement('div');
      expect(() => detector.scan(root)).not.toThrow();
    });

    it('should detect reels links', () => {
      document.body.innerHTML = `
        <div>
          <a href="/reels/abc123">Reel</a>
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const link = document.querySelector('a[href*="/reels/"]');
      expect(link?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should detect individual reel links', () => {
      document.body.innerHTML = `
        <div>
          <a href="/reel/abc123">Individual Reel</a>
        </div>
      `;

      const root = document.body;
      detector.scan(root);

      const link = document.querySelector('a[href*="/reel/"]');
      expect(link?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should detect reels in articles', () => {
      document.body.innerHTML = `
        <article>
          <a href="/reel/xyz789">Reel Post</a>
        </article>
      `;

      const root = document.body;
      detector.scan(root);

      const article = document.querySelector('article');
      expect(article?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should not process already hidden elements', () => {
      document.body.innerHTML = `
        <div>
          <a href="/reels/abc123" data-shortshield-hidden="true">Reel</a>
        </div>
      `;

      const root = document.body;
      expect(() => detector.scan(root)).not.toThrow();
    });
  });

  describe('feed scanning', () => {
    it('should detect reels in feed articles', () => {
      document.body.innerHTML = `
        <article>
          <header>
            <a href="/@username/">User</a>
          </header>
          <div>
            <a href="/reel/feedreel123">Reel in Feed</a>
          </div>
        </article>
      `;

      const root = document.body;
      detector.scan(root);

      const article = document.querySelector('article');
      expect(article?.getAttribute('data-shortshield-hidden')).toBe('true');
    });

    it('should detect articles with reels indicator SVG', () => {
      document.body.innerHTML = `
        <article>
          <svg aria-label="Reel"></svg>
          <a href="/reel/123">Content</a>
        </article>
      `;

      const root = document.body;
      detector.scan(root);

      const article = document.querySelector('article');
      expect(article?.getAttribute('data-shortshield-hidden')).toBe('true');
    });
  });

  describe('navigation hiding', () => {
    it('should hide reels navigation links', () => {
      document.body.innerHTML = `
        <nav>
          <div>
            <a href="/reels/">Reels</a>
          </div>
        </nav>
      `;

      const root = document.body;
      detector.scan(root);

      // The parent div should be hidden
      const navDiv = document.querySelector('nav div');
      expect(navDiv?.getAttribute('data-shortshield-hidden')).toBe('true');
    });
  });

  describe('element hiding', () => {
    it('should apply hide action to elements', () => {
      document.body.innerHTML = `
        <a href="/reels/test" style="display: block;">Reel Link</a>
      `;

      const root = document.body;
      detector.scan(root);

      const element = document.querySelector('a[href*="/reels/"]') as HTMLElement;
      expect(element?.style.display).toBe('none');
    });
  });
});
