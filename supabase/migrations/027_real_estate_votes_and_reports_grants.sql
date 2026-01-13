-- =============================================================================
-- Permisos para las funciones
-- =============================================================================
GRANT EXECUTE ON FUNCTION create_real_estate(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION vote_real_estate(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION report_real_estate(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_user_reported_real_estate(UUID) TO authenticated;

