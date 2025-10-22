import { expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class DashboardPage extends BasePage {
  
  constructor(page: any) {
    super(page);
  }

  // Verify all login page elements
  
getDashboardPage() {
        // Replace with actual DashboardPage import and implementation
        return new DashboardPage(this.page);
    }
}
