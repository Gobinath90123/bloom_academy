import { Page } from '@playwright/test';

export class BasePage {
  constructor(public page: Page) {}

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async clickElement(locator: string) {
    await this.page.click(locator);
  }

  async fillText(locator: string, text: string) {
    await this.page.fill(locator, text);
  }

  async clickByRole(role: string, name?: string | RegExp) {
    if (name) {
      await this.page.getByRole(role as any, { name }).click();
    } else {
      await this.page.getByRole(role as any).click();
    }
  }

  async clickByText(text: string) {
    await this.page.getByText(text).click();
  }
}
