-- =============================================================================
-- TRIGGERS BASE
-- =============================================================================
-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;

CREATE TRIGGER update_reviews_updated_at BEFORE
UPDATE ON public.reviews FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

DROP TRIGGER IF EXISTS update_real_estates_updated_at ON public.real_estates;

CREATE TRIGGER update_real_estates_updated_at BEFORE
UPDATE ON public.real_estates FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

DROP TRIGGER IF EXISTS update_review_rooms_updated_at ON public.review_rooms;

CREATE TRIGGER update_review_rooms_updated_at BEFORE
UPDATE ON public.review_rooms FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Triggers para votos
DROP TRIGGER IF EXISTS review_votes_trigger ON public.review_votes;

CREATE TRIGGER review_votes_trigger
AFTER INSERT
OR DELETE
OR
UPDATE ON public.review_votes FOR EACH ROW
EXECUTE FUNCTION update_review_votes ();

-- Triggers para contadores de inmobiliarias
DROP TRIGGER IF EXISTS update_real_estate_counters_trigger ON public.reviews;

CREATE TRIGGER update_real_estate_counters_trigger
AFTER INSERT
OR
UPDATE
OR DELETE ON public.reviews FOR EACH ROW
EXECUTE FUNCTION update_real_estate_counters ();

-- Triggers para auditoría
DROP TRIGGER IF EXISTS review_changes_audit ON public.reviews;

CREATE TRIGGER review_changes_audit
AFTER INSERT
OR
UPDATE ON public.reviews FOR EACH ROW
EXECUTE FUNCTION log_review_changes ();

DROP TRIGGER IF EXISTS review_deletion_audit ON public.reviews;

CREATE TRIGGER review_deletion_audit BEFORE DELETE ON public.reviews FOR EACH ROW
EXECUTE FUNCTION log_review_deletion ();

-- =============================================================================
-- TRIGGERS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- Trigger para updated_at en real_estate_reviews
DROP TRIGGER IF EXISTS update_real_estate_reviews_updated_at ON public.real_estate_reviews;

CREATE TRIGGER update_real_estate_reviews_updated_at BEFORE
UPDATE ON public.real_estate_reviews FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para votos de reseñas de inmobiliarias
DROP TRIGGER IF EXISTS real_estate_review_votes_trigger ON public.real_estate_review_votes;

CREATE TRIGGER real_estate_review_votes_trigger
AFTER INSERT
OR DELETE
OR
UPDATE ON public.real_estate_review_votes FOR EACH ROW
EXECUTE FUNCTION update_real_estate_review_votes ();

-- Trigger para actualizar rating de inmobiliaria cuando cambian sus reseñas
DROP TRIGGER IF EXISTS update_real_estate_rating_trigger ON public.real_estate_reviews;

CREATE TRIGGER update_real_estate_rating_trigger
AFTER INSERT
OR
UPDATE
OR DELETE ON public.real_estate_reviews FOR EACH ROW
EXECUTE FUNCTION update_real_estate_rating_from_reviews ();

-- Trigger para capturar snapshot
DROP TRIGGER IF EXISTS set_user_snapshot_on_insert ON public.real_estate_review_votes;

CREATE TRIGGER set_user_snapshot_on_insert BEFORE INSERT ON public.real_estate_review_votes FOR EACH ROW
EXECUTE FUNCTION public.sync_user_snapshot ();

-- =============================================================================
-- Triggers (después de crear las tablas)
-- =============================================================================
-- Trigger para updated_at en real_estate_reports
DROP TRIGGER IF EXISTS update_real_estate_reports_updated_at ON public.real_estate_reports;

CREATE TRIGGER update_real_estate_reports_updated_at BEFORE
UPDATE ON public.real_estate_reports FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para updated_at en real_estate_votes
DROP TRIGGER IF EXISTS update_real_estate_votes_updated_at ON public.real_estate_votes;

CREATE TRIGGER update_real_estate_votes_updated_at BEFORE
UPDATE ON public.real_estate_votes FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column ();

-- Trigger para contadores de votos de inmobiliarias
DROP TRIGGER IF EXISTS real_estate_votes_counters_trigger ON public.real_estate_votes;

CREATE TRIGGER real_estate_votes_counters_trigger
AFTER INSERT
OR DELETE
OR
UPDATE ON public.real_estate_votes FOR EACH ROW
EXECUTE FUNCTION update_real_estate_votes_counters ();