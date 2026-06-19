// k6/journeys/explore-geo.js
// Browser journey: navigate to /explorar → detect location → wait for nearby results → verify map
// Thresholds: p95 LCP < 3s, p99 LCP < 4s, error < 1%
//
// Flow:
//   1. Navigate to /explorar
//   2. Click the "Detect my location" button (triggers browser geolocation API)
//   3. Wait for getReviewsNearby RPC to return results
//   4. Verify property cards appear
//   5. Verify map renders
//
// The test page context grants geolocation permission so the browser dialog
// is automatically accepted.

import { browser } from 'k6/browser';
import { check } from 'k6';
import { validateEnv, BASE_URL, THRESHOLDS, STAGES_LIGHT } from '../shared/config.js';

// Montevideo coordinates for geolocation mock
const TEST_LATITUDE = -34.9011;
const TEST_LONGITUDE = -56.1645;

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
  const exploreUrl = `${BASE_URL}/explorar`;
  console.log(`[explore-geo] Starting browser journey against ${exploreUrl}`);
  return { exploreUrl };
}

export default async function (data) {
  const page = await browser.newPage();

  try {
    // Grant geolocation permission and mock coordinates BEFORE navigation
    // This bypasses the browser permission dialog
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({
      latitude: TEST_LATITUDE,
      longitude: TEST_LONGITUDE,
      accuracy: 100,
    });

    // Navigate to explore page
    const res = await page.goto(data.exploreUrl, { waitUntil: 'load' });

    check(res, {
      'explore page loads': (r) => r.status === 200,
    });

    // Look for the "Detect my location" button or geolocation trigger
    // The explore page has a geolocation button — try multiple selectors
    const geoButtonSelectors = [
      'button:has-text("Detectar")',
      'button:has-text("ubicación")',
      'button:has-text("location")',
      '[data-testid="detect-location"]',
      'button:has-text("Cerca de mí")',
    ];

    let geoButton = null;
    for (const selector of geoButtonSelectors) {
      const btn = page.locator(selector);
      const btnCount = await btn.count();
      if (btnCount > 0) {
        geoButton = btn;
        console.log(`[explore-geo] Found geolocation button with selector: ${selector}`);
        break;
      }
    }

    if (geoButton) {
      await geoButton.click();

      // Wait for results to load (getReviewsNearby RPC + map render)
      await page.waitForTimeout(5000);
    } else {
      // If no geolocation button found, the page may auto-detect on load
      // or the user needs to type in the search box first
      console.warn('[explore-geo] No geolocation button found, waiting for auto-detect');
      await page.waitForTimeout(5000);
    }

    // Verify property cards or results appear
    // The explore page shows property cards with data-testid="property-card"
    // or search results with data-testid="search-result"
    const propertyCards = page.locator('[data-testid="property-card"]');
    const searchResults = page.locator('[data-testid="search-result"]');

    const cardCount = await propertyCards.count();
    const resultCount = await searchResults.count();

    check(null, {
      'property cards or results visible': () => cardCount > 0 || resultCount > 0,
    });

    console.log(`[explore-geo] Found ${cardCount} property cards, ${resultCount} search results`);

    // Check that the Leaflet map is rendered
    // Leaflet renders a div with class "leaflet-container"
    const mapContainer = page.locator('.leaflet-container');
    const mapVisible = await mapContainer.count();

    check(null, {
      'map is rendered': () => mapVisible > 0,
    });

    await page.screenshot({ path: 'k6/reports/explore-geo.png' });
    console.log('[explore-geo] Screenshot saved to k6/reports/explore-geo.png');
  } finally {
    await page.close();
  }
}
