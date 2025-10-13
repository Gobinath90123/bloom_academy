import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

function getBaseUrl() {
  const environment = process.env.ENV;
  if (!environment) return 'https://staging.bloomscareer.com/login';
  switch (environment) {
    case 'prod':
      return 'https://www.goperla.com/';
    case 'local':
      return 'http://localhost';
    default:
      return 'http://3.80.32.182:3000';
  }
}

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  fullyParallel: true,
  reporter: [
    ['list'],
    // ['./CustomReporterConfig.ts'],
    ['junit', { outputFile: './report/results.xml' }],
    ['allure-playwright'],
    ['monocart-reporter', {
      name: "Blooms Academy Automation Test Report",
      outputFile: './report/monocart-report/index.html',
    }],
  ],
  use: {
    baseURL: getBaseUrl(),
  },
  // globalSetup: require.resolve('./global-setup.js'),
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        actionTimeout: 60000,
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: { args: ['--start-maximized'] },
      },
    },
  ],
});