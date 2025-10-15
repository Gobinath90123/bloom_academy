import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { MockTestPage } from '../pages/mocktestpage';
import { testData } from '../test-data/testData';
const baseURL = process.env.BASE_URL;

test.describe('Mock Test', () => {
    let loginPage: LoginPage;
    let mockTestPage: MockTestPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        mockTestPage = new MockTestPage(page);
        await loginPage.navigateTo(baseURL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        await expect(page.getByRole('link', { name: 'Mock Test' })).toBeVisible();
        await mockTestPage.goto();
    });

    test('Print all section titles on Mock Test Blooms Academy', async () => {
        await mockTestPage.printSectionTitles();
    });

    test('Print all card titles for each section on Mock Test page', async () => {
        await mockTestPage.printAllSectionCardTitles();
    });

    test('Take first test and skip all questions', async () => {
        const sectionName = testData.sectionData.mockTestSectionName;
        await mockTestPage.takeFirstTestInSection(sectionName);
        await mockTestPage.skipAllQuestionsAndSubmit();
    });

});