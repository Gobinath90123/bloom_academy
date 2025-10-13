import { Page, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class LoginPage extends BasePage {
  private usernameField = 'Mobile No / Email ID *';
  private passwordField = 'Password *';
  private loginButton = 'Login';
  private successMessage = 'Login successful!';

  constructor(page: Page) {
    super(page);
  }

  async enterUsername(username: string) {
    await this.page.getByRole('textbox', { name: this.usernameField }).fill(username);
  }

  async enterPassword(password: string) {
    await this.page.getByRole('textbox', { name: this.passwordField }).fill(password);
  }

  async clickLoginButton() {
    await this.page.getByRole('button', { name: this.loginButton }).click();
  }

  async handlePopups() {
    // Clicking buttons with empty text if needed
    const buttons = this.page.getByRole('button').filter({ hasText: /^$/ });
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }
  }

  async verifyLoginSuccess() {
    await this.page.getByText(this.successMessage).click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.handlePopups();
    await this.clickLoginButton();
    await this.verifyLoginSuccess();
  }
}
