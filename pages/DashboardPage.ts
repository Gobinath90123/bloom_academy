import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './Basepage';

export class DashboardPage extends BasePage {
  readonly summarylocator: Locator;
  readonly mocktestReviewPageHeading: Locator;
  constructor(page: any) {
    super(page);
    this.summarylocator = page.locator("(//a[contains(@class,'text-blue-600') and normalize-space()='Summary'])[1]");
  }

  // Verify all login page elements

  getDashboardPage() {
    // Replace with actual DashboardPage import and implementation
    return new DashboardPage(this.page);
  }

  async clickSummaryLinkAndVerify() {
    await this.page.waitForTimeout(2000);
    await expect(this.summarylocator).toBeVisible();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.summarylocator.click(),
    ]);

    await newPage.waitForLoadState();
    const url = newPage.url();
    console.log(`New tab URL: ${url}`);
    expect(url).toContain('staging.bloomscareer.com/mock-test-review');
    await this.page.waitForTimeout(1000);
    const headingLocator = newPage.locator("//h1[@class='text-2xl font-bold text-red-600 mb-2']");
    await headingLocator.waitFor({ state: 'visible', timeout: 5000 });
    console.log(`Mock Test Review Page Heading is showed successfully`);
    await newPage.close();
  }


}
