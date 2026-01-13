-- =============================================================================
-- MIGRACIÓN 006: SISTEMA DE FAVORITOS PARA INMOBILIARIAS
-- =============================================================================
-- Crear tabla de favoritos de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(real_estate_id, user_id)
);