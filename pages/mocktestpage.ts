import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class MockTestPage extends BasePage {
  readonly page: Page;
  readonly sectionLocator: Locator;
  readonly cardLocator: Locator;
  readonly takeTestButton: Locator;

  private selectors = {
    section: "//ul[@class='space-y-1']/li//div",
    card: "//div[@class='bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 cursor-pointer']",
    takeTestBtn: "(//button[contains(text(), 'Take Test')])[1]",
    questionTitle: "//div[@class='text-lg font-semibold']",
    optionSpan: "(//div[contains(@class, 'flex flex-col gap-4 mb-6')]/button/span[contains(@class, 'font-bold')])",
    submitBtn: "//button[normalize-space()='Submit']",
    alertHeading: "//h2[normalize-space()='Alert!']",
    alertText: "//p[@class='text-gray-700 mb-4']",
    questionsSummary: "//div[@class='text-gray-700']",
    resultItems: "//div[@class='mb-2 text-black-700 font-bold']",
    dashboardBtn: "//button[normalize-space()='Go to Dashboard']",
  };

  constructor(page: Page) {
    super(page);
    this.sectionLocator = page.locator(this.selectors.section);
    this.cardLocator = page.locator(this.selectors.card);
    this.takeTestButton = page.locator(this.selectors.takeTestBtn);
  }

  async goto() {
    await this.page.goto('https://staging.bloomscareer.com/mock-test');
    await expect(this.page.locator('h1').filter({ hasText: 'Blooms Academy' })).toBeVisible();
  }

  async printSectionTitles() {
    const count = await this.sectionLocator.count();
    console.log(`Total sections found: ${count}`);
    for (let i = 0; i < count; i++) {
      const title = await this.sectionLocator.nth(i).innerText();
      console.log(`Section ${i + 1} Title: ${title}`);
    }
  }

  async printAllSectionCardTitles() {
    const sectionCount = await this.sectionLocator.count();
    for (let i = 0; i < sectionCount; i++) {
      const section = this.sectionLocator.nth(i);
      const sectionTitle = await section.innerText();
      console.log(`\nSection ${i + 1} Title: ${sectionTitle}`);
      await section.click();
      await this.page.waitForTimeout(500); // Wait for cards to load
      const cards = this.cardLocator;
      const cardCount = await cards.count();
      console.log(`Total cards found in "${sectionTitle}": ${cardCount}`);
      for (let j = 0; j < cardCount; j++) {
        const cardTitle = await cards.nth(j).locator('.font-semibold').innerText();
        console.log(`Card ${j + 1} Title: ${cardTitle}`);
      }
    }
  }

  async takeFirstTestInSection(sectionName: string) {
    // Click the section by name
    await this.page.locator(this.selectors.section, { hasText: sectionName }).click();
    // Click the first card (test)
    await this.cardLocator.first().click();
    await this.cardLocator.first().click();
    await this.takeTestButton.click();
    await expect(this.page.getByRole('heading', { name: 'Mock Test Instructions' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Continue →' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Continue →' }).click();
  }

  async printTextByLocator(locatorStr: string) {
    const locator = this.page.locator(locatorStr);
    await expect(locator).toBeVisible();
    const text = await locator.innerText();
    await this.page.waitForTimeout(2000);
    console.log(`Text for given Locator: ${text}`);
  }

  private async scrollToBottomOfContainer(buttonLocator: Locator) {
    // helper to ensure scrolled position so Continue/Skip are reachable
    await buttonLocator.evaluate((el: HTMLElement) => {
      el.scrollTop = el.scrollHeight;
    });
  }

  async allQuestionsAndSubmit(action: 'Skip' | 'Continue', optionIndex: number) {
    const skipBtn = this.page.getByRole('button', { name: 'Skip' });
    const continueBtn = this.page.getByRole('button', { name: 'Continue →' });
    const submitBtn = this.page.locator(this.selectors.submitBtn);

    for (let i = 0; i < 200; i++) {
      // Early exit if Submit is visible
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) break;
      const element = this.page.locator(this.selectors.questionTitle);
      const text = await element.innerText().catch(() => '');
      if (text) console.log('Question:', text.trim());

      // Always scroll to bottom before each action
      await this.scrollToBottomOfContainer(skipBtn);

      if (action === 'Skip') {
        if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await skipBtn.click();
        } else {
          break;
        }
      } else if (action === 'Continue') {
        const options = ['1', '2', '3', '4'];
        const tryOrder = [
          options[optionIndex - 1],
          ...options.filter((_, idx) => idx !== optionIndex - 1)
        ];
        let clicked = false;
        for (const opt of tryOrder) {
          const optBtn = this.page.locator(`${this.selectors.optionSpan}[${opt}]`);
          if (await optBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await optBtn.click();
            const option = await optBtn.innerText().catch(() => '');
            console.log('Answer:', option.trim());
            clicked = true;
            break;
          }
        }

        // Scroll again before clicking Continue
        await this.scrollToBottomOfContainer(skipBtn);
        if (clicked && await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await continueBtn.click();
        } else if (!clicked) {
          break;
        }
      } else {
        throw new Error(`Unknown action: ${action}`);
      }
    }
    return;
  }

  async submitTest(): Promise<{ alertText: string; questionsAnswered: string }> {
    const submitBtn = this.page.locator(this.selectors.submitBtn);
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    await expect(this.page.locator(this.selectors.alertHeading)).toBeVisible();

    const alertLocator = this.page.locator(this.selectors.alertText);
    await expect(alertLocator).toBeVisible();
    const alertText = await alertLocator.innerText();

    await this.page.waitForTimeout(500);
    const questionsLocator = this.page.locator(this.selectors.questionsSummary);
    let questionsAnswered = '';
    if (await questionsLocator.count() > 0) {
      questionsAnswered = await questionsLocator.first().innerText();
    }

    const submitConfirmBtn = this.page.getByRole('button', { name: 'Submit →' });
    await expect(submitConfirmBtn).toBeVisible();
    await submitConfirmBtn.click();
    return { alertText, questionsAnswered };
  }

  async verifyTestSubmitted() {
    await expect(this.page.getByRole('heading', { name: 'Success!' })).toBeVisible();
    await expect(this.page.getByText('Your test has been submitted')).toBeVisible();

    const resultsLocator = this.page.locator(this.selectors.resultItems);
    const total = await resultsLocator.count();
    const toRead = Math.min(5, total);
    for (let i = 0; i < toRead; i++) {
      const el = resultsLocator.nth(i);
      await expect(el).toBeVisible({ timeout: 5000 });
      const result = await el.innerText();
      console.log(`Result ${i + 1}: ${result}`);
    }
  }

  async goToDashboardAfterSubmission() {
    const dashboardBtn = this.page.locator(this.selectors.dashboardBtn);
    await expect(dashboardBtn).toBeVisible();
    await dashboardBtn.click();
    await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  }
}