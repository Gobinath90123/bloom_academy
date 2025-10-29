import { Page, expect, Locator } from '@playwright/test';

/**
 * BasePage class provides common functionality for all page objects
 * Following DRY principle by centralizing common interactions
 */
export abstract class BasePage {
  protected page: Page;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.copyrightText = page.getByText('© Tuluk Career Consultancy');
  }

  /**
   * Navigates to the specified URL
   * @param url The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Clicks an element identified by role
   * @param role The ARIA role of the element
   * @param name Optional name of the element
   */
  async clickByRole(role: string, name?: string | RegExp): Promise<void> {
    const locator = name
      ? this.page.getByRole(role as any, { name })
      : this.page.getByRole(role as any);
    await locator.click();
  }

  /**
   * Fills an input field identified by role
   * @param role The ARIA role of the input element
   * @param name The name of the input element
   * @param value The value to fill
   */
  async fillByRole(role: string, name: string | RegExp, value: string): Promise<void> {
    await this.page.getByRole(role as any, { name }).fill(value);
  }

  /**
   * Clicks an element identified by text
   * @param text The text content of the element
   */
  async clickByText(text: string): Promise<void> {
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

  /**
   * Verifies that an element identified by role is visible
   * @param role The ARIA role of the element
   * @param name Optional name of the element
   */
  async expectRoleVisible(role: string, name?: string | RegExp): Promise<void> {
    const locator = name
      ? this.page.getByRole(role as any, { name })
      : this.page.getByRole(role as any);
    await expect(locator).toBeVisible();
  }

  /**
   * Waits for the page to reach network idle state
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Waits for an element to be visible
   * @param selectorOrLocator Either a CSS selector string or a Locator object
   * @param timeout Maximum time to wait in milliseconds
   */
  async waitForVisible(selectorOrLocator: string | Locator, timeout = 30000): Promise<void> {
    const locator = typeof selectorOrLocator === 'string'
      ? this.page.locator(selectorOrLocator).first()
      : selectorOrLocator.first();
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Gets a locator for an element by role
   * @param role The ARIA role of the element
   * @param name Optional name of the element
   * @returns Locator for the element
   */
  getByRole(role: string, name?: string | RegExp): Locator {
    return name
      ? this.page.getByRole(role as any, { name })
      : this.page.getByRole(role as any);
  }

  /**
   * Gets a locator for an element by text
   * @param text The text content of the element
   * @returns Locator for the element
   */
  getByText(text: string): Locator {
    return this.page.getByText(text);
  }

  /**
   * Scrolls to the footer of the page and verifies that the copyright text is visible
   */
  async scrollToFooter() {
    await this.copyrightText.waitFor({ state: 'visible' });
    await this.copyrightText.evaluate((div: HTMLElement) => {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    await this.page.waitForTimeout(500);
  }

  /**
   * Verifies mandatory field validation error
   * @param fieldName The name of the field to check
   */
  async verifyMandatoryFieldError(fieldName: string): Promise<void> {
    const field = this.page.getByRole('textbox', { name: fieldName });
    const actualErrorMessage = await field.evaluate((el: HTMLInputElement) => el.validationMessage);
    console.log(`📋 Actual error message for "${fieldName}": "${actualErrorMessage}"`);
    await expect(actualErrorMessage).toContain('Please fill out this field');
  }
}