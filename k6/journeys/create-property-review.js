// k6/journeys/create-property-review.js
// HTTP journey: login → POST create_review RPC (property review, NOT real estate review)
// Thresholds: API < 1s, auth < 1s, error < 1%
//
// Flow:
//   1. Login via Supabase password grant → get session
//   2. POST the create_review RPC with review data
//   3. Validate response
//
// Rate limited: 5 reviews per 10 minutes per user
// This journey creates REAL data in the database.
// Run seed-test-data.sql before each meaningful test run to reset state.

import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import {
  validateEnv,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  BASE_URL,
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

const testRealEstates = new SharedArray('test-real-estates', function () {
  return [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
  ];
});

export const options = {
  stages: STAGES_LIGHT,
  thresholds: THRESHOLDS.httpVote,
};

const ADDRESSES = [
  {
    text: 'Av. 18 de Julio 1200, Montevideo',
    osm_id: 'lt-osm-address-1',
    lat: -34.905,
    lon: -56.191,
  },
  { text: 'Av. Italia 4500, Montevideo', osm_id: 'lt-osm-address-2', lat: -34.88, lon: -56.15 },
  {
    text: 'Bulevar Artigas 1500, Montevideo',
    osm_id: 'lt-osm-address-3',
    lat: -34.898,
    lon: -56.175,
  },
  {
    text: 'Rambla Costanera 2500, Montevideo',
    osm_id: 'lt-osm-address-4',
    lat: -34.913,
    lon: -56.162,
  },
  {
    text: 'Av. Luis Alberto de Herrera 3200, Montevideo',
    osm_id: 'lt-osm-address-5',
    lat: -34.885,
    lon: -56.135,
  },
];

const PROPERTY_TYPES = ['apartment', 'house', 'duplex', 'studio', 'penthouse'];

export function setup() {
  validateEnv();
  console.log(`[create-property-review] Starting against ${SUPABASE_URL}`);
  return { supabaseUrl: SUPABASE_URL };
}

export default function (data) {
  const { supabaseUrl } = data;

  // ---- Step 1: Login ----
  const vuIndex = __VU - 1;
  const iterIndex = vuIndex + __ITER * 20;
  const email = testUsers[iterIndex % testUsers.length];

  const session = login(email);
  if (!session) {
    console.error(`[create-property-review] Login failed for ${email}, skipping iteration`);
    return;
  }

  // ---- Step 2: Build review payload ----
  const addrIdx = (vuIndex + __ITER) % ADDRESSES.length;
  const addr = ADDRESSES[addrIdx];
  const propertyType = PROPERTY_TYPES[(vuIndex + __ITER) % PROPERTY_TYPES.length];
  const realEstateId = testRealEstates[(vuIndex + __ITER) % testRealEstates.length];
  const timestamp = Date.now();

  const reviewPayload = JSON.stringify({
    p_title: `Load Test Property Review ${timestamp}`,
    p_description:
      'This is an automated load test review for a property. It meets the minimum length requirement of 20 characters and includes sufficient detail about the property experience.',
    p_rating: (vuIndex % 5) + 1,
    p_address_text: addr.text,
    p_address_osm_id: addr.osm_id,
    p_latitude: addr.lat,
    p_longitude: addr.lon,
    p_real_estate_id: realEstateId,
    p_property_type: propertyType,
    p_zone_rating: (vuIndex % 5) + 1,
    p_winter_comfort: 'bueno',
    p_summer_comfort: 'regular',
    p_humidity: 'baja',
    p_review_rooms: JSON.stringify([
      { name: 'Living', rating: 4, condition: 'bueno' },
      { name: 'Cocina', rating: 3, condition: 'regular' },
      { name: 'Dormitorio', rating: 4, condition: 'bueno' },
    ]),
  });

  // ---- Step 3: POST create_review RPC ----
  const rpcUrl = `${supabaseUrl}/rest/v1/rpc/create_review`;
  const rpcParams = {
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${session.access_token}`,
    },
    tags: { type: 'api' },
  };

  const rpcRes = http.post(rpcUrl, reviewPayload, rpcParams);

  const rpcSuccess = check(rpcRes, {
    'create_review RPC returns 200': (r) => r.status === 200,
    'review creation response is valid': (r) => {
      try {
        const body = JSON.parse(r.body);
        // Success = { success: true, id: "...", action: "created", message: null }
        return body !== null && typeof body === 'object';
      } catch {
        return false;
      }
    },
  });

  if (!rpcSuccess) {
    console.error(
      `[create-property-review] Failed: ${rpcRes.status} ${rpcRes.body.substring(0, 300)}`
    );
  } else {
    const body = JSON.parse(rpcRes.body);
    if (body.success) {
      console.log(`[create-property-review] Created review ${body.id} for ${addr.text}`);
    } else {
      console.warn(`[create-property-review] RPC returned: ${body.message}`);
    }
  }
}

export function teardown() {
  // Run cleanup to remove created reviews
  cleanup();
}
