import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { MockTestPage } from '../pages/mocktestpage';
import { testData } from '../test-data/testData';
const baseURL = process.env.BASE_URL;

test.describe('Mock Test', () => {
    let loginPage: LoginPage;
    let mockTestPage: MockTestPage;
    const runMockTestFlow = async (page: any, pageObj: MockTestPage, sectionName: string, action: 'Skip' | 'Continue', optionIndex = 1) => {
        await expect(page.getByRole('link', { name: 'Mock Test' })).toBeVisible();
        await pageObj.goto();
        await pageObj.takeFirstTestInSection(sectionName);
        await pageObj.printTextByLocator("(//span[@class='font-bold'])[3]");
        await pageObj.allQuestionsAndSubmit(action, optionIndex);
        const submitInfo = await pageObj.submitTest();
        console.log('Submit alert text:', submitInfo.alertText);
        console.log('Questions summary:', submitInfo.questionsAnswered);
        await pageObj.verifyTestSubmitted();
        await pageObj.goToDashboardAfterSubmission();
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        mockTestPage = new MockTestPage(page);
        await loginPage.navigateTo(baseURL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
    });

    test('Verify navigation to Mock Test page', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Mock Test' })).toBeVisible();
        await mockTestPage.goto();
    });

    test('Print all section titles on Mock Test Blooms Academy', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Mock Test' })).toBeVisible();
        await mockTestPage.goto();
        await mockTestPage.printSectionTitles();
    });

    test('Print all card titles for each section on Mock Test page', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'Mock Test' })).toBeVisible();
        await mockTestPage.goto();
        await mockTestPage.printAllSectionCardTitles();
    });

    test('Take first test and skip all questions and submit', async ({ page }) => {
        const sectionName = testData.sectionData.mockTestSectionName;
        await runMockTestFlow(page, mockTestPage, sectionName, 'Skip', 3);
    });

    test('Answer all questions dynamically and submit', async ({ page }) => {
        const sectionName = testData.sectionData.mockTestSectionName;
        await runMockTestFlow(page, mockTestPage, sectionName, 'Continue', 3);
    });
});