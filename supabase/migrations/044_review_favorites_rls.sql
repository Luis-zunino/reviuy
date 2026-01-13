-- =============================================================================
-- POLÍTICAS RLS PARA FAVORITOS DE RESEÑAS
-- =============================================================================

-- Políticas de seguridad
DROP POLICY IF EXISTS "Anyone can view review favorites"
ON public.review_favorites;

CREATE POLICY "Anyone can view review favorites"
ON public.review_favorites FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own review favorites"
ON public.review_favorites;

CREATE POLICY "Users can insert their own review favorites"
ON public.review_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own review favorites"
ON public.review_favorites;

CREATE POLICY "Users can delete their own review favorites"
ON public.review_favorites FOR DELETE
USING (auth.uid() = user_id);
