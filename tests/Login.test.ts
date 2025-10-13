import { test } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';
const baseURL = process.env.BASE_URL;

test.describe('Login Tests', () => {
test('Verify login to Blooms Career using POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo(baseURL);
  await loginPage.login(testData.username, testData.password);
});





});