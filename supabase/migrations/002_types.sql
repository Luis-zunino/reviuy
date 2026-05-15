create type public.create_review_result as (
  success BOOLEAN,
  review_id UUID,
  message TEXT,
  error TEXT
);

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

create type public.toggle_favorite_result as (
  success BOOLEAN,
  is_favorite BOOLEAN,
  message TEXT,
  error TEXT
);

-- =============================================================================
-- TIPOS EN USO
-- =============================================================================
-- =============================================================================
-- REVIEWS (USUARIOS)
-- =============================================================================
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

create type public.update_review_result as (success boolean, message text);

create type public.vote_review_result as (success boolean, message text, action text);

create type public.report_review_result as (success boolean, message text, report_id uuid);

create type public.report_result as (
  success BOOLEAN,
  report_id UUID,
  message TEXT,
  error TEXT
);

-- =============================================================================
-- REAL ESTATE REVIEWS
-- =============================================================================
create type public.create_real_estate_review_result as (success boolean, message text, review_id uuid);

create type public.vote_real_estate_review_result as (success boolean, message text);

create type public.report_real_estate_review_result as (success boolean, message text, report_id uuid);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
create type public.create_real_estate_result as (success boolean, message text, id uuid);

create type public.vote_real_estate_result as (success boolean, message text);

create type public.report_real_estate_result as (success boolean, message text);

create type public.toggle_favorite_real_estate_result as (
  success boolean,
  message text,
  is_favorite boolean
);

-- =============================================================================
-- FAVORITOS DE REVIEWS
-- =============================================================================
create type public.toggle_favorite_review_result as (
  success boolean,
  message text,
  is_favorite boolean
);

-- =============================================================================
-- MODERACIÓN / SEGURIDAD
-- =============================================================================
create type public.detect_suspicious_activity_result as (
  user_id uuid,
  total_requests integer,
  blocked_requests integer,
  suspicious_score integer
);