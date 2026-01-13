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



