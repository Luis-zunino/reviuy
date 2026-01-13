-- =============================================================================
-- FUNCIÓN PARA AGREGAR/QUITAR FAVORITO DE RESEÑA (TOGGLE)
-- =============================================================================

CREATE OR REPLACE FUNCTION toggle_favorite_review(
    p_review_id UUID
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
        SELECT 1 FROM public.review_favorites
        WHERE review_id = p_review_id AND user_id = v_user_id
    ) INTO v_favorite_exists;
    
    -- Si existe, eliminarlo
    IF v_favorite_exists THEN
        DELETE FROM public.review_favorites
        WHERE review_id = p_review_id AND user_id = v_user_id;
        
        RETURN json_build_object(
            'success', true,
            'isFavorite', false,
            'message', 'Eliminado de favoritos'
        );
    ELSE
        -- Si no existe, agregarlo
        INSERT INTO public.review_favorites (review_id, user_id)
        VALUES (p_review_id, v_user_id);
        
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
GRANT EXECUTE ON FUNCTION toggle_favorite_review(UUID) TO authenticated;

-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI UNA RESEÑA ES FAVORITA
-- =============================================================================

CREATE OR REPLACE FUNCTION is_review_favorite(
    p_review_id UUID
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
        FROM public.review_favorites
        WHERE review_id = p_review_id
        AND user_id = v_user_id
    );
END;
$$;

-- Permisos
GRANT EXECUTE ON FUNCTION is_review_favorite(UUID) TO authenticated;
