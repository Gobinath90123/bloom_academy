import { Page, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goToHomeFromBanner() {
    await this.page.getByRole('banner').getByRole('link', { name: 'Home' }).click();
  }

  async expectHeroHeadings() {
    await expect(this.page.getByRole('heading', { name: 'Good Coaching is' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Good Teaching &' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Nothing Else.' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'View Courses' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Watch Video' })).toBeVisible();
  }

  async navigateToExternal(url: string) {
    await this.page.goto(url);
  }

  async expectCareerSectionHeadings() {
    await expect(this.page.getByRole('heading', { name: 'To identify your Future' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Take Test' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Blooms Academy is a unit of' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Our Programmes' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Mentors and Councellors' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'What Experts Say About Blooms' })).toBeVisible();
  }
}
