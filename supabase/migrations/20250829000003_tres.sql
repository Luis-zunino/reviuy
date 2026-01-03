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

-- =============================================================================
-- ÍNDICES PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Índices para real_estate_reviews
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_real_estate_id ON public.real_estate_reviews(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_user_id ON public.real_estate_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_created_at ON public.real_estate_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_rating ON public.real_estate_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_real_estate_rating ON public.real_estate_reviews(real_estate_id, rating);

-- Índices para real_estate_review_votes
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_review_id ON public.real_estate_review_votes(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_user_id ON public.real_estate_review_votes(user_id);

-- Índices para real_estate_review_reports
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_review_id ON public.real_estate_review_reports(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_status ON public.real_estate_review_reports(status);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_created_at ON public.real_estate_review_reports(created_at);

-- Índices de búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_text_search 
ON public.real_estate_reviews USING gin(to_tsvector('spanish', title || ' ' || description));

-- =============================================================================
-- FUNCIONES PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Función para actualizar contadores de votos de reseñas de inmobiliarias
CREATE OR REPLACE FUNCTION update_real_estate_review_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.vote_type = 'like' THEN
            UPDATE public.real_estate_reviews SET likes = likes + 1 WHERE id = NEW.real_estate_review_id;
        ELSE
            UPDATE public.real_estate_reviews SET dislikes = dislikes + 1 WHERE id = NEW.real_estate_review_id;
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.vote_type = 'like' THEN
            UPDATE public.real_estate_reviews SET likes = likes - 1 WHERE id = OLD.real_estate_review_id;
        ELSE
            UPDATE public.real_estate_reviews SET dislikes = dislikes - 1 WHERE id = OLD.real_estate_review_id;
        END IF;
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF OLD.vote_type != NEW.vote_type THEN
            IF OLD.vote_type = 'like' THEN
                UPDATE public.real_estate_reviews SET likes = likes - 1 WHERE id = OLD.real_estate_review_id;
            ELSE
                UPDATE public.real_estate_reviews SET dislikes = dislikes - 1 WHERE id = OLD.real_estate_review_id;
            END IF;
            IF NEW.vote_type = 'like' THEN
                UPDATE public.real_estate_reviews SET likes = likes + 1 WHERE id = NEW.real_estate_review_id;
            ELSE
                UPDATE public.real_estate_reviews SET dislikes = dislikes + 1 WHERE id = NEW.real_estate_review_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar rating de inmobiliaria basado en sus reseñas
CREATE OR REPLACE FUNCTION update_real_estate_rating_from_reviews()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        UPDATE public.real_estates 
        SET 
            rating = (
                SELECT COALESCE(AVG(rating), 0) 
                FROM public.real_estate_reviews 
                WHERE real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
            ),
            review_count = (
                SELECT COUNT(*) 
                FROM public.real_estate_reviews 
                WHERE real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
            )
        WHERE id = COALESCE(NEW.real_estate_id, OLD.real_estate_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Función para crear reseña de inmobiliaria
CREATE OR REPLACE FUNCTION create_real_estate_review(
    p_real_estate_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_rating INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_review_id UUID;
    v_user_id UUID;
    v_existing_review UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
    END IF;

    -- Validar que la inmobiliaria existe
    IF NOT EXISTS (SELECT 1 FROM public.real_estates WHERE id = p_real_estate_id) THEN
        RETURN json_build_object('success', false, 'error', 'La inmobiliaria no existe');
    END IF;

    -- Validar rating
    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN json_build_object('success', false, 'error', 'El rating debe estar entre 1 y 5');
    END IF;

    -- Verificar si el usuario ya tiene una reseña para esta inmobiliaria
    SELECT id INTO v_existing_review
    FROM public.real_estate_reviews
    WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id;

    IF v_existing_review IS NOT NULL THEN
        RETURN json_build_object('success', false, 'error', 'Ya has escrito una reseña para esta inmobiliaria');
    END IF;

    -- Insertar la nueva reseña
    INSERT INTO public.real_estate_reviews (
        real_estate_id,
        user_id,
        title,
        description,
        rating
    ) VALUES (
        p_real_estate_id,
        v_user_id,
        p_title,
        p_description,
        p_rating
    )
    RETURNING id INTO v_review_id;

    RETURN json_build_object(
        'success', true,
        'review_id', v_review_id,
        'message', 'Reseña de inmobiliaria creada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Error al crear la reseña: ' || SQLERRM);
END;
$$;

-- Función para votar reseñas de inmobiliarias
CREATE OR REPLACE FUNCTION vote_real_estate_review(
    p_real_estate_review_id UUID,
    p_vote_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
    END IF;

    IF p_vote_type NOT IN ('like', 'dislike') THEN
        RETURN json_build_object('success', false, 'error', 'Tipo de voto inválido');
    END IF;

    INSERT INTO public.real_estate_review_votes (real_estate_review_id, user_id, vote_type)
    VALUES (p_real_estate_review_id, v_user_id, p_vote_type)
    ON CONFLICT (real_estate_review_id, user_id) 
    DO UPDATE SET vote_type = p_vote_type;

    RETURN json_build_object('success', true, 'message', 'Voto registrado exitosamente');

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Error al registrar el voto');
END;
$$;

-- Función para reportar reseñas de inmobiliarias
CREATE OR REPLACE FUNCTION report_real_estate_review(
    p_real_estate_review_id UUID,
    p_reason TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_report_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.real_estate_reviews WHERE id = p_real_estate_review_id) THEN
        RETURN json_build_object('success', false, 'error', 'La reseña no existe');
    END IF;

    INSERT INTO public.real_estate_review_reports (real_estate_review_id, reported_by_user_id, reason, description)
    VALUES (p_real_estate_review_id, v_user_id, p_reason, p_description)
    ON CONFLICT (real_estate_review_id, reported_by_user_id) 
    DO UPDATE SET 
        reason = EXCLUDED.reason,
        description = EXCLUDED.description,
        status = 'pending',
        updated_at = NOW()
    RETURNING id INTO v_report_id;

    RETURN json_build_object('success', true, 'report_id', v_report_id, 'message', 'Reporte enviado exitosamente');

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$$;

-- =============================================================================
-- TRIGGERS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Trigger para updated_at en real_estate_reviews
DROP TRIGGER IF EXISTS update_real_estate_reviews_updated_at ON public.real_estate_reviews;
CREATE TRIGGER update_real_estate_reviews_updated_at
    BEFORE UPDATE ON public.real_estate_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para votos de reseñas de inmobiliarias
DROP TRIGGER IF EXISTS real_estate_review_votes_trigger ON public.real_estate_review_votes;
CREATE TRIGGER real_estate_review_votes_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.real_estate_review_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_real_estate_review_votes();

-- Trigger para actualizar rating de inmobiliaria cuando cambian sus reseñas
DROP TRIGGER IF EXISTS update_real_estate_rating_trigger ON public.real_estate_reviews;
CREATE TRIGGER update_real_estate_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.real_estate_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_real_estate_rating_from_reviews();

-- =============================================================================
-- RLS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Habilitar RLS en nuevas tablas
ALTER TABLE public.real_estate_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_review_reports ENABLE ROW LEVEL SECURITY;

-- Políticas para real_estate_reviews
DROP POLICY IF EXISTS "Anyone can view real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Anyone can view real estate reviews" ON public.real_estate_reviews 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Authenticated users can create real estate reviews" ON public.real_estate_reviews 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Users can update own real estate reviews" ON public.real_estate_reviews 
    FOR UPDATE USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Users can delete own real estate reviews" ON public.real_estate_reviews 
    FOR DELETE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Políticas para real_estate_review_votes
DROP POLICY IF EXISTS "Anyone can view real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Anyone can view real estate review votes" ON public.real_estate_review_votes 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can manage own real estate review votes" ON public.real_estate_review_votes 
    FOR ALL USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Políticas para real_estate_review_reports
DROP POLICY IF EXISTS "Users can create real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can create real estate review reports" ON public.real_estate_review_reports 
    FOR INSERT WITH CHECK (reported_by_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can view own real estate review reports" ON public.real_estate_review_reports 
    FOR SELECT USING (reported_by_user_id = auth.uid());

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