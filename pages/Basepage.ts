import { Page, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to any URL
  async navigateTo(url: string) {
    await this.page.goto(url);
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
}
