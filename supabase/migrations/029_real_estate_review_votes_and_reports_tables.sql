-- =============================================================================
-- CREAR TABLAS NECESARIAS PRIMERO (SI NO EXISTEN)
-- =============================================================================

-- Tabla para votos de reseñas de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_review_id UUID NOT NULL REFERENCES public.real_estate_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(real_estate_review_id, user_id)
);

-- Tabla para reportes de reseñas de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_review_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_review_id UUID NOT NULL REFERENCES public.real_estate_reviews(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(real_estate_review_id, reported_by_user_id)
);