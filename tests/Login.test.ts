import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';

const BASE_URL = process.env.BASE_URL || testData.url;

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo(BASE_URL);
  });

  test('Login with valid username and password', async () => {
    await loginPage.verifyLoginPageElements();
    await loginPage.login(testData.validUser.username, testData.validUser.password);
  });

  test('Login attempt with valid username and invalid password', async () => {
    await loginPage.enterUsername(testData.validUser.username);
    await loginPage.enterPassword(testData.invalidUser.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyInvalidLogin();
  });

  test('Login attempt with Invalid Mobile and valid password', async () => {
    await loginPage.enterUsername(testData.invalidUser.username);
    await loginPage.enterPassword(testData.validUser.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyInvalidLogin();
  });

  test('Verify Login with Invalid Mobile/Email and valid password', async () => {
    await loginPage.enterUsername(testData.invalidUser.username2);
    await loginPage.enterPassword(testData.validUser.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyInvalidLoginMessage();
  });

  test('Verify Mandatory Fields Validation', async () => {
    await loginPage.enterUsername('');
    await loginPage.enterPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyMandatoryFieldError(loginPage.USERNAME_FIELD);
    await loginPage.verifyMandatoryFieldError(loginPage.PASSWORD_FIELD);
  });

  test('Verify Forgot Password Link', async () => {
    await loginPage.clickForgotPassword();
    await loginPage.verifyHeading('Forgot Password');
  });

  test('Verify Sign Up Link', async () => {
    await loginPage.clickSignUp();
    await loginPage.verifyHeading('Registration');
  });

  test('Verify Login with Invalid Mobile/Email and without entering password', async () => {
    await loginPage.enterUsername(testData.invalidUser.username);
    await loginPage.enterPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyMandatoryFieldError(loginPage.PASSWORD_FIELD);
  });

  test('Verify Login with valid Password and without entering Email', async () => {
    await loginPage.enterUsername('');
    await loginPage.enterPassword(testData.validUser.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyMandatoryFieldError(loginPage.USERNAME_FIELD);
  });
});