CREATE TYPE public.create_review_result AS (
    success BOOLEAN,
    review_id UUID,
    message TEXT,
    error TEXT
);

CREATE TYPE public.get_review_delete_info_result AS (
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

CREATE TYPE public.action_result AS (success BOOLEAN, message TEXT, error TEXT);

CREATE TYPE public.toggle_favorite_result AS (
    success BOOLEAN,
    is_favorite BOOLEAN,
    message TEXT,
    error TEXT
);

-- =============================================================================
-- TIPOS GENERALES DE RESPUESTA
-- =============================================================================
CREATE TYPE public.result_success AS (success boolean, message text);

CREATE TYPE public.result_error AS (success boolean, error text);

CREATE TYPE public.result_success_id AS (success boolean, message text, id uuid);

CREATE TYPE public.result_toggle AS (
    success boolean,
    message text,
    is_favorite boolean
);

CREATE TYPE public.result_vote AS (success boolean, message text, action text);

CREATE TYPE public.result_report AS (success boolean, message text, report_id uuid);

-- =============================================================================
-- REVIEWS (USUARIOS)
-- =============================================================================
CREATE TYPE public.review_delete_info AS (
    id uuid,
    title text,
    created_at timestamptz,
    rating integer,
    likes integer,
    dislikes integer,
    can_delete boolean,
    vote_count integer
);

CREATE TYPE public.update_review_result AS (success boolean, message text);

CREATE TYPE public.vote_review_result AS (success boolean, message text, action text);

CREATE TYPE public.report_review_result AS (success boolean, message text, report_id uuid);

CREATE TYPE public.report_result AS (
    success BOOLEAN,
    report_id UUID,
    message TEXT,
    error TEXT
);

-- =============================================================================
-- REAL ESTATE REVIEWS
-- =============================================================================
CREATE TYPE public.create_real_estate_review_result AS (success boolean, message text, review_id uuid);

CREATE TYPE public.vote_real_estate_review_result AS (success boolean, message text);

CREATE TYPE public.report_real_estate_review_result AS (success boolean, message text, report_id uuid);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
CREATE TYPE public.create_real_estate_result AS (success boolean, message text, id uuid);

CREATE TYPE public.vote_real_estate_result AS (success boolean, message text);

CREATE TYPE public.report_real_estate_result AS (success boolean, message text);

CREATE TYPE public.toggle_favorite_real_estate_result AS (
    success boolean,
    message text,
    is_favorite boolean
);

-- =============================================================================
-- FAVORITOS DE REVIEWS
-- =============================================================================
CREATE TYPE public.toggle_favorite_review_result AS (
    success boolean,
    message text,
    is_favorite boolean
);

-- =============================================================================
-- MODERACIÓN / SEGURIDAD
-- =============================================================================
CREATE TYPE public.detect_suspicious_activity_result AS (
    user_id uuid,
    total_requests integer,
    blocked_requests integer,
    suspicious_score integer
);