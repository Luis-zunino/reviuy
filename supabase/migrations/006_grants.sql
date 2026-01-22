-- =============================================================================
-- PERMISOS PARA FUNCIONES DE REVIEWS
-- =============================================================================
grant execute on FUNCTION toggle_favorite_real_estate (UUID) to authenticated;

grant execute on FUNCTION is_real_estate_favorite (UUID) to authenticated;

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
    text
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