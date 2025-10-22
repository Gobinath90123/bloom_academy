import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';
import { OldQuestionPaperpage } from '../pages/OldQuestionPaperpage';
import { testData } from '../test-data/testData';
import path from 'path';
import fs from 'fs';

const baseURL = process.env.BASE_URL;

test.describe('OldQuestionPaper Functionality', () => {

    let loginPage: LoginPage;
    let oldQuestionPaperpage: OldQuestionPaperpage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        oldQuestionPaperpage = new OldQuestionPaperpage(page);
        await loginPage.navigateTo(baseURL as string);
        await loginPage.login(testData.validUser.username, testData.validUser.password);
        await expect(page.getByRole('link', { name: 'Old Question Paper' })).toBeVisible();
        await page.getByRole('link', { name: 'Old Question Paper' }).click();
        await expect(page.getByRole('heading', { name: 'Old Question Paper and' })).toBeVisible();
    });

    test('Navigate and click Old Question Paper Page', async () => {
        await oldQuestionPaperpage.printOldQuestionPaperTabTitles();
        await oldQuestionPaperpage.printAllSectionCardTitles();
    });

    test('Navigate and download Old Question Paper PDF', async ({ page }) => {
            // Ensure elements are visible
            await expect(page.getByRole('button', { name: testData.OldQuestionPaperData.tabName })).toBeVisible();
            await page.locator(`button:has-text("${testData.OldQuestionPaperData.tabName}")`).click();
    
            await expect(page.locator('span').filter({ hasText: testData.OldQuestionPaperData.sectionName })).toBeVisible();
            await page.locator('span').filter({ hasText: testData.OldQuestionPaperData.sectionName }).click();
            await page.waitForTimeout(1000); // Wait for page to load
    
            // Wait for table and download link
            const downloadLink = page.getByRole('link', { name: testData.OldQuestionPaperData.downloadButton }).first();
            await expect(downloadLink).toBeVisible();
    
            // Ensure download folder exists
            const downloadDir = path.join(__dirname, '..', 'downloads');
    
            if (fs.existsSync(downloadDir)) {
                console.log(`✅ Download folder already exists: ${downloadDir}`);
            } else {
                fs.mkdirSync(downloadDir, { recursive: true });
                console.log(`📁 Download folder created: ${downloadDir}`);
            }
    
            const [newTab] = await Promise.all([
                page.context().waitForEvent('page'),
                downloadLink.click(), // click triggers new tab
            ]);
            await newTab.waitForLoadState('domcontentloaded');
            const pdfUrl = newTab.url();
            console.log(`PDF URL: ${pdfUrl}`);
            const response = await newTab.request.get(pdfUrl);
            const buffer = await response.body();
            const fileName = path.basename(pdfUrl); // e.g., niftgeneralknowledge1.pdf
            const filePath = path.join(downloadDir, fileName);
            fs.writeFileSync(filePath, buffer);
            console.log(`✅ PDF downloaded successfully: ${filePath}`);
            // Close the new tab
            await newTab.close();
    
            // Delete the file after use
            fs.unlinkSync(filePath);
            console.log(`🗑️ PDF deleted successfully: ${filePath}`);
           
        });

});