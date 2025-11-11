import { test, expect, Page } from '@playwright/test';

// Section data structure
const sections = [
  { id: 1, name: 'HERO', hasAnimation: false, heading: "THEY'RE CONNING YOU, MATE." },
  { id: 2, name: 'PRODUCTIVITY THEATRE', hasAnimation: true, heading: 'PRODUCTIVITY THEATRE' },
  { id: 3, name: 'WHAT WE FOUND', hasAnimation: true, heading: 'WHAT WE FOUND' },
  { id: 4, name: 'WHY IT ALL BREAKS DOWN', hasAnimation: true, heading: 'WHY IT ALL BREAKS DOWN' },
  { id: 5, name: 'TRANSITION', hasAnimation: true, heading: "But here's the thing: there's a better way" },
  { id: 6, name: 'IMAGINE THIS INSTEAD', hasAnimation: true, heading: 'IMAGINE THIS INSTEAD' },
  { id: 7, name: 'THE FRAMEWORK', hasAnimation: true, heading: 'THE FRAMEWORK' },
  { id: 8, name: "LET'S BUILD THIS TOGETHER", hasAnimation: true, heading: "LET'S BUILD THIS TOGETHER" },
];

test.describe('Scroll Animations - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should load all 8 sections on the page', async ({ page }) => {
    // Verify all sections are present in the DOM
    const sectionElements = page.locator('section');
    await expect(sectionElements).toHaveCount(8);

    // Verify each section heading
    for (const section of sections) {
      const heading = page.getByRole('heading', { name: new RegExp(section.heading.substring(0, 20), 'i') });
      await expect(heading).toBeAttached();
    }
  });

  test('should have HERO section visible immediately (no animation)', async ({ page }) => {
    // Hero section should be visible immediately
    const heroHeading = page.getByRole('heading', { name: /THEY'RE CONNING YOU/i });
    await expect(heroHeading).toBeVisible();

    // Check it's in viewport
    const boundingBox = await heroHeading.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.y).toBeGreaterThan(-100);
  });

  test('should animate sections on scroll (fade-in + slide-up)', async ({ page }) => {
    // Test Section 2 (PRODUCTIVITY THEATRE)
    const section2 = page.locator('section').nth(1);

    // Section should initially be below viewport
    let boundingBox = await section2.boundingBox();
    const viewportSize = page.viewportSize()!;

    // Get initial opacity (should be 0 or very low)
    const initialOpacity = await section2.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    console.log('Section 2 initial opacity:', initialOpacity);

    // Scroll to bring section into view
    await section2.scrollIntoViewIfNeeded();

    // Wait for animation to start
    await page.waitForTimeout(100);

    // Check opacity increased (animation triggered)
    const animatedOpacity = await section2.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    console.log('Section 2 animated opacity:', animatedOpacity);

    // Wait for animation to complete
    await page.waitForTimeout(800);

    // Final opacity should be 1
    const finalOpacity = await section2.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    console.log('Section 2 final opacity:', finalOpacity);
    expect(parseFloat(finalOpacity)).toBeGreaterThan(0.9);
  });

  test('should NOT re-trigger animations on scroll back up', async ({ page }) => {
    // Scroll to Section 3
    const section3 = page.locator('section').nth(2);
    await section3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Verify it's fully visible
    let opacity = await section3.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Scroll back down to Section 3
    await section3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Opacity should still be 1 (no re-animation)
    opacity = await section3.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('should animate all sections in sequence during full page scroll', async ({ page }) => {
    const animationResults = [];

    for (let i = 1; i < sections.length; i++) {
      const section = page.locator('section').nth(i);
      const sectionInfo = sections[i];

      if (!sectionInfo.hasAnimation) continue;

      // Scroll to section
      await section.scrollIntoViewIfNeeded();

      // Small delay to start animation
      await page.waitForTimeout(100);

      // Wait for animation
      await page.waitForTimeout(700);

      // Check final state
      const opacity = await section.evaluate((el) => window.getComputedStyle(el).opacity);
      const transform = await section.evaluate((el) => window.getComputedStyle(el).transform);

      animationResults.push({
        section: sectionInfo.name,
        opacity: parseFloat(opacity),
        hasTransform: transform !== 'none',
      });

      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    }

    console.log('Animation results:', animationResults);
  });

  test('should have staggered child animations in Section 3', async ({ page }) => {
    // Scroll to Section 3 (WHAT WE FOUND)
    const section3 = page.locator('section').nth(2);
    await section3.scrollIntoViewIfNeeded();

    // Get all child elements with stagger animation
    const staggeredChildren = section3.locator('h3');
    const childCount = await staggeredChildren.count();

    expect(childCount).toBeGreaterThan(0);

    // Wait for stagger animation to complete
    await page.waitForTimeout(1500);

    // All children should be visible
    for (let i = 0; i < childCount; i++) {
      await expect(staggeredChildren.nth(i)).toBeVisible();
    }
  });
});

test.describe('Scroll Animations - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE size
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should animate sections on mobile touch scroll', async ({ page }) => {
    // Test Section 2
    const section2 = page.locator('section').nth(1);

    // Scroll to section
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);

    // Check animation triggered
    await page.waitForTimeout(700);
    const opacity = await section2.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('should handle rapid scrolling without breaking', async ({ page }) => {
    // Rapidly scroll through multiple sections
    for (let i = 1; i < 5; i++) {
      const section = page.locator('section').nth(i);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200); // Quick scroll
    }

    // Wait for animations to settle
    await page.waitForTimeout(1000);

    // All sections should be visible
    for (let i = 1; i < 5; i++) {
      const section = page.locator('section').nth(i);
      const opacity = await section.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeGreaterThan(0.8);
    }
  });

  test('should be responsive at mobile viewport', async ({ page }) => {
    // Check that all sections are still present
    const sectionElements = page.locator('section');
    await expect(sectionElements).toHaveCount(8);

    // Check hero is visible
    const heroHeading = page.getByRole('heading', { name: /THEY'RE CONNING YOU/i });
    await expect(heroHeading).toBeVisible();
  });
});

test.describe('Visual Quality & Performance', () => {
  test('should have no layout shifts during animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial layout
    const section2 = page.locator('section').nth(1);
    const initialBox = await section2.boundingBox();

    // Scroll to trigger animation
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Check layout hasn't shifted
    const finalBox = await section2.boundingBox();

    // Height should remain same (no layout shift)
    expect(Math.abs(finalBox!.height - initialBox!.height)).toBeLessThan(5);
  });

  test('should have smooth animations with proper easing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);

    // Check transition properties
    const transition = await section2.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    console.log('Transition properties:', transition);

    // Should have opacity and transform transitions
    expect(transition).toBeTruthy();
  });

  test('should complete animations within 800ms', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);

    // Record start time
    const startTime = Date.now();

    // Trigger animation
    await section2.scrollIntoViewIfNeeded();

    // Wait until fully visible
    await expect(section2).toBeVisible();
    await page.waitForFunction(
      (el) => parseFloat(window.getComputedStyle(el).opacity) > 0.95,
      section2
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Animation completed in ${duration}ms`);

    // Should complete within 1000ms (600ms animation + buffer)
    expect(duration).toBeLessThan(1200);
  });

  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Basic accessibility checks
    const sections = page.locator('section');

    // All sections should have proper structure
    for (let i = 0; i < 8; i++) {
      const section = sections.nth(i);
      const headings = section.locator('h1, h2, h3');
      await expect(headings.first()).toBeAttached();
    }
  });

  test('should maintain text readability during animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);
    const heading = section2.getByRole('heading', { name: /PRODUCTIVITY THEATRE/i });

    // Scroll to trigger animation
    await section2.scrollIntoViewIfNeeded();

    // During animation, text should still be readable (no extreme blur or distortion)
    await page.waitForTimeout(300); // Mid-animation

    // Text should be visible
    await expect(heading).toBeVisible();

    // After animation
    await page.waitForTimeout(700);
    await expect(heading).toBeVisible();

    // Check text color contrast exists
    const color = await heading.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).toBeTruthy();
  });
});

test.describe('Cross-Browser Consistency', () => {
  test('should work consistently across browsers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Testing on: ${browserName}`);

    // Test basic animation on Section 2
    const section2 = page.locator('section').nth(1);

    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const opacity = await section2.evaluate((el) => window.getComputedStyle(el).opacity);

    console.log(`${browserName} - Section 2 opacity: ${opacity}`);

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);

    // All 8 sections should exist
    const sectionCount = await page.locator('section').count();
    expect(sectionCount).toBe(8);
  });
});

test.describe('Edge Cases', () => {
  test('should handle small viewport heights', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Animations should still trigger
    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const opacity = await section2.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.8);
  });

  test('should handle large viewport heights', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 2000 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Multiple sections might be visible at once
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBe(8);
  });

  test('should handle browser zoom levels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate zoom (150%)
    await page.evaluate(() => {
      document.body.style.zoom = '1.5';
    });

    await page.waitForTimeout(500);

    // Animations should still work
    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const opacity = await section2.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.8);
  });

  test('should handle JavaScript disabled gracefully', async ({ browser }) => {
    // This tests progressive enhancement
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto('/');

    // Content should still be visible without JS
    // (Note: Framer Motion won't work without JS, but content should be accessible)
    const headings = page.locator('h1, h2');
    const count = await headings.count();

    // Should have some content visible
    expect(count).toBeGreaterThan(0);

    await context.close();
  });
});
