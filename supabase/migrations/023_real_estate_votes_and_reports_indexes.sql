-- =============================================================================
-- Índices para mejor rendimiento
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_real_estate_votes_real_estate_id ON public.real_estate_votes(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_votes_user_id ON public.real_estate_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reports_real_estate_id ON public.real_estate_reports(real_estate_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_reports_reported_by ON public.real_estate_reports(reported_by_user_id);
