
-- Políticas para REVIEWS
-- Create ONE clear read policy
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;

CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR
INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Users can update own reviews" ON public.reviews FOR
UPDATE
    USING (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    ) WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
);
