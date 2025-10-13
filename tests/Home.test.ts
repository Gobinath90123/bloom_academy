import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';
import { HomePage } from '../pages/HomePage';

test.describe('Home Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo(process.env.BASE_URL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        const dashboardPage = loginPage.getDashboardPage();
        await dashboardPage.expectRoleVisible('heading', 'Dashboard');

    });

    test('Verify Home Page Navigation', async ({ page }) => {
        const home = new HomePage(page);
        await home.goToHomeFromBanner();
        await home.navigateToExternal('https://staging.bloomscareer.com/');
    });

    test('Verify View Courses Button', async ({ page }) => {
        const home = new HomePage(page);
        await home.goToHomeFromBanner();
        await home.navigateToExternal('https://staging.bloomscareer.com/');
        await page.getByRole('button', { name: 'View Courses' }).click();
        await expect(page.getByRole('heading', { name: 'College Info' })).toBeVisible();
        await home.expectCareerSectionHeadings();
    });

    test('Verify Watch Video Button', async ({ page }) => {
        const home = new HomePage(page);
        await home.goToHomeFromBanner();
        await home.navigateToExternal('https://staging.bloomscareer.com/');
        await page.getByRole('button', { name: 'Watch Video' }).click();
        await expect(page.getByRole('heading', { name: 'Shorts' })).toBeVisible();
    });

    test('Verify Exam Updates Section', async ({ page }) => {
        const home = new HomePage(page);
        await home.goToHomeFromBanner();
        await home.navigateToExternal('https://staging.bloomscareer.com/');        
        await expect(page.getByRole('main').getByText('Exam Updates')).toBeVisible();
        await expect(page.getByText('26K+Number of Students')).toBeVisible();
        await expect(page.getByText('+Skilled Candidates')).toBeVisible();
        await expect(page.getByText('+Associate Schools')).toBeVisible();
        await expect(page.getByText('General Updates')).toBeVisible();
    });

});
