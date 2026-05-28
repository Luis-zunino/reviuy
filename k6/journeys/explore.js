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
  stages: STAGES_DEFAULT,
  thresholds: THRESHOLDS.browserPage,
};

export function setup() {
  validateEnv();
  console.log(`[explore] Starting browser journey against ${BASE_URL}${EXPLORE_PATH}`);
  return { baseUrl: BASE_URL, exploreUrl: `${BASE_URL}${EXPLORE_PATH}` };
}

export default function (data) {
  const page = browser.newPage();

  try {
    // Navigate to explore page
    const res = page.goto(data.exploreUrl, { waitUntil: 'load' });

    check(res, {
      'explore page status is 200': (r) => r.status === 200,
    });

    // Find the search input and type a query (fill is faster than type for load tests)
    const searchInput = page.locator(
      'input[type="text"], input[type="search"], [data-testid="search-input"]'
    );
    if (searchInput) {
      searchInput.fill('test property');
    }

    // Wait for results to appear
    page.waitForTimeout(2000);

    // Check that property cards or results are visible
    const results = page.locator('[data-testid="property-card"], [data-testid="search-result"]');
    check(null, {
      'search results are visible': () => results && results.count() > 0,
    });

    // Artificial think time
    page.waitForTimeout(1000);
  } finally {
    page.close();
  }
}

export function teardown() {
  cleanup();
}
