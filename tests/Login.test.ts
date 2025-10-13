import { test } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';

test('Verify login to Blooms Career using POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo('https://staging.bloomscareer.com/login');
  await loginPage.login(testData.username, testData.password);
});
