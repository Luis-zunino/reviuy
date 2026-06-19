// k6/journeys/vote-review.js
// HTTP journey: login → fetch review ID → POST vote_review RPC (toggle like/dislike)
// Thresholds: API < 1s, auth < 1s, error < 1%
//
// Flow:
//   1. Login via Supabase password grant → get session
//   2. Fetch a review ID from Supabase REST API (cached at setup)
//   3. POST vote_review RPC (alternates between 'like' and 'dislike' per iteration)
//   4. Validate response
//
// Rate limited: 20 votes per 60 minutes per user (enforced by check_rate_limit RPC)
// Materialized view refresh: each vote triggers review_vote_stats refresh

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
import { login } from '../shared/auth.js';
import { cleanup } from '../shared/cleanup.js';

const testUsers = new SharedArray('test-users', function () {
  const users = [];
  for (let i = 0; i < 20; i++) {
    users.push(`loadtest-${i}@reviuy.qa`);
  }
  return users;
});

export const options = {
  stages: STAGES_LIGHT,
  thresholds: THRESHOLDS.httpVote,
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
    console.error(`[vote-review] Failed to fetch review IDs: ${res.status} ${res.body}`);
    return [];
  }
  try {
    const rows = JSON.parse(res.body);
    return rows.map((r) => r.id);
  } catch (e) {
    console.error(`[vote-review] Failed to parse review IDs: ${e}`);
    return [];
  }
}

export function setup() {
  validateEnv();
  const reviewIds = fetchReviewIds();
  console.log(
    `[vote-review] Loaded ${reviewIds.length} review IDs, ${testUsers.length} test users`
  );
  return { supabaseUrl: SUPABASE_URL, reviewIds };
}

export default function (data) {
  const { supabaseUrl, reviewIds } = data;

  // ---- Step 1: Login ----
  const vuIndex = __VU - 1;
  const iterIndex = vuIndex + __ITER * 20;
  const email = testUsers[iterIndex % testUsers.length];

  const session = login(email);
  if (!session) {
    console.error(`[vote-review] Login failed for ${email}, skipping iteration`);
    return;
  }

  // ---- Step 2: Pick a review ID ----
  if (!reviewIds || reviewIds.length === 0) {
    console.warn('[vote-review] No review IDs available, skipping');
    return;
  }
  const reviewIndex = (vuIndex + __ITER) % reviewIds.length;
  const reviewId = reviewIds[reviewIndex];

  // ---- Step 3: Vote (alternate between like/dislike to test toggle) ----
  const voteType = __ITER % 2 === 0 ? 'like' : 'dislike';
  const rpcUrl = `${supabaseUrl}/rest/v1/rpc/vote_review`;
  const rpcPayload = JSON.stringify({
    p_review_id: reviewId,
    p_vote_type: voteType,
  });
  const rpcParams = {
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${session.access_token}`,
    },
    tags: { type: 'api' },
  };

  const rpcRes = http.post(rpcUrl, rpcPayload, rpcParams);

  const rpcSuccess = check(rpcRes, {
    'vote RPC returns 200': (r) => r.status === 200,
    'vote response has action': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.action !== undefined;
      } catch {
        return false;
      }
    },
  });

  if (!rpcSuccess) {
    console.error(
      `[vote-review] Vote failed for review ${reviewId} (${voteType}): ${rpcRes.status} ${rpcRes.body}`
    );
  } else {
    const body = JSON.parse(rpcRes.body);
    console.log(`[vote-review] Voted ${voteType} on review ${reviewId}: ${body.action}`);
  }
}

export function teardown() {
  // Note: votes are toggles — no cleanup needed.
  // Running this journey against staging will create/remove votes.
  // Run seed-test-data.sql before each meaningful test run to reset.
  cleanup();
}
