import { Page } from '@playwright/test';
import { BasePage } from './Basepage';
import { DashboardPage } from './DashboardPage';

/**
 * LoginPage represents the login page of the application
 * Implements page object model pattern for test automation
 */
export class LoginPage extends BasePage {
  // Constants for page elements
  readonly USERNAME_FIELD = 'Mobile No / Email ID *';
  readonly PASSWORD_FIELD = 'Password *';
  readonly LOGIN_BUTTON = 'Login';
  readonly LOGO_ALT_TEXT = 'Tuluk Logo';
  readonly FORGOT_PASSWORD_LINK = 'Forgot Password?';
  readonly SIGN_UP_LINK = 'Sign Up';
  
  // Common messages
  readonly SUCCESS_MESSAGE = 'Login successful!';
  readonly INVALID_LOGIN_MESSAGE = 'Please enter valid login';
  readonly ERROR_MESSAGE_SELECTOR = 'role=status';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verifies all login page elements are present
   */
  async verifyLoginPageElements(): Promise<void> {
    await this.expectTextVisible(this.USERNAME_FIELD);
    await this.expectTextVisible(this.PASSWORD_FIELD);
    await this.expectRoleVisible('button', this.LOGIN_BUTTON);
    await this.expectRoleVisible('img', this.LOGO_ALT_TEXT);
    await this.expectRoleVisible('heading', 'Login');
    await this.expectTextVisible('Enter your credentials to');
    await this.expectTextVisible('Do not have an account? Sign');
  }

  /**
   * Enters username in the username field
   * @param username The username to enter
   */
  async enterUsername(username: string): Promise<void> {
    const usernameField = this.page.getByRole('textbox', { name: this.USERNAME_FIELD });
    await usernameField.waitFor({ state: 'visible' });
    console.log(`📝 Entering username: ${username}`);
    await usernameField.fill(username);
    console.log('✅ Username entered successfully');

  }

  /**
   * Enters password in the password field
   * @param password The password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillByRole('textbox', this.PASSWORD_FIELD, password);
  }

  /**
   * Clicks the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickByRole('button', this.LOGIN_BUTTON);
  }

  /**
   * Verifies successful login by checking for success message
   */
  async verifyLoginSuccess(): Promise<void> {
    await this.expectTextVisible(this.SUCCESS_MESSAGE);
  }

  /**
   * Verifies invalid login by checking for error message
   */
  async verifyInvalidLogin(): Promise<void> {
    await this.expectTextVisible(this.INVALID_LOGIN_MESSAGE);
  }

  /**
   * Clicks the forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickByRole('link', this.FORGOT_PASSWORD_LINK);
  }

  /**
   * Clicks the sign up link
   */
  async clickSignUp(): Promise<void> {
    await this.clickByRole('link', this.SIGN_UP_LINK);
  }

  /**
   * Verifies a heading with specific text is visible
   * @param headingText The text of the heading to verify
   */
  async verifyHeading(headingText: string): Promise<void> {
    await this.expectRoleVisible('heading', headingText);
  }

  /**
   * Performs complete login flow
   * @param username The username to login with
   * @param password The password to login with
   */
  async login(username: string, password: string): Promise<void> {
    console.log('🚀 Starting login process...');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.verifyLoginSuccess();
  }

  /**
   * Verifies invalid login message is displayed
   */
  async verifyInvalidLoginMessage(): Promise<void> {
    await this.expectRoleVisible('status');
  }

  /**
   * Gets the dashboard page object
   * @returns DashboardPage instance
   */
  getDashboardPage(): DashboardPage {
    return new DashboardPage(this.page);
  }
}