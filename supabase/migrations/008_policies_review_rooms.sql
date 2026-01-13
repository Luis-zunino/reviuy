-- Políticas para REVIEW_ROOMS
DROP POLICY IF EXISTS "Anyone can view review rooms" ON public.review_rooms;

CREATE POLICY "Anyone can view review rooms" ON public.review_rooms FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage rooms of their reviews" ON public.review_rooms;

CREATE POLICY "Users can manage rooms of their reviews" ON public.review_rooms FOR ALL USING (
    EXISTS (
        SELECT
            1
        FROM
            public.reviews
        WHERE
            reviews.id = review_rooms.review_id
            AND reviews.user_id = auth.uid()
    )
);

-- =============================================================================
-- MIGRACIÓN 1 COMPLETADA
-- =============================================================================
DO $$ BEGIN RAISE NOTICE 'Migración 1 completada: Estructura base creada (real_estates, reviews, review_rooms)';

END $$;