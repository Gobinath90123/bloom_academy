import { Page, expect } from '@playwright/test';
import { BasePage } from './Basepage';

type CardInfo = { title: string; examDate: string };

export class ExamUpdatesPage extends BasePage {
  private selectors = {
    bannerExamLink: "role=banner >> role=link[name='Exam Updates']",
    categoryButton: (name: string) => `role=button[name='${name}']`,
    gridContainer: "xpath=//div[contains(@class, 'relative overflow-hidden')]",
    // scoped from grid container; use xpath to avoid CSS parsing errors
    gridTitle: "xpath=.//div//h3",
    sectionCard: "xpath=//div[contains(@class, 'bg-white') and contains(@class, 'rounded-xl')]",
    examDateRel: "xpath=.//span[contains(., 'Exam Date')]//p",
    headingByName: (name: string) => `role=heading[name='${name}']`,
  } as const;

  private gridContainerLocator: ReturnType<Page['locator']>;
  private cardsLocator: ReturnType<Page['locator']>;

  constructor(page: Page) {
    super(page);
    // initialize locators after BasePage has set this.page
    this.gridContainerLocator = this.page.locator(this.selectors.gridContainer);
    this.cardsLocator = this.page.locator(this.selectors.sectionCard);
  }

  async goToExamUpdatesFromBanner() {
    await this.page.getByRole('banner').getByRole('link', { name: 'Exam Updates' }).click();
  }

  async navigateToExternal(url: string) {
    await this.navigateTo(url);
  }

  /**
   * Open a category (e.g. "Previous Exam Previous Exam") and wait until the grid is visible.
   */
  async openCategory(category: string, timeout = 5000) {
    await this.page.getByRole('button', { name: category }).click();
    await this.gridContainerLocator.first().waitFor({ state: 'visible', timeout });
  }

  /**
   * Return the list of trimmed titles within the current category grid.
   */
  async getCategoryExamTitles(): Promise<string[]> {
    const titlesLocator = this.gridContainerLocator.locator(this.selectors.gridTitle);
    const raw = await titlesLocator.allTextContents();
    return raw.map(t => t.trim()).filter(Boolean);
  }

  /**
   * Open a subsection heading (e.g. 'AFTER DIPLOMA') and wait for cards to render.
   */
  async openSubCategory(subCategory: string, timeout = 5000) {
    await this.page.getByRole('heading', { name: subCategory }).click();
    await this.cardsLocator.first().waitFor({ state: 'visible', timeout });
  }

  private async safeText(locator: ReturnType<Page['locator']>): Promise<string | null> {
    try {
      const c = await locator.count();
      if (c === 0) return null;
      const txt = await locator.first().innerText();
      return txt ? txt.trim() : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Return an array of cards under the current section with title and examDate.
   */
  async getSectionCards(): Promise<CardInfo[]> {
    const result: CardInfo[] = [];
    const count = await this.cardsLocator.count();
    for (let i = 0; i < count; i++) {
      const card = this.cardsLocator.nth(i);
      const title = (await this.safeText(card.locator('h3'))) ?? '(no title)';
      const examDate = (await this.safeText(card.locator(this.selectors.examDateRel))) ?? 'N/A';
      result.push({ title, examDate });
    }
    return result;
  }
}