import { Page, Locator, expect } from '@playwright/test';

export class MockTestPage {
    readonly page: Page;
    readonly sectionLocator: Locator;
    readonly cardLocator: Locator;
    readonly takeTestButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sectionLocator = page.locator("//ul[@class='space-y-1']/li//div");
        this.cardLocator = page.locator("//div[@class='bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-300 cursor-pointer']");
        this.takeTestButton = page.locator("(//button[contains(text(), 'Take Test')])[1]");
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
        await this.page.locator("//ul[@class='space-y-1']/li//div", { hasText: sectionName }).click();
        // Click the first card (test)
        await this.cardLocator.first().click();
        await this.cardLocator.first().click();
        await this.takeTestButton.click();
        await expect(this.page.getByRole('heading', { name: 'Mock Test Instructions' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Continue →' })).toBeVisible();
        await this.page.getByRole('button', { name: 'Continue →' }).click();

    }

    async skipAllQuestionsAndSubmit() {

        const container = this.page.getByRole('button', { name: 'Skip' });
        await container.evaluate((el) => {
            el.scrollTop = el.scrollHeight; // scroll to bottom of container
        });

        for (let i = 0; i < 100; i++) {
            
            const skipBtn = this.page.getByRole('button', { name: 'Skip' });
            if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await skipBtn.click();
            } else {
                break;
            }
        }
        // Submit flow
        await this.page.waitForTimeout(2000); // waits for 2 seconds
        await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await this.page.getByRole('button', { name: 'Submit' }).click();
        await expect(this.page.getByRole('heading', { name: 'Alert!' })).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Submit →' })).toBeVisible();
        await this.page.getByRole('button', { name: 'Submit →' }).click();
        await expect(this.page.getByRole('heading', { name: 'Success!' })).toBeVisible();
        await expect(this.page.getByText('Your test has been submitted')).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
        await this.page.waitForTimeout(2000); // waits for 2 seconds
        await this.page.getByRole('button', { name: 'Go to Dashboard' }).click();
        await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    }
}