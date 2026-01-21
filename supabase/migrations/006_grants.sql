-- =============================================================================
-- PERMISOS PARA FUNCIONES DE REVIEWS
-- =============================================================================
GRANT EXECUTE ON FUNCTION toggle_favorite_real_estate (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION is_real_estate_favorite (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION toggle_favorite_review (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION is_review_favorite (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION create_review (
    TEXT,
    TEXT,
    INTEGER,
    UUID,
    TEXT,
    TEXT,
    TEXT,
    DECIMAL,
    DECIMAL,
    INTEGER,
    TEXT,
    TEXT,
    TEXT
) TO authenticated;

GRANT EXECUTE ON FUNCTION delete_review_safe (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION vote_review (UUID, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION get_review_delete_info (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION update_review (
    UUID,
    TEXT,
    TEXT,
    INTEGER,
    TEXT,
    INTEGER,
    TEXT,
    TEXT,
    TEXT
) TO authenticated;

GRANT EXECUTE ON FUNCTION report_review (UUID, TEXT, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION has_user_reported_review (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION create_real_estate_review (UUID, TEXT, TEXT, INTEGER) TO authenticated;

GRANT EXECUTE ON FUNCTION vote_real_estate_review (UUID, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION report_real_estate_review (UUID, TEXT, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION create_real_estate (TEXT, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION vote_real_estate (UUID, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION report_real_estate (UUID, TEXT, TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION has_user_reported_real_estate (UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION public.has_user_reported_real_estate_review (UUID) TO authenticated;