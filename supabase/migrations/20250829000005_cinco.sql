-- =============================================================================
-- PRIMERO ELIMINAR TODAS LAS FUNCIONES Y TRIGGERS QUE PUEDEN ESTAR CAUSANDO CONFLICTOS
-- =============================================================================

-- Eliminar trigger PRIMERO antes que la función (el trigger depende de la función)
DROP TRIGGER IF EXISTS update_real_estate_votes_trigger ON public.real_estate_votes;
DROP TRIGGER IF EXISTS update_real_estate_votes_updated_at ON public.real_estate_votes;
DROP FUNCTION IF EXISTS update_real_estate_votes() CASCADE;

-- Eliminar funciones problemáticas que puedan tener conflictos de parámetros
DROP FUNCTION IF EXISTS has_user_reported_real_estate_review(UUID);
DROP FUNCTION IF EXISTS vote_real_estate_review(UUID, TEXT);
DROP FUNCTION IF EXISTS vote_real_estate(UUID, TEXT) CASCADE;

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

-- =============================================================================
-- HABILITAR RLS EN LAS NUEVAS TABLAS
-- =============================================================================

ALTER TABLE public.real_estate_review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_review_reports ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FUNCIÓN PARA VOTAR RESEÑAS DE INMOBILIARIAS (NUEVA IMPLEMENTACIÓN)
-- =============================================================================

CREATE OR REPLACE FUNCTION vote_real_estate_review(
    p_review_id UUID,
    p_vote_type TEXT
) RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE 
    v_user_id UUID;
    v_existing_vote TEXT;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;
    
    IF p_vote_type NOT IN ('like', 'dislike') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Tipo de voto inválido'
        );
    END IF;
    
    -- Verificar si ya existe un voto
    SELECT vote_type INTO v_existing_vote
    FROM public.real_estate_review_votes
    WHERE real_estate_review_id = p_review_id AND user_id = v_user_id;
    
    -- Si el voto es el mismo, eliminarlo (toggle)
    IF v_existing_vote = p_vote_type THEN
        DELETE FROM public.real_estate_review_votes
        WHERE real_estate_review_id = p_review_id AND user_id = v_user_id;
        
        RETURN json_build_object(
            'success', true,
            'message', 'Voto eliminado exitosamente'
        );
    END IF;
    
    -- Insertar o actualizar el voto
    INSERT INTO public.real_estate_review_votes (real_estate_review_id, user_id, vote_type)
    VALUES (p_review_id, v_user_id, p_vote_type)
    ON CONFLICT (real_estate_review_id, user_id) 
    DO UPDATE SET vote_type = p_vote_type;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Voto registrado exitosamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error al registrar el voto: ' || SQLERRM
        );
END;
$$;

-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI USUARIO YA REPORTÓ UNA RESEÑA DE INMOBILIARIA
-- =============================================================================

CREATE OR REPLACE FUNCTION has_user_reported_real_estate_review(p_review_id UUID) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE 
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS (
        SELECT 1
        FROM public.real_estate_review_reports
        WHERE real_estate_review_id = p_review_id
        AND reported_by_user_id = v_user_id
    );
END;
$$;

-- =============================================================================
-- POLÍTICAS PARA REAL_ESTATE_REVIEW_VOTES
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can view real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Anyone can view real estate review votes" 
ON public.real_estate_review_votes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can insert their own real estate review votes" 
ON public.real_estate_review_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can update their own real estate review votes" 
ON public.real_estate_review_votes FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can delete their own real estate review votes" 
ON public.real_estate_review_votes FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================================================
-- POLÍTICAS PARA REAL_ESTATE_REVIEW_REPORTS
-- =============================================================================

DROP POLICY IF EXISTS "Users can create real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can create real estate review reports" 
ON public.real_estate_review_reports FOR INSERT 
WITH CHECK (reported_by_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can view their own real estate review reports" 
ON public.real_estate_review_reports FOR SELECT 
USING (reported_by_user_id = auth.uid());

-- =============================================================================
-- AGREGAR CONTADORES DE LIKES/DISLIKES A REAL_ESTATES
-- =============================================================================

-- Agregar columnas de likes y dislikes a real_estates si no existen
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'real_estates' 
        AND column_name = 'likes'
    ) THEN
        ALTER TABLE public.real_estates ADD COLUMN likes INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'real_estates' 
        AND column_name = 'dislikes'
    ) THEN
        ALTER TABLE public.real_estates ADD COLUMN dislikes INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- =============================================================================
-- NOTA: Trigger eliminado porque causaba duplicación con INSERT ON CONFLICT DO UPDATE
-- Los contadores ahora se manejan manualmente en la función vote_real_estate()

-- =============================================================================
-- FUNCIÓN PARA VOTAR INMOBILIARIAS (ACTUALIZADA CON TOGGLE)
-- =============================================================================

CREATE OR REPLACE FUNCTION vote_real_estate(
    p_real_estate_id UUID,
    p_vote_type TEXT
) RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE 
    v_user_id UUID;
    v_existing_vote TEXT;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;
    
    IF p_vote_type NOT IN ('like', 'dislike') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Tipo de voto inválido'
        );
    END IF;
    
    -- Verificar si ya existe un voto
    SELECT vote_type INTO v_existing_vote
    FROM public.real_estate_votes
    WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id;
    
    -- Si el voto es el mismo, eliminarlo (toggle)
    IF v_existing_vote = p_vote_type THEN
        DELETE FROM public.real_estate_votes
        WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id;
        
        -- Decrementar el contador correspondiente
        IF v_existing_vote = 'like' THEN
            UPDATE public.real_estates SET likes = GREATEST(0, likes - 1) WHERE id = p_real_estate_id;
        ELSE
            UPDATE public.real_estates SET dislikes = GREATEST(0, dislikes - 1) WHERE id = p_real_estate_id;
        END IF;
        
        RETURN json_build_object(
            'success', true,
            'message', 'Voto eliminado exitosamente'
        );
    END IF;
    
    -- Si existe un voto diferente, actualizar contadores
    IF v_existing_vote IS NOT NULL THEN
        -- Decrementar el voto anterior
        IF v_existing_vote = 'like' THEN
            UPDATE public.real_estates SET likes = GREATEST(0, likes - 1) WHERE id = p_real_estate_id;
        ELSE
            UPDATE public.real_estates SET dislikes = GREATEST(0, dislikes - 1) WHERE id = p_real_estate_id;
        END IF;
        
        -- Incrementar el nuevo voto
        IF p_vote_type = 'like' THEN
            UPDATE public.real_estates SET likes = likes + 1 WHERE id = p_real_estate_id;
        ELSE
            UPDATE public.real_estates SET dislikes = dislikes + 1 WHERE id = p_real_estate_id;
        END IF;
        
        -- Actualizar el voto
        UPDATE public.real_estate_votes 
        SET vote_type = p_vote_type
        WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id;
    ELSE
        -- Es un voto nuevo, solo incrementar
        IF p_vote_type = 'like' THEN
            UPDATE public.real_estates SET likes = likes + 1 WHERE id = p_real_estate_id;
        ELSE
            UPDATE public.real_estates SET dislikes = dislikes + 1 WHERE id = p_real_estate_id;
        END IF;
        
        -- Insertar el nuevo voto
        INSERT INTO public.real_estate_votes (real_estate_id, user_id, vote_type)
        VALUES (p_real_estate_id, v_user_id, p_vote_type);
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Voto registrado exitosamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error al registrar el voto: ' || SQLERRM
        );
END;
$$;

-- =============================================================================
-- PERMISOS PARA LAS FUNCIONES
-- =============================================================================

GRANT EXECUTE ON FUNCTION vote_real_estate_review(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_user_reported_real_estate_review(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION vote_real_estate(UUID, TEXT) TO authenticated;

-- =============================================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_review_id ON public.real_estate_review_votes(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_user_id ON public.real_estate_review_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_review_id ON public.real_estate_review_reports(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_reported_by ON public.real_estate_review_reports(reported_by_user_id);