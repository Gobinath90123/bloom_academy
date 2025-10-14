import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';

test.describe('Dashboard Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo(process.env.BASE_URL as string);
    });

    test('Verify Forgot Password Page Navigation', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        const dashboardPage = loginPage.getDashboardPage();
        await dashboardPage.expectRoleVisible('heading', 'Dashboard');
    });

    test('Verify User Profile Display', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        const dashboardPage = loginPage.getDashboardPage();
        await dashboardPage.expectRoleVisible('heading', 'Dashboard');

        // dynamic assertions based on test data
        const username = testData.validUser.username;
        await dashboardPage.expectRoleVisible('heading', testData.validUser.name);
        await dashboardPage.expectTextVisible(testData.validUser.role);
        await dashboardPage.expectTextVisible(`| ${username}`);
    });

});