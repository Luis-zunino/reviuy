// k6/journeys/login.js
// HTTP journey: POST Supabase password grant, measure auth latency
// Thresholds: p95 auth < 1s, error < 1%
//
// This is the ONLY journey that exercises the auth endpoint in every iteration.
// Other journeys authenticate once in setup() and reuse the session.
// Uses a pool of 20 test users (loadtest-0 through loadtest-19@reviuy.qa).
// Each VU cycles through users by index.
//
// Throttled with sleep(5) and max 2 VUs to stay within Supabase Auth rate limits
// on the free tier (~30 req/min). 2 VUs × ~12 req/min = ~24 req/min, under the limit.
// This is a smoke test for auth, not a stress test.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import {
  validateEnv,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  TEST_PASSWORD,
  THRESHOLDS,
} from '../shared/config.js';
// Custom light stages for auth: slow ramp, max 2 VUs, with extended think time
// Kept at 2 VUs to stay under Supabase free tier rate limit (~30 req/min).
const LOGIN_STAGES = [
  { duration: '30s', target: 1 },
  { duration: '1m', target: 2 },
  { duration: '2m', target: 2 },
  { duration: '30s', target: 0 },
];
// Build list of test user emails at init time (shared across VUs)
const testUsers = new SharedArray('test-users', function () {
  const users = [];
  for (let i = 0; i < 20; i++) {
    users.push(`loadtest-${i}@reviuy.qa`);
  }
  return users;
});

export const options = {
  stages: LOGIN_STAGES,
  thresholds: THRESHOLDS.httpAuth,
};

export function setup() {
  validateEnv();
  console.log(`[login] Starting HTTP journey against ${SUPABASE_URL}`);
  return { supabaseUrl: SUPABASE_URL };
}

export default function (data) {
  // Each VU picks a test user by index (round-robin across iterations)
  const vuIndex = __VU - 1; // 0-indexed
  const iterIndex = vuIndex + __ITER * 20; // spread across users
  const email = testUsers[iterIndex % testUsers.length];

  const url = `${data.supabaseUrl}/auth/v1/token?grant_type=password`;
  const payload = JSON.stringify({
    email: email,
    password: TEST_PASSWORD,
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
    },
    tags: { type: 'auth' },
  };

  const res = http.post(url, payload, params);

  const isSuccess = check(res, {
    'login status is 200': (r) => r.status === 200,
    'response has access_token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.access_token !== undefined && body.access_token !== null;
      } catch {
        return false;
      }
    },
  });

  if (!isSuccess) {
    console.error(`[login] Failed for ${email}: ${res.status} ${res.body}`);
  }

  // Throttle to stay under Supabase Auth rate limit (~30 req/min)
  sleep(5);
}

export function teardown() {
  // Cleanup handled by workflow-level cleanup job after all journeys complete.
}
