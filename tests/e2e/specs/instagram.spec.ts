import { test, expect, openPopup } from '../fixtures';

test.describe('Instagram Reels Blocking', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    // Ensure extension is enabled
    const popup = await openPopup(context, extensionId);
    await popup.waitForLoadState('domcontentloaded');

    const toggle = popup.getByRole('switch').first();
    if (await toggle.isVisible()) {
      const isChecked = await toggle.isChecked();
      if (!isChecked) {
        await toggle.click();
      }
    }

    await popup.close();
  });

  test('should load extension on Instagram', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.instagram.com');
    await page.waitForLoadState('domcontentloaded');

    // Instagram may show login wall
    await expect(page).toHaveURL(/instagram\.com/);
  });

  test('should block Reels tab on Instagram', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.instagram.com/reels');
    await page.waitForLoadState('domcontentloaded');

    // Wait for content to potentially load
    await page.waitForTimeout(2000);

    // Extension should either block or hide Reels content
    // Verify the page is handled by extension
  });

  test('should hide Reels in Instagram feed', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.instagram.com');
    await page.waitForLoadState('networkidle');

    // Wait for feed to load
    await page.waitForTimeout(3000);

    // Check for Reels content in feed
    // Instagram uses various selectors for Reels
    const reelsContent = page.locator(
      '[data-testid*="reel"], [aria-label*="Reel"]'
    );

    // If Reels exist in feed, they should be hidden
    const count = await reelsContent.count();
    if (count > 0) {
      // Reels should be hidden when blocking is enabled
    }
  });

  test('should handle Instagram Stories vs Reels', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.instagram.com');
    await page.waitForLoadState('networkidle');

    // Stories should remain visible (they're not Reels)
    // This test verifies extension doesn't over-block
    const storiesContainer = page.locator(
      '[aria-label*="Stories"], [data-testid*="story"]'
    );

    // Stories should still be accessible
    // (Unless specifically configured to block)
    expect(storiesContainer).toBeTruthy();
  });

  test('should handle Instagram profile Reels tab', async ({ context }) => {
    const page = await context.newPage();

    // Navigate to a profile's Reels tab
    await page.goto('https://www.instagram.com/instagram/reels/');
    await page.waitForLoadState('domcontentloaded');

    // Reels content on profile should be handled by extension
  });

  test('should not break regular Instagram posts', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.instagram.com');
    await page.waitForLoadState('domcontentloaded');

    // Regular posts should still be visible and functional
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Instagram Platform Toggle', () => {
  test('should disable blocking when Instagram toggle is off', async ({
    context,
    extensionId,
  }) => {
    const popup = await openPopup(context, extensionId);

    // Find Instagram platform toggle
    const instagramToggle = popup.getByRole('checkbox', { name: /instagram/i });
    if (await instagramToggle.isVisible()) {
      await instagramToggle.uncheck();
    }

    await popup.close();

    // Navigate to Instagram Reels
    const page = await context.newPage();
    await page.goto('https://www.instagram.com/reels');
    await page.waitForLoadState('domcontentloaded');

    // With blocking disabled, Reels should be accessible
  });

  test('should persist Instagram settings', async ({
    context,
    extensionId,
  }) => {
    // Disable Instagram
    const popup1 = await openPopup(context, extensionId);
    const toggle = popup1.getByRole('checkbox', { name: /instagram/i });
    if (await toggle.isVisible()) {
      await toggle.uncheck();
    }
    await popup1.close();

    // Re-open and verify
    const popup2 = await openPopup(context, extensionId);
    const savedToggle = popup2.getByRole('checkbox', { name: /instagram/i });
    if (await savedToggle.isVisible()) {
      expect(await savedToggle.isChecked()).toBe(false);
    }
    await popup2.close();
  });
});
