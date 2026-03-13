-- =============================================================================
-- PERMISOS PARA FUNCIONES DE REVIEWS
-- =============================================================================
grant execute on FUNCTION toggle_favorite_real_estate (UUID) to authenticated;

grant execute on FUNCTION is_real_estate_favorite (UUID) to authenticated;

grant execute on FUNCTION get_user_real_estate_vote (UUID) to authenticated;

grant execute on function public.get_reviews_by_current_user () to authenticated;

grant execute on function public.get_favorite_reviews_by_current_user () to authenticated;

grant execute on function public.get_user_review_vote (uuid) to authenticated;

grant execute on function public.check_user_review_for_address (text) to authenticated;

grant execute on function public.get_real_estate_review_by_user (uuid) to authenticated;

grant execute on FUNCTION toggle_favorite_review (UUID) to authenticated;

grant execute on FUNCTION is_review_favorite (UUID) to authenticated;

grant execute on FUNCTION public.create_review (
    text,
    text,
    integer,
    text,
    text,
    numeric,
    numeric,
    uuid,
    text,
    integer,
    text,
    text,
    text,
    text,
    text,
    jsonb
) to authenticated;

grant execute on FUNCTION delete_review_safe (UUID) to authenticated;

grant execute on FUNCTION vote_review (UUID, TEXT) to authenticated;

grant execute on FUNCTION get_review_delete_info (UUID) to authenticated;

grant execute on FUNCTION update_review (
    UUID,
    TEXT,
    TEXT,
    INTEGER,
    TEXT,
    INTEGER,
    TEXT,
    TEXT,
    TEXT
) to authenticated;

grant execute on FUNCTION report_review (UUID, TEXT, TEXT) to authenticated;

grant execute on FUNCTION has_user_reported_review (UUID) to authenticated;

grant execute on FUNCTION create_real_estate_review (UUID, TEXT, TEXT, INTEGER) to authenticated;

grant execute on FUNCTION vote_real_estate_review (UUID, TEXT) to authenticated;

grant execute on FUNCTION report_real_estate_review (UUID, TEXT, TEXT) to authenticated;

grant execute on FUNCTION create_real_estate (TEXT, TEXT) to authenticated;

grant execute on FUNCTION vote_real_estate (UUID, TEXT) to authenticated;

grant execute on FUNCTION report_real_estate (UUID, TEXT, TEXT) to authenticated;

grant execute on FUNCTION has_user_reported_real_estate (UUID) to authenticated;

grant execute on FUNCTION public.has_user_reported_real_estate_review (UUID) to authenticated;

-- Permisos para funciones y vistas de contadores de votos
grant execute on FUNCTION public.get_real_estate_vote_counts (UUID) to authenticated,
anon;

grant
select
    on public.real_estate_vote_stats to authenticated,
    anon;

grant
select
    on public.real_estates_with_votes to authenticated,
    anon;

-- Permisos para funciones y vistas de contadores de votos de reviews
grant execute on FUNCTION public.get_review_vote_counts (UUID) to authenticated,
anon;

grant
select
    on public.review_vote_stats to authenticated,
    anon;

grant
select
    on public.reviews_with_votes to authenticated,
    anon;

-- Permisos para funciones y vistas de contadores de votos de real_estate_reviews
grant execute on FUNCTION public.get_real_estate_review_vote_counts (UUID) to authenticated,
anon;

grant
select
    on public.real_estate_review_vote_stats to authenticated,
    anon;

grant
select
    on public.real_estate_reviews_with_votes to authenticated,
    anon;
