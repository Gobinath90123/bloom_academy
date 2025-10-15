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

    test('Take first test and skip all questions and submit', async () => {
        const sectionName = testData.sectionData.mockTestSectionName;
        await mockTestPage.takeFirstTestInSection(sectionName);
        await mockTestPage.allQuestionsAndSubmit('Skip', 3);
    });

    test.only('Answer all questions dynamically and submit', async () => {
        // Optionally print some text for debugging
        const sectionName = testData.sectionData.mockTestSectionName;
        await mockTestPage.takeFirstTestInSection(sectionName);
        await mockTestPage.printTextByLocator("(//span[@class='font-bold'])[3]");
        await mockTestPage.allQuestionsAndSubmit('Continue', 3);
    });


    // //print text using below text locator
    // locator (//span[@class='font-bold'])[3] 
    // //print inner text using below locator
    // locator //div[@class='text-lg font-semibold']   
    // await page.goto('https://staging.bloomscareer.com/mock-test');

    // //print inner text using for loop
    // await page.locator("//div[@class='text-lg font-semibold']").toBeVisible();
    // await page.locator("//span[contains(@class, 'font-bold') and contains(@class, 'bg-green-200')]").click();
    // await expect(page.getByRole('button', { name: 'Continue →' })).toBeVisible();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.goto('https://staging.bloomscareer.com/mock-test');
    // await page.getByRole('button', { name: 'A 5' }).click();

    // //use for loop
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 3' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A', exact: true }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A C2' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A (-8,0)' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A சொற்களின் எண்ணிக்கை 17 ஆகும்' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 7' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A', exact: true }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A', exact: true }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 2k-' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 11' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 23' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 9' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A ab' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A', exact: true }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 109' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 27' }).click();
    // await page.getByRole('button', { name: 'D' }).click();
    // await page.getByRole('button', { name: 'A 27' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A', exact: true }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A', exact: true }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 53 :' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A G.P.' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A  a + b, b + c, c + d are in' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'A 1' }).click();
    // await page.getByRole('button', { name: 'Continue →' }).click();
    // await page.getByRole('button', { name: 'Submit' }).click();
    // await page.getByRole('button', { name: 'Submit →' }).click();
    // await page.getByRole('button', { name: 'Go to Dashboard' }).click();
});