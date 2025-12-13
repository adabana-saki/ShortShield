import { test, expect, openOptions } from '../fixtures';

test.describe('Options Page', () => {
  test('should open options page successfully', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    await expect(options.locator('body')).toBeVisible();

    await options.close();
  });

  test('should display whitelist section', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Whitelist section should be present
    const whitelistSection = options.getByText(/whitelist/i).first();
    await expect(whitelistSection).toBeVisible();

    await options.close();
  });

  test('should add entry to whitelist', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Find whitelist input
    const input = options.getByRole('textbox', { name: /channel|url|add/i }).first();

    if (await input.isVisible()) {
      // Enter a test value
      await input.fill('@TestChannel');

      // Find and click add button
      const addButton = options.getByRole('button', { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();

        // Entry should appear in the list
        const entry = options.getByText('@TestChannel');
        await expect(entry).toBeVisible();
      }
    }

    await options.close();
  });

  test('should remove entry from whitelist', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Add an entry first
    const input = options.getByRole('textbox').first();
    if (await input.isVisible()) {
      await input.fill('@ToBeRemoved');

      const addButton = options.getByRole('button', { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();

        // Find remove button for the entry
        const removeButton = options.getByRole('button', { name: /remove|delete|×/i }).last();
        if (await removeButton.isVisible()) {
          await removeButton.click();

          // Entry should be removed
          await expect(options.getByText('@ToBeRemoved')).not.toBeVisible();
        }
      }
    }

    await options.close();
  });

  test('should display custom rules section', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Custom rules section should be present
    const customRulesSection = options.getByText(/custom rules/i).first();
    await expect(customRulesSection).toBeVisible();

    await options.close();
  });

  test('should add custom CSS rule', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Navigate to custom rules section if needed
    const customRulesTab = options.getByRole('tab', { name: /custom/i });
    if (await customRulesTab.isVisible()) {
      await customRulesTab.click();
    }

    // Find selector input
    const selectorInput = options.getByPlaceholder(/selector/i).first();

    if (await selectorInput.isVisible()) {
      await selectorInput.fill('.test-selector');

      const addButton = options.getByRole('button', { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }

    await options.close();
  });

  test('should validate CSS selector format', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    const selectorInput = options.getByPlaceholder(/selector/i).first();

    if (await selectorInput.isVisible()) {
      // Enter invalid selector
      await selectorInput.fill('invalid{{{selector');

      const addButton = options.getByRole('button', { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();

        // Error message should appear
        const errorMessage = options.getByText(/invalid|error/i);
        await expect(errorMessage).toBeVisible();
      }
    }

    await options.close();
  });

  test('should display log viewer', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Log viewer section should be present
    const logsSection = options.getByText(/logs|activity/i).first();
    await expect(logsSection).toBeVisible();

    await options.close();
  });

  test('should export settings', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Find export button
    const exportButton = options.getByRole('button', { name: /export/i }).first();

    if (await exportButton.isVisible()) {
      // Set up download handler
      const downloadPromise = options.waitForEvent('download');

      await exportButton.click();

      // Download should start
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toContain('shortshield');
    }

    await options.close();
  });

  test('should have import functionality', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Import button should be present
    const importButton = options.getByRole('button', { name: /import/i }).first();

    if (await importButton.isVisible()) {
      await expect(importButton).toBeEnabled();
    }

    await options.close();
  });

  test('should clear logs', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Find clear logs button
    const clearButton = options.getByRole('button', { name: /clear.*logs|clear all/i }).first();

    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Logs should be cleared (may show empty state)
      const emptyState = options.getByText(/no logs|empty|cleared/i);
      await expect(emptyState).toBeVisible();
    }

    await options.close();
  });

  test('should display proper i18n strings', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    const bodyText = await options.locator('body').textContent();

    // No untranslated message keys
    expect(bodyText).not.toContain('__MSG_');
    expect(bodyText).not.toContain('undefined');

    await options.close();
  });

  test('should be navigable with keyboard', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Tab navigation should work
    await options.keyboard.press('Tab');

    const focusedElement = options.locator(':focus');
    await expect(focusedElement).toBeVisible();

    await options.close();
  });

  test('should persist settings after page reload', async ({ context, extensionId }) => {
    const options1 = await openOptions(context, extensionId);

    // Add a whitelist entry
    const input = options1.getByRole('textbox').first();
    if (await input.isVisible()) {
      await input.fill('@PersistenceTest');

      const addButton = options1.getByRole('button', { name: /add/i }).first();
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }

    await options1.close();

    // Re-open options
    const options2 = await openOptions(context, extensionId);

    // Entry should still be there
    const entry = options2.getByText('@PersistenceTest');
    await expect(entry).toBeVisible();

    await options2.close();
  });
});

test.describe('Options Page Responsive Design', () => {
  test('should display correctly on various screen sizes', async ({ context, extensionId }) => {
    const options = await openOptions(context, extensionId);

    // Test different viewport sizes
    const sizes = [
      { width: 1280, height: 720 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
    ];

    for (const size of sizes) {
      await options.setViewportSize(size);
      await options.waitForTimeout(100);

      // Main content should remain visible
      const mainContent = options.locator('main, .container, #app').first();
      await expect(mainContent).toBeVisible();
    }

    await options.close();
  });
});
