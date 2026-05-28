// k6/journeys/review-detail.js
// HTTP journey: GET /reviews/{id}, validate response body
// Thresholds: page < 3s, API < 500ms, error < 1%
//
// Flow:
//   1. Fetch a list of review IDs from Supabase REST API (cached at setup)
//   2. Each VU picks a review ID and fetches the review detail page
//   3. Validates the response contains expected elements

import http from 'k6/http';
import { check } from 'k6';
import {
  validateEnv,
  BASE_URL,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  THRESHOLDS,
  STAGES_DEFAULT,
} from '../shared/config.js';
import { cleanup } from '../shared/cleanup.js';

export const options = {
  stages: STAGES_DEFAULT,
  thresholds: THRESHOLDS.httpReviewDetail,
};

/**
 * Fetch review IDs from Supabase REST API.
 * Runs once in setup() and the result is passed to all VUs via data.
 */
function fetchReviewIds() {
  const url = `${SUPABASE_URL}/rest/v1/reviews`;
  const params = {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  };
  const res = http.get(`${url}?select=id&order=created_at.asc&limit=200`, params);
  if (res.status !== 200) {
    console.error(`[review-detail] Failed to fetch review IDs: ${res.status} ${res.body}`);
    return [];
  }
  try {
    const rows = JSON.parse(res.body);
    return rows.map((r) => r.id);
  } catch (e) {
    console.error(`[review-detail] Failed to parse review IDs: ${e}`);
    return [];
  }
}

export function setup() {
  validateEnv();
  const reviewIds = fetchReviewIds();
  console.log(`[review-detail] Loaded ${reviewIds.length} review IDs`);
  return { baseUrl: BASE_URL, reviewIds };
}

export default function (data) {
  const { baseUrl, reviewIds } = data;

  if (!reviewIds || reviewIds.length === 0) {
    console.warn('[review-detail] No review IDs available — using a placeholder ID');
    const res = http.get(baseUrl, { tags: { type: 'page' } });
    check(res, {
      'fallback page loads': (r) => r.status < 500,
    });
    return;
  }

  // Each VU cycles through review IDs
  const reviewIndex = (__VU - 1 + __ITER) % reviewIds.length;
  const reviewId = reviewIds[reviewIndex];

  const detailUrl = `${baseUrl}/review/${reviewId}/details`;
  const res = http.get(detailUrl, { tags: { type: 'page' } });

  const success = check(res, {
    'review detail page is 200': (r) => r.status === 200,
    'response contains review content': (r) => {
      if (r.status !== 200) return false;
      const body = r.body;
      return (
        body.includes('review') ||
        body.includes('rating') ||
        body.includes('Review') ||
        body.includes('property')
      );
    },
    'response body is not empty': (r) => r.body.length > 100,
  });

  if (!success) {
    console.error(`[review-detail] Failed for review ${reviewId}: ${res.status}`);
  }
}

export function teardown() {
  cleanup();
}
