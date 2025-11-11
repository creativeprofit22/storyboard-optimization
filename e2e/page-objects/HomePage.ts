import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly sections: {
    hero: Locator;
    productivityTheatre: Locator;
    whatWeFound: Locator;
    whyItBreaksDown: Locator;
    transition: Locator;
    imagineThisInstead: Locator;
    theFramework: Locator;
    buildTogether: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    // Define section locators
    this.sections = {
      hero: page.locator('section').nth(0),
      productivityTheatre: page.locator('section').nth(1),
      whatWeFound: page.locator('section').nth(2),
      whyItBreaksDown: page.locator('section').nth(3),
      transition: page.locator('section').nth(4),
      imagineThisInstead: page.locator('section').nth(5),
      theFramework: page.locator('section').nth(6),
      buildTogether: page.locator('section').nth(7),
    };
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async scrollToSection(sectionName: keyof typeof this.sections) {
    const section = this.sections[sectionName];
    await section.scrollIntoViewIfNeeded();
  }

  async waitForSectionAnimation(sectionName: keyof typeof this.sections, timeout = 1000) {
    const section = this.sections[sectionName];
    await this.page.waitForTimeout(timeout);

    // Wait for opacity to reach near 1
    await this.page.waitForFunction(
      (el) => {
        const opacity = window.getComputedStyle(el).opacity;
        return parseFloat(opacity) > 0.9;
      },
      section,
      { timeout: 2000 }
    );
  }

  async getSectionOpacity(sectionName: keyof typeof this.sections): Promise<number> {
    const section = this.sections[sectionName];
    const opacity = await section.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    return parseFloat(opacity);
  }

  async getSectionTransform(sectionName: keyof typeof this.sections): Promise<string> {
    const section = this.sections[sectionName];
    return await section.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
  }

  async scrollToBottom() {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  async scrollToTop() {
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
  }

  async getSectionCount(): Promise<number> {
    return await this.page.locator('section').count();
  }

  async verifySectionHeading(sectionName: keyof typeof this.sections, expectedText: RegExp | string) {
    const section = this.sections[sectionName];
    const heading = section.locator('h1, h2').first();
    await expect(heading).toContainText(expectedText);
  }

  async getAllSectionOpacities(): Promise<Record<string, number>> {
    const opacities: Record<string, number> = {};

    for (const [name, locator] of Object.entries(this.sections)) {
      const opacity = await locator.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).opacity);
      });
      opacities[name] = opacity;
    }

    return opacities;
  }

  async measureAnimationTiming(sectionName: keyof typeof this.sections): Promise<number> {
    const section = this.sections[sectionName];
    const startTime = Date.now();

    await section.scrollIntoViewIfNeeded();

    await this.page.waitForFunction(
      (el) => parseFloat(window.getComputedStyle(el).opacity) > 0.95,
      section
    );

    return Date.now() - startTime;
  }

  async checkForLayoutShift(sectionName: keyof typeof this.sections): Promise<{ shifted: boolean; heightDiff: number }> {
    const section = this.sections[sectionName];

    const initialBox = await section.boundingBox();
    await section.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(800);
    const finalBox = await section.boundingBox();

    const heightDiff = Math.abs(finalBox!.height - initialBox!.height);

    return {
      shifted: heightDiff > 5,
      heightDiff,
    };
  }

  async captureConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    this.page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    return errors;
  }

  async isHeroVisible(): Promise<boolean> {
    const heroHeading = this.page.getByRole('heading', { name: /THEY'RE CONNING YOU/i });
    return await heroHeading.isVisible();
  }

  async scrollThroughAllSections(delay = 800) {
    const sectionKeys = Object.keys(this.sections) as Array<keyof typeof this.sections>;

    for (const sectionName of sectionKeys) {
      await this.scrollToSection(sectionName);
      await this.page.waitForTimeout(delay);
    }
  }

  async getStaggeredChildrenCount(sectionName: keyof typeof this.sections): Promise<number> {
    const section = this.sections[sectionName];
    const children = section.locator('h3, h4');
    return await children.count();
  }

  async waitForStaggerAnimation(sectionName: keyof typeof this.sections, expectedChildren: number) {
    const section = this.sections[sectionName];
    await section.scrollIntoViewIfNeeded();

    // Wait for stagger to complete (base delay + children * stagger interval)
    const totalTime = 200 + (expectedChildren * 100) + 600;
    await this.page.waitForTimeout(totalTime);
  }
}
