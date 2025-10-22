import { test } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { MoreMenuPage } from '../pages/MoreMenuPage';
import { testData } from '../test-data/testData';

const baseURL = process.env.BASE_URL;

test.describe('More Test', () => {
    test.slow();
    let loginPage: LoginPage;
    let moreMenu: MoreMenuPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        moreMenu = new MoreMenuPage(page);

        await loginPage.navigateTo(baseURL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
    });

    test('Verify More menu visibility', async ({ page }) => {
        await moreMenu.clickMore();
    });

    test('Verify More menu dropdown options', async ({ page }) => {
        await moreMenu.verifyTopOptions(['About us', 'Shorts', 'Gallery', 'Programmes']);
    });

    test('Verify About Us page navigation', async ({ page }) => {
        await moreMenu.navigateToURL('About us', 'About Us');
    });

    test('Verify Shorts page navigation', async ({ page }) => {
        await moreMenu.navigateToURL('Shorts', 'Shorts');
    });

    test('Verify Gallery page navigation', async ({ page }) => {
        await moreMenu.navigateToURL('Gallery', 'Gallery');
    });

    test('Verify Programmes submenu visibility', async ({ page }) => {
        await moreMenu.verifyProgrammesSubOptions();
    });

    const programmeTests = [
        { name: 'Undergraduate', heading: 'Undergraduate Programmes' },
        { name: 'Postgraduate', heading: 'Postgraduate Programmes' },
        { name: 'Diploma', heading: 'Diploma Programmes' },
    ];

    for (const programme of programmeTests) {
        test(`Verify ${programme.name} programmes navigation`, async ({ page }) => {
            await moreMenu.navigateToProgramme(programme.name, programme.heading);
        });
    }
});
