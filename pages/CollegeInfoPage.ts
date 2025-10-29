import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class CollegeInfoPage extends BasePage {
    readonly categoryLocator: Locator;
    readonly subCategoryLocator: Locator;
    readonly collegeNameLocator: Locator;
    readonly subCategoryCourseLocator: Locator;

    constructor(page: Page) {
        super(page);
        this.categoryLocator = this.page.locator("//div[@class='font-bold text-base text-gray-900 text-center']");
        this.subCategoryLocator = this.page.locator("//div[@class='font-bold text-base text-gray-900']");
        this.subCategoryCourseLocator = this.page.locator("//div[@class='font-bold text-base text-[#232b5c]']");
        this.collegeNameLocator = this.page.locator("//td[@class='border px-4 py-2'][2]");
    }

    async printCollegeInfoCategoryTitles() {
        await this.page.waitForTimeout(1000);
        const count = await this.categoryLocator.count();
        console.log(`Total CategoryName Tab: ${count}`);
        for (let i = 0; i < count; i++) {
            const title = await this.categoryLocator.nth(i).innerText();
            console.log(`CategoryName ${i + 1} Title: ${title}`);
        }
    }

    async printCollegeInfoSubCategoryTitles() {
        await this.page.waitForTimeout(1000);
        const count = await this.subCategoryLocator.count();
        console.log(`Total SubCategoryName Tab: ${count}`);
        for (let i = 0; i < count; i++) {
            const title = await this.subCategoryLocator.nth(i).innerText();
            console.log(`SubCategoryName ${i + 1} Title: ${title}`);
        }
    }

    async printCollegeInfoSubCategoryCourseTitles() {
        await this.page.waitForTimeout(1000);
        const count = await this.subCategoryCourseLocator.count();
        console.log(`Total SubCategoryCourseTitles Tab: ${count}`);
        for (let i = 0; i < count; i++) {
            const title = await this.subCategoryCourseLocator.nth(i).innerText();
            console.log(`SubCategoryCourseTitles ${i + 1} Title: ${title}`);
        }
    }

    async printCollegeName() {
        await this.page.waitForTimeout(1000);
        const count = await this.collegeNameLocator.count();
        console.log(`Total CollegeName: ${count}`);
        for (let i = 0; i < count; i++) {
            const title = await this.collegeNameLocator.nth(i).innerText();
            console.log(`CollegeName ${i + 1} Title: ${title}`);
        }
    }

    // Click a category dynamically by name
    async clickCategory(name: string) {
        const locator = this.page.locator(`text="${name}"`);
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    // Click first/any subcategory by index (1-based)
    async clickSubCategoryByIndex(index: number) {
        const locator = this.page.locator("(//div[@class='font-bold text-base text-gray-900'])").nth(index - 1);
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    // Click first/any course by index
    async clickCourseByIndex(index: number) {
        const locator = this.page.locator("(//span[@class='text-white font-semibold'])").nth(index - 1);
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    // Click back buttons dynamically
    async clickBack(type: 'Sub-Subchild' | 'Subcategory' | 'Category') {
        const locator = this.page.getByRole('button', { name: `← Back to ${type}` });
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }
}