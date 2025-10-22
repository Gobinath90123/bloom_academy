import { test, expect } from '@playwright/test';
import { ForgetPage } from '../pages/Forgetpage';
import { LoginPage } from '../pages/Loginpage';

test.describe('Forget Tests', () => {
  let forgetPage: ForgetPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo(process.env.BASE_URL as string);
    forgetPage = new ForgetPage(page);
    await forgetPage.openForgotPassword();
  });

  test('Verify Forgot Password Page Navigation', async ({ page }) => {
    await expect(forgetPage.mobileInput).toBeVisible();
  });

  test('Verify Mandatory Mobile Field', async ({ page }) => {
    await forgetPage.sendOtp();
    await forgetPage.verifyMandatoryFieldError('Mobile Number');
    });

  test('Verify Invalid Mobile Number', async ({ page }) => {
    await forgetPage.fillMobile('123456');
    await forgetPage.sendOtp();
    await expect(page.getByText('Mobile number must be 10')).toBeVisible();
  });

  test('Verify Valid Mobile Number OTP', async ({ page }) => {
    await forgetPage.fillMobile('1234567890');
    await forgetPage.sendOtp();
    await page.waitForTimeout(5000);
    await forgetPage.verifyOtp();
  });

  test('Verify Back to Login Link', async ({ page }) => {
    await forgetPage.goToLogin();
    });

  test('Verify Mandatory Password Fields', async ({ page }) => {
    await forgetPage.completeOtpFlow('1234567890');
    await page.waitForTimeout(2000);
    await expect(forgetPage.newPasswordInput).toBeVisible();
    await expect(forgetPage.confirmPasswordInput).toBeVisible();
    expect(await forgetPage.isResetDisabled()).toBeTruthy();
  });

  test('Verify Password Minimum Length', async ({ page }) => {
    await forgetPage.completeOtpFlow('1234567890');
    await forgetPage.enterNewPassword('12345');
    await forgetPage.enterConfirmPassword('12345');
    await forgetPage.clickResetPassword();
    await expect(page.getByText('Password must be at least 6 characters.')).toBeVisible();
  });

  test('Verify Password and Confirm Password Match', async ({ page }) => {
    await forgetPage.completeOtpFlow('1234567890');
    await forgetPage.enterNewPassword('1234567890');
    await forgetPage.enterConfirmPassword('123456789');
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('Verify Successful Password Set', async ({ page }) => {
    await forgetPage.completeOtpFlow('1234567890');
    await forgetPage.enterNewPassword('1234567890');
    await forgetPage.enterConfirmPassword('1234567890');
    await forgetPage.clickResetPassword();
    await forgetPage.expectPasswordResetSuccess();
  });

  test('Verify Show/Hide Password Toggle', async ({ page }) => {
    await forgetPage.completeOtpFlow('1234567890');
    await forgetPage.enterNewPassword('1234567890');
    await forgetPage.enterConfirmPassword('1234567890');

  // initially the inputs should be of type password
  await forgetPage.expectNewPasswordType('password');
  await forgetPage.expectConfirmPasswordType('password');

  // toggle to show
  await forgetPage.toggleNewPasswordVisibility();
  await forgetPage.expectNewPasswordType('text');

  await forgetPage.toggleConfirmPasswordVisibility();
  await forgetPage.expectConfirmPasswordType('text');

  // toggle back to hide
  await forgetPage.toggleNewPasswordVisibility();
  await forgetPage.expectNewPasswordType('password');

  await forgetPage.toggleConfirmPasswordVisibility();
  await forgetPage.expectConfirmPasswordType('password');
  });
});