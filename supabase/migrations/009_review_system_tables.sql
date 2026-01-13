-- =============================================================================
-- MIGRACIÓN 2: SISTEMA COMPLETO DE REVIEWS
-- Fecha: 09 de octubre de 2025
-- Descripción: Votos, reportes, auditoría y funciones para reviews
-- =============================================================================

-- =============================================================================
-- TABLAS PARA SISTEMA DE REVIEWS
-- =============================================================================

-- Tabla de votos para reviews
CREATE TABLE IF NOT EXISTS public.review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(review_id, user_id)
);

-- Tabla para reportes de reviews
CREATE TABLE IF NOT EXISTS public.review_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, reported_by_user_id)
);

-- Tabla de auditoría para eliminaciones
CREATE TABLE IF NOT EXISTS public.review_deletions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL,
    deleted_by UUID NOT NULL REFERENCES auth.users(id),
    review_title TEXT,
    review_rating INTEGER,
    review_created_at TIMESTAMPTZ,
    deletion_reason TEXT,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de auditoría completa
CREATE TABLE IF NOT EXISTS public.review_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id),
    change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);