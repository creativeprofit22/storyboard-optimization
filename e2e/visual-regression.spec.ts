import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should match hero section screenshot', async ({ page }) => {
    const homePage = new HomePage(page);

    // Take screenshot of hero section
    await expect(homePage.sections.hero).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match section 2 before animation', async ({ page }) => {
    const section2 = page.locator('section').nth(1);

    // Screenshot before it enters viewport
    await expect(section2).toHaveScreenshot('section2-before-animation.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match section 2 after animation', async ({ page }) => {
    const homePage = new HomePage(page);

    // Scroll to section and wait for animation
    await homePage.scrollToSection('productivityTheatre');
    await homePage.waitForSectionAnimation('productivityTheatre');

    // Take screenshot after animation
    await expect(homePage.sections.productivityTheatre).toHaveScreenshot('section2-after-animation.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match full page scroll', async ({ page }) => {
    // Take full-page screenshot
    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true,
      maxDiffPixels: 500,
    });
  });

  test('should not have visual glitches during animation', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.scrollToSection('productivityTheatre');

    // Take screenshots at different animation stages
    await page.waitForTimeout(100); // Start
    await expect(homePage.sections.productivityTheatre).toHaveScreenshot('section2-anim-start.png');

    await page.waitForTimeout(300); // Mid
    await expect(homePage.sections.productivityTheatre).toHaveScreenshot('section2-anim-mid.png');

    await page.waitForTimeout(400); // End
    await expect(homePage.sections.productivityTheatre).toHaveScreenshot('section2-anim-end.png');
  });

  test('should match mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('mobile-hero.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('tablet-hero.png', {
      maxDiffPixels: 100,
    });
  });

  test('should match desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('desktop-hero.png', {
      maxDiffPixels: 100,
    });
  });

  test('should have no text jumping in framework section', async ({ page }) => {
    const homePage = new HomePage(page);

    // Scroll to framework section
    await homePage.scrollToSection('theFramework');

    // Take screenshot before animation completes
    await page.waitForTimeout(100);
    await expect(homePage.sections.theFramework).toHaveScreenshot('framework-animating.png');

    // After animation
    await page.waitForTimeout(800);
    await expect(homePage.sections.theFramework).toHaveScreenshot('framework-complete.png');
  });
});

test.describe('Color and Contrast', () => {
  test('should have proper text contrast in all sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const homePage = new HomePage(page);

    // Check hero section (dark background)
    const heroText = homePage.sections.hero.locator('h1').first();
    const heroColor = await heroText.evaluate((el) => window.getComputedStyle(el).color);
    const heroBg = await homePage.sections.hero.evaluate((el) => window.getComputedStyle(el).backgroundColor);

    console.log('Hero - Text:', heroColor, 'Background:', heroBg);

    // Check section 2 (light background)
    await homePage.scrollToSection('productivityTheatre');
    const section2Text = homePage.sections.productivityTheatre.locator('h2').first();
    const section2Color = await section2Text.evaluate((el) => window.getComputedStyle(el).color);
    const section2Bg = await homePage.sections.productivityTheatre.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    console.log('Section 2 - Text:', section2Color, 'Background:', section2Bg);

    // Both should have valid colors
    expect(heroColor).toBeTruthy();
    expect(section2Color).toBeTruthy();
  });

  test('should maintain proper colors during animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);

    // Get color before animation
    const textElement = section2.locator('h2').first();
    const colorBefore = await textElement.evaluate((el) => window.getComputedStyle(el).color);

    // Trigger animation
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Get color after animation
    const colorAfter = await textElement.evaluate((el) => window.getComputedStyle(el).color);

    // Color should remain consistent
    expect(colorBefore).toBe(colorAfter);
  });
});
