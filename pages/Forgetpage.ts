import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

/**
 * ForgetPage represents the forgot password page of the application
 * Implements page object model pattern for test automation
 */
export class ForgetPage extends BasePage {
  // Named roles/text used on the page — keep them as constants for maintainability
  private readonly FORGOT_LINK_TEXT = 'Forgot Password?';
  private readonly LOGIN_LINK_TEXT = 'Login';
  private readonly MOBILE_INPUT_NAME = 'Enter Mobile Number';
  private readonly SEND_OTP_BUTTON_NAME = 'Send OTP';
  private readonly VERIFY_OTP_BUTTON_NAME = 'Verify OTP';
  private readonly NEW_PASSWORD_NAME = 'Enter new password';
  private readonly CONFIRM_PASSWORD_NAME = 'Confirm new password';
  private readonly RESET_PASSWORD_BUTTON_NAME = 'Reset Password';

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
  readonly OTP_VERIFIED_MESSAGE = 'OTP verified successfully.';
  readonly PASSWORD_RESET_SUCCESS_MESSAGE = 'Password reset successfully!';

  constructor(page: Page) {
    super(page);
    this.forgotLink = this.getByRole('link', this.FORGOT_LINK_TEXT);
    this.loginLink = this.getByRole('link', this.LOGIN_LINK_TEXT);
    this.mobileInput = this.getByRole('textbox', this.MOBILE_INPUT_NAME);
    this.sendOtpButton = this.getByRole('button', this.SEND_OTP_BUTTON_NAME);
    this.verifyOtpButton = this.getByRole('button', this.VERIFY_OTP_BUTTON_NAME);
    this.newPasswordInput = this.getByRole('textbox', this.NEW_PASSWORD_NAME);
    this.confirmPasswordInput = this.getByRole('textbox', this.CONFIRM_PASSWORD_NAME);
    this.resetPasswordButton = this.getByRole('button', this.RESET_PASSWORD_BUTTON_NAME);
  }

  /**
   * Opens the forgot password page by clicking the forgot password link
   */
  async openForgotPassword(): Promise<void> {
    await this.forgotLink.click();
  }

  /**
   * Navigates back to the login page
   */
  async goToLogin(): Promise<void> {
    await this.page.waitForTimeout(2000);
    await this.loginLink.click();
  }

  /**
   * Fills the mobile number field
   * @param mobile The mobile number to fill
   */
  async fillMobile(mobile: string): Promise<void> {
    await this.mobileInput.click();
    await this.mobileInput.fill(mobile);
  }

  /**
   * Sends OTP after filling mobile number
   * @param mobile Optional mobile number to fill before sending OTP
   */
  async sendOtp(mobile?: string): Promise<void> {
    if (typeof mobile === 'string') {
      await this.fillMobile(mobile);
    }
    await this.sendOtpButton.click();
  }

  /**
   * Clicks the verify OTP button
   */
  async clickVerifyOtp(): Promise<void> {
    await this.verifyOtpButton.click();
  }

  /**
   * Verifies OTP by clicking verify button and checking success message
   */
  async verifyOtp(): Promise<void> {
    await this.clickVerifyOtp();
    await this.waitForVisible(this.getByText(this.OTP_VERIFIED_MESSAGE), 8000);
    await this.expectTextVisible(this.OTP_VERIFIED_MESSAGE);
  }

  /**
   * Enters new password
   * @param password The new password to enter
   */
  async enterNewPassword(password: string): Promise<void> {
    await this.newPasswordInput.click();
    await this.newPasswordInput.fill(password);
  }

  /**
   * Enters confirm password
   * @param password The confirm password to enter
   */
  async enterConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.click();
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Clicks the reset password button
   */
  async clickResetPassword(): Promise<void> {
    await this.resetPasswordButton.click();
  }

  /**
   * Checks if reset password button is disabled
   * @returns Promise resolving to true if button is disabled, false otherwise
   */
  async isResetDisabled(): Promise<boolean> {
    return this.resetPasswordButton.isDisabled();
  }

  /**
   * Expects password reset success message to be visible
   */
  async expectPasswordResetSuccess(): Promise<void> {
    await this.waitForVisible(this.getByText(this.PASSWORD_RESET_SUCCESS_MESSAGE), 8000);
    await this.expectTextVisible(this.PASSWORD_RESET_SUCCESS_MESSAGE);
  }

  /**
   * Completes the OTP flow
   * @param mobile The mobile number to use for OTP
   */
  async completeOtpFlow(mobile: string): Promise<void> {
    await this.sendOtp(mobile);
    await this.page.waitForTimeout(5000);
    // small wait if backend takes time to enable verify
    await this.verifyOtp();
  }

  /**
   * Toggles visibility of new password field
   */
  async toggleNewPasswordVisibility(): Promise<void> {
    await this.page.locator("(//button[@type='button'])[1]").click();
  }

  /**
   * Toggles visibility of confirm password field
   */
  async toggleConfirmPasswordVisibility(): Promise<void> {
    await this.page.locator("(//button[@type='button'])[2]").click();
  }

  /**
   * Gets the type attribute of new password input
   * @returns Promise resolving to the type attribute value
   */
  async getNewPasswordType(): Promise<string | null> {
    return this.newPasswordInput.getAttribute('type');
  }

  /**
   * Gets the type attribute of confirm password input
   * @returns Promise resolving to the type attribute value
   */
  async getConfirmPasswordType(): Promise<string | null> {
    return this.confirmPasswordInput.getAttribute('type');
  }

  /**
   * Expects new password input to have specific type
   * @param expected The expected type ('text' or 'password')
   */
  async expectNewPasswordType(expected: 'text' | 'password'): Promise<void> {
    await this.newPasswordInput.waitFor();
    await expect(this.newPasswordInput).toHaveAttribute('type', expected);
  }

  /**
   * Expects confirm password input to have specific type
   * @param expected The expected type ('text' or 'password')
   */
  async expectConfirmPasswordType(expected: 'text' | 'password'): Promise<void> {
    await this.confirmPasswordInput.waitFor();
    await expect(this.confirmPasswordInput).toHaveAttribute('type', expected);
  }
}