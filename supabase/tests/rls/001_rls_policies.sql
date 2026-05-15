BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(29);

-- 1) RLS habilitado en tablas criticas
SELECT ok((SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'reviews'), 'RLS habilitado en public.reviews');
SELECT ok((SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'review_votes'), 'RLS habilitado en public.review_votes');
SELECT ok((SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname = 'real_estate_reviews'), 'RLS habilitado en public.real_estate_reviews');

-- 2) Policies de update con filtro deleted_at
SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reviews'
      AND policyname = 'reviews_update_own'
      AND COALESCE(qual, '') ILIKE '%deleted_at is null%'
  ),
  'reviews_update_own incluye deleted_at IS NULL'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_estate_reviews'
      AND policyname = 'real_estate_reviews_update_own'
      AND COALESCE(qual, '') ILIKE '%deleted_at is null%'
  ),
  'real_estate_reviews_update_own incluye deleted_at IS NULL'
);

-- 3) Policies de select own en tablas de votos
SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'review_votes'
      AND policyname = 'review_votes_select_own'
  ),
  'review_votes_select_own existe'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_estate_votes'
      AND policyname = 'real_estate_votes_select_own'
  ),
  'real_estate_votes_select_own existe'
);

SELECT ok(
  EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_estate_review_votes'
      AND policyname = 'real_estate_review_votes_select_own'
  ),
  'real_estate_review_votes_select_own existe'
);

-- 4) FKs de auditoria sin ON DELETE CASCADE
SELECT ok(
  NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname IN ('review_audit', 'review_deletions')
      AND c.contype = 'f'
      AND c.confdeltype = 'c'
  ),
  'review_audit y review_deletions no usan ON DELETE CASCADE'
);

-- 5) Revokes de anon sobre tablas de votos
SELECT is(
  has_table_privilege('anon', 'public.review_votes', 'SELECT'),
  false,
  'anon NO tiene SELECT sobre public.review_votes'
);

SELECT is(
  has_table_privilege('anon', 'public.real_estate_votes', 'SELECT'),
  false,
  'anon NO tiene SELECT sobre public.real_estate_votes'
);

SELECT is(
  has_table_privilege('anon', 'public.real_estate_review_votes', 'SELECT'),
  false,
  'anon NO tiene SELECT sobre public.real_estate_review_votes'
);

-- 6) Índices únicos parciales críticos
SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'idx_reviews_user_address_osm_unique'
      AND indexdef ILIKE '%UNIQUE INDEX%'
      AND indexdef ILIKE '%(user_id, address_osm_id)%'
      AND indexdef ILIKE '%WHERE (deleted_at IS NULL)%'
  ),
  'Existe índice único parcial reviews(user_id, address_osm_id) con deleted_at IS NULL'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'idx_real_estate_reviews_user_re_unique'
      AND indexdef ILIKE '%UNIQUE INDEX%'
      AND indexdef ILIKE '%(user_id, real_estate_id)%'
      AND indexdef ILIKE '%WHERE (deleted_at IS NULL)%'
  ),
  'Existe índice único parcial real_estate_reviews(user_id, real_estate_id) con deleted_at IS NULL'
);

-- 7) Vistas _public endurecidas (security_invoker=off + security_barrier=true)
SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'reviews_public'
      AND c.relkind = 'v'
      AND c.reloptions::text ILIKE '%security_invoker=off%'
      AND c.reloptions::text ILIKE '%security_barrier=true%'
  ),
  'reviews_public tiene security_invoker=off y security_barrier=true'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'reviews_with_votes_public'
      AND c.relkind = 'v'
      AND c.reloptions::text ILIKE '%security_invoker=off%'
      AND c.reloptions::text ILIKE '%security_barrier=true%'
  ),
  'reviews_with_votes_public tiene security_invoker=off y security_barrier=true'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = 'real_estates_with_votes_public'
      AND c.relkind = 'v'
      AND c.reloptions::text ILIKE '%security_invoker=off%'
      AND c.reloptions::text ILIKE '%security_barrier=true%'
  ),
  'real_estates_with_votes_public tiene security_invoker=off y security_barrier=true'
);

-- 8) Funciones internas sensibles sin EXECUTE para roles cliente
SELECT is(
  has_function_privilege('anon', 'public.check_rate_limit(text, integer, integer)', 'EXECUTE'),
  false,
  'anon NO tiene EXECUTE sobre check_rate_limit'
);

SELECT is(
  has_function_privilege('authenticated', 'public.log_security_event(text, text, text, jsonb)', 'EXECUTE'),
  false,
  'authenticated NO tiene EXECUTE sobre log_security_event'
);

SELECT is(
  has_function_privilege('anon', 'public.refresh_all_vote_stats()', 'EXECUTE'),
  false,
  'anon NO tiene EXECUTE sobre refresh_all_vote_stats'
);

SELECT is(
  has_function_privilege('authenticated', 'public.cleanup_old_security_logs()', 'EXECUTE'),
  false,
  'authenticated NO tiene EXECUTE sobre cleanup_old_security_logs'
);

-- 9) Vistas _public no deben exponer user_id/created_by
SELECT ok(
  NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name IN (
        'reviews_public',
        'reviews_with_votes_public',
        'real_estate_reviews_public',
        'real_estate_reviews_with_votes_public',
        'real_estates_with_votes_public'
      )
      AND column_name IN ('user_id', 'created_by')
  ),
  'Vistas _public no exponen user_id ni created_by'
);

-- 10) SECURITY DEFINER sin search_path explícito es riesgoso
SELECT ok(
  NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND NOT EXISTS (
        SELECT 1
        FROM unnest(coalesce(p.proconfig, '{}'::text[])) cfg
        WHERE cfg = 'search_path=public'
      )
  ),
  'Todas las funciones SECURITY DEFINER de public tienen search_path=public'
);

-- 11) Tables con deleted_at deben tener policy SELECT filtrando activos
SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reviews'
      AND policyname = 'reviews_select_public'
      AND coalesce(qual, '') ILIKE '%deleted_at is null%'
  ),
  'reviews_select_public filtra deleted_at IS NULL'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'real_estates'
      AND policyname = 'real_estates_select_public'
      AND coalesce(qual, '') ILIKE '%deleted_at is null%'
  ),
  'real_estates_select_public filtra deleted_at IS NULL'
);

-- 12) Drift: toda tabla sensible nueva debe mantener baseline de seguridad
SELECT ok(
  NOT EXISTS (
    WITH sensitive_tables AS (
      SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND EXISTS (
          SELECT 1
          FROM pg_attribute a
          WHERE a.attrelid = c.oid
            AND a.attnum > 0
            AND NOT a.attisdropped
            AND a.attname IN ('user_id', 'created_by', 'reporter_id', 'reviewed_user_id', 'email')
        )
    )
    SELECT 1
    FROM sensitive_tables s
    JOIN pg_class c ON c.relname = s.relname
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND NOT c.relrowsecurity
  ),
  'Todas las tablas sensibles tienen RLS habilitado'
);

SELECT ok(
  NOT EXISTS (
    WITH sensitive_tables AS (
      SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND EXISTS (
          SELECT 1
          FROM pg_attribute a
          WHERE a.attrelid = c.oid
            AND a.attnum > 0
            AND NOT a.attisdropped
            AND a.attname IN ('user_id', 'created_by', 'reporter_id', 'reviewed_user_id', 'email')
        )
    )
    SELECT 1
    FROM sensitive_tables s
    WHERE NOT EXISTS (
      SELECT 1
      FROM pg_policies p
      WHERE p.schemaname = 'public'
        AND p.tablename = s.relname
        AND UPPER(p.cmd) IN ('SELECT', 'ALL')
    )
  ),
  'Todas las tablas sensibles tienen policy mínima de SELECT/ALL'
);

SELECT ok(
  NOT EXISTS (
    WITH mutating_sensitive_tables AS (
      SELECT c.relname
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND c.relname NOT IN ('security_logs')
        AND EXISTS (
          SELECT 1
          FROM pg_attribute a
          WHERE a.attrelid = c.oid
            AND a.attnum > 0
            AND NOT a.attisdropped
            AND a.attname IN ('user_id', 'reporter_id')
        )
    )
    SELECT 1
    FROM mutating_sensitive_tables s
    WHERE NOT EXISTS (
      SELECT 1
      FROM pg_policies p
      WHERE p.schemaname = 'public'
        AND p.tablename = s.relname
        AND UPPER(p.cmd) IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    )
  ),
  'Todas las tablas sensibles tienen policy mínima de mutación (INSERT/UPDATE/DELETE/ALL)'
);

-- 13) Grants por rol: anon no puede mutar tablas sensibles
SELECT ok(
  NOT EXISTS (
    WITH mutating_sensitive_tables AS (
      SELECT c.oid
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relkind = 'r'
        AND c.relname NOT IN ('review_audit', 'review_deletions')
        AND EXISTS (
          SELECT 1
          FROM pg_attribute a
          WHERE a.attrelid = c.oid
            AND a.attnum > 0
            AND NOT a.attisdropped
            AND a.attname IN ('user_id', 'created_by', 'reporter_id', 'reviewed_user_id', 'email')
        )
    )
    SELECT 1
       FROM mutating_sensitive_tables s
       WHERE has_table_privilege('anon', s.oid, 'INSERT')
         OR has_table_privilege('anon', s.oid, 'UPDATE')
         OR has_table_privilege('anon', s.oid, 'DELETE')
  ),
  'anon no tiene INSERT/UPDATE/DELETE sobre tablas sensibles'
);

-- 14) Grants por rol: funciones internas nuevas no ejecutables por roles cliente
SELECT ok(
  NOT EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname ~ '^(refresh_|cleanup_|log_security_|check_rate_limit|moderate_|sync_)'
      AND (
        has_function_privilege('anon', p.oid, 'EXECUTE')
        OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
      )
  ),
  'Funciones internas (refresh/cleanup/log_security/check_rate_limit/moderate/sync) no tienen EXECUTE en anon/authenticated'
);

SELECT * FROM finish();

ROLLBACK;
