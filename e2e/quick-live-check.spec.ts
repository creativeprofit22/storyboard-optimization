import { test, expect } from '@playwright/test';

/**
 * QUICK LIVE DEPLOYMENT CHECK
 *
 * This is a simplified test that focuses on:
 * 1. Site accessibility
 * 2. Basic structure validation
 * 3. Animation element presence
 *
 * Run with: npm run test:e2e -- e2e/quick-live-check.spec.ts
 */

test.describe('Quick Live Deployment Check', () => {
  test('Site is accessible and loads correctly', async ({ page }) => {
    console.log('Testing: https://www.creativeprofitagency.com/');

    // Navigate to the live site
    const response = await page.goto('https://www.creativeprofitagency.com/');

    // Check response status
    expect(response?.status()).toBe(200);
    console.log('✓ Site returns 200 OK');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    console.log('✓ Page fully loaded');

    // Check page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    expect(title).toBeTruthy();

    // Verify all 8 sections exist
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    console.log(`✓ Found ${sectionCount} sections`);
    expect(sectionCount).toBe(8);
  });

  test('Section 2 has correct structure (PRODUCTIVITY THEATRE)', async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);

    // Check heading exists
    const heading = section2.locator('h2, h1');
    await expect(heading).toBeAttached();
    const headingText = await heading.textContent();
    console.log(`Section 2 heading: ${headingText}`);

    // Count paragraphs
    const paragraphs = section2.locator('p');
    const paragraphCount = await paragraphs.count();
    console.log(`Section 2 paragraph count: ${paragraphCount}`);

    // Verify we have paragraphs (should be 4)
    expect(paragraphCount).toBeGreaterThanOrEqual(4);
    console.log('✓ Section 2 has 4+ paragraphs');

    // Check if paragraphs have content
    for (let i = 0; i < Math.min(paragraphCount, 4); i++) {
      const paragraph = paragraphs.nth(i);
      const text = await paragraph.textContent();
      expect(text?.length).toBeGreaterThan(10);
      console.log(`  Paragraph ${i + 1}: ${text?.substring(0, 50)}...`);
    }
  });

  test('Section 3 has correct structure (WHAT WE FOUND)', async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    const section3 = page.locator('section').nth(2);

    // Check heading exists
    const heading = section3.locator('h2, h1');
    await expect(heading).toBeAttached();
    const headingText = await heading.textContent();
    console.log(`Section 3 heading: ${headingText}`);

    // Count research findings (h3 or similar)
    const findings = section3.locator('h3, [class*="finding"]');
    const findingCount = await findings.count();
    console.log(`Section 3 finding count: ${findingCount}`);

    // Should have multiple findings
    expect(findingCount).toBeGreaterThanOrEqual(4);
    console.log('✓ Section 3 has 4+ research findings');
  });

  test('Section 4 has correct structure (WHY IT ALL BREAKS DOWN)', async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    const section4 = page.locator('section').nth(3);

    // Check heading exists
    const heading = section4.locator('h2, h1');
    await expect(heading).toBeAttached();
    const headingText = await heading.textContent();
    console.log(`Section 4 heading: ${headingText}`);

    // Count paragraphs
    const paragraphs = section4.locator('p');
    const paragraphCount = await paragraphs.count();
    console.log(`Section 4 paragraph count: ${paragraphCount}`);

    // Verify we have paragraphs (should be 5)
    expect(paragraphCount).toBeGreaterThanOrEqual(5);
    console.log('✓ Section 4 has 5+ paragraphs');

    // Check if paragraphs have content
    for (let i = 0; i < Math.min(paragraphCount, 5); i++) {
      const paragraph = paragraphs.nth(i);
      const text = await paragraph.textContent();
      expect(text?.length).toBeGreaterThan(10);
      console.log(`  Paragraph ${i + 1}: ${text?.substring(0, 50)}...`);
    }
  });

  test('Visual verification - take screenshots for manual review', async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/live-deployment-full-page.png',
      fullPage: true,
    });
    console.log('✓ Full page screenshot saved');

    // Screenshot Section 2
    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await section2.screenshot({
      path: 'test-results/section-2-productivity-theatre.png',
    });
    console.log('✓ Section 2 screenshot saved');

    // Screenshot Section 3
    const section3 = page.locator('section').nth(2);
    await section3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await section3.screenshot({
      path: 'test-results/section-3-what-we-found.png',
    });
    console.log('✓ Section 3 screenshot saved');

    // Screenshot Section 4
    const section4 = page.locator('section').nth(3);
    await section4.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await section4.screenshot({
      path: 'test-results/section-4-why-it-breaks-down.png',
    });
    console.log('✓ Section 4 screenshot saved');

    console.log('\nScreenshots saved to test-results/ directory for manual visual review');
  });

  test('Check for console errors during page load', async ({ page }) => {
    const consoleErrors: string[] = [];
    const jsErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    // Scroll through page to trigger any lazy-loaded errors
    for (let i = 0; i < 8; i++) {
      const section = page.locator('section').nth(i);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }

    // Report errors
    if (consoleErrors.length > 0) {
      console.log('\n⚠️  Console Errors Found:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✓ No console errors found');
    }

    if (jsErrors.length > 0) {
      console.log('\n⚠️  JavaScript Errors Found:');
      jsErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✓ No JavaScript errors found');
    }

    // Fail test if critical errors found
    // (You can adjust this based on what errors are acceptable)
    const criticalErrors = jsErrors.filter(
      (error) => !error.includes('favicon') && !error.includes('analytics')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('Measure page performance', async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        domInteractive: perfData.domInteractive,
        transferSize: perfData.transferSize,
      };
    });

    console.log('\nPerformance Metrics:');
    console.log(`  DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`  Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
    console.log(`  First Paint: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
    console.log(`  DOM Interactive: ${performanceMetrics.domInteractive.toFixed(2)}ms`);
    console.log(`  Transfer Size: ${(performanceMetrics.transferSize / 1024).toFixed(2)} KB`);

    // Performance assertions (adjust thresholds as needed)
    expect(performanceMetrics.firstPaint).toBeLessThan(3000); // First paint under 3s
    expect(performanceMetrics.domInteractive).toBeLessThan(5000); // Interactive under 5s
  });

  test('Check animation-related attributes in DOM', async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    // Check if Framer Motion attributes exist (indicates animations are set up)
    const section2 = page.locator('section').nth(1);

    // Check for common animation-related attributes/classes
    const section2Html = await section2.innerHTML();

    console.log('\nChecking for animation indicators...');

    // Check for Framer Motion data attributes
    if (section2Html.includes('data-framer') || section2Html.includes('motion')) {
      console.log('✓ Framer Motion attributes detected');
    } else {
      console.log('⚠️  No obvious Framer Motion attributes found');
    }

    // Check paragraphs in Section 2
    const paragraphs = section2.locator('p');
    const firstParagraph = paragraphs.first();

    const hasStyle = await firstParagraph.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        hasTransition: style.transition !== 'none' && style.transition !== '',
        hasTransform: style.transform !== 'none',
        opacity: style.opacity,
      };
    });

    console.log('First paragraph computed style:');
    console.log(`  Has transition: ${hasStyle.hasTransition}`);
    console.log(`  Has transform: ${hasStyle.hasTransform}`);
    console.log(`  Opacity: ${hasStyle.opacity}`);
  });
});

test.describe('Mobile Viewport Check', () => {
  test.use({
    viewport: { width: 375, height: 667 },
  });

  test('Site works on mobile viewport', async ({ page }) => {
    console.log('\nTesting mobile viewport: 375x667');

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    // Verify sections still exist
    const sections = page.locator('section');
    const sectionCount = await sections.count();
    expect(sectionCount).toBe(8);
    console.log('✓ All 8 sections present on mobile');

    // Take mobile screenshot
    await page.screenshot({
      path: 'test-results/live-deployment-mobile.png',
      fullPage: true,
    });
    console.log('✓ Mobile screenshot saved');

    // Check Section 2 paragraphs on mobile
    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const paragraphs = section2.locator('p');
    const paragraphCount = await paragraphs.count();
    console.log(`Mobile - Section 2 paragraph count: ${paragraphCount}`);
    expect(paragraphCount).toBeGreaterThanOrEqual(4);
  });
});

// Summary reporter
test.afterAll(async () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         QUICK LIVE DEPLOYMENT CHECK COMPLETE          ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('\n✓ Basic structure validation complete');
  console.log('✓ Screenshots saved for visual review');
  console.log('✓ Performance metrics collected');
  console.log('\nNext steps:');
  console.log('1. Review screenshots in test-results/ directory');
  console.log('2. Manually verify animations work (see LIVE_DEPLOYMENT_TEST_PLAN.md)');
  console.log('3. Test on real mobile devices');
  console.log('4. Test cross-browser (Chrome, Firefox, Safari)');
  console.log('\n');
});
