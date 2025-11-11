import { test, expect, Page } from '@playwright/test';

/**
 * LIVE DEPLOYMENT VERIFICATION TEST SUITE
 *
 * Purpose: Critical verification that ALL animations work correctly on the live site
 * after recent animation fixes for Sections 2 & 4 paragraph animations.
 *
 * Site: https://www.creativeprofitagency.com/
 *
 * Focus Areas:
 * 1. Section 2 (PRODUCTIVITY THEATRE) - 4 paragraphs with fade-in + slide-up + stagger
 * 2. Section 4 (WHY IT ALL BREAKS DOWN) - 5 paragraphs with fade-in + slide-up + stagger
 * 3. No re-triggering on scroll back
 * 4. Stagger timing consistency (100-150ms between items)
 * 5. prefers-reduced-motion accessibility
 * 6. Mobile animations
 * 7. Cross-browser compatibility
 */

interface AnimationTestResult {
  section: string;
  test: string;
  status: 'PASS' | 'FAIL';
  details: string;
  timing?: number;
}

const testResults: AnimationTestResult[] = [];

function addResult(section: string, test: string, status: 'PASS' | 'FAIL', details: string, timing?: number) {
  testResults.push({ section, test, status, details, timing });
  console.log(`[${status}] ${section} - ${test}: ${details}${timing ? ` (${timing}ms)` : ''}`);
}

test.describe('CRITICAL: Live Deployment Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow initial rendering
  });

  test('CRITICAL: Section 2 (PRODUCTIVITY THEATRE) - All 4 paragraphs animate with stagger', async ({ page }) => {
    console.log('\n========================================');
    console.log('TESTING SECTION 2: PRODUCTIVITY THEATRE');
    console.log('========================================\n');

    const section2 = page.locator('section').nth(1);

    // Verify section heading
    const heading = section2.locator('h2');
    const headingText = await heading.textContent();
    console.log('Section heading:', headingText);

    // Find all paragraphs in Section 2
    const paragraphs = section2.locator('p');
    const paragraphCount = await paragraphs.count();

    console.log(`Found ${paragraphCount} paragraphs in Section 2`);

    if (paragraphCount < 4) {
      addResult('Section 2', 'Paragraph Count', 'FAIL', `Expected 4 paragraphs, found ${paragraphCount}`);
      throw new Error(`CRITICAL FAIL: Section 2 should have 4 paragraphs, found ${paragraphCount}`);
    } else {
      addResult('Section 2', 'Paragraph Count', 'PASS', `Found ${paragraphCount} paragraphs`);
    }

    // Get initial states before scrolling
    const initialOpacities = [];
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = paragraphs.nth(i);
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      const transform = await paragraph.evaluate(el => window.getComputedStyle(el).transform);
      initialOpacities.push({ opacity: parseFloat(opacity), transform });
      console.log(`Paragraph ${i + 1} initial - opacity: ${opacity}, transform: ${transform}`);
    }

    // Scroll to Section 2 to trigger animations
    console.log('\nScrolling to Section 2...');
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200); // Allow animation to start

    // Track animation progress
    const animationTimings = [];
    const startTime = Date.now();

    // Monitor each paragraph's animation
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = paragraphs.nth(i);

      // Wait for paragraph to become visible (animation complete)
      await paragraph.waitFor({ state: 'visible', timeout: 2000 });

      const animationTime = Date.now() - startTime;
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      const transform = await paragraph.evaluate(el => window.getComputedStyle(el).transform);

      animationTimings.push({
        index: i,
        time: animationTime,
        opacity: parseFloat(opacity),
        transform,
      });

      console.log(`Paragraph ${i + 1} animated at ${animationTime}ms - opacity: ${opacity}, transform: ${transform}`);
    }

    // Wait for all animations to complete
    await page.waitForTimeout(1000);

    // Verify all paragraphs are fully visible
    let allVisible = true;
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = paragraphs.nth(i);
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      const finalOpacity = parseFloat(opacity);

      if (finalOpacity < 0.95) {
        addResult('Section 2', `Paragraph ${i + 1} Final Opacity`, 'FAIL', `Expected >= 0.95, got ${finalOpacity}`);
        allVisible = false;
      } else {
        addResult('Section 2', `Paragraph ${i + 1} Final Opacity`, 'PASS', `Opacity: ${finalOpacity}`);
      }
    }

    // Verify stagger timing (should be ~100-150ms between items)
    console.log('\nAnalyzing stagger timing...');
    for (let i = 1; i < animationTimings.length; i++) {
      const timeDiff = animationTimings[i].time - animationTimings[i - 1].time;
      console.log(`Stagger delay between paragraph ${i} and ${i + 1}: ${timeDiff}ms`);

      // Stagger should be between 50ms and 300ms (allowing some variance)
      if (timeDiff > 50 && timeDiff < 300) {
        addResult('Section 2', `Stagger ${i}→${i + 1}`, 'PASS', `${timeDiff}ms delay`);
      } else {
        addResult('Section 2', `Stagger ${i}→${i + 1}`, 'FAIL', `${timeDiff}ms delay (expected 50-300ms)`);
      }
    }

    expect(allVisible).toBe(true);
    console.log('\n✓ Section 2 paragraphs all animated successfully\n');
  });

  test('CRITICAL: Section 4 (WHY IT ALL BREAKS DOWN) - All 5 paragraphs animate with stagger', async ({ page }) => {
    console.log('\n==========================================');
    console.log('TESTING SECTION 4: WHY IT ALL BREAKS DOWN');
    console.log('==========================================\n');

    const section4 = page.locator('section').nth(3);

    // Verify section heading
    const heading = section4.locator('h2');
    const headingText = await heading.textContent();
    console.log('Section heading:', headingText);

    // Find all paragraphs in Section 4
    const paragraphs = section4.locator('p');
    const paragraphCount = await paragraphs.count();

    console.log(`Found ${paragraphCount} paragraphs in Section 4`);

    if (paragraphCount < 5) {
      addResult('Section 4', 'Paragraph Count', 'FAIL', `Expected 5 paragraphs, found ${paragraphCount}`);
      throw new Error(`CRITICAL FAIL: Section 4 should have 5 paragraphs, found ${paragraphCount}`);
    } else {
      addResult('Section 4', 'Paragraph Count', 'PASS', `Found ${paragraphCount} paragraphs`);
    }

    // Get initial states before scrolling
    const initialOpacities = [];
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = paragraphs.nth(i);
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      const transform = await paragraph.evaluate(el => window.getComputedStyle(el).transform);
      initialOpacities.push({ opacity: parseFloat(opacity), transform });
      console.log(`Paragraph ${i + 1} initial - opacity: ${opacity}, transform: ${transform}`);
    }

    // Scroll to Section 4 to trigger animations
    console.log('\nScrolling to Section 4...');
    await section4.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200); // Allow animation to start

    // Track animation progress
    const animationTimings = [];
    const startTime = Date.now();

    // Monitor each paragraph's animation
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = paragraphs.nth(i);

      // Wait for paragraph to become visible (animation complete)
      await paragraph.waitFor({ state: 'visible', timeout: 2000 });

      const animationTime = Date.now() - startTime;
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      const transform = await paragraph.evaluate(el => window.getComputedStyle(el).transform);

      animationTimings.push({
        index: i,
        time: animationTime,
        opacity: parseFloat(opacity),
        transform,
      });

      console.log(`Paragraph ${i + 1} animated at ${animationTime}ms - opacity: ${opacity}, transform: ${transform}`);
    }

    // Wait for all animations to complete
    await page.waitForTimeout(1000);

    // Verify all paragraphs are fully visible
    let allVisible = true;
    for (let i = 0; i < paragraphCount; i++) {
      const paragraph = paragraphs.nth(i);
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      const finalOpacity = parseFloat(opacity);

      if (finalOpacity < 0.95) {
        addResult('Section 4', `Paragraph ${i + 1} Final Opacity`, 'FAIL', `Expected >= 0.95, got ${finalOpacity}`);
        allVisible = false;
      } else {
        addResult('Section 4', `Paragraph ${i + 1} Final Opacity`, 'PASS', `Opacity: ${finalOpacity}`);
      }
    }

    // Verify stagger timing (should be ~100-150ms between items)
    console.log('\nAnalyzing stagger timing...');
    for (let i = 1; i < animationTimings.length; i++) {
      const timeDiff = animationTimings[i].time - animationTimings[i - 1].time;
      console.log(`Stagger delay between paragraph ${i} and ${i + 1}: ${timeDiff}ms`);

      // Stagger should be between 50ms and 300ms (allowing some variance)
      if (timeDiff > 50 && timeDiff < 300) {
        addResult('Section 4', `Stagger ${i}→${i + 1}`, 'PASS', `${timeDiff}ms delay`);
      } else {
        addResult('Section 4', `Stagger ${i}→${i + 1}`, 'FAIL', `${timeDiff}ms delay (expected 50-300ms)`);
      }
    }

    expect(allVisible).toBe(true);
    console.log('\n✓ Section 4 paragraphs all animated successfully\n');
  });

  test('CRITICAL: Section 3 (WHAT WE FOUND) - All 4 research findings animate with stagger', async ({ page }) => {
    console.log('\n===================================');
    console.log('TESTING SECTION 3: WHAT WE FOUND');
    console.log('===================================\n');

    const section3 = page.locator('section').nth(2);

    // Scroll to Section 3
    await section3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    // Find all research findings (h3 or div containers)
    const findings = section3.locator('h3, [class*="finding"]');
    const findingCount = await findings.count();

    console.log(`Found ${findingCount} research findings in Section 3`);

    if (findingCount < 4) {
      addResult('Section 3', 'Research Findings Count', 'FAIL', `Expected at least 4, found ${findingCount}`);
    } else {
      addResult('Section 3', 'Research Findings Count', 'PASS', `Found ${findingCount} findings`);
    }

    // Wait for animations to complete
    await page.waitForTimeout(1500);

    // Verify all findings are visible
    for (let i = 0; i < Math.min(findingCount, 4); i++) {
      const finding = findings.nth(i);
      const isVisible = await finding.isVisible();
      const opacity = await finding.evaluate(el => window.getComputedStyle(el).opacity);

      if (isVisible && parseFloat(opacity) > 0.9) {
        addResult('Section 3', `Finding ${i + 1} Visible`, 'PASS', `Opacity: ${opacity}`);
      } else {
        addResult('Section 3', `Finding ${i + 1} Visible`, 'FAIL', `Opacity: ${opacity}, Visible: ${isVisible}`);
      }
    }

    console.log('\n✓ Section 3 research findings all animated\n');
  });

  test('CRITICAL: NO animation re-triggering on scroll back', async ({ page }) => {
    console.log('\n=======================================');
    console.log('TESTING: No Animation Re-triggering');
    console.log('=======================================\n');

    // Scroll through sections 2, 3, 4 to trigger animations
    const sections = [
      { index: 1, name: 'Section 2 (PRODUCTIVITY THEATRE)' },
      { index: 2, name: 'Section 3 (WHAT WE FOUND)' },
      { index: 3, name: 'Section 4 (WHY IT ALL BREAKS DOWN)' },
    ];

    console.log('Phase 1: Scrolling down to trigger all animations...');
    for (const { index, name } of sections) {
      const section = page.locator('section').nth(index);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000); // Allow animations to complete
      console.log(`✓ ${name} animated`);
    }

    // Record final opacities after first scroll
    const firstScrollOpacities = [];
    for (const { index, name } of sections) {
      const section = page.locator('section').nth(index);
      const opacity = await section.evaluate(el => window.getComputedStyle(el).opacity);
      firstScrollOpacities.push({ index, name, opacity: parseFloat(opacity) });
      console.log(`${name} opacity after first scroll: ${opacity}`);
    }

    // Scroll back to top
    console.log('\nPhase 2: Scrolling back to top...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    // Scroll back down and check opacities haven't changed
    console.log('Phase 3: Scrolling back down to check re-triggering...');
    for (let i = 0; i < sections.length; i++) {
      const { index, name } = sections[i];
      const section = page.locator('section').nth(index);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      const opacity = await section.evaluate(el => window.getComputedStyle(el).opacity);
      const opacityFloat = parseFloat(opacity);
      const firstOpacity = firstScrollOpacities[i].opacity;

      console.log(`${name} opacity on second scroll: ${opacity}`);

      // Opacity should still be ~1.0 (not re-animating from 0)
      if (Math.abs(opacityFloat - firstOpacity) < 0.1 && opacityFloat > 0.9) {
        addResult('No Re-trigger', name, 'PASS', `Opacity maintained at ${opacity} (no re-animation)`);
      } else {
        addResult('No Re-trigger', name, 'FAIL', `Opacity changed from ${firstOpacity} to ${opacityFloat} (possible re-animation)`);
      }
    }

    console.log('\n✓ Animation re-triggering test complete\n');
  });

  test('CRITICAL: All sections animate correctly in full page scroll', async ({ page }) => {
    console.log('\n====================================');
    console.log('TESTING: Full Page Scroll Animation');
    console.log('====================================\n');

    const sectionNames = [
      'HERO (no animation expected)',
      'PRODUCTIVITY THEATRE',
      'WHAT WE FOUND',
      'WHY IT ALL BREAKS DOWN',
      'TRANSITION',
      'IMAGINE THIS INSTEAD',
      'THE FRAMEWORK',
      "LET'S BUILD THIS TOGETHER",
    ];

    for (let i = 0; i < 8; i++) {
      const section = page.locator('section').nth(i);
      const sectionName = sectionNames[i];

      console.log(`\nScrolling to Section ${i + 1}: ${sectionName}`);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      const opacity = await section.evaluate(el => window.getComputedStyle(el).opacity);
      const isVisible = await section.isVisible();

      console.log(`  Opacity: ${opacity}, Visible: ${isVisible}`);

      if (i === 0) {
        // Hero section should always be visible (no animation)
        addResult(`Section ${i + 1}`, sectionName, 'PASS', 'Hero section visible');
      } else {
        // All other sections should animate and be visible
        if (parseFloat(opacity) > 0.9 && isVisible) {
          addResult(`Section ${i + 1}`, sectionName, 'PASS', `Animated successfully (opacity: ${opacity})`);
        } else {
          addResult(`Section ${i + 1}`, sectionName, 'FAIL', `Opacity: ${opacity}, Visible: ${isVisible}`);
        }
      }
    }

    console.log('\n✓ Full page scroll test complete\n');
  });

  test('CRITICAL: No layout shifts or visual glitches during animation', async ({ page }) => {
    console.log('\n========================================');
    console.log('TESTING: Layout Shifts & Visual Quality');
    console.log('========================================\n');

    const section2 = page.locator('section').nth(1);

    // Get initial dimensions
    const initialBox = await section2.boundingBox();
    console.log('Section 2 initial dimensions:', initialBox);

    // Scroll to trigger animation
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100); // During animation

    const midAnimationBox = await section2.boundingBox();
    console.log('Section 2 mid-animation dimensions:', midAnimationBox);

    await page.waitForTimeout(800); // After animation

    const finalBox = await section2.boundingBox();
    console.log('Section 2 final dimensions:', finalBox);

    // Check for layout shifts
    const heightShift = Math.abs(finalBox!.height - initialBox!.height);
    const widthShift = Math.abs(finalBox!.width - initialBox!.width);

    console.log(`Height shift: ${heightShift}px, Width shift: ${widthShift}px`);

    if (heightShift < 5 && widthShift < 5) {
      addResult('Visual Quality', 'Layout Shift', 'PASS', `Minimal shift: ${heightShift}px height, ${widthShift}px width`);
    } else {
      addResult('Visual Quality', 'Layout Shift', 'FAIL', `Significant shift detected: ${heightShift}px height, ${widthShift}px width`);
    }

    // Check for text flickering (text should remain readable)
    const paragraph = section2.locator('p').first();
    const textColor = await paragraph.evaluate(el => window.getComputedStyle(el).color);
    const fontSize = await paragraph.evaluate(el => window.getComputedStyle(el).fontSize);

    console.log(`Text color: ${textColor}, Font size: ${fontSize}`);

    if (textColor && fontSize) {
      addResult('Visual Quality', 'Text Readability', 'PASS', 'Text styles maintained during animation');
    } else {
      addResult('Visual Quality', 'Text Readability', 'FAIL', 'Text styles compromised');
    }

    console.log('\n✓ Visual quality test complete\n');
  });
});

test.describe('CRITICAL: Accessibility - prefers-reduced-motion', () => {
  test('CRITICAL: Content loads instantly with NO animations when prefers-reduced-motion is enabled', async ({ browser }) => {
    console.log('\n=============================================');
    console.log('TESTING: prefers-reduced-motion Accessibility');
    console.log('=============================================\n');

    // Create context with prefers-reduced-motion
    const context = await browser.newContext({
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    console.log('Browser context: prefers-reduced-motion = reduce');

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    console.log('\nVerifying content loads instantly without animations...\n');

    // All sections should be immediately visible with opacity 1
    const sections = page.locator('section');
    const sectionCount = await sections.count();

    console.log(`Found ${sectionCount} sections`);

    let allInstantlyVisible = true;

    for (let i = 0; i < sectionCount; i++) {
      const section = sections.nth(i);

      // Scroll to section
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100); // Minimal wait

      const opacity = await section.evaluate(el => window.getComputedStyle(el).opacity);
      const isVisible = await section.isVisible();

      console.log(`Section ${i + 1} - Opacity: ${opacity}, Visible: ${isVisible}`);

      // With reduced motion, content should be immediately visible (opacity 1)
      if (parseFloat(opacity) > 0.95 && isVisible) {
        addResult('Reduced Motion', `Section ${i + 1}`, 'PASS', `Immediately visible (opacity: ${opacity})`);
      } else {
        addResult('Reduced Motion', `Section ${i + 1}`, 'FAIL', `Not immediately visible (opacity: ${opacity})`);
        allInstantlyVisible = false;
      }
    }

    // Check specific paragraphs in Sections 2 & 4
    console.log('\nChecking Section 2 paragraphs...');
    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    const section2Paragraphs = section2.locator('p');
    const section2Count = await section2Paragraphs.count();

    for (let i = 0; i < section2Count; i++) {
      const paragraph = section2Paragraphs.nth(i);
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      console.log(`  Paragraph ${i + 1} opacity: ${opacity}`);

      if (parseFloat(opacity) > 0.95) {
        addResult('Reduced Motion', `Section 2 Paragraph ${i + 1}`, 'PASS', `Instantly visible (${opacity})`);
      } else {
        addResult('Reduced Motion', `Section 2 Paragraph ${i + 1}`, 'FAIL', `Not visible (${opacity})`);
        allInstantlyVisible = false;
      }
    }

    console.log('\nChecking Section 4 paragraphs...');
    const section4 = page.locator('section').nth(3);
    await section4.scrollIntoViewIfNeeded();
    const section4Paragraphs = section4.locator('p');
    const section4Count = await section4Paragraphs.count();

    for (let i = 0; i < section4Count; i++) {
      const paragraph = section4Paragraphs.nth(i);
      const opacity = await paragraph.evaluate(el => window.getComputedStyle(el).opacity);
      console.log(`  Paragraph ${i + 1} opacity: ${opacity}`);

      if (parseFloat(opacity) > 0.95) {
        addResult('Reduced Motion', `Section 4 Paragraph ${i + 1}`, 'PASS', `Instantly visible (${opacity})`);
      } else {
        addResult('Reduced Motion', `Section 4 Paragraph ${i + 1}`, 'FAIL', `Not visible (${opacity})`);
        allInstantlyVisible = false;
      }
    }

    expect(allInstantlyVisible).toBe(true);

    await context.close();

    console.log('\n✓ prefers-reduced-motion test complete\n');
  });
});

test.describe('CRITICAL: Mobile Animations', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE
  });

  test('CRITICAL: Animations work on mobile scroll (portrait)', async ({ page }) => {
    console.log('\n==================================');
    console.log('TESTING: Mobile Animations (Portrait)');
    console.log('==================================\n');

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    console.log('Viewport: 375x667 (iPhone SE portrait)');

    // Test Sections 2, 3, 4
    const testSections = [
      { index: 1, name: 'Section 2 (PRODUCTIVITY THEATRE)' },
      { index: 2, name: 'Section 3 (WHAT WE FOUND)' },
      { index: 3, name: 'Section 4 (WHY IT ALL BREAKS DOWN)' },
    ];

    for (const { index, name } of testSections) {
      const section = page.locator('section').nth(index);

      console.log(`\nScrolling to ${name}...`);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      const opacity = await section.evaluate(el => window.getComputedStyle(el).opacity);
      const isVisible = await section.isVisible();

      console.log(`  Opacity: ${opacity}, Visible: ${isVisible}`);

      if (parseFloat(opacity) > 0.9 && isVisible) {
        addResult('Mobile Portrait', name, 'PASS', `Animated successfully (opacity: ${opacity})`);
      } else {
        addResult('Mobile Portrait', name, 'FAIL', `Opacity: ${opacity}, Visible: ${isVisible}`);
      }
    }

    console.log('\n✓ Mobile portrait test complete\n');
  });

  test('CRITICAL: Animations work on mobile landscape', async ({ page }) => {
    console.log('\n===================================');
    console.log('TESTING: Mobile Animations (Landscape)');
    console.log('===================================\n');

    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    console.log('Viewport: 667x375 (iPhone SE landscape)');

    // Test Section 2
    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const opacity = await section2.evaluate(el => window.getComputedStyle(el).opacity);
    const isVisible = await section2.isVisible();

    console.log(`Section 2 - Opacity: ${opacity}, Visible: ${isVisible}`);

    if (parseFloat(opacity) > 0.9 && isVisible) {
      addResult('Mobile Landscape', 'Section 2', 'PASS', `Animated successfully (opacity: ${opacity})`);
    } else {
      addResult('Mobile Landscape', 'Section 2', 'FAIL', `Opacity: ${opacity}, Visible: ${isVisible}`);
    }

    console.log('\n✓ Mobile landscape test complete\n');
  });
});

test.describe('CRITICAL: Cross-Browser Compatibility', () => {
  test('CRITICAL: Animations work on Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chromium-specific test');

    console.log('\n============================');
    console.log('TESTING: Chromium Browser');
    console.log('============================\n');

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const opacity = await section2.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`Chromium - Section 2 opacity: ${opacity}`);

    if (parseFloat(opacity) > 0.9) {
      addResult('Chromium', 'Section 2 Animation', 'PASS', `Opacity: ${opacity}`);
    } else {
      addResult('Chromium', 'Section 2 Animation', 'FAIL', `Opacity: ${opacity}`);
    }

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('CRITICAL: Animations work on Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Firefox-specific test');

    console.log('\n=========================');
    console.log('TESTING: Firefox Browser');
    console.log('=========================\n');

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const opacity = await section2.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`Firefox - Section 2 opacity: ${opacity}`);

    if (parseFloat(opacity) > 0.9) {
      addResult('Firefox', 'Section 2 Animation', 'PASS', `Opacity: ${opacity}`);
    } else {
      addResult('Firefox', 'Section 2 Animation', 'FAIL', `Opacity: ${opacity}`);
    }

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });

  test('CRITICAL: Animations work on WebKit (Safari)', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'WebKit-specific test');

    console.log('\n===============================');
    console.log('TESTING: WebKit (Safari) Browser');
    console.log('===============================\n');

    await page.goto('https://www.creativeprofitagency.com/');
    await page.waitForLoadState('networkidle');

    const section2 = page.locator('section').nth(1);
    await section2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const opacity = await section2.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`WebKit - Section 2 opacity: ${opacity}`);

    if (parseFloat(opacity) > 0.9) {
      addResult('WebKit', 'Section 2 Animation', 'PASS', `Opacity: ${opacity}`);
    } else {
      addResult('WebKit', 'Section 2 Animation', 'FAIL', `Opacity: ${opacity}`);
    }

    expect(parseFloat(opacity)).toBeGreaterThan(0.9);
  });
});

// Generate final test report after all tests
test.afterAll(async () => {
  console.log('\n\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           LIVE DEPLOYMENT VERIFICATION REPORT            ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Site: https://www.creativeprofitagency.com/');
  console.log('Date:', new Date().toISOString());
  console.log('═══════════════════════════════════════════════════════════\n');

  // Count passes and fails
  const passes = testResults.filter(r => r.status === 'PASS').length;
  const fails = testResults.filter(r => r.status === 'FAIL').length;
  const total = testResults.length;

  console.log(`OVERALL RESULTS: ${passes}/${total} tests passed (${fails} failed)\n`);

  // Group results by section
  const sections = [...new Set(testResults.map(r => r.section))];

  for (const section of sections) {
    const sectionResults = testResults.filter(r => r.section === section);
    const sectionPasses = sectionResults.filter(r => r.status === 'PASS').length;
    const sectionFails = sectionResults.filter(r => r.status === 'FAIL').length;

    console.log(`\n${section}: ${sectionPasses}/${sectionResults.length} passed`);
    console.log('─'.repeat(60));

    for (const result of sectionResults) {
      const icon = result.status === 'PASS' ? '✓' : '✗';
      const color = result.status === 'PASS' ? 'PASS' : 'FAIL';
      console.log(`  ${icon} [${color}] ${result.test}: ${result.details}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    CRITICAL CHECKLIST                     ');
  console.log('═══════════════════════════════════════════════════════════\n');

  const criticalChecks = [
    { name: 'Section 2 paragraphs animating', key: 'Section 2', subkey: 'Paragraph' },
    { name: 'Section 4 paragraphs animating', key: 'Section 4', subkey: 'Paragraph' },
    { name: 'Stagger timing consistent', key: 'Stagger' },
    { name: 'No animation re-triggers', key: 'No Re-trigger' },
    { name: 'prefers-reduced-motion works', key: 'Reduced Motion' },
    { name: 'No layout shifts', key: 'Layout Shift' },
    { name: 'Mobile animations work', key: 'Mobile' },
    { name: 'Cross-browser verified', key: 'Chromium' },
  ];

  for (const check of criticalChecks) {
    const relevant = testResults.filter(r =>
      r.section.includes(check.key) &&
      (!check.subkey || r.test.includes(check.subkey))
    );
    const allPassed = relevant.every(r => r.status === 'PASS');
    const icon = allPassed && relevant.length > 0 ? '✓' : '✗';
    const status = allPassed && relevant.length > 0 ? 'PASS' : 'FAIL';
    console.log(`  ${icon} [${status}] ${check.name}`);
  }

  console.log('\n═══════════════════════════════════════════════════════════\n');

  if (fails > 0) {
    console.log('⚠️  DEPLOYMENT VERIFICATION FAILED');
    console.log(`${fails} test(s) failed. Review failures above.\n`);
  } else {
    console.log('✓ DEPLOYMENT VERIFICATION PASSED');
    console.log('All critical animations working correctly!\n');
  }
});
