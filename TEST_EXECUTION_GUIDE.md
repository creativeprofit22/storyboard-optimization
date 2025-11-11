# Test Execution Guide
## How to Run and Evaluate E2E Tests

---

## Quick Start

### Option 1: Run Automated Tests (Recommended)

```bash
# Navigate to project directory
cd /home/reaver47/Documents/agent-girl/storyboard-optimization/website

# Install system dependencies (Linux/WSL only, one-time)
sudo npx playwright install-deps

# Run all tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui
```

### Option 2: Manual Testing

Open the browser and test manually using the checklist below.

---

## Automated Test Execution

### 1. Full Test Suite (All Browsers)
```bash
npm run test:e2e
```
**What it tests:**
- All 8 sections
- Chrome, Firefox, Safari
- Mobile Chrome & Safari
- 19 animation tests
- 6 performance tests
- 9 visual regression tests

**Expected Duration:** 3-5 minutes

---

### 2. Animation Tests Only
```bash
npm run test:animations
```
**Coverage:**
- Section visibility
- Fade-in effects
- Slide-up animations
- No re-trigger behavior
- Staggered children
- Mobile touch scroll

**Expected Duration:** 1-2 minutes

---

### 3. Performance Tests Only
```bash
npm run test:performance
```
**Measures:**
- FPS during scroll
- Memory usage
- Core Web Vitals
- Console errors
- Animation smoothness

**Expected Duration:** 2-3 minutes

---

### 4. Single Browser Tests
```bash
# Chrome only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox

# Safari only (macOS)
npm run test:e2e:webkit

# Mobile only
npm run test:e2e:mobile
```

---

### 5. Debug Mode
```bash
npm run test:e2e:debug
```
**Features:**
- Step through tests
- Pause on errors
- Inspect elements
- View screenshots

---

### 6. View Test Report
```bash
npm run test:report
```
Opens HTML report with:
- Pass/fail summary
- Screenshots of failures
- Performance metrics
- Video recordings

---

## Manual Testing Protocol

### Test Environment Setup
1. Clear browser cache
2. Disable browser extensions
3. Set viewport to 1920x1080 (desktop) or 375x667 (mobile)
4. Open DevTools (F12)

### Test URL
https://www.creativeprofitagency.com/

---

## Manual Test Checklist

### STEP 1: Initial Page Load
```
1. Navigate to URL
2. Wait for page to fully load
3. Verify Hero section visible immediately
4. Open DevTools Console - check for errors
5. Open DevTools Performance tab - start recording
```

**Expected Result:**
- Hero heading "THEY'RE CONNING YOU, MATE." visible
- No console errors
- Page interactive within 3 seconds

---

### STEP 2: Section 2 - PRODUCTIVITY THEATRE
```
1. Slowly scroll down until section enters viewport
2. Observe animation:
   - Starts faded out (opacity 0)
   - Fades in over ~600ms
   - Slides up slightly
3. Note animation quality (smooth/janky)
4. Scroll back up to Hero
5. Scroll down to Section 2 again
```

**Expected Result:**
- ✓ Smooth fade-in animation
- ✓ Slide-up effect visible
- ✓ Animation completes in ~600ms
- ✓ No re-animation on second visit
- ✓ No text jumping or layout shift

**Record:**
- Animation Quality: _______ (Smooth / Acceptable / Janky)
- Re-trigger: _______ (Yes = FAIL / No = PASS)

---

### STEP 3: Section 3 - WHAT WE FOUND
```
1. Scroll to section
2. Observe main section fade-in
3. Watch child elements (4 subsections)
4. Count stagger delay between children
5. Verify all 4 subsections appear
```

**Expected Result:**
- ✓ Main section animates first
- ✓ 4 subsections stagger in sequentially
- ✓ ~100ms delay between each child
- ✓ All text readable during animation

**Record:**
- Stagger Working: _______ (Yes / No)
- Children Counted: _______ (Expected: 4)

---

### STEP 4: Section 4 - WHY IT ALL BREAKS DOWN
```
1. Scroll to section
2. Note background color (light)
3. Observe paragraph stagger
4. Check orange text visibility
```

**Expected Result:**
- ✓ Light background section animates
- ✓ Paragraphs stagger in
- ✓ Orange highlight text visible
- ✓ Good contrast throughout

---

### STEP 5: Section 5 - TRANSITION
```
1. Scroll to short transition section
2. Verify orange heading animates
3. Check centered layout
```

**Expected Result:**
- ✓ Section fades in
- ✓ Text centered
- ✓ Orange color preserved

---

### STEP 6: Section 6 - IMAGINE THIS INSTEAD
```
1. Scroll to section
2. Observe animation
3. Check paragraph stagger
```

**Expected Result:**
- ✓ Section animates smoothly
- ✓ Staggered paragraphs
- ✓ Light background

---

### STEP 7: Section 7 - THE FRAMEWORK
```
1. Scroll to section
2. Count framework principles (should be 5)
3. Watch stagger animation
4. Note numbered headings in orange
```

**Expected Result:**
- ✓ Dark background section
- ✓ 5 principles stagger in
- ✓ Orange numbered headings (1-5)
- ✓ Smooth sequential animation

**Record:**
- Principles Counted: _______ (Expected: 5)

---

### STEP 8: Section 8 - LET'S BUILD THIS TOGETHER
```
1. Scroll to final section
2. Verify animation at page bottom
3. Check CTA box visibility
```

**Expected Result:**
- ✓ Final section animates
- ✓ Dark box CTA visible
- ✓ No animation issues at bottom

---

### STEP 9: Performance Check
```
1. Stop DevTools Performance recording
2. Review timeline:
   - Check FPS graph (should be mostly green, 60fps)
   - Look for red/yellow sections (jank)
   - Review rendering time per frame
3. Open DevTools → Lighthouse
4. Run Performance audit
```

**Expected Metrics:**
- FPS: _______ (Target: 60, Min: 30)
- Lighthouse Performance Score: _______ (Target: >80)
- Largest Contentful Paint: _______ (Target: <2.5s)
- Total Blocking Time: _______ (Target: <300ms)

---

### STEP 10: Mobile Testing
```
1. Open DevTools Device Toolbar (Ctrl+Shift+M)
2. Select "iPhone 13" or "Pixel 5"
3. Reload page
4. Scroll through all sections with mouse drag (simulates touch)
5. Try fast flick scrolling
```

**Expected Result:**
- ✓ All sections responsive
- ✓ Animations trigger on scroll
- ✓ No breaking during fast scroll
- ✓ Text readable on mobile

---

### STEP 11: Cross-Browser Testing

#### Firefox
```
1. Open https://www.creativeprofitagency.com/ in Firefox
2. Repeat Steps 1-8
3. Note any differences
```

#### Safari (macOS only)
```
1. Open URL in Safari
2. Repeat Steps 1-8
3. Note any differences
```

**Record:**
- Chrome: _______ (PASS / FAIL)
- Firefox: _______ (PASS / FAIL)
- Safari: _______ (PASS / FAIL)

---

## Results Interpretation

### Pass Criteria
✓ All 8 sections present and visible
✓ Sections 2-8 animate on scroll
✓ Animations smooth (>30 FPS)
✓ No re-triggering on scroll back
✓ No console errors
✓ No layout shifts
✓ Text readable throughout
✓ Works on mobile
✓ Works in 3+ browsers

### Fail Criteria
✗ Sections missing
✗ Animations not triggering
✗ Janky animations (<30 FPS)
✗ Re-animation on scroll back
✗ Console errors present
✗ Text jumping/layout shifts
✗ Mobile broken
✗ Browser incompatibilities

---

## Troubleshooting

### Issue: Tests fail to run
```bash
# Check Node.js version (need 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reinstall Playwright browsers
npx playwright install --with-deps
```

### Issue: Timeout errors
```bash
# Increase timeout in playwright.config.ts
timeout: 120000  # 2 minutes
```

### Issue: Browser won't launch (WSL)
```bash
# Install system dependencies
sudo apt-get update
sudo apt-get install libnspr4 libnss3 libasound2 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2
```

### Issue: "Cannot find module" errors
```bash
# Rebuild TypeScript
npm run build
```

---

## Test Report Template

### Test Execution Report
**Date:** ______________
**Tester:** ______________
**Environment:** ______________

### Browser Coverage
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Test Results
| Test Category | Status | Notes |
|--------------|--------|-------|
| Section Visibility | ⬜ PASS ⬜ FAIL | |
| Animation Triggers | ⬜ PASS ⬜ FAIL | |
| Animation Smoothness | ⬜ PASS ⬜ FAIL | |
| No Re-trigger | ⬜ PASS ⬜ FAIL | |
| Stagger Effects | ⬜ PASS ⬜ FAIL | |
| Mobile Responsive | ⬜ PASS ⬜ FAIL | |
| Performance (>30 FPS) | ⬜ PASS ⬜ FAIL | |
| No Console Errors | ⬜ PASS ⬜ FAIL | |

### Performance Metrics
- Average FPS: _______
- Lighthouse Score: _______
- Load Time: _______
- Memory Usage: _______

### Issues Found
1. _______________________________________
2. _______________________________________
3. _______________________________________

### Overall Assessment
⬜ PASS - All tests passed, ready for production
⬜ PASS WITH NOTES - Minor issues, acceptable
⬜ FAIL - Critical issues, needs fixing

### Screenshots/Videos
Attach evidence of any failures or interesting findings.

---

## Next Steps After Testing

### If Tests Pass
1. Generate test report: `npm run test:report`
2. Archive results for documentation
3. Update deployment status
4. Monitor production metrics

### If Tests Fail
1. Review failure screenshots in `playwright-report/`
2. Check specific failing test in test output
3. Debug with: `npm run test:e2e:debug`
4. Fix issues in code
5. Re-run tests
6. Document fixes

---

## Continuous Monitoring

### Post-Deployment
- Run tests against production URL
- Set up monitoring for:
  - Animation performance
  - FPS metrics
  - Console errors
  - User experience metrics

### Regression Testing
- Run tests before each deployment
- Include in CI/CD pipeline
- Maintain baseline screenshots

---

## Additional Resources

- **Playwright Docs**: https://playwright.dev
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Web Vitals**: https://web.dev/vitals/
- **Chrome DevTools**: https://developer.chrome.com/docs/devtools/

---

## Support

For questions or issues:
1. Check test file comments
2. Review E2E_TEST_DOCUMENTATION.md
3. Check Playwright documentation
4. Review animation code in AnimatedSection.tsx
