// k6/journeys/auth-callback.js
// HTTP journey: simulate the auth callback flow without OAuth redirect
// Thresholds: auth < 1s, API < 1s, error < 1%
//
// This journey tests the SERVER-SIDE portion of authentication:
//   1. Login via Supabase password grant → get session
//   2. Verify session via getUser (callback's key check)
//   3. Check user metadata terms_accepted_at
//   4. Simulate updateUser for first-login terms acceptance
//
// This does NOT test Google OAuth itself (external to the app).
// What it tests: Supabase Auth API under load, session validation,
// and user metadata operations — the critical auth path.

import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import {
  validateEnv,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  THRESHOLDS,
  STAGES_LIGHT,
} from '../shared/config.js';

const testUsers = new SharedArray('test-users', function () {
  const users = [];
  for (let i = 0; i < 20; i++) {
    users.push(`loadtest-${i}@reviuy.qa`);
  }
  return users;
});

export const options = {
  stages: STAGES_LIGHT,
  thresholds: THRESHOLDS.httpAuth,
};

export function setup() {
  validateEnv();
  console.log(`[auth-callback] Testing auth flow against ${SUPABASE_URL}`);
  return { supabaseUrl: SUPABASE_URL };
}

export default function (data) {
  const { supabaseUrl } = data;

  // ---- Step 1: Login (simulates successful OAuth/magic link) ----
  const vuIndex = __VU - 1;
  const email = testUsers[vuIndex % testUsers.length];

  const tokenUrl = `${supabaseUrl}/auth/v1/token?grant_type=password`;
  const tokenPayload = JSON.stringify({
    email: email,
    password: __ENV.TEST_PASSWORD,
  });

  const tokenRes = http.post(tokenUrl, tokenPayload, {
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
    },
    tags: { type: 'auth' },
  });

  if (
    !check(tokenRes, {
      'login returns 200': (r) => r.status === 200,
      'has access_token': (r) => JSON.parse(r.body).access_token !== undefined,
    })
  ) {
    console.error(`[auth-callback] Login failed for ${email}: ${tokenRes.status}`);
    return;
  }

  const session = JSON.parse(tokenRes.body);

  // ---- Step 2: getUser (callback verifies the session) ----
  const userRes = http.get(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${session.access_token}`,
    },
    tags: { type: 'api' },
  });

  if (
    !check(userRes, {
      'getUser returns 200': (r) => r.status === 200,
      'user.id exists': (r) => JSON.parse(r.body).id !== undefined,
    })
  ) {
    console.error(`[auth-callback] getUser failed: ${userRes.status}`);
    return;
  }

  const userData = JSON.parse(userRes.body);

  // ---- Step 3: Check terms (callback's branching logic) ----
  const hasTerms = Boolean(userData?.user_metadata?.terms_accepted_at);
  console.log(`[auth-callback] ${email} — has_terms: ${hasTerms}`);

  // ---- Step 4: Simulate callback's updateUser for terms acceptance ----
  if (!hasTerms) {
    const updateRes = http.put(
      `${supabaseUrl}/auth/v1/user`,
      JSON.stringify({
        data: {
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
          terms_version: 'v1',
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        tags: { type: 'api' },
      }
    );

    check(updateRes, {
      'updateUser returns 200': (r) => r.status === 200,
      'terms_accepted_at persisted': (r) => {
        try {
          return JSON.parse(r.body)?.user_metadata?.terms_accepted_at !== undefined;
        } catch {
          return false;
        }
      },
    });
  }
}

export function teardown() {
  // Cleanup handled by workflow-level cleanup job after all journeys complete.
}
