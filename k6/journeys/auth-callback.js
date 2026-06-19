// k6/journeys/auth-callback.js
// HTTP journey: simulate the auth callback flow without OAuth redirect
// Thresholds: auth < 1s, API < 1s, error < 1%
//
// This journey tests the SERVER-SIDE portion of authentication:
//   1. Verify session via getUser (callback's key check)
//   2. Check user metadata terms_accepted_at
//   3. Simulate updateUser for first-login terms acceptance
//
// This does NOT test Google OAuth itself (external to the app).
// What it tests: Supabase Auth API under load, session validation,
// and user metadata operations — the critical auth path.
// Login is done once in setup() — all VUs reuse the same session.

import http from 'k6/http';
import { check } from 'k6';
import {
  validateEnv,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  THRESHOLDS,
  STAGES_LIGHT,
} from '../shared/config.js';
import { login } from '../shared/auth.js';

export const options = {
  stages: STAGES_LIGHT,
  thresholds: THRESHOLDS.httpAuth,
};

export function setup() {
  validateEnv();
  // Login once in setup — all VUs reuse the same session.
  // The auth endpoint is tested separately by login.js.
  const session = login('loadtest-0@reviuy.qa');
  if (!session) {
    throw new Error('[auth-callback] Setup login failed');
  }
  console.log(`[auth-callback] Testing auth flow against ${SUPABASE_URL}, logged in as loadtest-0`);
  return { supabaseUrl: SUPABASE_URL, accessToken: session.access_token };
}

export default function (data) {
  const { supabaseUrl, accessToken } = data;

  // ---- Step 1: getUser (callback verifies the session) ----
  const userRes = http.get(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${accessToken}`,
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
  console.log(`[auth-callback] loadtest-0 — has_terms: ${hasTerms}`);

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
          Authorization: `Bearer ${accessToken}`,
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
