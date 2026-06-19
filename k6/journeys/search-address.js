// k6/journeys/search-address.js
// Browser journey: navigate home → type address → select from Nominatim autocomplete → navigate to address page
// Thresholds: p95 LCP < 3s, p99 LCP < 4s, error < 1%
//
// Flow:
//   1. GET / (redirects to /home)
//   2. Find the address search input
//   3. Type a city name (triggers Nominatim debounced autocomplete)
//   4. Wait for results popover to appear
//   5. Click on the first result
//   6. Verify navigation to /address/[osmId]
//
// External dependency: Nominatim API (openstreetmap.org)
// The nominatim-stub.js module provides fixtures for offline testing.

import { browser } from 'k6/browser';
import { check } from 'k6';
import { validateEnv, BASE_URL, THRESHOLDS, STAGES_LIGHT } from '../shared/config.js';

// No teardown needed — cleanup handled by workflow-level cleanup job.

export const options = {
  scenarios: {
    browser_test: {
      executor: 'ramping-vus',
      stages: STAGES_LIGHT,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: THRESHOLDS.browserPage,
};

export function setup() {
  validateEnv();
  console.log(`[search-address] Starting browser journey against ${BASE_URL}`);
  return { baseUrl: BASE_URL };
}

export default async function (data) {
  const page = await browser.newPage();

  try {
    // Navigate to home (which redirects to /home)
    const res = await page.goto(data.baseUrl, { waitUntil: 'load' });
    await page.waitForSelector('body', { timeout: 10000 });

    check(res, {
      'home page loads': (r) => r.status === 200,
    });

    // Find the address search input by its placeholder text
    // The AsyncSearchSelect uses "Escribe ciudad (ej: Mon...)" as placeholder
    const searchInput = page.locator('input[placeholder="Escribe ciudad (ej: Mon...)"]');
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });

    // Type a city name to trigger Nominatim autocomplete
    // The component requires 3+ characters before it opens the popover
    await searchInput.fill('Montevideo');

    // Wait for the popover results to appear (Nominatim has debounce + network latency)
    // The popover contains CommandItem elements with role="option"
    const resultItem = page.locator('[role="option"]');
    await resultItem.first().waitFor({ state: 'visible', timeout: 15000 });

    // Verify we have results
    const resultCount = await resultItem.count();
    check(null, {
      'address search results appear': () => resultCount > 0,
    });

    if (resultCount > 0) {
      // Click the first result
      await resultItem.first().click();

      // Wait for navigation to the address page
      // After selecting, the app navigates to /address/[osmId]
      await page.waitForTimeout(2000);

      const currentUrl = page.url();
      const navigatedToAddress = currentUrl.includes('/address/');
      check(null, {
        'navigated to address page': () => navigatedToAddress,
      });

      console.log(`[search-address] Navigated to: ${currentUrl}`);
    } else {
      console.warn('[search-address] No address results appeared');
    }
  } finally {
    await page.close();
  }
}
