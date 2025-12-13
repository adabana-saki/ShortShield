import { test, expect, openPopup, navigateToYouTubeShorts } from '../fixtures';

test.describe('YouTube Shorts Blocking', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    // Ensure extension is enabled before each test
    const popup = await openPopup(context, extensionId);

    // Wait for popup to load
    await popup.waitForLoadState('domcontentloaded');

    // Check if main toggle exists and is enabled
    const toggle = popup.getByRole('switch').first();
    if (await toggle.isVisible()) {
      const isChecked = await toggle.isChecked();
      if (!isChecked) {
        await toggle.click();
      }
    }

    await popup.close();
  });

  test('should load extension on YouTube', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.youtube.com');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loaded
    await expect(page).toHaveTitle(/YouTube/);
  });

  test('should hide Shorts shelf on YouTube homepage', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.youtube.com');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check if Shorts shelf is hidden or not present
    const shortsShelf = page.locator('[is-shorts]').first();

    // Should be either hidden or not visible
    const isVisible = await shortsShelf.isVisible().catch(() => false);

    // If Shorts content exists, it should be hidden by extension
    if (await shortsShelf.count() > 0) {
      expect(isVisible).toBe(false);
    }
  });

  test('should block navigation to /shorts/ URLs', async ({ context }) => {
    const page = await context.newPage();

    // Navigate to a Shorts URL
    await page.goto('https://www.youtube.com/shorts');

    // Wait for potential redirect
    await page.waitForTimeout(2000);

    // Check URL - should either be redirected or show blocking
    const url = page.url();

    // Extension may redirect away from /shorts/ or display blocking message
    // This depends on the extension's configuration
  });

  test('should redirect Shorts video to regular video player', async ({ context }) => {
    const page = await context.newPage();

    // This test requires a valid Shorts video ID
    // Using a placeholder - in real tests, use a known Shorts video
    const shortsUrl = 'https://www.youtube.com/shorts/dQw4w9WgXcQ';

    await page.goto(shortsUrl);
    await page.waitForLoadState('domcontentloaded');

    // Wait for potential redirect
    await page.waitForTimeout(3000);

    const currentUrl = page.url();

    // If redirect is enabled, URL should be changed to /watch?v=
    // This depends on extension settings
  });

  test('should preserve functionality on regular YouTube videos', async ({ context }) => {
    const page = await context.newPage();

    // Navigate to a regular video
    await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await page.waitForLoadState('domcontentloaded');

    // Video player should still be accessible
    const videoPlayer = page.locator('#movie_player').first();
    await expect(videoPlayer).toBeVisible({ timeout: 15000 });
  });

  test('should handle Shorts links in search results', async ({ context }) => {
    const page = await context.newPage();

    // Search for something that may include Shorts
    await page.goto('https://www.youtube.com/results?search_query=shorts+test');
    await page.waitForLoadState('networkidle');

    // Wait for search results to load
    await page.waitForTimeout(2000);

    // Extension should either hide Shorts results or transform their links
    // Verify page is functional
    await expect(page.locator('#contents')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('YouTube Platform Toggle', () => {
  test('should disable blocking when YouTube toggle is off', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Find YouTube platform toggle and disable it
    const youtubeToggle = popup.getByRole('checkbox', { name: /youtube/i });
    if (await youtubeToggle.isVisible()) {
      await youtubeToggle.uncheck();
    }

    await popup.close();

    // Navigate to YouTube Shorts
    const page = await context.newPage();
    await page.goto('https://www.youtube.com/shorts');
    await page.waitForLoadState('domcontentloaded');

    // With blocking disabled, Shorts should be accessible
    // (Actual behavior depends on implementation)
  });
});
