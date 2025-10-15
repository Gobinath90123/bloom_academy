import { test } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';
const baseURL = process.env.BASE_URL;

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo(baseURL as string);
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
    await loginPage.verifyMandatoryFieldError(loginPage.usernameField);
    await loginPage.verifyMandatoryFieldError(loginPage.passwordField);
  });

  test('Verify Forgot Password Link', async () => {
    await loginPage.clickForgotPassword();
    await loginPage.verifyHeading('Forgot Password');
  });

  test('Verify Sign Up Link', async () => {
    await loginPage.clickSignUp();
    await loginPage.verifyHeading('Register');
  });

  test('Verify Login with Invalid Mobile/Email and without entering password', async () => {
    await loginPage.enterUsername(testData.invalidUser.username);
    await loginPage.enterPassword('');
    await loginPage.clickLoginButton();
    await loginPage.verifyMandatoryFieldError(loginPage.passwordField);
  });

  test('Verify Login with valid Password and without entering Email', async () => {
    await loginPage.enterUsername('');
    await loginPage.enterPassword(testData.validUser.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyMandatoryFieldError(loginPage.usernameField);
  });

});