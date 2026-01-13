-- =============================================================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_review_id ON public.real_estate_review_votes(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_user_id ON public.real_estate_review_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_review_id ON public.real_estate_review_reports(real_estate_review_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_reported_by ON public.real_estate_review_reports(reported_by_user_id);