-- =============================================================================
-- Primero crear las tablas si no existen
-- =============================================================================

-- Tabla para reportes de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(real_estate_id, reported_by_user_id)
);

-- Tabla para votos de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(real_estate_id, user_id)
);

-- =============================================================================
-- Habilitar RLS en las nuevas tablas
-- =============================================================================
ALTER TABLE public.real_estate_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_reports ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Políticas para real_estate_votes
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can view real estate votes" ON public.real_estate_votes;
CREATE POLICY "Anyone can view real estate votes" ON public.real_estate_votes 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own real estate votes" ON public.real_estate_votes;
CREATE POLICY "Users can insert their own real estate votes" ON public.real_estate_votes 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own real estate votes" ON public.real_estate_votes;
CREATE POLICY "Users can update their own real estate votes" ON public.real_estate_votes 
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own real estate votes" ON public.real_estate_votes;
CREATE POLICY "Users can delete their own real estate votes" ON public.real_estate_votes 
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- Políticas para real_estate_reports 
-- =============================================================================
DROP POLICY IF EXISTS "Users can create real estate reports" ON public.real_estate_reports;
CREATE POLICY "Users can create real estate reports" ON public.real_estate_reports 
    FOR INSERT WITH CHECK (reported_by_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own real estate reports" ON public.real_estate_reports;
CREATE POLICY "Users can view their own real estate reports" ON public.real_estate_reports 
    FOR SELECT USING (reported_by_user_id = auth.uid());

-- =============================================================================
-- Ahora crear las funciones
-- =============================================================================

-- Función para crear inmobiliaria
CREATE OR REPLACE FUNCTION create_real_estate(
    p_name text,
    p_description text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid;
    v_real_estate_id uuid;
BEGIN
    -- Obtener el ID del usuario autenticado
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;
    
    -- Validar nombre
    IF p_name IS NULL OR p_name = '' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'El nombre es obligatorio'
        );
    END IF;
    
    -- Insertar la inmobiliaria
    INSERT INTO public.real_estates (name, description, user_id, likes, dislikes)
    VALUES (p_name, p_description, v_user_id, 0, 0)
    RETURNING id INTO v_real_estate_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Inmobiliaria creada exitosamente',
        'id', v_real_estate_id
    );
    
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Ya existe una inmobiliaria con ese nombre'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error al crear la inmobiliaria: ' || SQLERRM
        );
END;
$$;

-- Función para votar inmobiliarias
CREATE OR REPLACE FUNCTION vote_real_estate(
    p_real_estate_id UUID,
    p_vote_type TEXT
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$ 
DECLARE 
    v_user_id UUID;
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

    INSERT INTO public.real_estate_votes (real_estate_id, user_id, vote_type)
    VALUES (p_real_estate_id, v_user_id, p_vote_type) 
    ON CONFLICT (real_estate_id, user_id) DO UPDATE
    SET vote_type = EXCLUDED.vote_type;

    RETURN json_build_object(
        'success', true,
        'message', 'Voto registrado exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN 
        RETURN json_build_object(
            'success', false,
            'error', 'Error al registrar el voto'
        );
END;
$$;

-- Función para reportar inmobiliarias 
CREATE OR REPLACE FUNCTION report_real_estate(
    p_real_estate_id UUID,
    p_reason TEXT,
    p_description TEXT DEFAULT NULL
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$ 
DECLARE 
    v_user_id UUID;
BEGIN 
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN 
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.real_estates
        WHERE id = p_real_estate_id
    ) THEN 
        RETURN json_build_object(
            'success', false,
            'error', 'La inmobiliaria no existe'
        );
    END IF;

    INSERT INTO public.real_estate_reports (
        real_estate_id,
        reported_by_user_id,
        reason,
        description
    )
    VALUES (
        p_real_estate_id,
        v_user_id,
        p_reason,
        p_description
    ) 
    ON CONFLICT (real_estate_id, reported_by_user_id) DO UPDATE
    SET 
        reason = EXCLUDED.reason,
        description = EXCLUDED.description,
        status = 'pending',
        updated_at = NOW();

    RETURN json_build_object(
        'success', true,
        'message', 'Reporte enviado exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN 
        RETURN json_build_object(
            'success', false,
            'error', 'Error interno del servidor'
        );
END;
$$;

-- Función para verificar si usuario ya reportó una inmobiliaria 
CREATE OR REPLACE FUNCTION has_user_reported_real_estate(p_real_estate_id UUID) 
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
        FROM public.real_estate_reports
        WHERE real_estate_id = p_real_estate_id
        AND reported_by_user_id = v_user_id
    );
END;
$$;

-- =============================================================================
-- Ahora crear los triggers (después de crear las tablas)
-- =============================================================================

-- Trigger para updated_at en real_estate_reports
DROP TRIGGER IF EXISTS update_real_estate_reports_updated_at ON public.real_estate_reports;
CREATE TRIGGER update_real_estate_reports_updated_at 
    BEFORE UPDATE ON public.real_estate_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at en real_estate_votes
DROP TRIGGER IF EXISTS update_real_estate_votes_updated_at ON public.real_estate_votes;
CREATE TRIGGER update_real_estate_votes_updated_at 
    BEFORE UPDATE ON public.real_estate_votes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Permisos para las funciones
-- =============================================================================
GRANT EXECUTE ON FUNCTION create_real_estate(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION vote_real_estate(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION report_real_estate(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION has_user_reported_real_estate(UUID) TO authenticated;

-- =============================================================================
-- Índices para mejor rendimiento
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_real_estate_votes_real_estate_id ON public.real_estate_votes(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_votes_user_id ON public.real_estate_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reports_real_estate_id ON public.real_estate_reports(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reports_reported_by ON public.real_estate_reports(reported_by_user_id);