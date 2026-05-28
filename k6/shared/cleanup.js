// k6/shared/cleanup.js
// Calls the cleanup_test_data() RPC to remove all load test data

import http from 'k6/http';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from './config.js';

/**
 * Calls cleanup_test_data() RPC via Supabase REST API.
 * Idempotent — safe to call multiple times.
 * Must be called in teardown() of every journey.
 */
export function cleanup() {
  const url = `${SUPABASE_URL}/rest/v1/rpc/cleanup_test_data`;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    tags: { type: 'api' },
  };

  console.log(`Cleanup: POST ${url}`);
  const res = http.post(url, '', params);

  if (res.status >= 200 && res.status < 300) {
    console.log(`Cleanup RPC succeeded: ${res.status}`);
  } else {
    console.error(`Cleanup RPC failed: ${res.status} ${res.body}`);
  }

  return res;
}
