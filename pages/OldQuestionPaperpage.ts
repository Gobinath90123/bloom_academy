import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { BasePage } from './Basepage';

export class OldQuestionPaperpage extends BasePage{
    readonly tabLocator: Locator;
    readonly sectionLocator: Locator;
    readonly collegeNameLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.tabLocator = page.locator("//div[@class='flex flex-wrap space-x-4 sm:space-x-8 border-b mb-6 overflow-x-auto']//button");
        this.sectionLocator = page.locator("//span[@class='z-10']");
        this.collegeNameLocator = page.locator("//td[@class='px-6 py-3'][2]");
    }

    async printOldQuestionPaperTabTitles() {
        await this.page.waitForTimeout(2000);
        const count = await this.tabLocator.count();
        console.log(`Total Old Question Paper Tab: ${count}`);
        for (let i = 0; i < count; i++) {
            const title = await this.tabLocator.nth(i).innerText();
            console.log(`TabName ${i + 1} Title: ${title}`);
        }
    }

    async printAllSectionCardTitles() {
        await this.page.waitForTimeout(1000);
        await this.page.evaluate(() => {
            window.scrollBy(0, 10000); // scroll down 500px
        });
        const sectionCount = await this.sectionLocator.count();
        for (let i = 0; i < sectionCount; i++) {
            const section = this.sectionLocator.nth(i);
            const sectionTitle = await section.innerText();
            console.log(`\nSection ${i + 1} Title: ${sectionTitle}`);
            await section.click();
            // await this.page.waitForTimeout(500); // Wait for cards to load
            const college = this.collegeNameLocator;
            const cardCount = await college.count();
            console.log(`Total cards found in "${sectionTitle}": ${cardCount}`);
            for (let j = 0; j < cardCount; j++) {
                const cardTitle = await college.nth(j).innerText();
                console.log(`Card ${j + 1} Title: ${cardTitle}`);
            }
        }
    }

 
};