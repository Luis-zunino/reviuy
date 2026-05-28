// k6/journeys/home.js
// Browser journey: GET /, wait for [data-testid="property-card"]
// Thresholds: p95 LCP < 3s, p99 LCP < 4s, error < 1%

import { browser } from 'k6/browser';
import { check } from 'k6';
import { validateEnv, BASE_URL, THRESHOLDS, STAGES_DEFAULT } from '../shared/config.js';
import { cleanup } from '../shared/cleanup.js';

export const options = {
  stages: STAGES_DEFAULT,
  thresholds: THRESHOLDS.browserPage,
};

export function setup() {
  validateEnv();
  console.log(`[home] Starting browser journey against ${BASE_URL}`);
  return { baseUrl: BASE_URL };
}

export default function (data) {
  const page = browser.newPage();

  try {
    const res = page.goto(data.baseUrl, { waitUntil: 'load' });
    page.waitForSelector('[data-testid="property-card"]', {
      timeout: 10000,
    });

    check(res, {
      'home page status is 200': (r) => r.status === 200,
      'property cards are visible': () => {
        const cards = page.locator('[data-testid="property-card"]');
        return cards.count() > 0;
      },
    });

    // Artificial think时间 to simulate user behavior
    page.waitForTimeout(1000);
  } finally {
    page.close();
  }
}

export function teardown() {
  cleanup();
}
