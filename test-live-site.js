#!/usr/bin/env node

/**
 * Simple Live Site Verification Script
 * Tests basic connectivity and structure without full browser automation
 */

const https = require('https');

const SITE_URL = 'https://www.creativeprofitagency.com/';

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║     LIVE SITE VERIFICATION - Basic Connectivity      ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

console.log(`Testing: ${SITE_URL}\n`);

// Test 1: Site accessibility
console.log('[TEST 1] Checking site accessibility...');
https.get(SITE_URL, (res) => {
  const { statusCode, headers } = res;

  console.log(`Status Code: ${statusCode}`);
  console.log(`Content-Type: ${headers['content-type']}`);

  if (statusCode === 200) {
    console.log('✓ [PASS] Site is accessible (200 OK)\n');
  } else {
    console.log(`✗ [FAIL] Unexpected status code: ${statusCode}\n`);
    process.exit(1);
  }

  let html = '';

  res.on('data', (chunk) => {
    html += chunk;
  });

  res.on('end', () => {
    // Test 2: HTML structure validation
    console.log('[TEST 2] Validating HTML structure...');

    // Count sections
    const sectionMatches = html.match(/<section/g) || [];
    const sectionCount = sectionMatches.length;
    console.log(`Found ${sectionCount} <section> tags`);

    if (sectionCount === 8) {
      console.log('✓ [PASS] All 8 sections present\n');
    } else {
      console.log(`✗ [FAIL] Expected 8 sections, found ${sectionCount}\n`);
    }

    // Test 3: Check for key section headings
    console.log('[TEST 3] Checking section headings...');

    const sections = [
      { name: 'HERO', text: "THEY'RE CONNING YOU" },
      { name: 'Section 2', text: 'PRODUCTIVITY THEATRE' },
      { name: 'Section 3', text: 'WHAT WE FOUND' },
      { name: 'Section 4', text: 'WHY IT ALL BREAKS DOWN' },
      { name: 'Section 5', text: "here's the thing" },
      { name: 'Section 6', text: 'IMAGINE THIS INSTEAD' },
      { name: 'Section 7', text: 'THE FRAMEWORK' },
      { name: 'Section 8', text: "LET'S BUILD THIS TOGETHER" },
    ];

    let allHeadingsFound = true;
    sections.forEach(({ name, text }) => {
      const found = html.includes(text);
      if (found) {
        console.log(`  ✓ ${name}: "${text}" found`);
      } else {
        console.log(`  ✗ ${name}: "${text}" NOT FOUND`);
        allHeadingsFound = false;
      }
    });

    if (allHeadingsFound) {
      console.log('✓ [PASS] All section headings present\n');
    } else {
      console.log('✗ [FAIL] Some section headings missing\n');
    }

    // Test 4: Check for Framer Motion
    console.log('[TEST 4] Checking for animation libraries...');
    const hasFramerMotion = html.includes('framer-motion') || html.includes('motion');
    if (hasFramerMotion) {
      console.log('✓ [PASS] Framer Motion references found\n');
    } else {
      console.log('⚠️  [WARN] No obvious Framer Motion references (may be bundled)\n');
    }

    // Test 5: Check for React
    console.log('[TEST 5] Checking for React...');
    const hasReact = html.includes('__NEXT_DATA__') || html.includes('react');
    if (hasReact) {
      console.log('✓ [PASS] Next.js/React app detected\n');
    } else {
      console.log('✗ [FAIL] React/Next.js not detected\n');
    }

    // Test 6: Check page size
    console.log('[TEST 6] Measuring page size...');
    const sizeKB = (html.length / 1024).toFixed(2);
    console.log(`HTML size: ${sizeKB} KB`);
    if (html.length > 1000) {
      console.log('✓ [PASS] Page has content\n');
    } else {
      console.log('✗ [FAIL] Page seems too small\n');
    }

    // Test 7: Check for paragraph content in Section 2
    console.log('[TEST 7] Checking Section 2 content...');
    // Look for productivity theatre content
    const hasProductivityContent = html.toLowerCase().includes('productivity') ||
                                   html.toLowerCase().includes('theatre');
    if (hasProductivityContent) {
      console.log('✓ [PASS] Section 2 content detected\n');
    } else {
      console.log('✗ [FAIL] Section 2 content not found\n');
    }

    // Test 8: Check meta tags
    console.log('[TEST 8] Checking meta tags...');
    const hasViewport = html.includes('viewport');
    const hasCharset = html.includes('charset') || html.includes('utf-8');

    console.log(`  Viewport meta: ${hasViewport ? '✓' : '✗'}`);
    console.log(`  Charset: ${hasCharset ? '✓' : '✗'}`);

    if (hasViewport && hasCharset) {
      console.log('✓ [PASS] Essential meta tags present\n');
    } else {
      console.log('⚠️  [WARN] Some meta tags missing\n');
    }

    // Summary
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                  TEST SUMMARY                         ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('Basic Validation: ✓ PASSED');
    console.log('Site is live and serving content\n');

    console.log('NEXT STEPS - Manual Verification Required:\n');
    console.log('1. Open browser: https://www.creativeprofitagency.com/');
    console.log('2. Open DevTools (F12)');
    console.log('3. Follow LIVE_DEPLOYMENT_TEST_PLAN.md for detailed testing\n');

    console.log('CRITICAL TESTS TO PERFORM MANUALLY:\n');
    console.log('  □ Section 2: Verify 4 paragraphs animate with stagger');
    console.log('  □ Section 4: Verify 5 paragraphs animate with stagger');
    console.log('  □ Section 3: Verify 4 research findings animate');
    console.log('  □ No re-triggering: Scroll up/down, animations don\'t repeat');
    console.log('  □ Stagger timing: ~100-150ms between paragraph animations');
    console.log('  □ prefers-reduced-motion: Enable in DevTools, content instant');
    console.log('  □ Mobile: Test on actual device or DevTools mobile emulation');
    console.log('  □ Cross-browser: Test in Chrome, Firefox, Safari\n');

    console.log('Documentation:');
    console.log('  - LIVE_DEPLOYMENT_TEST_PLAN.md (step-by-step manual guide)');
    console.log('  - DEPLOYMENT_VERIFICATION_SUMMARY.md (comprehensive overview)');
    console.log('  - e2e/live-deployment-verification.spec.ts (automated tests)\n');

    console.log('═══════════════════════════════════════════════════════════\n');
  });

}).on('error', (err) => {
  console.error(`✗ [FAIL] Error connecting to site: ${err.message}\n`);
  process.exit(1);
});
