-- =============================================================================
-- TRIGGERS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Trigger para updated_at en real_estate_reviews
DROP TRIGGER IF EXISTS update_real_estate_reviews_updated_at ON public.real_estate_reviews;
CREATE TRIGGER update_real_estate_reviews_updated_at
    BEFORE UPDATE ON public.real_estate_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para votos de reseñas de inmobiliarias
DROP TRIGGER IF EXISTS real_estate_review_votes_trigger ON public.real_estate_review_votes;
CREATE TRIGGER real_estate_review_votes_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.real_estate_review_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_real_estate_review_votes();

-- Trigger para actualizar rating de inmobiliaria cuando cambian sus reseñas
DROP TRIGGER IF EXISTS update_real_estate_rating_trigger ON public.real_estate_reviews;
CREATE TRIGGER update_real_estate_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.real_estate_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_real_estate_rating_from_reviews();