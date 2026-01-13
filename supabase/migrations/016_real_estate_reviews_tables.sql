-- =============================================================================
-- MIGRACIÓN 3: SISTEMA DE RESEÑAS DE INMOBILIARIAS  
-- Fecha: 09 de octubre de 2025
-- Descripción: Reseñas específicas para inmobiliarias
-- =============================================================================

-- =============================================================================
-- TABLAS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- TABLA: Reseñas de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contenido de la reseña sobre la inmobiliaria
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    
    -- Contadores
    likes INTEGER NOT NULL DEFAULT 0,
    dislikes INTEGER NOT NULL DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Un usuario solo puede hacer una reseña por inmobiliaria
    UNIQUE(real_estate_id, user_id)
);

-- TABLA: Votos para reseñas de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_review_id UUID NOT NULL REFERENCES public.real_estate_reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(real_estate_review_id, user_id)
);

-- TABLA: Reportes para reseñas de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_review_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    real_estate_review_id UUID NOT NULL REFERENCES public.real_estate_reviews(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(real_estate_review_id, reported_by_user_id)
);