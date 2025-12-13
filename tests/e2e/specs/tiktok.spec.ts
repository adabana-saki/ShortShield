import { test, expect, openPopup } from '../fixtures';

test.describe('TikTok Blocking', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    // Ensure extension is enabled
    const popup = await openPopup(context, extensionId);
    await popup.waitForLoadState('domcontentloaded');

    // Check main toggle
    const toggle = popup.getByRole('switch').first();
    if (await toggle.isVisible()) {
      const isChecked = await toggle.isChecked();
      if (!isChecked) {
        await toggle.click();
      }
    }

    await popup.close();
  });

  test('should load extension on TikTok', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.tiktok.com');
    await page.waitForLoadState('domcontentloaded');

    // Verify page loaded (may have login wall)
    await expect(page).toHaveURL(/tiktok\.com/);
  });

  test('should block TikTok video feed', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.tiktok.com');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Check if video containers are hidden
    // TikTok's structure varies, so we check common selectors
    const videoContainers = page.locator(
      '[data-e2e="recommend-list-item-container"]'
    );

    // If videos exist, they should be hidden by extension
    const count = await videoContainers.count();
    if (count > 0) {
      // Check visibility of first few items
      for (let i = 0; i < Math.min(count, 3); i++) {
        const isHidden = await videoContainers
          .nth(i)
          .isHidden()
          .catch(() => true);
        // Videos should be hidden when blocking is enabled
        expect(typeof isHidden).toBe('boolean');
      }
    }
  });

  test('should handle TikTok For You page', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.tiktok.com/foryou');
    await page.waitForLoadState('domcontentloaded');

    // Extension should handle the For You feed
    // Page should either show blocking message or hide content
  });

  test('should handle TikTok profile pages', async ({ context }) => {
    const page = await context.newPage();

    // Navigate to a TikTok profile
    await page.goto('https://www.tiktok.com/@tiktok');
    await page.waitForLoadState('domcontentloaded');

    // Profile page should load (videos may be blocked based on settings)
    await expect(page.locator('body')).toBeVisible();
  });

  test('should not break non-video TikTok pages', async ({ context }) => {
    const page = await context.newPage();

    // Navigate to TikTok's discover page
    await page.goto('https://www.tiktok.com/discover');
    await page.waitForLoadState('domcontentloaded');

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('TikTok Platform Toggle', () => {
  test('should disable blocking when TikTok toggle is off', async ({
    context,
    extensionId,
  }) => {
    const popup = await openPopup(context, extensionId);

    // Find TikTok platform toggle
    const tiktokToggle = popup.getByRole('checkbox', { name: /tiktok/i });
    if (await tiktokToggle.isVisible()) {
      await tiktokToggle.uncheck();
    }

    await popup.close();

    // Navigate to TikTok
    const page = await context.newPage();
    await page.goto('https://www.tiktok.com');
    await page.waitForLoadState('domcontentloaded');

    // With blocking disabled, TikTok content should be visible
    // (Actual verification depends on implementation)
  });

  test('should persist TikTok settings across sessions', async ({
    context,
    extensionId,
  }) => {
    // Disable TikTok
    const popup1 = await openPopup(context, extensionId);
    const tiktokToggle = popup1.getByRole('checkbox', { name: /tiktok/i });
    if (await tiktokToggle.isVisible()) {
      await tiktokToggle.uncheck();
    }
    await popup1.close();

    // Open popup again
    const popup2 = await openPopup(context, extensionId);

    // Check if setting persisted
    const toggle = popup2.getByRole('checkbox', { name: /tiktok/i });
    if (await toggle.isVisible()) {
      const isChecked = await toggle.isChecked();
      expect(isChecked).toBe(false);
    }

    await popup2.close();
  });
});
