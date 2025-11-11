# Quick Test Reference Card

## Instant Commands

```bash
# Run all tests
npm run test:e2e

# Interactive UI mode (best for debugging)
npm run test:e2e:ui

# Run and watch browser
npm run test:e2e:headed

# Specific test suites
npm run test:animations
npm run test:performance
npm run test:visual

# View report
npm run test:report
```

---

## Manual Testing - 5 Minute Quick Check

1. **Open**: https://www.creativeprofitagency.com/
2. **Check Hero**: Visible immediately? ✓/✗
3. **Scroll Section 2**: Fades in smoothly? ✓/✗
4. **Scroll Back Up, Then Down**: Animation re-triggers? Should be NO ✓/✗
5. **Scroll Section 3**: 4 items stagger in? ✓/✗
6. **Check DevTools**: Any console errors? Should be NO ✓/✗
7. **Open Mobile View**: Animations work? ✓/✗

**Result**: All ✓ = PASS

---

## Expected Behavior Summary

### Section 1 (Hero)
- No animation
- Immediately visible

### Sections 2-8
- Start: opacity 0, translateY 20px
- End: opacity 1, translateY 0
- Duration: 600ms
- Trigger: Once on entering viewport
- No re-trigger on scroll back

### Section 3 Special
- 4 child elements
- Stagger 100ms apart

### Section 7 Special
- 5 framework principles
- Stagger 100ms apart

---

## Performance Targets

| Metric | Target | Minimum |
|--------|--------|---------|
| FPS | 60 | 30 |
| Animation Duration | 600ms | 800ms |
| Page Load | 2s | 3s |
| Memory | 50MB | 100MB |
| Console Errors | 0 | 0 |

---

## Files Quick Reference

| File | Purpose |
|------|---------|
| `e2e/scroll-animations.spec.ts` | Main tests |
| `e2e/performance.spec.ts` | Speed tests |
| `e2e/visual-regression.spec.ts` | Screenshot tests |
| `E2E_TEST_DOCUMENTATION.md` | Full docs |
| `TEST_EXECUTION_GUIDE.md` | How to test |

---

## Troubleshooting

**Tests won't run?**
```bash
sudo npx playwright install-deps
```

**Need to debug?**
```bash
npm run test:e2e:debug
```

**Update screenshots?**
```bash
npm run test:visual -- --update-snapshots
```

---

## Browser Checklist

- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## Pass/Fail Quick Check

**PASS = All of:**
- ✓ 8 sections visible
- ✓ Animations smooth
- ✓ No re-triggering
- ✓ No errors
- ✓ Works on mobile
- ✓ 3+ browsers tested

**FAIL = Any of:**
- ✗ Sections missing
- ✗ Janky animations
- ✗ Re-triggering
- ✗ Console errors
- ✗ Mobile broken
- ✗ Browser issues
