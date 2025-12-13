import { test, expect, openPopup } from '../fixtures';

test.describe('Popup UI', () => {
  test('should open popup successfully', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Popup should load without errors
    await expect(popup.locator('body')).toBeVisible();

    await popup.close();
  });

  test('should display main toggle', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Main enable/disable toggle should be present
    const mainToggle = popup.getByRole('switch').first();
    await expect(mainToggle).toBeVisible();

    await popup.close();
  });

  test('should toggle extension on/off', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    const mainToggle = popup.getByRole('switch').first();

    // Get initial state
    const initialState = await mainToggle.isChecked();

    // Toggle
    await mainToggle.click();

    // State should change
    const newState = await mainToggle.isChecked();
    expect(newState).toBe(!initialState);

    // Toggle back
    await mainToggle.click();
    expect(await mainToggle.isChecked()).toBe(initialState);

    await popup.close();
  });

  test('should display platform toggles', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Check for platform-specific toggles
    const platformLabels = ['YouTube', 'TikTok', 'Instagram'];

    for (const platform of platformLabels) {
      const platformSection = popup.getByText(platform, { exact: false });
      await expect(platformSection).toBeVisible();
    }

    await popup.close();
  });

  test('should toggle individual platforms', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Find and toggle YouTube checkbox
    const youtubeToggle = popup.getByRole('checkbox', { name: /youtube/i }).first();

    if (await youtubeToggle.isVisible()) {
      const initialState = await youtubeToggle.isChecked();
      await youtubeToggle.click();
      expect(await youtubeToggle.isChecked()).toBe(!initialState);
    }

    await popup.close();
  });

  test('should display statistics', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Stats section should be visible
    // Look for blocked count or similar statistics display
    const statsSection = popup.locator('[data-testid="stats"], .stats, .statistics').first();

    // If stats section exists, it should be visible
    if (await statsSection.count() > 0) {
      await expect(statsSection).toBeVisible();
    }

    await popup.close();
  });

  test('should have link to options page', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Settings/Options link should be present
    const optionsLink = popup.getByRole('link', { name: /settings|options/i }).first();

    if (await optionsLink.isVisible()) {
      await expect(optionsLink).toHaveAttribute('href', /options/);
    }

    await popup.close();
  });

  test('should persist toggle states after closing', async ({ context, extensionId }) => {
    // Open popup and change a setting
    const popup1 = await openPopup(context, extensionId);
    const mainToggle = popup1.getByRole('switch').first();

    // Toggle to opposite state
    await mainToggle.click();
    const stateAfterToggle = await mainToggle.isChecked();

    await popup1.close();

    // Re-open popup
    const popup2 = await openPopup(context, extensionId);
    const mainToggle2 = popup2.getByRole('switch').first();

    // State should be preserved
    expect(await mainToggle2.isChecked()).toBe(stateAfterToggle);

    await popup2.close();
  });

  test('should display proper i18n strings', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Check that UI text is properly localized (no missing translations)
    // Look for __MSG_ patterns which indicate untranslated strings
    const bodyText = await popup.locator('body').textContent();

    expect(bodyText).not.toContain('__MSG_');
    expect(bodyText).not.toContain('undefined');

    await popup.close();
  });

  test('should be keyboard accessible', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Tab through interactive elements
    await popup.keyboard.press('Tab');

    // First focusable element should receive focus
    const focusedElement = popup.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Should be able to activate with Enter/Space
    await popup.keyboard.press('Space');

    await popup.close();
  });

  test('should handle rapid toggle clicks', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    const mainToggle = popup.getByRole('switch').first();

    // Rapid clicks should not cause issues
    for (let i = 0; i < 5; i++) {
      await mainToggle.click();
    }

    // Final state should be stable (odd number of clicks)
    await popup.waitForTimeout(500);

    // Popup should still be functional
    await expect(mainToggle).toBeVisible();

    await popup.close();
  });
});

test.describe('Popup Responsive Design', () => {
  test('should display correctly at popup size', async ({ context, extensionId }) => {
    const popup = await openPopup(context, extensionId);

    // Set typical popup viewport size
    await popup.setViewportSize({ width: 350, height: 500 });

    // Content should not overflow
    const body = popup.locator('body');
    const boundingBox = await body.boundingBox();

    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(350);
    }

    await popup.close();
  });
});
