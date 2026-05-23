-- =============================================================================
-- MIGRACIÓN 005: TRIGGERS
-- =============================================================================
-- Automatizan mantenimiento de datos: updated_at, contadores, auditoría.
-- Todas las funciones invocadas están definidas en migración 004.
-- =============================================================================

-- =============================================================================
-- TRIGGERS PARA updated_at EN TABLAS BASE
-- =============================================================================
drop trigger if exists update_reviews_updated_at on public.reviews;

create trigger update_reviews_updated_at
  before update on public.reviews
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_real_estates_updated_at on public.real_estates;

create trigger update_real_estates_updated_at
  before update on public.real_estates
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_review_rooms_updated_at on public.review_rooms;

create trigger update_review_rooms_updated_at
  before update on public.review_rooms
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Contadores de inmobiliarias
drop trigger if exists update_real_estate_counters_trigger on public.reviews;

create trigger update_real_estate_counters_trigger
  after insert or update or delete on public.reviews
  for each row
  execute function update_real_estate_counters();

-- Auditoría de cambios
drop trigger if exists review_changes_audit on public.reviews;

create trigger review_changes_audit
  after insert or update on public.reviews
  for each row
  execute function log_review_changes();

-- Auditoría de eliminaciones
drop trigger if exists review_deletion_audit on public.reviews;

create trigger review_deletion_audit
  before delete on public.reviews
  for each row
  execute function log_review_deletion();

-- =============================================================================
-- TRIGGERS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- updated_at en real_estate_reviews
drop trigger if exists update_real_estate_reviews_updated_at on public.real_estate_reviews;

create trigger update_real_estate_reviews_updated_at
  before update on public.real_estate_reviews
  for each row
  execute function update_updated_at_column();

-- Rating de inmobiliaria cuando cambian sus reseñas
drop trigger if exists update_real_estate_rating_trigger on public.real_estate_reviews;

create trigger update_real_estate_rating_trigger
  after insert or update or delete on public.real_estate_reviews
  for each row
  execute function update_real_estate_rating_from_reviews();

-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REPORTES Y VOTOS
-- =============================================================================
-- updated_at en real_estate_reports
drop trigger if exists update_real_estate_reports_updated_at on public.real_estate_reports;

create trigger update_real_estate_reports_updated_at
  before update on public.real_estate_reports
  for each row
  execute function update_updated_at_column();

-- updated_at en real_estate_votes
drop trigger if exists update_real_estate_votes_updated_at on public.real_estate_votes;

create trigger update_real_estate_votes_updated_at
  before update on public.real_estate_votes
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRIGGERS FALTANTES DE updated_at (reportes de reviews)
-- =============================================================================
drop trigger if exists update_review_reports_updated_at on public.review_reports;

create trigger update_review_reports_updated_at
  before update on public.review_reports
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_real_estate_review_reports_updated_at on public.real_estate_review_reports;

create trigger update_real_estate_review_reports_updated_at
  before update on public.real_estate_review_reports
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRIGGER DE RATE LIMITING (cleanup automático)
-- =============================================================================
-- Elimina registros expirados después de cada INSERT en rate_limits.
drop trigger if exists cleanup_rate_limits_trigger on public.rate_limits;

create trigger cleanup_rate_limits_trigger
  after insert on public.rate_limits
  for each row
  execute function cleanup_rate_limits_on_insert();

-- =============================================================================
-- NOTA: Los triggers de refresh de vistas materializadas (review_vote_stats,
-- real_estate_vote_stats, real_estate_review_vote_stats) fueron eliminados
-- porque REFRESH MATERIALIZED VIEW CONCURRENTLY toma EXCLUSIVE lock y
-- serializa escrituras. Usar pg_cron o Supabase Edge Function con schedule
-- para refrescar periódicamente:
--   SELECT cron.schedule('refresh-review-vote-stats', '30 seconds',
--     $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.review_vote_stats$$);
-- =============================================================================
