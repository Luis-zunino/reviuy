-- =============================================================================
-- FUNCIÓN PARA AGREGAR/QUITAR FAVORITO (TOGGLE)
-- =============================================================================

CREATE OR REPLACE FUNCTION toggle_favorite_real_estate(
    p_real_estate_id UUID
) RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE 
    v_user_id UUID;
    v_favorite_exists BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;
    
    -- Verificar si ya existe en favoritos
    SELECT EXISTS (
        SELECT 1 FROM public.real_estate_favorites
        WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id
    ) INTO v_favorite_exists;
    
    -- Si existe, eliminarlo
    IF v_favorite_exists THEN
        DELETE FROM public.real_estate_favorites
        WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id;
        
        RETURN json_build_object(
            'success', true,
            'isFavorite', false,
            'message', 'Eliminado de favoritos'
        );
    ELSE
        -- Si no existe, agregarlo
        INSERT INTO public.real_estate_favorites (real_estate_id, user_id)
        VALUES (p_real_estate_id, v_user_id);
        
        RETURN json_build_object(
            'success', true,
            'isFavorite', true,
            'message', 'Agregado a favoritos'
        );
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error al actualizar favoritos: ' || SQLERRM
        );
END;
$$;

-- Permisos
GRANT EXECUTE ON FUNCTION toggle_favorite_real_estate(UUID) TO authenticated;

-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI UNA INMOBILIARIA ES FAVORITA
-- =============================================================================

CREATE OR REPLACE FUNCTION is_real_estate_favorite(
    p_real_estate_id UUID
) RETURNS BOOLEAN 
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
        FROM public.real_estate_favorites
        WHERE real_estate_id = p_real_estate_id
        AND user_id = v_user_id
    );
END;
$$;

-- Permisos
GRANT EXECUTE ON FUNCTION is_real_estate_favorite(UUID) TO authenticated;
