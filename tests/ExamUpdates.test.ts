import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';
import { ExamUpdatesPage } from 'pages/ExamUpdatesPage';

test.describe('Home Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo(process.env.BASE_URL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        const dashboardPage = loginPage.getDashboardPage();
        await dashboardPage.expectRoleVisible('heading', 'Dashboard');
    });

    test('Verify Exam Updates Page Navigation', async ({ page }) => {
        const ExamData = testData.ExamData;
        const exam = new ExamUpdatesPage(page);
        await exam.goToExamUpdatesFromBanner();
        await exam.navigateToExternal('https://staging.bloomscareer.com/exam-updates');
        await exam.expectRoleVisible('heading',  ExamData.PageName);
    });

    test('Verify Exam Updates Competitive Examinations', async ({ page }) => {
        const ExamData = testData.ExamData;
        const exam = new ExamUpdatesPage(page);
        await exam.goToExamUpdatesFromBanner();
        await exam.navigateToExternal('https://staging.bloomscareer.com/exam-updates');
        await exam.expectRoleVisible('heading',  ExamData.PageName);
        await expect(page.getByRole('link', { name: ExamData.tabName })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Previous Exam Previous Exam' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Latest Exam Latest Exam' })).toBeVisible();

    });

    test('Verify Exam Updates Previous Exam Previous Exam', async ({ page }) => {
        const ExamData = testData.ExamData;
        const exam = new ExamUpdatesPage(page);
        await exam.goToExamUpdatesFromBanner();
        await exam.navigateToExternal('https://staging.bloomscareer.com/exam-updates');
        await exam.expectRoleVisible('heading', ExamData.PageName);
        await expect(page.getByRole('link', { name: ExamData.tabName })).toBeVisible();
        await exam.openCategory(ExamData.CategoryName);
        await page.waitForTimeout(2000);
        const titles = await exam.getCategoryExamTitles();
        console.log('Previous Exam Titles:');
        await page.waitForTimeout(2000);
        if (titles.length === 0) console.log('(no titles found)');
        else titles.forEach(t => console.log(t));
    });

    test('Verify Exam Updates Previous Exam Previous Exam-> AFTER DIPLOMA', async ({ page }) => {
        const ExamData = testData.ExamData;
        const exam = new ExamUpdatesPage(page);
        await exam.goToExamUpdatesFromBanner();
        await exam.navigateToExternal('https://staging.bloomscareer.com/exam-updates');
        await exam.expectRoleVisible('heading', ExamData.PageName);
        await expect(page.getByRole('link', { name: ExamData.tabName })).toBeVisible();
        await exam.openCategory(ExamData.CategoryName);
        await exam.openSubCategory(ExamData.SubCategoryName);
        const cards = await exam.getSectionCards();
        cards.forEach((c, idx) => {
            console.log(`Card ${idx + 1}:`);
            console.log(`  Title     : ${c.title}`);
            console.log(`  Exam Date : ${c.examDate}`);
            console.log('---------------------------');
        });
    });

});
