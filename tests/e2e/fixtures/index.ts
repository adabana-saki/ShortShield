import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';
import { resolve } from 'path';

/**
 * Extension context interface
 */
interface ExtensionContext {
  extensionId: string;
  backgroundPage: Page | null;
  popupPage: Page | null;
  optionsPage: Page | null;
}

/**
 * Test fixtures for browser extension E2E tests
 */
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const extensionPath = resolve(__dirname, '../../../dist/chrome');
    const context = await base.chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let extensionId = '';

    // Wait for service worker to be available
    let serviceWorker = context.serviceWorkers()[0];
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }

    // Extract extension ID from service worker URL
    const url = serviceWorker.url();
    const match = url.match(/chrome-extension:\/\/([^/]+)/);
    if (match) {
      extensionId = match[1];
    }

    await use(extensionId);
  },
});

export { expect };

/**
 * Helper to open extension popup
 */
export async function openPopup(context: BrowserContext, extensionId: string): Promise<Page> {
  const popupUrl = `chrome-extension://${extensionId}/src/popup/index.html`;
  const page = await context.newPage();
  await page.goto(popupUrl);
  await page.waitForLoadState('domcontentloaded');
  return page;
}

/**
 * Helper to open extension options page
 */
export async function openOptions(context: BrowserContext, extensionId: string): Promise<Page> {
  const optionsUrl = `chrome-extension://${extensionId}/src/options/index.html`;
  const page = await context.newPage();
  await page.goto(optionsUrl);
  await page.waitForLoadState('domcontentloaded');
  return page;
}

/**
 * Helper to wait for extension to be ready
 */
export async function waitForExtensionReady(page: Page): Promise<void> {
  // Wait for React to render
  await page.waitForSelector('[data-testid="extension-root"]', {
    state: 'visible',
    timeout: 10000,
  }).catch(() => {
    // Fallback if data-testid not present
    return page.waitForLoadState('networkidle');
  });
}

/**
 * Helper to navigate to YouTube Shorts
 */
export async function navigateToYouTubeShorts(page: Page): Promise<void> {
  await page.goto('https://www.youtube.com/shorts');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Helper to navigate to TikTok
 */
export async function navigateToTikTok(page: Page): Promise<void> {
  await page.goto('https://www.tiktok.com');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Helper to navigate to Instagram Reels
 */
export async function navigateToInstagramReels(page: Page): Promise<void> {
  await page.goto('https://www.instagram.com/reels');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Storage helper for extension storage
 */
export async function getExtensionStorage(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate(() => {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (items) => {
        resolve(items);
      });
    });
  });
}

/**
 * Helper to set extension storage
 */
export async function setExtensionStorage(
  page: Page,
  data: Record<string, unknown>
): Promise<void> {
  await page.evaluate((storageData) => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.set(storageData, () => {
        resolve();
      });
    });
  }, data);
}

/**
 * Helper to clear extension storage
 */
export async function clearExtensionStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  });
}
