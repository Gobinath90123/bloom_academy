import { BasePage } from './Basepage';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  public usernameField = 'Mobile No / Email ID *';
  public passwordField = 'Password *';
  private loginButton = 'Login';
  private successMessage = 'Login successful!';
  private logoAltText = 'Tuluk Logo';
  private errorMessageSelector = 'role=status';
  private forgotPasswordLink = 'Forgot Password?';
  private errorMessageInvalid = 'Please enter valid login';
  private signUpLink = 'Sign Up';
  private togglePasswordButton = 'button[aria-label="toggle password visibility"]';

  constructor(page: any) {
    super(page);
  }

  // Verify all login page elements
  async verifyLoginPageElements() {
    await this.expectTextVisible(this.usernameField);
    await this.expectTextVisible(this.passwordField);
    await this.expectRoleVisible('button', this.loginButton);
    await this.expectRoleVisible('img', this.logoAltText);
    await this.expectRoleVisible('heading', 'Login');
    await this.expectTextVisible('Enter your credentials to');
    await this.expectTextVisible('Do not have an account? Sign');
  }

  async enterUsername(username: string) {
    await this.fillByRole('textbox', this.usernameField, username);
  }

  async enterPassword(password: string) {
    await this.fillByRole('textbox', this.passwordField, password);
  }

  async clickLoginButton() {
    await this.clickByRole('button', this.loginButton);
  }

  async verifyLoginSuccess() {
    await this.expectTextVisible(this.successMessage);
  }

  async verifyInvalidLogin() {
  await this.expectTextVisible(this.errorMessageInvalid);
}

 async clickForgotPassword() {
    await this.clickByRole('link', this.forgotPasswordLink);
  }

 async clickSignUp() {
    await this.clickByRole('link', this.signUpLink);
  }

  
  async verifyHeading(headingText: string) {
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.verifyLoginSuccess();
  }

   async verifyInvalidLoginMessage() {
    await expect(this.page.getByRole('status')).toBeVisible();
  }

  async verifyMandatoryFieldError(fieldName: string) {
  const field = this.page.getByRole('textbox', { name: fieldName });
  const actualErrorMessage = await field.evaluate((el: HTMLInputElement) => el.validationMessage);
  console.log(`📋 Actual error message for "${fieldName}": "${actualErrorMessage}"`);
  await expect(actualErrorMessage).toBe('Please fill out this field.');
}
}
