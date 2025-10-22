import { Page, expect, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.copyrightText = page.getByText('© Tuluk Career Consultancy');
  }

  // Navigate to any URL
  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  // Backwards-compatible alias used across tests/pages
  async navigateToExternal(url: string) {
    await this.navigateTo(url);
  }

  // Click element by role
  async clickByRole(role: string, name?: string | RegExp) {
    if (name) {
      await this.page.getByRole(role as any, { name }).click();
    } else {
      await this.page.getByRole(role as any).click();
    }
  }

  // Fill input by role
  async fillByRole(role: string, name: string | RegExp, value: string) {
    await this.page.getByRole(role as any, { name }).fill(value);
  }

  // Click element by text
  async clickByText(text: string) {
    await this.page.getByText(text).click();
  }

   async scrollToFooter() {
    await this.copyrightText.scrollIntoViewIfNeeded();
    await expect(this.copyrightText).toBeVisible();
  }

  // Verify text is visible
  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  // Verify element by role is visible
  async expectRoleVisible(role: string, name?: string | RegExp) {
    if (name) {
      await expect(this.page.getByRole(role as any, { name })).toBeVisible();
    } else {
      await expect(this.page.getByRole(role as any)).toBeVisible();
    }
  }

  // Wait for network idle
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Wait for an element to be visible. Accepts a selector string or a Locator.
  async waitForVisible(selectorOrLocator: string | ReturnType<Page['locator']>, timeout = 5000) {
    if (typeof selectorOrLocator === 'string') {
      await this.page.locator(selectorOrLocator).first().waitFor({ state: 'visible', timeout });
    } else {
      await selectorOrLocator.first().waitFor({ state: 'visible', timeout });
    }
  }
}
