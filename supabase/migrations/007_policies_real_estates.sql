
-- Políticas para REAL_ESTATES
DROP POLICY IF EXISTS "Anyone can view real estates" ON public.real_estates;

CREATE POLICY "Anyone can view real estates" ON public.real_estates FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create real estates" ON public.real_estates;

CREATE POLICY "Authenticated users can create real estates" ON public.real_estates FOR
INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
            created_by = auth.uid()
            OR created_by IS NULL
        )
    );

DROP POLICY IF EXISTS "Creators can update their real estates" ON public.real_estates;

CREATE POLICY "Creators can update their real estates" ON public.real_estates FOR
UPDATE
    USING (
        auth.uid() IS NOT NULL
        AND (
            created_by = auth.uid()
            OR created_by IS NULL
        )
    );

DROP POLICY IF EXISTS "Creators can delete their real estates" ON public.real_estates;

CREATE POLICY "Creators can delete their real estates" ON public.real_estates FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND (
        created_by = auth.uid()
        OR created_by IS NULL
    )
);
