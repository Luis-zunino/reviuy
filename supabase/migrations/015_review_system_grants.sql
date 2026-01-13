-- =============================================================================
-- PERMISOS PARA FUNCIONES DE REVIEWS
-- =============================================================================

GRANT EXECUTE ON FUNCTION create_review(TEXT, TEXT, INTEGER, UUID, TEXT, TEXT, TEXT, DECIMAL, DECIMAL, INTEGER, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_review_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION vote_review(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_review_delete_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_review(UUID, TEXT, TEXT, INTEGER, TEXT, INTEGER, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION report_review(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_user_reported_review(UUID) TO authenticated;


-- =============================================================================
-- MIGRACIÓN 2 COMPLETADA
-- =============================================================================

DO $$ 
BEGIN
    RAISE NOTICE 'Migración 2 completada: Sistema completo de reviews (votos, reportes, auditoría, funciones)';
END $$;