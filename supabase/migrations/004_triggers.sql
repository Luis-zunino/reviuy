-- =============================================================================
-- TRIGGERS BASE
-- =============================================================================
-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;

CREATE TRIGGER update_reviews_updated_at BEFORE
UPDATE
    ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estates_updated_at ON public.real_estates;

CREATE TRIGGER update_real_estates_updated_at BEFORE
UPDATE
    ON public.real_estates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_review_rooms_updated_at ON public.review_rooms;

CREATE TRIGGER update_review_rooms_updated_at BEFORE
UPDATE
    ON public.review_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
