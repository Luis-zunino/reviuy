-- =============================================================================
-- PERMISOS PARA FUNCIONES DE REVIEWS
-- =============================================================================
grant
execute on FUNCTION toggle_favorite_real_estate (UUID) to authenticated;

grant
execute on FUNCTION is_real_estate_favorite (UUID) to authenticated;

grant
execute on FUNCTION get_user_real_estate_vote (UUID) to authenticated;

grant
execute on function public.get_reviews_by_current_user () to authenticated;

grant
execute on function public.get_favorite_reviews_by_current_user () to authenticated;

grant
execute on function public.get_user_review_vote (uuid) to authenticated;

grant
execute on function public.check_user_review_for_address (text) to authenticated;

grant
execute on function public.get_real_estate_review_by_user (uuid) to authenticated;

grant
execute on FUNCTION toggle_favorite_review (UUID) to authenticated;

grant
execute on FUNCTION is_review_favorite (UUID) to authenticated;

grant
execute on FUNCTION public.create_review (
  text,
  text,
  integer,
  text,
  text,
  numeric,
  numeric,
  uuid,
  text,
  integer,
  text,
  text,
  text,
  text,
  text,
  jsonb
) to authenticated;

grant
execute on FUNCTION delete_review_safe (UUID) to authenticated;

grant
execute on FUNCTION vote_review (UUID, TEXT) to authenticated;

grant
execute on FUNCTION get_review_delete_info (UUID) to authenticated;

grant
execute on FUNCTION update_review (
  UUID,
  TEXT,
  TEXT,
  INTEGER,
  TEXT,
  INTEGER,
  TEXT,
  TEXT,
  TEXT
) to authenticated;

grant
execute on FUNCTION report_review (UUID, TEXT, TEXT) to authenticated;

grant
execute on FUNCTION has_user_reported_review (UUID) to authenticated;

grant
execute on FUNCTION create_real_estate_review (UUID, TEXT, TEXT, INTEGER) to authenticated;

grant
execute on FUNCTION vote_real_estate_review (UUID, TEXT) to authenticated;

grant
execute on FUNCTION report_real_estate_review (UUID, TEXT, TEXT) to authenticated;

grant
execute on FUNCTION create_real_estate (TEXT, TEXT) to authenticated;

grant
execute on FUNCTION vote_real_estate (UUID, TEXT) to authenticated;

grant
execute on FUNCTION report_real_estate (UUID, TEXT, TEXT) to authenticated;

grant
execute on FUNCTION has_user_reported_real_estate (UUID) to authenticated;

grant
execute on FUNCTION public.has_user_reported_real_estate_review (UUID) to authenticated;

-- Permisos para funciones y vistas de contadores de votos
grant
execute on FUNCTION public.get_real_estate_vote_counts (UUID) to authenticated,
anon;

grant
select
  on public.real_estate_vote_stats to authenticated,
  anon;

-- NOTA: real_estates_with_votes expone created_by.
-- Acceder SOLO vía funciones SECURITY DEFINER o vistas _public.
-- Se revoca el grant directo para proteger privacidad.
-- NOTA: anon NO tiene acceso a real_estates_with_votes (expone created_by).
-- Los usuarios anónimos deben usar real_estates_with_votes_public (migración 017).
-- Permisos para funciones y vistas de contadores de votos de reviews
grant
execute on FUNCTION public.get_review_vote_counts (UUID) to authenticated,
anon;

grant
select
  on public.review_vote_stats to authenticated,
  anon;

-- NOTA: reviews_with_votes expone user_id.
-- Acceder SOLO vía funciones SECURITY DEFINER o vistas _public.
-- Se revoca el grant directo para proteger privacidad.
-- NOTA: anon NO tiene acceso a reviews_with_votes (expone user_id).
-- Los usuarios anónimos deben usar reviews_with_votes_public (migración 017).
-- Permisos para funciones y vistas de contadores de votos de real_estate_reviews
grant
execute on FUNCTION public.get_real_estate_review_vote_counts (UUID) to authenticated,
anon;

grant
select
  on public.real_estate_review_vote_stats to authenticated,
  anon;

-- NOTA: real_estate_reviews_with_votes expone user_id.
-- Acceder SOLO vía funciones SECURITY DEFINER o vistas _public.
-- Se revoca el grant directo para proteger privacidad.
-- NOTA: anon NO tiene acceso a real_estate_reviews_with_votes (expone user_id).
-- Los usuarios anónimos deben usar real_estate_reviews_with_votes_public (migración 017).
-- =============================================================================
-- REVOKE: Funciones internas que NO deben ser invocables por usuarios
-- =============================================================================
-- check_rate_limit: Función interna de rate limiting. Se revoca de anon/public
-- pero NO de authenticated porque es llamada por funciones SECURITY INVOKER
-- (create_review, vote_review, etc.). REVOKE de authenticated rompería todas
-- esas funciones ya que las llamadas anidadas heredan permisos del invocador.
revoke
execute on FUNCTION public.check_rate_limit (text, integer, integer)
from
  public,
  anon;

-- log_security_event: SECURITY DEFINER. Se revoca de anon/public pero
-- NO de authenticated porque es llamada por funciones SECURITY INVOKER
-- que necesitan registrar eventos de seguridad en nombre del usuario.
revoke
execute on FUNCTION public.log_security_event (text, text, text, jsonb)
from
  public,
  anon;

-- moderate_reports: Función admin, solo service_role
revoke
execute on FUNCTION public.moderate_reports (uuid, text, text, text)
from
  public,
  anon,
  authenticated;

-- detect_suspicious_activity: Función admin, solo service_role
revoke
execute on FUNCTION public.detect_suspicious_activity (uuid)
from
  public,
  anon,
  authenticated;

-- check_migration_status_simple: Expone metadata del schema
revoke
execute on FUNCTION public.check_migration_status_simple ()
from
  public,
  anon,
  authenticated;

-- cleanup_rate_limits_on_insert: Función de trigger, no debe llamarse directamente
revoke
execute on FUNCTION public.cleanup_rate_limits_on_insert ()
from
  public,
  anon,
  authenticated;

-- Funciones de refresh de MVs: No deben llamarse directamente
revoke
execute on FUNCTION public.refresh_real_estate_vote_stats ()
from
  public,
  anon,
  authenticated;

revoke
execute on FUNCTION public.refresh_review_vote_stats ()
from
  public,
  anon,
  authenticated;

revoke
execute on FUNCTION public.refresh_real_estate_review_vote_stats ()
from
  public,
  anon,
  authenticated;

-- Funciones de trigger: No deben llamarse directamente
revoke
execute on FUNCTION public.update_updated_at_column ()
from
  public,
  anon,
  authenticated;

revoke
execute on FUNCTION public.update_real_estate_counters ()
from
  public,
  anon,
  authenticated;

revoke
execute on FUNCTION public.log_review_changes ()
from
  public,
  anon,
  authenticated;

revoke
execute on FUNCTION public.log_review_deletion ()
from
  public,
  anon,
  authenticated;

revoke
execute on FUNCTION public.update_real_estate_rating_from_reviews ()
from
  public,
  anon,
  authenticated;

-- cleanup_old_security_logs: Función de mantenimiento, solo service_role
revoke
execute on function public.cleanup_old_security_logs ()
from
  public,
  anon,
  authenticated;

-- refresh_all_vote_stats: Función de mantenimiento, solo service_role
revoke
execute on function public.refresh_all_vote_stats ()
from
  public,
  anon,
  authenticated;

-- =============================================================================
-- REVOKE: Tablas crudas con user_id/created_by para proteger privacidad
-- =============================================================================
-- Las tablas reviews, real_estates y real_estate_reviews contienen columnas
-- con identificadores de usuario (user_id, created_by). Supabase otorga SELECT
-- por defecto a anon/authenticated, exponiendo estos IDs via REST.
-- El acceso público debe usar exclusivamente las vistas _public (017) que
-- reemplazan los IDs por el flag booleano is_mine.
revoke
select
  on public.reviews
from
  anon,
  authenticated;

revoke
select
  on public.real_estates
from
  anon,
  authenticated;

revoke
select
  on public.real_estate_reviews
from
  anon,
  authenticated;

-- =============================================================================
-- REVOKE: Vistas no-_public que exponen user_id/created_by
-- =============================================================================
-- Estas vistas usan SELECT * sobre tablas con columnas de ID de usuario.
-- El acceso público debe usar exclusivamente las vistas _public (017).
revoke
select
  on public.reviews_with_votes
from
  authenticated,
  anon;

revoke
select
  on public.real_estates_with_votes
from
  authenticated,
  anon;

revoke
select
  on public.real_estate_reviews_with_votes
from
  authenticated,
  anon;

-- =============================================================================
-- NOTA: Tablas con columnas user_id pero con RLS + funciones SECURITY INVOKER
-- =============================================================================
-- Las siguientes tablas contienen FKs a auth.users pero NO se revoca SELECT
-- porque son consultadas por funciones SECURITY INVOKER (que se ejecutan con
-- permisos del llamante). La protección es RLS: cada política filtra por
-- auth.uid(), asegurando que cada usuario solo ve sus propios datos.
--
-- Tablas protegidas por RLS (SELECT mantenido):
--   review_votes, real_estate_votes, real_estate_review_votes
--   review_reports, review_deletions, review_audit
--   review_favorites, real_estate_favorites
--   real_estate_review_reports, real_estate_reports
--   rate_limits
--
-- Si en el futuro se convierten las funciones a SECURITY DEFINER, se puede
-- revocar SELECT de authenticated y anon como defensa en profundidad.

-- =============================================================================
-- REVOKE: Vista de monitoreo rate_limit_stats (no usada por funciones)
-- =============================================================================
revoke
select
  on public.rate_limit_stats
from
  anon,
  authenticated;

-- Hardening adicional: anon nunca debe mutar tablas directamente.
-- Las operaciones de escritura deben pasar por funciones/capas de negocio.
revoke insert,
update,
delete on all tables in schema public
from
  anon;

-- Evita drift en nuevas tablas creadas en el futuro.
alter default privileges in schema public
revoke insert,
update,
delete on tables
from
  anon;