-- =============================================================================
-- Load Test Seed Data
-- =============================================================================
-- NOT a migration — run this EXPLICITLY against your staging environment.
-- This script creates test users, properties, and reviews for load testing.
--
-- NEVER run this against production. It creates real accounts with known
-- passwords that bypass normal authentication.
--
-- Usage:
--   supabase db query --db-url "$STAGING_DB_URL" < supabase/seed-test-data.sql
--
-- Idempotent: uses ON CONFLICT DO NOTHING for all inserts.
-- Cleanup: call cleanup_test_data() RPC after the test run.
--
--   select cleanup_test_data();
-- =============================================================================

-- =============================================================================
-- 1. Load test users (20)
-- =============================================================================
-- Passwords are bcrypt-hashed using pgcrypto. All users get the same password
-- ('LoadTestPass2024!').
-- Users are created with email_confirmed_at so they can log in immediately.

-- Ensure pgcrypto is available for password hashing
create extension if not exists pgcrypto with schema extensions;

do $$
declare
  v_email text;
  v_idx int;
begin
  for v_idx in 0..19 loop
    v_email := 'loadtest-' || v_idx || '@reviuy.qa';

    insert into auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      gen_random_uuid(),
      v_email,
      extensions.crypt('LoadTestPass2024!', extensions.gen_salt('bf', 10)),
      now(),
      jsonb_build_object('is_load_test_user', true),
      now(),
      now()
    )
    on conflict (email) do nothing;
  end loop;
end;
$$;

-- =============================================================================
-- 2. Load test real estates (50)
-- =============================================================================
-- Created by the first test user (loadtest-0@reviuy.qa).

insert into public.real_estates (name, description, created_by)
select
  'Test Property ' || n,
  'Load test property for performance testing — #' || n,
  (select id from auth.users where email = 'loadtest-0@reviuy.qa')
from generate_series(1, 50) n
where not exists (
  select 1 from public.real_estates where name = 'Test Property ' || n
);

-- =============================================================================
-- 3. Load test reviews (200)
-- =============================================================================
-- Distributed round-robin across 20 users and 50 properties.

insert into public.reviews (
  user_id,
  real_estate_id,
  title,
  description,
  rating,
  property_type,
  address_text,
  address_osm_id,
  latitude,
  longitude,
  zone_rating,
  winter_comfort,
  summer_comfort,
  humidity
)
select
  u.id,
  re.id,
  'Load Test Review #' || n,
  'This is an automated load test review number ' || n || ' for performance testing purposes. It contains enough text to meet the minimum length requirement.',
  3 + (n % 3),
  case
    when n % 3 = 0 then 'apartment'
    when n % 3 = 1 then 'house'
    else 'room'
  end,
  '123 Load Test Street, Montevideo',
  'lt-osm-' || n,
  (-34.9035 + n * 0.001)::decimal(10, 8),
  (-56.1660 + n * 0.001)::decimal(11, 8),
  3 + (n % 3),
  case when n % 2 = 0 then 'comfortable' else 'cold' end,
  case when n % 2 = 0 then 'comfortable' else 'hot' end,
  case when n % 3 = 0 then 'normal' when n % 3 = 1 then 'high' else 'low' end
from generate_series(1, 200) n
join auth.users u on u.email = 'loadtest-' || ((n - 1) % 20) || '@reviuy.qa'
join public.real_estates re on re.name = 'Test Property ' || (1 + ((n - 1) % 50))
on conflict (id) do nothing;

-- =============================================================================
-- 4. Review rooms for a subset of reviews (50)
-- =============================================================================

insert into public.review_rooms (review_id, room_type, area_m2)
select
  r.id,
  case
    when n % 2 = 0 then 'bedroom'
    else 'living_room'
  end,
  15 + (n % 10)::numeric(7, 2)
from (
  select
    r.id,
    row_number() over (order by r.created_at) as rn
  from public.reviews r
  where r.user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
) r
cross join generate_series(1, 200) n
where r.rn = n and n % 4 = 0
on conflict (id) do nothing;
