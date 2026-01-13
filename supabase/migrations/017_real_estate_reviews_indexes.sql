-- =============================================================================
-- ÍNDICES PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Índices para real_estate_reviews
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_real_estate_id ON public.real_estate_reviews(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_user_id ON public.real_estate_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_created_at ON public.real_estate_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_rating ON public.real_estate_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_real_estate_rating ON public.real_estate_reviews(real_estate_id, rating);

-- Índices para real_estate_review_votes
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_review_id ON public.real_estate_review_votes(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_user_id ON public.real_estate_review_votes(user_id);

-- Índices para real_estate_review_reports
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_review_id ON public.real_estate_review_reports(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_status ON public.real_estate_review_reports(status);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_created_at ON public.real_estate_review_reports(created_at);

-- Índices de búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_text_search 
ON public.real_estate_reviews USING gin(to_tsvector('spanish', title || ' ' || description));
