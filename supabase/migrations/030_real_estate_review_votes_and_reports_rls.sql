-- =============================================================================
-- HABILITAR RLS EN LAS NUEVAS TABLAS
-- =============================================================================

ALTER TABLE public.real_estate_review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate_review_reports ENABLE ROW LEVEL SECURITY;