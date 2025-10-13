import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class ForgetPage extends BasePage {
  // Named roles/text used on the page — keep them as constants for maintainability
  private readonly forgotLinkText = 'Forgot Password?';
  private readonly loginLinkText = 'Login';
  private readonly mobileInputName = 'Enter Mobile Number';
  private readonly sendOtpButtonName = 'Send OTP';
  private readonly verifyOtpButtonName = 'Verify OTP';
  private readonly newPasswordName = 'Enter new password';
  private readonly confirmPasswordName = 'Confirm new password';
  private readonly resetPasswordButtonName = 'Reset Password';

  // Locators
  readonly forgotLink: Locator;
  readonly loginLink: Locator;
  readonly mobileInput: Locator;
  readonly sendOtpButton: Locator;
  readonly verifyOtpButton: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetPasswordButton: Locator;

  // Common messages used in assertions
  readonly otpVerifiedMessage = 'OTP verified successfully.';
  readonly passwordResetSuccessMessage = 'Password reset successfully!';

  constructor(page: Page) {
    super(page);
    this.forgotLink = this.page.getByRole('link', { name: this.forgotLinkText });
    this.loginLink = this.page.getByRole('link', { name: this.loginLinkText });
    this.mobileInput = this.page.getByRole('textbox', { name: this.mobileInputName });
    this.sendOtpButton = this.page.getByRole('button', { name: this.sendOtpButtonName });
    this.verifyOtpButton = this.page.getByRole('button', { name: this.verifyOtpButtonName });
    this.newPasswordInput = this.page.getByRole('textbox', { name: this.newPasswordName });
    this.confirmPasswordInput = this.page.getByRole('textbox', { name: this.confirmPasswordName });
    this.resetPasswordButton = this.page.getByRole('button', { name: this.resetPasswordButtonName });
  }

  // --- Navigation / basic actions ---
  async openForgotPassword() {
    await this.forgotLink.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  // --- Mobile / OTP flow ---
  async fillMobile(mobile: string) {
    await this.mobileInput.click();
    await this.mobileInput.fill(mobile);
  }

  async sendOtp(mobile?: string) {
    if (typeof mobile === 'string') {
      await this.fillMobile(mobile);
    }
    await this.sendOtpButton.click();
  }

  async clickVerifyOtp() {
    await this.verifyOtpButton.click();
  }

  async verifyOtp() {
    await this.clickVerifyOtp();
    await this.page.getByText(this.otpVerifiedMessage).waitFor({ timeout: 8000 });
    await expect(this.page.getByText(this.otpVerifiedMessage)).toBeVisible();
  }

  // --- Password reset flow ---
  async enterNewPassword(password: string) {
    await this.newPasswordInput.click();
    await this.newPasswordInput.fill(password);
  }

  async enterConfirmPassword(password: string) {
    await this.confirmPasswordInput.click();
    await this.confirmPasswordInput.fill(password);
  }

  async clickResetPassword() {
    await this.resetPasswordButton.click();
  }

  async isResetDisabled(): Promise<boolean> {
    return this.resetPasswordButton.isDisabled();
  }

  async expectPasswordResetSuccess() {
    await this.page.getByText(this.passwordResetSuccessMessage).waitFor({ timeout: 8000 });
    await expect(this.page.getByText(this.passwordResetSuccessMessage)).toBeVisible();
  }

  // Convenience: run through OTP verification then return to caller for password steps
  async completeOtpFlow(mobile: string) {
    await this.sendOtp(mobile);
    await this.page.waitForTimeout(5000);
    // small wait if backend takes time to enable verify
    await this.verifyOtp();
  }

  async verifyMandatoryFieldError(fieldName: string) {
  const field = this.page.getByRole('textbox', { name: fieldName });
  const actualErrorMessage = await field.evaluate((el: HTMLInputElement) => el.validationMessage);
  console.log(`📋 Actual error message for "${fieldName}": "${actualErrorMessage}"`);
  await expect(actualErrorMessage).toBe('Please fill out this field.');
}
}
