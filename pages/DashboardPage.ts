import { BasePage } from './Basepage';
import { expect } from '@playwright/test';

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
