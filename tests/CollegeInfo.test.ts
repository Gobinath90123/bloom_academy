import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { CollegeInfoPage } from '../pages/CollegeInfoPage';
import { testData } from '../test-data/testData';

const baseURL = process.env.BASE_URL;

test.describe('Mock Test', () => {
    let loginPage: LoginPage;
    let collegeInfoPage: CollegeInfoPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        collegeInfoPage = new CollegeInfoPage(page);

        await loginPage.navigateTo(baseURL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);

        await expect(page.getByRole('link', { name: 'College Info' })).toBeVisible();
        await page.getByRole('link', { name: 'College Info' }).click();
        await expect(page.getByRole('heading', { name: 'College Info' })).toBeVisible();
    });

    test('Navigate and click study material buttons', async ({ page }) => {
        // Click main category dynamically
        await collegeInfoPage.printCollegeInfoCategoryTitles();
        await collegeInfoPage.clickCategory(testData.CollegeInfoData.CategoryName);

        // Click first subcategory dynamically
        await collegeInfoPage.printCollegeInfoSubCategoryTitles();
        await collegeInfoPage.clickSubCategoryByIndex(1);

        // Click first sub-subcategory dynamically
        await collegeInfoPage.printCollegeInfoSubCategoryTitles();
        await collegeInfoPage.clickSubCategoryByIndex(1);

        // Click first course
        await collegeInfoPage.printCollegeInfoSubCategoryCourseTitles();
        await collegeInfoPage.clickCourseByIndex(1);

        // Print college names
        await collegeInfoPage.printCollegeName();

        // Navigate back cleanly
        await collegeInfoPage.clickBack('Sub-Subchild');
        await collegeInfoPage.clickBack('Subcategory');
        await collegeInfoPage.clickBack('Category');

        // Verify landing on main page
        await expect(page.getByRole('heading', { name: 'College Info' })).toBeVisible();
    });
});
