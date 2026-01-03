-- =============================================================================
-- MIGRACIÓN 007: SISTEMA DE FAVORITOS PARA RESEÑAS
-- =============================================================================

-- Crear tabla de favoritos de reseñas
CREATE TABLE IF NOT EXISTS public.review_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_review_favorites_review_id 
ON public.review_favorites(review_id);

CREATE INDEX IF NOT EXISTS idx_review_favorites_user_id 
ON public.review_favorites(user_id);

-- Habilitar RLS
ALTER TABLE public.review_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
DROP POLICY IF EXISTS "Anyone can view review favorites" ON public.review_favorites;
CREATE POLICY "Anyone can view review favorites" 
ON public.review_favorites FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own review favorites" ON public.review_favorites;
CREATE POLICY "Users can insert their own review favorites" 
ON public.review_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own review favorites" ON public.review_favorites;
CREATE POLICY "Users can delete their own review favorites" 
ON public.review_favorites FOR DELETE 
USING (auth.uid() = user_id);

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
