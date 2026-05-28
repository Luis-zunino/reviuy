-- =============================================================================
-- Migration 016: Load test cleanup function
-- =============================================================================
-- Creates the cleanup_test_data() RPC used by load tests to purge test data.
-- This is safe for all environments because it only creates a function.
--
-- The actual seed data (users, properties, reviews) lives in
-- supabase/seed-test-data.sql and is NEVER applied via migrations.
-- Run it explicitly against staging with:
--   supabase db query --db-url "$STAGING_DB_URL" < supabase/seed-test-data.sql
-- =============================================================================

-- =============================================================================
-- 1. Load test cleanup function
-- =============================================================================
-- SECURITY DEFINER so it can delete across schemas (auth.users references).
-- Called via REST API: POST /rest/v1/rpc/cleanup_test_data
-- Only callable with service_role key.

create or replace function public.cleanup_test_data()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Delete review_rooms belonging to load test reviews
  delete from review_rooms
  where review_id in (
    select id from reviews
    where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  -- Delete review_votes by load test users or on their reviews
  delete from review_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
     or review_id in (
      select id from reviews
      where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  -- Delete review_favorites by load test users
  delete from review_favorites
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete reviews by load test users
  delete from reviews
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real_estate_reviews and related data by load test users
  delete from real_estate_review_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
     or real_estate_review_id in (
      select id from real_estate_reviews
      where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  delete from real_estate_review_reports
  where reported_by_user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  delete from real_estate_reviews
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete review reports by load test users
  delete from review_reports
  where reported_by_user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete review audit trail for load test reviews
  delete from review_audit
  where review_id in (
    select id from reviews
    where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  -- Delete review deletions audit
  delete from review_deletions
  where deleted_by in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real estate votes by load test users
  delete from real_estate_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real estate favorites by load test users
  delete from real_estate_favorites
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real estate reports by load test users
  delete from real_estate_reports
  where reported_by_user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete rate limits for load test users
  delete from rate_limits
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete security logs for load test users
  delete from security_logs
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete load test real estates (created by loadtest-0)
  delete from real_estates
  where name like 'Test Property %'
    and created_by in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete the load test users themselves
  delete from auth.users
  where email like 'loadtest-%@reviuy.qa';

  -- Refresh materialized views after data deletion
  refresh materialized view public.real_estate_vote_stats;
  refresh materialized view public.review_vote_stats;
  refresh materialized view public.real_estate_review_vote_stats;
end;
$$;

-- Revoke from anon/authenticated, grant only to service_role
-- (matches the project security pattern from 007_grants.sql)
revoke execute on function public.cleanup_test_data() from public, anon, authenticated;
grant execute on function public.cleanup_test_data() to service_role;

comment on function public.cleanup_test_data() is
  'Deletes all load test data (users, properties, reviews). SECURITY DEFINER — service_role only.';
