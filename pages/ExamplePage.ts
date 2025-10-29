import { Page, Locator } from '@playwright/test';
import { BasePage } from './Basepage';

/**
 * ExamplePage demonstrates the standard format for creating new page objects
 * Follow this structure when implementing new pages
 */
export class ExamplePage extends BasePage {
  // Define constants for element texts/labels
  private readonly EXAMPLE_HEADING = 'Example Page';
  private readonly USERNAME_INPUT_LABEL = 'Username';
  private readonly PASSWORD_INPUT_LABEL = 'Password';
  private readonly LOGIN_BUTTON_TEXT = 'Login';
  private readonly SUCCESS_MESSAGE = 'Login successful!';
  
  // Define locators as readonly properties
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize locators in constructor
    this.usernameInput = this.getByRole('textbox', this.USERNAME_INPUT_LABEL);
    this.passwordInput = this.getByRole('textbox', this.PASSWORD_INPUT_LABEL);
    this.loginButton = this.getByRole('button', this.LOGIN_BUTTON_TEXT);
  }

  /**
   * Verifies all example page elements are present
   */
  async verifyPageElements(): Promise<void> {
    await this.expectRoleVisible('heading', this.EXAMPLE_HEADING);
    await this.expectRoleVisible('textbox', this.USERNAME_INPUT_LABEL);
    await this.expectRoleVisible('textbox', this.PASSWORD_INPUT_LABEL);
    await this.expectRoleVisible('button', this.LOGIN_BUTTON_TEXT);
  }

  /**
   * Enters username in the username field
   * @param username The username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillByRole('textbox', this.USERNAME_INPUT_LABEL, username);
  }

  /**
   * Enters password in the password field
   * @param password The password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillByRole('textbox', this.PASSWORD_INPUT_LABEL, password);
  }

  /**
   * Clicks the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickByRole('button', this.LOGIN_BUTTON_TEXT);
  }

  /**
   * Verifies successful login by checking for success message
   */
  async verifyLoginSuccess(): Promise<void> {
    await this.expectTextVisible(this.SUCCESS_MESSAGE);
  }

  /**
   * Performs complete login flow
   * @param username The username to login with
   * @param password The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.verifyLoginSuccess();
  }
}