import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { CpaqPage } from '../pages/CpaqPage';
import { testData } from '../test-data/testData';
const baseURL = process.env.BASE_URL || testData.url;

test.describe('TestCase: Navigate to CPAQ Test Page (Payment already done)', () => {

  test('Verify CPAQ Test page opens successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cpaqPage = new CpaqPage(page);
    await loginPage.navigateTo(baseURL);
    await loginPage.login(testData.paymentnonpaymentUser.username, testData.paymentnonpaymentUser.password);
    await cpaqPage.navigateToCpaqPage();
    await cpaqPage.verifyCpaqPageVisible();
    await page.getByRole('button', { name: 'Continue with CPAQ TEST   →' }).click();

    // Wait for either Payment Popup or Assessment Page to appear
    const paymentPopup = page.getByRole('heading', { name: 'Payment Popup' });
    const assessmentHeading = page.getByRole('heading', { name: 'Career and Personality Assessment Questionnaire(CPAQ) Test' });

    // Wait for one of the selectors to be visible (timeout 5s)
    let isPaymentPopupVisible = false;
    try {
      await paymentPopup.waitFor({ state: 'visible', timeout: 5000 });
      isPaymentPopupVisible = true;
    } catch {
      isPaymentPopupVisible = false;
    }

    if (isPaymentPopupVisible) {
      // Payment flow
      await expect(page.getByText('CPAQ Test Fee')).toBeVisible();
      await expect(page.getByRole('textbox').first()).toBeVisible();
      await expect(page.getByText('Promo Code', { exact: true })).toBeVisible();
      await expect(page.getByText('CPAQ Test Fee')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Payment Popup' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Proceed →' })).toBeVisible();
      await page.getByRole('button', { name: 'Apply' }).click();
      await expect(page.getByText('Please enter a promo code.')).toBeVisible();
      await page.getByRole('textbox', { name: '####' }).dblclick();
      await page.getByRole('textbox', { name: '####' }).fill('CPAQ');
      await page.getByRole('button', { name: 'Apply' }).click();
      await page.getByRole('textbox').first().click();
      await page.getByRole('button', { name: 'Proceed →' }).click();
      await expect(page.getByRole('heading', { name: 'Payment Details' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Continue with CPAQ   →' })).toBeVisible();
      await page.getByRole('button', { name: 'Continue with CPAQ   →' }).click();
      await cpaqPage.verifyAssessmentButtons();
      await page.getByRole('button', { name: '×' }).click();
      await page.goto('https://staging.bloomscareer.com/cpaq-test');
      //await page.getByRole('banner').getByRole('link', { name: 'Home' }).click();
    } else {
      // Assessment flow (if payment already done)
      await cpaqPage.verifyAssessmentButtons();
      await page.getByRole('button', { name: '×' }).click();
    }
  });

});