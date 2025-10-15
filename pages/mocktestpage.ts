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

    // async skipAllQuestionsAndSubmit(action: string, optionIndex: number) {
    //     for (let i = 0; i < 200; i++) {
    //         switch (action.toLowerCase()) {
    //             case 'skip': {
    //                 const container = this.page.getByRole('button', { name: 'Skip' });
    //                 await container.evaluate((el) => {
    //                     el.scrollTop = el.scrollHeight; // scroll to bottom of container
    //                 });
    //                 const skipBtn = this.page.getByRole('button', { name: 'Skip' });
    //                 if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    //                     await skipBtn.click();
    //                 } else {
    //                     i = 100; // exit loop
    //                 }
    //                 break;
    //             }
    //             case 'continue': {
    //                 const options = ['1', '2', '3', '4'];
    //                 let clicked = false;
    //                 const tryOrder = [
    //                     options[optionIndex - 1], // user-selected (1-based)
    //                     ...options.filter((_, idx) => idx !== optionIndex - 1)
    //                 ];
    //                 for (const opt of tryOrder) {
    //                     const optBtn = this.page.locator(
    //                         "(//div[contains(@class, 'flex flex-col gap-4 mb-6')]/button/span[contains(@class, 'font-bold')])[" + opt + "]"
    //                     );
    //                     if (await optBtn.isVisible({ timeout: 000 }).catch(() => false)) {
    //                         await optBtn.click();
    //                         clicked = true;
    //                         break;
    //                     }
    //                 }
    //                 if (clicked) {
    //                     const container = this.page.getByRole('button', { name: 'Skip' });
    //                     await container.evaluate((el) => {
    //                         el.scrollTop = el.scrollHeight; // scroll to bottom of container
    //                     });
    //                     const continueBtn = this.page.getByRole('button', { name: 'Continue →' });
    //                     if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    //                         await continueBtn.click();
    //                     }
    //                 } else {
    //                     i = 100; // exit loop if no option found
    //                 }
    //                 break;
    //             }
    //             default:
    //                 throw new Error(`Unknown action: ${action}`);
    //         }

    //         // Check if Submit button is visible to break early
    //         const submitBtn = this.page.getByRole('button', { name: 'Submit' });
    //         if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    //             break;
    //         }
    //     }

    //     // Submit flow
    //     await expect(this.page.getByRole('button', { name: 'Submit' })).toBeVisible();
    //     await this.page.getByRole('button', { name: 'Submit' }).click();
    //     await expect(this.page.getByRole('heading', { name: 'Alert!' })).toBeVisible();
    //     await expect(this.page.getByRole('button', { name: 'Submit →' })).toBeVisible();
    //     await this.page.getByRole('button', { name: 'Submit →' }).click();
    //     await expect(this.page.getByRole('heading', { name: 'Success!' })).toBeVisible();
    //     await expect(this.page.getByText('Your test has been submitted')).toBeVisible();
    //     await expect(this.page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
    //     await this.page.getByRole('button', { name: 'Go to Dashboard' }).click();
    //     await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    // }

    async printTextByLocator(locatorStr: string) {
        const locator = this.page.locator(locatorStr);
        await expect(locator).toBeVisible();
        const text = await locator.innerText();
        await this.page.waitForTimeout(2000);
        console.log(`Text for given Locator: ${text}`);
    }



    async allQuestionsAndSubmit(action: string, optionIndex: number) {
        const skipBtn = this.page.getByRole('button', { name: 'Skip' });
        const continueBtn = this.page.getByRole('button', { name: 'Continue →' });
        const submitBtn = this.page.getByRole('button', { name: 'Submit' });

        for (let i = 0; i < 200; i++) {
            // Early exit if Submit is visible
            if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) break;
            const element = this.page.locator("//div[@class='text-lg font-semibold']");
            const text = await element.innerText();
            console.log('Question:', text.trim());
            // Always scroll to bottom before each action
            await skipBtn.evaluate((el) => {
                el.scrollTop = el.scrollHeight; // scroll to bottom of container
            });
            if (action.toLowerCase() === 'skip') {
                if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await skipBtn.click();
                } else {
                    break;
                }
            } else if (action.toLowerCase() === 'continue') {
                const options = ['1', '2', '3', '4'];
                const tryOrder = [
                    options[optionIndex - 1],
                    ...options.filter((_, idx) => idx !== optionIndex - 1)
                ];
                let clicked = false;
                for (const opt of tryOrder) {

                    const optBtn = this.page.locator(
                        "(//div[contains(@class, 'flex flex-col gap-4 mb-6')]/button/span[contains(@class, 'font-bold')])[" + opt + "]"
                    );
                    if (await optBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                        await optBtn.click();
                        const option = await optBtn.innerText();
                        console.log('Answer:', option.trim());
                        clicked = true;
                        break;
                    }
                }
                // Scroll again before clicking Continue
                await skipBtn.evaluate((el) => {
                    el.scrollTop = el.scrollHeight;
                }); 
                if (clicked && await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await continueBtn.click();
                } else if (!clicked) {
                    break;
                }
            } else {
                throw new Error(`Unknown action: ${action}`);
            }
        }

        // Submit flow
        await expect(submitBtn).toBeVisible();
        await submitBtn.click();
        await expect(this.page.getByRole('heading', { name: 'Alert!' })).toBeVisible();
        const submitConfirmBtn = this.page.getByRole('button', { name: 'Submit →' });
        await expect(submitConfirmBtn).toBeVisible();
        await submitConfirmBtn.click();
        await expect(this.page.getByRole('heading', { name: 'Success!' })).toBeVisible();
        await expect(this.page.getByText('Your test has been submitted')).toBeVisible();
        const dashboardBtn = this.page.getByRole('button', { name: 'Go to Dashboard' });
        await expect(dashboardBtn).toBeVisible();
        await dashboardBtn.click();
        await expect(this.page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    }
}