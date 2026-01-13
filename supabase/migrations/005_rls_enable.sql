-- =============================================================================
-- RLS BASE
-- =============================================================================
-- Habilitar RLS en tablas base
ALTER TABLE
    public.reviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    public.real_estates ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    public.review_rooms ENABLE ROW LEVEL SECURITY;
