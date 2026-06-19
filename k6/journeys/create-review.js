// k6/journeys/create-review.js
// HTTP journey: login → GET property → POST review via Server Action
// Thresholds: SA < 1s, e2e < 5s, error < 1%
//
// Flow:
//   1. Login via Supabase password grant → get session
//   2. GET the create review page → build auth cookie → extract action hash
//   3. POST the Server Action with review data
//   4. Validate response

import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import {
  validateEnv,
  BASE_URL,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  THRESHOLDS,
  STAGES_LIGHT,
} from '../shared/config.js';
import { login, getProjectRef, buildAuthCookieValue, buildAuthCookieName } from '../shared/auth.js';
// Build list of test user emails at init time
const testUsers = new SharedArray('test-users', function () {
  const users = [];
  for (let i = 0; i < 20; i++) {
    users.push(`loadtest-${i}@reviuy.qa`);
  }
  return users;
});

export const options = {
  stages: STAGES_LIGHT,
  thresholds: THRESHOLDS.httpServerAction,
};

export function setup() {
  validateEnv();
  const projectRef = getProjectRef();
  if (!projectRef) {
    throw new Error('Could not determine Supabase project ref from SUPABASE_URL');
  }
  console.log(`[create-review] Project ref: ${projectRef}`);
  return {
    baseUrl: BASE_URL,
    supabaseUrl: SUPABASE_URL,
    projectRef: projectRef,
  };
}

export default function (data) {
  // ---- Step 1: Login ----
  const vuIndex = __VU - 1;
  const iterIndex = vuIndex + __ITER * 20;
  const email = testUsers[iterIndex % testUsers.length];

  const session = login(email);
  if (!session) {
    console.error(`[create-review] Login failed for ${email}, skipping iteration`);
    return;
  }

  const cookieValue = buildAuthCookieValue(session);
  const cookieName = buildAuthCookieName(data.projectRef);

  // ---- Step 2: GET a property ID for the review ----
  // Fetch properties via Supabase REST API (anonymous query for public data)
  const propsUrl = `${data.supabaseUrl}/rest/v1/real_estates?select=id,name&limit=1`;
  const propsRes = http.get(propsUrl, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    tags: { type: 'api' },
  });

  check(propsRes, {
    'property list fetched': (r) => r.status === 200,
  });

  if (propsRes.status !== 200) {
    console.error(`[create-review] Failed to fetch properties: ${propsRes.body}`);
    return;
  }

  let properties;
  try {
    properties = JSON.parse(propsRes.body);
  } catch {
    console.error(`[create-review] Invalid JSON from properties API`);
    return;
  }

  if (!properties || properties.length === 0) {
    console.error('[create-review] No properties found');
    return;
  }

  const realEstateId = properties[0].id;
  const createUrl = `${data.baseUrl}/real-estate/${realEstateId}/review/create`;

  // ---- Step 3: Extract Server Action hash from the page ----
  console.log(`[create-review] Fetching page: ${createUrl}`);
  const pageRes = http.get(createUrl, {
    headers: {
      Cookie: `${cookieName}=${cookieValue}`,
    },
    tags: { type: 'page' },
  });

  check(pageRes, {
    'create review page loads': (r) => r.status === 200,
  });

  // Try to extract the action hash from the page HTML
  // Patterns: data-next-action="<hash>", "next-action":"<hash>", or $ACTION_<hash>
  let actionHash = null;
  const patterns = [
    /data-next-action["']?\s*[:=]\s*["']([^"']+)/,
    /["']next-action["']\s*:\s*["']([^"']+)/,
    /\$ACTION_(\w+)/,
    /action_id["']?\s*[:=]\s*["']([^"']+)/,
  ];
  for (const pattern of patterns) {
    const match = pageRes.body.match(pattern);
    if (match) {
      actionHash = match[1];
      break;
    }
  }

  // Fallback to env var
  if (!actionHash && __ENV.REVIEW_ACTION_HASH) {
    actionHash = __ENV.REVIEW_ACTION_HASH;
  }

  if (!actionHash) {
    console.warn(
      '[create-review] Could not extract action hash from page. ' +
        'Set REVIEW_ACTION_HASH env var. Attempting direct POST anyway.'
    );
  }

  // ---- Step 4: POST the Server Action to create a review ----
  const reviewPayload = JSON.stringify({
    title: 'Load Test Review ' + Date.now(),
    description:
      'This is an automated load test review for performance testing. It meets the minimum length requirement of 20 characters.',
    rating: 4,
    property_type: 'apartment',
    address_text: '123 Load Test Street, Montevideo',
    address_osm_id: 'lt-osm-' + Date.now(),
    latitude: -34.9035,
    longitude: -56.166,
    zone_rating: 3,
    real_estate_id: realEstateId,
  });

  const saHeaders = {
    'Content-Type': 'text/plain;charset=UTF-8',
    Cookie: `${cookieName}=${cookieValue}`,
  };

  if (actionHash) {
    saHeaders['Next-Action'] = actionHash;
  }

  const startTime = Date.now();
  const saRes = http.post(createUrl, reviewPayload, {
    headers: saHeaders,
    tags: { type: 'server_action' },
  });
  const totalDuration = Date.now() - startTime;

  const saSuccess = check(saRes, {
    'server action responds with 2xx or redirect': (r) =>
      (r.status >= 200 && r.status < 400) || r.status === 303 || r.status === 302,
  });

  if (!saSuccess) {
    console.error(
      `[create-review] Server Action failed: ${saRes.status} ${saRes.body.substring(0, 500)}`
    );
  }

  console.log(`[create-review] SA completed in ${totalDuration}ms — status: ${saRes.status}`);
}

export function teardown() {
  // Cleanup handled by workflow-level cleanup job after all journeys complete.
}
