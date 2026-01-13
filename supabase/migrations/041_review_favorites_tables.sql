-- =============================================================================
-- MIGRACIÓN 007: SISTEMA DE FAVORITOS PARA RESEÑAS
-- =============================================================================

-- Crear tabla de favoritos de reseñas
CREATE TABLE IF NOT EXISTS public.review_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);