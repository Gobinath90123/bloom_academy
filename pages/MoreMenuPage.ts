import { Page, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class MoreMenuPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Locators as getters
    get moreButton() {
        return this.page.getByRole('button', { name: 'More' });
    }

    get programmesLink() {
        return this.page.getByRole('link', { name: 'Programmes' }).first();
    }

    // Methods
    async clickMore() {
        await expect(this.moreButton).toBeVisible();
        await this.moreButton.click();
    }

    async verifyTopOptions(options: string[]) {
        for (const option of options) {
            await this.clickMore(); // Ensure dropdown opens
            const link = this.page.getByRole('link', { name: option }).first();
            await expect(link).toBeVisible();
            console.log(`Verified visibility of option: ${option}`);
        }
    }

    async navigateToURL(menuName: string, headingName: string) {
        await this.clickMore();
        const link = this.page.getByRole('link', { name: menuName }).first();
        await expect(link).toBeVisible();
        await link.click();
        await expect(this.page.getByRole('heading', { name: headingName })).toBeVisible();
        console.log(`Navigated to "${menuName}" and verified heading "${headingName}"`);
    }

    async verifyProgrammesSubOptions(subOptions: string[] = ['Undergraduate', 'Postgraduate', 'Diploma']) {
        await this.clickMore();
        await expect(this.programmesLink).toBeVisible();
        await this.programmesLink.hover();
        for (const subOption of subOptions) {
            const subLink = this.page.getByRole('link', { name: subOption });
            await expect(subLink).toBeVisible();
            console.log(`Verified visibility of sub-option: ${subOption}`);
        }
    }

    async navigateToProgramme(programmeName: string, headingName: string) {
        await this.page.waitForTimeout(1000); // Wait for any animations
        await this.clickMore();
        await this.verifyProgrammesSubOptions();
        const subLink = this.page.getByRole('link', { name: programmeName });
        await subLink.click();
        await expect(this.page.getByRole('heading', { name: headingName })).toBeVisible();
        console.log(`Clicked ${programmeName} and verified page heading`);
    }
}
