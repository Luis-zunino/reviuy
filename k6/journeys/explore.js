// k6/journeys/explore.js
// Browser journey: GET /explorar, type "test property", wait for results
// Thresholds: API < 500ms, page < 3s, error < 1%

import { browser } from 'k6/browser';
import { check } from 'k6';
import { validateEnv, BASE_URL, THRESHOLDS, STAGES_DEFAULT } from '../shared/config.js';

// Explore uses browser page thresholds (shared from config)
import { cleanup } from '../shared/cleanup.js';

// The explore page route — using the actual app route (/explorar)
const EXPLORE_PATH = '/explorar';

export const options = {
  scenarios: {
    browser_test: {
      executor: 'ramping-vus',
      stages: STAGES_DEFAULT,
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
  console.log(`[explore] Starting browser journey against ${BASE_URL}${EXPLORE_PATH}`);
  return { baseUrl: BASE_URL, exploreUrl: `${BASE_URL}${EXPLORE_PATH}` };
}

export default async function (data) {
  const page = await browser.newPage();

  try {
    // Navigate to explore page
    const res = await page.goto(data.exploreUrl, { waitUntil: 'load' });

    check(res, {
      'explore page status is 200': (r) => r.status === 200,
    });

    // Find the search input and type a query (fill is faster than type for load tests)
    const searchInput = page.locator(
      'input[type="text"], input[type="search"], [data-testid="search-input"]'
    );
    if (searchInput) {
      await searchInput.fill('test property');
    }

    // Wait for results to appear
    await page.waitForTimeout(2000);

    // Check that property cards or results are visible
    const results = page.locator('[data-testid="property-card"], [data-testid="search-result"]');
    check(null, {
      'search results are visible': async () => results && (await results.count()) > 0,
    });

    // Artificial think time
    await page.waitForTimeout(1000);
  } finally {
    await page.close();
  }
}

export function teardown() {
  cleanup();
}
