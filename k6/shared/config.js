// k6/shared/config.js
// Centralized thresholds, env var validation, and default exports for load tests

const REQUIRED_ENV_VARS = ['BASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'TEST_PASSWORD'];

/**
 * Validates that all required environment variables are set.
 * Call this in setup() to fail fast before VUs start.
 * @throws {Error} If any required env var is missing
 */
export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !__ENV[name]);

  if (missing.length > 0) {
    const msg = `Missing required env vars: ${missing.join(', ')}`;
    console.error(msg);
    throw new Error(msg);
  }

  console.log(`BASE_URL: ${__ENV.BASE_URL}`);
  console.log(`SUPABASE_URL: ${__ENV.SUPABASE_URL}`);
  console.log('SUPABASE_SERVICE_KEY: [REDACTED]');
  console.log('TEST_PASSWORD: [REDACTED]');
}

// Resolve env vars at init time — safe because they're set before k6 runs
export const BASE_URL = __ENV.BASE_URL;
export const SUPABASE_URL = __ENV.SUPABASE_URL;
export const SUPABASE_SERVICE_KEY = __ENV.SUPABASE_SERVICE_KEY;
export const TEST_PASSWORD = __ENV.TEST_PASSWORD;

// Report output directory (relative to project root)
export const REPORT_DIR = 'k6/reports';

// =============================================================================
// Thresholds
// =============================================================================
// Each journey selects the subset that applies. Tags are set on HTTP requests
// via `{ tags: { type: 'page' | 'api' | 'auth' | 'server_action' } }`.
//
// Browser journeys use browser_web_vital_* for page load timing.
// HTTP journeys use http_req_duration with custom tags.

export const THRESHOLDS = {
  // ---- Page loads (browser journeys) ----
  // Largest Contentful Paint — closest to "page visible and usable"
  browserPage: {
    browser_web_vital_lcp: ['p(95)<3000', 'p(99)<4000'],
    http_req_failed: ['rate<0.01'],
  },

  // ---- API calls (HTTP journeys) ----
  httpApi: {
    'http_req_duration{type:api}': ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },

  // ---- Auth (login journey) ----
  httpAuth: {
    'http_req_duration{type:auth}': ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },

  // ---- Server Action (create-review journey) ----
  httpServerAction: {
    'http_req_duration{type:server_action}': ['p(95)<1000'],
    'http_req_duration{type:e2e}': ['p(95)<5000'],
    http_req_failed: ['rate<0.01'],
  },

  // ---- Review detail (HTTP page + API) ----
  httpReviewDetail: {
    'http_req_duration{type:page}': ['p(95)<3000'],
    'http_req_duration{type:api}': ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },

  // ---- Vote (vote-review journey) ----
  httpVote: {
    'http_req_duration{type:api}': ['p(95)<1000'],
    'http_req_duration{type:auth}': ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

// =============================================================================
// Stage definitions
// =============================================================================
// Ramp 10→50 VUs / 2 min, hold 5 min, ramp down 1 min
export const STAGES_DEFAULT = [
  { duration: '2m', target: 10 },
  { duration: '2m', target: 50 },
  { duration: '5m', target: 50 },
  { duration: '1m', target: 0 },
];

// Light load for write-heavy journeys (create-review)
export const STAGES_LIGHT = [
  { duration: '1m', target: 10 },
  { duration: '1m', target: 30 },
  { duration: '3m', target: 30 },
  { duration: '1m', target: 0 },
];
