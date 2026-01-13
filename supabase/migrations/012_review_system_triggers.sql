-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REVIEWS
-- =============================================================================

-- Triggers para votos
DROP TRIGGER IF EXISTS review_votes_trigger ON public.review_votes;
CREATE TRIGGER review_votes_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.review_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_review_votes();

-- Triggers para contadores de inmobiliarias
DROP TRIGGER IF EXISTS update_real_estate_counters_trigger ON public.reviews;
CREATE TRIGGER update_real_estate_counters_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_real_estate_counters();

-- Triggers para auditoría
DROP TRIGGER IF EXISTS review_changes_audit ON public.reviews;
CREATE TRIGGER review_changes_audit
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION log_review_changes();

DROP TRIGGER IF EXISTS review_deletion_audit ON public.reviews;
CREATE TRIGGER review_deletion_audit
    BEFORE DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION log_review_deletion();