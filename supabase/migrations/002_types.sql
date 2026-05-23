-- =============================================================================
-- Tipos compuestos (composite types) para resultados de funciones
-- =============================================================================
-- Cada tipo se elimina primero para garantizar idempotencia en un nuevo esquema.

-- =============================================================================
-- REVIEWS (USUARIOS)
-- =============================================================================
drop type if exists public.create_review_result cascade;
create type public.create_review_result as (
  success BOOLEAN,
  review_id UUID,
  message TEXT,
  error TEXT
);

drop type if exists public.get_review_delete_info_result cascade;
create type public.get_review_delete_info_result as (
  id uuid,
  title text,
  created_at timestamptz,
  rating integer,
  likes integer,
  dislikes integer,
  can_delete boolean,
  vote_count integer,
  error text
);

drop type if exists public.toggle_favorite_result cascade;
create type public.toggle_favorite_result as (
  success BOOLEAN,
  is_favorite BOOLEAN,
  message TEXT,
  error TEXT
);

drop type if exists public.review_delete_info cascade;
create type public.review_delete_info as (
  id uuid,
  title text,
  created_at timestamptz,
  rating integer,
  likes integer,
  dislikes integer,
  can_delete boolean,
  vote_count integer
);

drop type if exists public.update_review_result cascade;
create type public.update_review_result as (success boolean, message text);

drop type if exists public.vote_review_result cascade;
create type public.vote_review_result as (success boolean, message text, action text);

drop type if exists public.report_review_result cascade;
create type public.report_review_result as (success boolean, message text, report_id uuid);

drop type if exists public.report_result cascade;
create type public.report_result as (
  success BOOLEAN,
  report_id UUID,
  message TEXT,
  error TEXT
);

-- =============================================================================
-- REAL ESTATE REVIEWS
-- =============================================================================
drop type if exists public.create_real_estate_review_result cascade;
create type public.create_real_estate_review_result as (success boolean, message text, review_id uuid);

drop type if exists public.vote_real_estate_review_result cascade;
create type public.vote_real_estate_review_result as (success boolean, message text);

drop type if exists public.report_real_estate_review_result cascade;
create type public.report_real_estate_review_result as (success boolean, message text, report_id uuid);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
drop type if exists public.create_real_estate_result cascade;
create type public.create_real_estate_result as (success boolean, message text, id uuid);

drop type if exists public.vote_real_estate_result cascade;
create type public.vote_real_estate_result as (success boolean, message text);

drop type if exists public.report_real_estate_result cascade;
create type public.report_real_estate_result as (success boolean, message text);

drop type if exists public.toggle_favorite_real_estate_result cascade;
create type public.toggle_favorite_real_estate_result as (
  success boolean,
  message text,
  is_favorite boolean
);

-- =============================================================================
-- FAVORITOS DE REVIEWS
-- =============================================================================
drop type if exists public.toggle_favorite_review_result cascade;
create type public.toggle_favorite_review_result as (
  success boolean,
  message text,
  is_favorite boolean
);
