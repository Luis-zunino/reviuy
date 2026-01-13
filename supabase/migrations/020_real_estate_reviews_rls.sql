-- =============================================================================
-- RLS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Habilitar RLS en nuevas tablas
ALTER TABLE public.real_estate_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_review_reports ENABLE ROW LEVEL SECURITY;

-- Políticas para real_estate_reviews
DROP POLICY IF EXISTS "Anyone can view real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Anyone can view real estate reviews" ON public.real_estate_reviews 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Authenticated users can create real estate reviews" ON public.real_estate_reviews 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Users can update own real estate reviews" ON public.real_estate_reviews 
    FOR UPDATE USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Users can delete own real estate reviews" ON public.real_estate_reviews 
    FOR DELETE USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Políticas para real_estate_review_votes
DROP POLICY IF EXISTS "Anyone can view real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Anyone can view real estate review votes" ON public.real_estate_review_votes 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can manage own real estate review votes" ON public.real_estate_review_votes 
    FOR ALL USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Políticas para real_estate_review_reports
DROP POLICY IF EXISTS "Users can create real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can create real estate review reports" ON public.real_estate_review_reports 
    FOR INSERT WITH CHECK (reported_by_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can view own real estate review reports" ON public.real_estate_review_reports 
    FOR SELECT USING (reported_by_user_id = auth.uid());

-- =============================================================================
-- POLÍTICAS PARA REAL_ESTATE_REVIEW_VOTES
-- =============================================================================

DROP POLICY IF EXISTS "Anyone can view real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Anyone can view real estate review votes" 
ON public.real_estate_review_votes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can insert their own real estate review votes" 
ON public.real_estate_review_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can update their own real estate review votes" 
ON public.real_estate_review_votes FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can delete their own real estate review votes" 
ON public.real_estate_review_votes FOR DELETE 
USING (auth.uid() = user_id);

-- =============================================================================
-- POLÍTICAS PARA REAL_ESTATE_REVIEW_REPORTS
-- =============================================================================

DROP POLICY IF EXISTS "Users can create real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can create real estate review reports" 
ON public.real_estate_review_reports FOR INSERT 
WITH CHECK (reported_by_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can view their own real estate review reports" 
ON public.real_estate_review_reports FOR SELECT 
USING (reported_by_user_id = auth.uid());




