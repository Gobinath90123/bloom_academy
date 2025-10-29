import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './Basepage';

export class FooterPage extends BasePage {

  readonly bloomsHeading: Locator;
  readonly newsletterHeading: Locator;
  readonly emailTextbox: Locator;
  readonly subscribeButton: Locator;
  readonly contactHeading: Locator;
  readonly coordinatorEmail: Locator;
  readonly contactNumber: Locator;
  readonly copyrightText: Locator;
  readonly socialLinks: Locator;
  readonly tabLocator: Locator;
  readonly playStoreLink: Locator;
  readonly appStoreLink: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    super(page);
    this.tabLocator = page.locator("//nav[@class='flex flex-wrap gap-6 text-gray-300']//a");
    this.bloomsHeading = page.getByRole('heading', { name: 'Blooms Academy', exact: true });
    this.newsletterHeading = page.getByRole('heading', { name: 'Subscribe to News Letter' });
    this.emailTextbox = page.getByRole('textbox', { name: 'Enter email' });
    this.subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    this.contactHeading = page.getByRole('heading', { name: 'Contact US' });
    this.coordinatorEmail = page.locator("//div[normalize-space()='Coordinator@bloomscareer.com']");
    this.contactNumber = page.locator("//div[normalize-space()='7358484874']");
    this.copyrightText = page.getByText('© Tuluk Career Consultancy');
    this.playStoreLink = page.locator("(//div[@class='text-sm font-semibold'])[1]");
    this.appStoreLink = page.locator("(//div[@class='text-sm font-semibold'])[2]");
    this.socialLinks = page.locator("//div[@class='flex gap-4']//a");
    this.emailInput = page.getByRole('textbox', { name: 'Enter email' });
  }


  async verifyFooterDetails() {
    await expect(this.bloomsHeading).toBeVisible();
    await expect(this.newsletterHeading).toBeVisible();
    await expect(this.emailTextbox).toBeVisible();
    await expect(this.subscribeButton).toBeVisible();
    await expect(this.contactHeading).toBeVisible();
    await expect(this.coordinatorEmail).toBeVisible();
    await expect(this.contactNumber).toBeVisible();
  }

  async printFooterTitles() {
    await this.page.waitForTimeout(2000);
    const count = await this.tabLocator.count();
    console.log(`Total Footer Title: ${count}`);
    for (let i = 0; i < count; i++) {
      const title = await this.tabLocator.nth(i).innerText();
      console.log(`Tab ${i + 1} Title: ${title}`);
    }
  }

  async clickPlayStoreLinkAndVerify() {
    await expect(this.playStoreLink).toBeVisible();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.playStoreLink.click(),
    ]);

    await newPage.waitForLoadState();
    const url = newPage.url();
    console.log(`New tab URL: ${url}`);
    expect(url).toContain('play.google.com');
    await newPage.close();

  }

  async clickAppStoreLinkAndVerify() {
    await expect(this.appStoreLink).toBeVisible();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.appStoreLink.click(),
    ]);

    await newPage.waitForLoadState();
    const url = newPage.url();
    console.log(`New tab URL: ${url}`);
    expect(url).toContain('apps.apple.com');
    await newPage.close();
  }

  async verifySocialLinks() {
    await this.scrollToFooter;
    await this.page.waitForTimeout(2000);
    const count = await this.socialLinks.count();
    console.log(`Total Social Links found: ${count}`);
    expect(count).toBe(4);

    const expectedDomains = [
      'facebook.com',
      'youtube.com',
      'instagram.com',
      'twitter.com'
    ];

    for (let i = 0; i < count; i++) {
      const link = this.socialLinks.nth(i);
      await expect(link).toBeVisible();

      // Get href attribute
      const href = await link.getAttribute('href');
      expect(href).not.toBeNull();

      // Check if href contains one of the expected domains
      const matched = expectedDomains.some(domain => href!.includes(domain));
      expect(matched, `Link does not contain valid domain: ${href}`).toBeTruthy();

      // Click and verify navigation opens new tab or correct domain
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        link.click()
      ]);

      await newPage.waitForLoadState();
      const newUrl = newPage.url();
      expect(newUrl).toContain(expectedDomains.find(d => newUrl.includes(d)) || '');
      await newPage.close();
    }
  }

  private successMessage(text: string) {
    return this.page.getByText(text);
  }

  async subscribeWithRandomEmail() {
    const randomEmail = `test${Date.now()}@yopmail.com`;
    console.log(`Using email: ${randomEmail}`);
    await this.scrollToFooter();
    await this.emailInput.fill(randomEmail);
    await this.subscribeButton.click();
    await this.page.waitForTimeout(2000);

    if (await this.successMessage('Successfully subscribed to').isVisible()) {
      console.log('Subscription successful');
    } else {
      throw new Error('No expected message appeared');
    }
  }

  async subscribeExistingEmail(email: string) {
    await this.scrollToFooter();
    await this.emailInput.fill(email);
    await this.subscribeButton.click();
    await this.page.waitForTimeout(2000);

    if (await this.successMessage('Successfully subscribed to').isVisible()) {
      console.log('Subscription successful');
    } else if (await this.successMessage('already subscribed this email').isVisible()) {
      console.log('Email already subscribed');
    } else {
      throw new Error('No expected message appeared');
    }
  }
}