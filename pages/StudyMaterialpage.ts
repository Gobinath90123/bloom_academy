import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class StudyMaterialPage {
    readonly page: Page;
    readonly tabLocator: Locator;
    readonly sectionLocator: Locator;
    readonly collegeNameLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tabLocator = page.locator("//div[contains(@class, 'flex flex-wrap') and contains(@class, 'border-b')]//button");
        this.sectionLocator = page.locator("//span[@class='z-10']");
        this.collegeNameLocator = page.locator("//td[@class='px-6 py-3'][2]");
    }

    async printStudyMaterialTabTitles() {
        await this.page.waitForTimeout(2000);
        const count = await this.tabLocator.count();
        console.log(`Total Study Material Tab: ${count}`);
        for (let i = 0; i < count; i++) {
            const title = await this.tabLocator.nth(i).innerText();
            console.log(`TabName ${i + 1} Title: ${title}`);
        }
    }

    async printAllSectionCardTitles() {
        await this.page.evaluate(() => {
            window.scrollBy(0, 1200); // scroll down 500px
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