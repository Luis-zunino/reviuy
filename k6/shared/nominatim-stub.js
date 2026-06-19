// k6/shared/nominatim-stub.js
// Provides cached Nominatim fixture data for route interception.
//
// Browser journeys use stubRoute() to intercept Nominatim calls via page.route().
// HTTP journeys use the raw fixtures directly if needed.

import { SharedArray } from 'k6/data';

// Load fixtures at init time (once, shared across all VUs)
const fixtures = new SharedArray('nominatim', function () {
  const raw = JSON.parse(open('../fixtures/nominatim.json'));
  return raw;
});

/**
 * Returns all fixture entries for use in HTTP journeys.
 * @returns {Array}
 */
export function getAllFixtures() {
  return fixtures;
}

/**
 * Returns the first matching fixture for a query string.
 * @param {string} query - Address search query
 * @returns {object|null}
 */
export function findFixture(query) {
  if (!query) return fixtures[0] || null;

  const q = query.toLowerCase();
  const match = fixtures.find((f) => f.query && q.includes(f.query.toLowerCase()));
  return match || fixtures[0] || null;
}
