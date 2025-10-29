import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { testData } from '../test-data/testData';
import { ProfilePage } from '../pages/ProfilePage';

// Using ProfilePage page object for upload and assertions

test.describe('Profile Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo(process.env.BASE_URL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        const dashboardPage = loginPage.getDashboardPage();
        await dashboardPage.expectRoleVisible('heading', 'Dashboard');
        await expect(page.getByRole('link', { name: 'View Profile →' })).toBeVisible();
        await page.getByRole('link', { name: 'View Profile →' }).click();
    });

    test('Verify Profile Page Navigation', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible();
    });

    test('Verify Profile Picture Upload', async ({ page }) => {
        const profilePage = new ProfilePage(page);
        await profilePage.uploadProfilePicture('image.jpg');
        //await profilePage.expectUploadButtonsVisible();
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });

    test('Verify Invalid Profile Picture Upload', async ({ page }) => {
        const profilePage = new ProfilePage(page);
        await profilePage.uploadProfilePicture('document.pdf');
        await expect(page.getByText('Please select a valid image')).toBeVisible();
    });

    test('Verify Profile Field Editing', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Name *', exact: true }).dblclick();
        await page.getByRole('textbox', { name: 'Father\'s Name *' }).dblclick();
        await page.getByRole('textbox', { name: 'Email ID' }).dblclick();
        await page.getByRole('button', { name: 'Save Changes' }).click();
    });

    test('Verify Mandatory Profile Fields', async ({ page }) => {
        await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Father\'s Name *' })).toBeVisible();
        await page.waitForTimeout(5000);
        await page.getByRole('textbox', { name: 'Name *', exact: true }).clear();
        await page.getByRole('textbox', { name: 'Father\'s Name *' }).clear();
        await page.getByRole('button', { name: 'Save Changes' }).click();
        await expect(page.getByText('The student name field is')).toBeVisible();
        await expect(page.getByText('The student father name field')).toBeVisible();
    });

    test('Verify Student Profile Fields', async ({ page }) => {
        await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Father\'s Name *' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Date of Birth *' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Mobile Number *' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Email ID' })).toBeVisible();
        await expect(page.getByLabel('Preferred Language')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save Changes' })).toBeVisible();
    });
});
