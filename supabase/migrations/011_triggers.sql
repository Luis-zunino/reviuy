-- =============================================================================
-- TRIGGERS BASE
-- =============================================================================
-- Triggers para updated_at
drop trigger IF exists update_reviews_updated_at on public.reviews;

create trigger update_reviews_updated_at BEFORE
update on public.reviews for EACH row
execute FUNCTION update_updated_at_column ();

drop trigger IF exists update_real_estates_updated_at on public.real_estates;

create trigger update_real_estates_updated_at BEFORE
update on public.real_estates for EACH row
execute FUNCTION update_updated_at_column ();

drop trigger IF exists update_review_rooms_updated_at on public.review_rooms;

create trigger update_review_rooms_updated_at BEFORE
update on public.review_rooms for EACH row
execute FUNCTION update_updated_at_column ();

-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Triggers para votos - ACTUALIZADO: Ahora refresca vista materializada
drop trigger IF exists review_votes_trigger on public.review_votes;

-- NOTA: El refresh de la vista materializada review_vote_stats ya NO se hace por trigger.
-- Usar pg_cron o Supabase Edge Function con schedule para refrescar periódicamente:
--   SELECT cron.schedule('refresh-review-vote-stats', '30 seconds', $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.review_vote_stats$$);
-- Motivo: REFRESH MATERIALIZED VIEW CONCURRENTLY toma EXCLUSIVE lock y serializa escrituras.
drop trigger IF exists trg_refresh_review_vote_stats on public.review_votes;

-- Triggers para contadores de inmobiliarias
drop trigger IF exists update_real_estate_counters_trigger on public.reviews;

create trigger update_real_estate_counters_trigger
after INSERT
or
update
or DELETE on public.reviews for EACH row
execute FUNCTION update_real_estate_counters ();

-- Triggers para auditoría
drop trigger IF exists review_changes_audit on public.reviews;

create trigger review_changes_audit
after INSERT
or
update on public.reviews for EACH row
execute FUNCTION log_review_changes ();

drop trigger IF exists review_deletion_audit on public.reviews;

create trigger review_deletion_audit BEFORE DELETE on public.reviews for EACH row
execute FUNCTION log_review_deletion ();

-- =============================================================================
-- TRIGGERS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- Trigger para updated_at en real_estate_reviews
drop trigger IF exists update_real_estate_reviews_updated_at on public.real_estate_reviews;

create trigger update_real_estate_reviews_updated_at BEFORE
update on public.real_estate_reviews for EACH row
execute FUNCTION update_updated_at_column ();

-- Trigger para votos de reseñas de inmobiliarias
drop trigger IF exists real_estate_review_votes_trigger on public.real_estate_review_votes;

-- NOTA: El refresh de la vista materializada real_estate_review_vote_stats ya NO se hace por trigger.
-- Usar pg_cron o Supabase Edge Function con schedule para refrescar periódicamente.
-- Motivo: REFRESH MATERIALIZED VIEW CONCURRENTLY toma EXCLUSIVE lock y serializa escrituras.
drop trigger IF exists trg_refresh_real_estate_review_vote_stats on public.real_estate_review_votes;

-- Trigger para actualizar rating de inmobiliaria cuando cambian sus reseñas
drop trigger IF exists update_real_estate_rating_trigger on public.real_estate_reviews;

create trigger update_real_estate_rating_trigger
after INSERT
or
update
or DELETE on public.real_estate_reviews for EACH row
execute FUNCTION update_real_estate_rating_from_reviews ();

-- =============================================================================
-- Triggers (después de crear las tablas)
-- =============================================================================
-- Trigger para updated_at en real_estate_reports
drop trigger IF exists update_real_estate_reports_updated_at on public.real_estate_reports;

create trigger update_real_estate_reports_updated_at BEFORE
update on public.real_estate_reports for EACH row
execute FUNCTION update_updated_at_column ();

-- Trigger para updated_at en real_estate_votes
drop trigger IF exists update_real_estate_votes_updated_at on public.real_estate_votes;

create trigger update_real_estate_votes_updated_at BEFORE
update on public.real_estate_votes for EACH row
execute FUNCTION update_updated_at_column ();

-- Trigger para contadores de votos de inmobiliarias
drop trigger IF exists real_estate_votes_counters_trigger on public.real_estate_votes;

-- NOTA: El refresh de la vista materializada real_estate_vote_stats ya NO se hace por trigger.
-- Usar pg_cron o Supabase Edge Function con schedule para refrescar periódicamente.
-- Motivo: REFRESH MATERIALIZED VIEW CONCURRENTLY toma EXCLUSIVE lock y serializa escrituras.
drop trigger IF exists trg_refresh_real_estate_vote_stats on public.real_estate_votes;

-- =============================================================================
-- TRIGGERS FALTANTES DE updated_at PARA TABLAS DE REPORTES
-- =============================================================================
drop trigger if exists update_review_reports_updated_at on public.review_reports;

create trigger update_review_reports_updated_at before
update on public.review_reports for each row
execute function update_updated_at_column ();

drop trigger if exists update_real_estate_review_reports_updated_at on public.real_estate_review_reports;

create trigger update_real_estate_review_reports_updated_at before
update on public.real_estate_review_reports for each row
execute function update_updated_at_column ();