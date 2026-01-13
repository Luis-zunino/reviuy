
-- =============================================================================
-- Funciones
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
