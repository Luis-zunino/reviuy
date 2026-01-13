-- =============================================================================
-- MIGRACIÓN: RESTRICCIÓN DE RESEÑA ÚNICA POR PROPIEDAD
-- Fecha: 03 de enero de 2026
-- Descripción: Restringe a los usuarios a una sola reseña por propiedad (usando address_osm_id)
-- =============================================================================

-- 1. Agregar restricción única a la tabla reviews
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_user_property_review UNIQUE (user_id, address_osm_id);