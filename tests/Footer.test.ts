import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { FooterPage } from '../pages/Footerpage';
import { testData } from '../test-data/testData';
const baseURL = process.env.BASE_URL;

test.describe('Footer Test Functionality', () => {
  let footerPage: FooterPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    footerPage = new FooterPage(page);
    await loginPage.navigateTo(process.env.BASE_URL as string);
    await loginPage.login(testData.validUser.username, testData.validUser.password);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  });

  test('Verify footer details Contact details', async () => {
    await footerPage.verifyFooterDetails();
    await footerPage.printFooterTitles();
  });

  test('Verify clicking Play Store link opens new tab and redirects correctly', async () => {
    await footerPage.clickPlayStoreLinkAndVerify();
  });

  //   test('Verify clicking App Store link opens new tab and redirects correctly', async () => {
  //   await footerPage.clickAppStoreLinkAndVerify();
  // });

  test('Verify social media links are visible and clickable', async () => {
    await footerPage.verifySocialLinks();
  });

  test('Verify Subscribe to News Letter Functionality', async ({ page }) => {
    await footerPage.subscribeWithRandomEmail();
  });

  test('Verify Subscribe to News Letter Functionality already existing user', async ({ page }) => {
    await footerPage.subscribeExistingEmail(testData.SubscribetoNewsLetterData.email);
  });

});