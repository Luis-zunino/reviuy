// k6/shared/auth.js
// Supabase password grant login + session cookie construction for @supabase/ssr

import http from 'k6/http';
import { check } from 'k6';
import { b64encode } from 'k6/encoding';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY, TEST_PASSWORD } from './config.js';

/**
 * Logs in as a load-test user via Supabase password grant.
 * Returns the full session object.
 *
 * @param {string} email - Test user email (e.g. loadtest-0@reviuy.qa)
 * @returns {object} Session with access_token, refresh_token, user, etc.
 */
export function login(email) {
  const url = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
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

  check(res, {
    'login status is 200': (r) => r.status === 200,
    'login returns access_token': (r) => {
      const body = JSON.parse(r.body);
      return body.access_token !== undefined;
    },
  });

  if (res.status !== 200) {
    console.error(`Login failed for ${email}: ${res.status} ${res.body}`);
    return null;
  }

  const session = JSON.parse(res.body);
  return session;
}

/**
 * Extract the Supabase project reference from the SUPABASE_URL.
 * e.g. "https://abc123.supabase.co" → "abc123"
 *
 * @returns {string|null}
 */
export function getProjectRef() {
  const match = SUPABASE_URL.match(/https?:\/\/([^.]+)/);
  if (!match) {
    console.error(`Could not extract project ref from SUPABASE_URL: ${SUPABASE_URL}`);
    return null;
  }
  return match[1];
}

/**
 * Builds the auth cookie value that @supabase/ssr expects.
 * Format: base64-{base64url(JSON.stringify(session))}
 *
 * @param {object} session - Session object from login()
 * @returns {string} Cookie value
 */
export function buildAuthCookieValue(session) {
  if (!session || !session.access_token) {
    console.error('Cannot build auth cookie: no valid session');
    return '';
  }

  const rawValue = JSON.stringify({
    access_token: session.access_token,
    token_type: session.token_type,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
    refresh_token: session.refresh_token,
    user: session.user,
  });

  const encodedValue = `base64-${b64encode(rawValue, 'rawurl')}`;
  return encodedValue;
}

/**
 * Builds the cookie name for the @supabase/ssr auth token.
 * Format: sb-{projectRef}-auth-token
 *
 * @param {string} projectRef - Supabase project reference
 * @returns {string}
 */
export function buildAuthCookieName(projectRef) {
  return `sb-${projectRef}-auth-token`;
}
