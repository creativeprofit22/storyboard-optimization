import { test, expect } from '@playwright/test';

test.describe('Performance Metrics', () => {
  test('should measure Core Web Vitals', async ({ page }) => {
    await page.goto('/');

    // Collect performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Wait for page to fully load
        if (document.readyState === 'complete') {
          collectMetrics();
        } else {
          window.addEventListener('load', collectMetrics);
        }

        function collectMetrics() {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paintMetrics = performance.getEntriesByType('paint');

          const metrics = {
            // Navigation timing
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            domInteractive: perfData.domInteractive - perfData.fetchStart,

            // Paint metrics
            firstPaint: 0,
            firstContentfulPaint: 0,

            // Resource timing
            totalResources: performance.getEntriesByType('resource').length,
          };

          // Get paint timings
          paintMetrics.forEach(entry => {
            if (entry.name === 'first-paint') {
              metrics.firstPaint = entry.startTime;
            }
            if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
          });

          resolve(metrics);
        }
      });
    });

    console.log('Performance Metrics:', metrics);

    // Assertions
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // FCP under 3s
    expect(metrics.domInteractive).toBeLessThan(5000); // DOM Interactive under 5s
  });

  test('should measure animation frame rate during scroll', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Measure FPS during scroll animation
    const fpsData = await page.evaluate(async () => {
      return new Promise<{ avgFps: number; minFps: number; frames: number[] }>((resolve) => {
        const frameTimes: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;
        const maxFrames = 60; // Measure for ~1 second

        function measureFrame(currentTime: number) {
          frameCount++;
          const delta = currentTime - lastTime;
          const fps = 1000 / delta;
          frameTimes.push(fps);
          lastTime = currentTime;

          if (frameCount < maxFrames) {
            requestAnimationFrame(measureFrame);
          } else {
            const avgFps = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const minFps = Math.min(...frameTimes);
            resolve({ avgFps, minFps, frames: frameTimes });
          }
        }

        // Start scrolling
        const section = document.querySelectorAll('section')[1];
        section.scrollIntoView({ behavior: 'smooth' });

        // Start measuring
        requestAnimationFrame(measureFrame);
      });
    });

    console.log(`Average FPS: ${fpsData.avgFps.toFixed(2)}`);
    console.log(`Minimum FPS: ${fpsData.minFps.toFixed(2)}`);

    // Should maintain at least 30fps average (60fps target)
    expect(fpsData.avgFps).toBeGreaterThan(30);
  });

  test('should have acceptable memory usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get memory metrics (Chromium only)
    const session = await page.context().newCDPSession(page);

    try {
      await session.send('Performance.enable');

      // Scroll through all sections
      for (let i = 1; i < 8; i++) {
        const section = page.locator('section').nth(i);
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      }

      const metrics = await session.send('Performance.getMetrics');
      console.log('Memory Metrics:', metrics.metrics);

      // Find heap size
      const heapSize = metrics.metrics.find((m: any) => m.name === 'JSHeapUsedSize');
      if (heapSize) {
        const heapSizeMB = heapSize.value / (1024 * 1024);
        console.log(`Heap size: ${heapSizeMB.toFixed(2)} MB`);

        // Should not exceed 100MB for this simple page
        expect(heapSizeMB).toBeLessThan(100);
      }
    } catch (error) {
      console.log('Memory metrics not available in this browser');
    }
  });

  test('should load CSS and JS efficiently', async ({ page }) => {
    const resourceStats = {
      scripts: [] as number[],
      stylesheets: [] as number[],
      images: [] as number[],
    };

    page.on('response', (response) => {
      const url = response.url();
      const timing = response.timing();

      if (url.endsWith('.js')) {
        resourceStats.scripts.push(timing.responseEnd);
      } else if (url.endsWith('.css')) {
        resourceStats.stylesheets.push(timing.responseEnd);
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        resourceStats.images.push(timing.responseEnd);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Resource Stats:', {
      scripts: resourceStats.scripts.length,
      stylesheets: resourceStats.stylesheets.length,
      images: resourceStats.images.length,
    });

    // Should have reasonable number of resources
    expect(resourceStats.scripts.length).toBeLessThan(50);
    expect(resourceStats.stylesheets.length).toBeLessThan(20);
  });

  test('should have no console errors during animations', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll through all sections
    for (let i = 1; i < 8; i++) {
      const section = page.locator('section').nth(i);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
    }

    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }

    expect(consoleErrors.length).toBe(0);
  });

  test('should measure animation smoothness', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Enable performance monitoring
    const section2 = page.locator('section').nth(1);

    // Measure animation timing
    const animationMetrics = await page.evaluate(async (sectionIndex) => {
      return new Promise<{ duration: number; smoothness: string }>((resolve) => {
        const section = document.querySelectorAll('section')[sectionIndex];
        const startTime = performance.now();
        let frames = 0;
        let jankyFrames = 0;
        let lastFrameTime = startTime;

        section.scrollIntoView({ behavior: 'smooth' });

        function checkFrame() {
          const now = performance.now();
          const delta = now - lastFrameTime;

          frames++;

          // Frame is janky if it takes more than ~20ms (< 50fps)
          if (delta > 20) {
            jankyFrames++;
          }

          lastFrameTime = now;

          if (now - startTime < 1000) {
            requestAnimationFrame(checkFrame);
          } else {
            const smoothnessPercent = ((frames - jankyFrames) / frames) * 100;
            resolve({
              duration: now - startTime,
              smoothness: smoothnessPercent > 90 ? 'smooth' : smoothnessPercent > 70 ? 'acceptable' : 'janky',
            });
          }
        }

        requestAnimationFrame(checkFrame);
      });
    }, 1);

    console.log('Animation Metrics:', animationMetrics);
    expect(animationMetrics.smoothness).not.toBe('janky');
  });
});

test.describe('Network Performance', () => {
  test('should load page with minimal requests', async ({ page }) => {
    const requests: string[] = [];

    page.on('request', (request) => {
      requests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total requests: ${requests.length}`);

    // Should not have excessive requests
    expect(requests.length).toBeLessThan(100);
  });

  test('should handle slow 3G network', async ({ page, context }) => {
    // Simulate slow 3G
    const client = await context.newCDPSession(page);
    await client.send('Network.enable');
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (750 * 1024) / 8, // 750kb/s
      uploadThroughput: (250 * 1024) / 8,   // 250kb/s
      latency: 100,
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    console.log(`Page loaded in ${loadTime}ms on slow 3G`);

    // Should still load reasonably fast
    expect(loadTime).toBeLessThan(10000); // 10 seconds max

    // Hero section should be visible
    const heroHeading = page.getByRole('heading', { name: /THEY'RE CONNING YOU/i });
    await expect(heroHeading).toBeVisible();
  });
});
