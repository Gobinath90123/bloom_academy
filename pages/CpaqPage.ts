import { expect, Page } from '@playwright/test';
import { BasePage } from './Basepage';

export class CpaqPage extends BasePage {
  private cpaqLink = 'CPAQ Test';
  private headingCareerPersonality = 'CAREER AND PERSONALITY';
  private headingCongratulations = 'Congratulations';

  constructor(page: Page) {
    super(page);
  }

  async navigateToCpaqPage() {
    await this.clickByRole('link', this.cpaqLink);
  }
  
  async verifyCpaqPageVisible() {
    await expect(this.page.getByRole('heading', { name: this.headingCareerPersonality })).toBeVisible();
  }

  async verifyAssessmentButtons() {
  await expect(this.page.getByRole('heading', { name: 'Career and Personality Assessment Questionnaire(CPAQ) Test' })).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Proceed to Career Assessment' })).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Proceed to Personality' })).toBeVisible();
  }
}
