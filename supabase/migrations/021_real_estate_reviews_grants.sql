-- =============================================================================
-- PERMISOS PARA FUNCIONES DE RESEÑAS DE INMOBILIARIAS
-- =============================================================================

GRANT EXECUTE ON FUNCTION create_real_estate_review(UUID, TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION vote_real_estate_review(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION report_real_estate_review(UUID, TEXT, TEXT) TO authenticated;

-- =============================================================================
-- MIGRACIÓN 3 COMPLETADA
-- =============================================================================

DO $$ 
BEGIN
    RAISE NOTICE 'Migración 3 completada: Sistema de reseñas de inmobiliarias creado';
END $$;