-- =============================================================================
-- PRIMERO ELIMINAR TODAS LAS FUNCIONES Y TRIGGERS QUE PUEDEN ESTAR CAUSANDO CONFLICTOS
-- =============================================================================

-- Eliminar trigger PRIMERO antes que la función (el trigger depende de la función)
DROP TRIGGER IF EXISTS update_real_estate_votes_trigger ON public.real_estate_votes;
DROP TRIGGER IF EXISTS update_real_estate_votes_updated_at ON public.real_estate_votes;
DROP FUNCTION IF EXISTS update_real_estate_votes() CASCADE;
