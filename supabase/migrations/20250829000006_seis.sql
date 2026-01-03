-- =============================================================================
-- MIGRACIÓN 006: SISTEMA DE FAVORITOS PARA INMOBILIARIAS
-- =============================================================================

-- Crear tabla de favoritos de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estate_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    real_estate_id UUID NOT NULL REFERENCES public.real_estates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(real_estate_id, user_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_real_estate_id 
ON public.real_estate_favorites(real_estate_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_user_id 
ON public.real_estate_favorites(user_id);

-- Habilitar RLS
ALTER TABLE public.real_estate_favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
DROP POLICY IF EXISTS "Anyone can view real estate favorites" ON public.real_estate_favorites;
CREATE POLICY "Anyone can view real estate favorites" 
ON public.real_estate_favorites FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.real_estate_favorites;
CREATE POLICY "Users can insert their own favorites" 
ON public.real_estate_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.real_estate_favorites;
CREATE POLICY "Users can delete their own favorites" 
ON public.real_estate_favorites FOR DELETE 
USING (auth.uid() = user_id);

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
