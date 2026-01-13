-- =============================================================================
-- ÍNDICES PARA SISTEMA DE REVIEWS
-- =============================================================================

-- Índices para review_votes
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON public.review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user_id ON public.review_votes(user_id);

-- Índices para review_reports
CREATE INDEX IF NOT EXISTS idx_review_reports_review_id ON public.review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON public.review_reports(status);
CREATE INDEX IF NOT EXISTS idx_review_reports_created_at ON public.review_reports(created_at);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_review_deletions_deleted_by ON public.review_deletions(deleted_by);
CREATE INDEX IF NOT EXISTS idx_review_deletions_deleted_at ON public.review_deletions(deleted_at);
CREATE INDEX IF NOT EXISTS idx_review_audit_review_id ON public.review_audit(review_id);
CREATE INDEX IF NOT EXISTS idx_review_audit_change_type ON public.review_audit(change_type);
CREATE INDEX IF NOT EXISTS idx_review_audit_created_at ON public.review_audit(created_at DESC);
