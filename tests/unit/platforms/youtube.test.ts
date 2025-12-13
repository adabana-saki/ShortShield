/**
 * YouTube detector tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { YouTubeDetector } from '@/content/platforms/youtube';
import type { Settings } from '@/shared/types';
import { DEFAULT_SETTINGS } from '@/shared/constants';

// Mock the logger
vi.mock('@/shared/utils/logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('YouTubeDetector', () => {
  let detector: YouTubeDetector;
  let mockSettings: Settings;

  beforeEach(() => {
    detector = new YouTubeDetector();
    mockSettings = {
      ...DEFAULT_SETTINGS,
      enabled: true,
      platforms: {
        youtube: true,
        tiktok: true,
        instagram: true,
      },
    };
    detector.setSettings(mockSettings);
  });

  describe('isSupported()', () => {
    it('should support YouTube domains', () => {
      expect(detector.isSupported('www.youtube.com')).toBe(true);
      expect(detector.isSupported('youtube.com')).toBe(true);
      expect(detector.isSupported('m.youtube.com')).toBe(true);
    });

    it('should not support other domains', () => {
      expect(detector.isSupported('www.google.com')).toBe(false);
      expect(detector.isSupported('tiktok.com')).toBe(false);
      expect(detector.isSupported('youtu.be')).toBe(false);
    });
  });

  describe('isEnabled()', () => {
    it('should return true when blocking is enabled', () => {
      expect(detector.isEnabled()).toBe(true);
    });

    it('should return false when blocking is disabled', () => {
      detector.setSettings({
        ...mockSettings,
        enabled: false,
      });
      expect(detector.isEnabled()).toBe(false);
    });

    it('should return false when YouTube platform is disabled', () => {
      detector.setSettings({
        ...mockSettings,
        platforms: {
          ...mockSettings.platforms,
          youtube: false,
        },
      });
      expect(detector.isEnabled()).toBe(false);
    });
  });

  describe('scan()', () => {
    let mockElement: HTMLDivElement;

    beforeEach(() => {
      mockElement = document.createElement('div');
      document.body.appendChild(mockElement);
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should hide ytd-reel-video-renderer elements', () => {
      const reelRenderer = document.createElement('ytd-reel-video-renderer');
      mockElement.appendChild(reelRenderer);

      detector.scan(mockElement);

      expect(reelRenderer.style.display).toBe('none');
      expect(reelRenderer.dataset.shortshieldHidden).toBe('true');
    });

    it('should hide ytd-rich-item-renderer[is-shorts] elements', () => {
      const richItem = document.createElement('ytd-rich-item-renderer');
      richItem.setAttribute('is-shorts', '');
      mockElement.appendChild(richItem);

      detector.scan(mockElement);

      expect(richItem.style.display).toBe('none');
    });

    it('should hide elements with [overlay-style="SHORTS"]', () => {
      const richItem = document.createElement('ytd-rich-item-renderer');
      const overlay = document.createElement('div');
      overlay.setAttribute('overlay-style', 'SHORTS');
      richItem.appendChild(overlay);
      mockElement.appendChild(richItem);

      detector.scan(mockElement);

      expect(richItem.style.display).toBe('none');
    });

    it('should hide links to /shorts/', () => {
      const richItem = document.createElement('ytd-rich-item-renderer');
      const link = document.createElement('a');
      link.href = 'https://www.youtube.com/shorts/abc123';
      richItem.appendChild(link);
      mockElement.appendChild(richItem);

      detector.scan(mockElement);

      expect(richItem.style.display).toBe('none');
    });

    it('should not hide already hidden elements', () => {
      const reelRenderer = document.createElement('ytd-reel-video-renderer');
      reelRenderer.dataset.shortshieldHidden = 'true';
      mockElement.appendChild(reelRenderer);

      const originalStyle = reelRenderer.style.cssText;
      detector.scan(mockElement);

      // Should not modify already processed elements
      expect(reelRenderer.style.cssText).toBe(originalStyle);
    });

    it('should not scan when disabled', () => {
      detector.setSettings({
        ...mockSettings,
        enabled: false,
      });

      const reelRenderer = document.createElement('ytd-reel-video-renderer');
      mockElement.appendChild(reelRenderer);

      detector.scan(mockElement);

      expect(reelRenderer.style.display).not.toBe('none');
    });

    it('should hide ytd-rich-shelf-renderer[is-shorts]', () => {
      const shelf = document.createElement('ytd-rich-shelf-renderer');
      shelf.setAttribute('is-shorts', '');
      mockElement.appendChild(shelf);

      detector.scan(mockElement);

      expect(shelf.style.display).toBe('none');
    });

    it('should hide ytd-reel-shelf-renderer', () => {
      const reelShelf = document.createElement('ytd-reel-shelf-renderer');
      mockElement.appendChild(reelShelf);

      detector.scan(mockElement);

      expect(reelShelf.style.display).toBe('none');
    });
  });

  describe('platform property', () => {
    it('should have youtube as platform', () => {
      expect(detector.platform).toBe('youtube');
    });
  });
});
