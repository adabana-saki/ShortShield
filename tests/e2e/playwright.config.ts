import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'path';

const extensionPath = resolve(__dirname, '../../dist/chrome');

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  forbidOnly: process.env.CI !== undefined && process.env.CI !== '',
  retries: process.env.CI !== undefined && process.env.CI !== '' ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    process.env.CI !== undefined && process.env.CI !== ''
      ? ['github']
      : ['list'],
  ],
  use: {
    baseURL: 'https://www.youtube.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            '--no-sandbox',
          ],
        },
      },
    },
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  outputDir: 'test-results',
});
