// k6/journeys/home.js
// Browser journey: GET /, wait for [data-testid="property-card"]
// Thresholds: p95 LCP < 3s, p99 LCP < 4s, error < 1%

import { browser } from 'k6/browser';
import { check } from 'k6';
import { validateEnv, BASE_URL, THRESHOLDS, STAGES_DEFAULT } from '../shared/config.js';

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
  console.log(`[home] Starting browser journey against ${BASE_URL}`);
  return { baseUrl: BASE_URL };
}

export default async function (data) {
  const page = await browser.newPage();

  try {
    const res = await page.goto(data.baseUrl, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="property-card"]', {
      timeout: 10000,
    });

    check(res, {
      'home page status is 200': (r) => r.status === 200,
      'property cards are visible': async () => {
        const cards = page.locator('[data-testid="property-card"]');
        return (await cards.count()) > 0;
      },
    });

    // Artificial think time to simulate user behavior
    await page.waitForTimeout(1000);
  } finally {
    await page.close();
  }
}

export function teardown() {
  // Cleanup handled by workflow-level cleanup job after all journeys complete.
}
