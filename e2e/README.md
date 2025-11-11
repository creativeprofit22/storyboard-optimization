# E2E Test Suite
## Scroll Animation Testing

This directory contains comprehensive end-to-end tests for the scroll animations on Creative Profit Agency website.

---

## Test Files

### `scroll-animations.spec.ts`
Main animation testing suite with 19 tests covering:
- Section visibility and loading
- Animation triggers on scroll
- No re-triggering behavior
- Staggered child animations
- Mobile touch scrolling
- Cross-browser compatibility
- Edge cases (zoom, small viewports, etc.)

### `performance.spec.ts`
Performance and optimization tests with 6+ tests:
- Core Web Vitals (FCP, LCP, CLS)
- Frame rate measurement (60 FPS target)
- Memory usage monitoring
- Animation smoothness
- Network performance
- Console error detection

### `visual-regression.spec.ts`
Screenshot-based visual testing with 9 tests:
- Before/after animation screenshots
- Full page screenshots
- Mobile/tablet/desktop viewports
- Color and contrast verification
- No visual glitches during animation

### `page-objects/HomePage.ts`
Page Object Model for maintainable tests:
- Section locators
- Helper methods for scrolling
- Animation measurement utilities
- Opacity and transform getters

---

## Quick Start

```bash
# Install dependencies (first time only)
npm install

# Install browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run specific suite
npm run test:animations
npm run test:performance
npm run test:visual

# Interactive mode
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

---

## Test Coverage

### Sections Tested
1. ✓ HERO - No animation (baseline)
2. ✓ PRODUCTIVITY THEATRE - Fade + slide + stagger
3. ✓ WHAT WE FOUND - Staggered children (4 items)
4. ✓ WHY IT ALL BREAKS DOWN - Light background animation
5. ✓ TRANSITION - Short section
6. ✓ IMAGINE THIS INSTEAD - Staggered paragraphs
7. ✓ THE FRAMEWORK - 5 principles stagger
8. ✓ LET'S BUILD THIS TOGETHER - Final CTA

### Browsers Tested
- Chrome (Desktop + Mobile)
- Firefox (Desktop + Mobile)
- Safari/WebKit (Desktop + Mobile)

### Devices Tested
- Desktop: 1920x1080, 1280x720
- Tablet: 768x1024
- Mobile: iPhone 13 (390x844), Pixel 5 (393x851)

---

## Test Architecture

```
e2e/
├── scroll-animations.spec.ts    # Main animation tests
├── performance.spec.ts           # Performance metrics
├── visual-regression.spec.ts     # Screenshot tests
├── page-objects/
│   └── HomePage.ts              # Page object pattern
└── README.md                    # This file
```

---

## Writing New Tests

### Using Page Object
```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/HomePage';

test('my new test', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.scrollToSection('productivityTheatre');
  await homePage.waitForSectionAnimation('productivityTheatre');

  const opacity = await homePage.getSectionOpacity('productivityTheatre');
  expect(opacity).toBeGreaterThan(0.9);
});
```

### Testing Animation Timing
```typescript
test('animation completes quickly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  const duration = await homePage.measureAnimationTiming('whatWeFound');
  expect(duration).toBeLessThan(1000); // 1 second max
});
```

### Checking for Layout Shifts
```typescript
test('no layout shift', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  const result = await homePage.checkForLayoutShift('theFramework');
  expect(result.shifted).toBe(false);
});
```

---

## Common Assertions

```typescript
// Section is visible
await expect(homePage.sections.hero).toBeVisible();

// Animation completed (high opacity)
const opacity = await homePage.getSectionOpacity('productivityTheatre');
expect(opacity).toBeGreaterThan(0.9);

// Correct number of elements
const count = await homePage.getSectionCount();
expect(count).toBe(8);

// Heading text matches
await homePage.verifySectionHeading('hero', /THEY'RE CONNING YOU/);

// No console errors
const errors = await homePage.captureConsoleErrors();
expect(errors.length).toBe(0);
```

---

## Debugging Tips

### View Browser
```bash
npm run test:e2e:headed
```

### Slow Down Tests
```typescript
test.use({
  launchOptions: { slowMo: 1000 } // 1 second between actions
});
```

### Take Screenshot
```typescript
await page.screenshot({ path: 'debug-screenshot.png' });
```

### Pause Test
```typescript
await page.pause(); // Opens Playwright Inspector
```

### Console Logging
```typescript
console.log('Section opacity:', await homePage.getSectionOpacity('hero'));
```

---

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: |
    npx playwright install --with-deps
    npm run test:e2e

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

### GitLab CI
```yaml
e2e_tests:
  script:
    - npm ci
    - npx playwright install --with-deps
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
```

---

## Performance Benchmarks

### Current Targets
- FPS: 60 (minimum 30)
- Animation duration: 600ms
- FCP: < 3 seconds
- Memory: < 100MB
- No console errors
- No layout shifts

### Measuring Performance
```bash
npm run test:performance -- --project=chromium
```

---

## Visual Regression

### Update Baseline Screenshots
```bash
npm run test:visual -- --update-snapshots
```

### Compare Screenshots
```bash
npm run test:visual
```

Diff images are saved to `test-results/` on failure.

---

## Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Check network speed
- Verify site is accessible

### Flaky Tests
- Add proper waits: `await page.waitForLoadState('networkidle')`
- Use `waitForFunction` for dynamic content
- Avoid hard-coded timeouts

### Screenshot Mismatches
- Update baselines: `--update-snapshots`
- Check for dynamic content (dates, randomness)
- Verify consistent viewport sizes

---

## Best Practices

1. **Use Page Objects**: Keep tests maintainable
2. **Wait Properly**: Use `waitFor*` methods, not `setTimeout`
3. **Stable Selectors**: Use `getByRole`, `getByText` over CSS selectors
4. **Parallel Safe**: Tests should not depend on each other
5. **Clean State**: Each test starts fresh
6. **Meaningful Names**: Describe what you're testing
7. **Error Messages**: Add context to assertions

---

## Test Maintenance

### When to Update Tests
- Animation timing changes
- New sections added
- Layout modifications
- Performance regressions
- Browser updates

### Regular Tasks
- Update Playwright: `npm update @playwright/test`
- Update browsers: `npx playwright install`
- Review test reports weekly
- Update baselines when design changes

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Test Execution Guide](../TEST_EXECUTION_GUIDE.md)
- [Full Test Documentation](../E2E_TEST_DOCUMENTATION.md)
- [Animation Implementation](../src/components/AnimatedSection.tsx)

---

## Test Statistics

- **Total Tests**: 34+
- **Test Suites**: 3
- **Browser Configs**: 5
- **Average Runtime**: 3-5 minutes
- **Coverage**: 8 sections, all animations
