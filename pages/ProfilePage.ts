import { Page } from '@playwright/test';
import { BasePage } from './Basepage';
import path from 'path';
import fs from 'fs';

export class ProfilePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // Click the 'Upload New Picture' button and set files using filechooser or input fallback
    async uploadProfilePicture(filePathOrName: string) {
        let filePath = filePathOrName;
        if (!path.isAbsolute(filePathOrName)) {
            filePath = path.resolve(process.cwd(), 'test-data', filePathOrName);
        }
        if (!fs.existsSync(filePath)) {
            throw new Error(`Test file not found at ${filePath}. Place the file in <project-root>/test-data/ or update the path.`);
        }

        const uploadUsingFileChooser = async () => {
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser', { timeout: 3000 }),
                this.page.getByRole('button', { name: 'Upload New Picture' }).click(),
            ]);
            await fileChooser.setFiles(filePath);
            return true;
        };

        const uploadUsingInput = async () => {
            const input = this.page.locator('input[type="file"]');
            const count = await input.count();
            if (count === 0) return false;
            await input.first().setInputFiles(filePath);
            return true;
        };

        let uploaded = false;
        try {
            uploaded = await uploadUsingFileChooser();
        } catch (err) {
            uploaded = await uploadUsingInput();
        }

        if (!uploaded) {
            const html = await this.page.content();
            console.error('Unable to upload file. Page HTML snapshot (truncated):\n', html.slice(0, 2000));
            throw new Error('Failed to upload profile file: no file chooser and no input[type=file] found. Inspect the page to find the correct selector.');
        }
    }

    // Convenience helpers for assertions
    async expectUploadButtonsVisible() {
        await this.page.getByRole('button', { name: 'Upload Image' }).waitFor({ state: 'visible' });
        await this.page.getByRole('button', { name: 'Cancel' }).waitFor({ state: 'visible' });
    }

}
