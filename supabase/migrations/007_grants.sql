-- =============================================================================
-- MIGRACIÓN 007: PERMISOS Y GRANTS
-- =============================================================================
-- Control granular de acceso:
-- - SELECT REVOCADO en tablas raw con user_id (la única lectura pública es vía _public views)
-- - ESCRITURA revocada para anon (todo pasa por funciones RPC)
-- - Grants específicos para funciones SECURITY INVOKER
-- - Grants restringidos para funciones SECURITY DEFINER (solo service_role)
-- =============================================================================

-- =============================================================================
-- SECCIÓN 1: GRANTS PARA FUNCIONES DE NEGOCIO (SECURITY INVOKER)
-- =============================================================================
grant execute on function public.toggle_favorite_real_estate(uuid) to authenticated;
grant execute on function public.is_real_estate_favorite(uuid) to authenticated;
grant execute on function public.get_user_real_estate_vote(uuid) to authenticated;
grant execute on function public.get_user_review_vote(uuid) to authenticated;
grant execute on function public.check_user_review_for_address(text) to authenticated;
grant execute on function public.toggle_favorite_review(uuid) to authenticated;
grant execute on function public.is_review_favorite(uuid) to authenticated;
grant execute on function public.create_review(text, text, integer, text, text, numeric, numeric, uuid, text, integer, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.delete_review_safe(uuid) to authenticated;
grant execute on function public.vote_review(uuid, text) to authenticated;
grant execute on function public.get_review_delete_info(uuid) to authenticated;
grant execute on function public.update_review(uuid, text, text, integer, text, integer, text, text, text) to authenticated;
grant execute on function public.report_review(uuid, text, text) to authenticated;
grant execute on function public.has_user_reported_review(uuid) to authenticated;
grant execute on function public.create_real_estate_review(uuid, text, text, integer) to authenticated;
grant execute on function public.vote_real_estate_review(uuid, text) to authenticated;
grant execute on function public.report_real_estate_review(uuid, text, text) to authenticated;
grant execute on function public.create_real_estate(text, text) to authenticated;
grant execute on function public.vote_real_estate(uuid, text) to authenticated;
grant execute on function public.report_real_estate(uuid, text, text) to authenticated;
grant execute on function public.has_user_reported_real_estate(uuid) to authenticated;
grant execute on function public.has_user_reported_real_estate_review(uuid) to authenticated;

-- =============================================================================
-- SECCIÓN 2: GRANTS PARA FUNCIONES DE CONTADORES DE VOTOS (SECURITY DEFINER)
--            Acceso público para lecturas agregadas
-- =============================================================================
grant execute on function public.get_real_estate_vote_counts(uuid) to authenticated, anon;
grant execute on function public.get_review_vote_counts(uuid) to authenticated, anon;
grant execute on function public.get_real_estate_review_vote_counts(uuid) to authenticated, anon;

-- =============================================================================
-- SECCIÓN 3: GRANTS PARA VISTAS MATERIALIZADAS (contadores agregados)
-- =============================================================================
grant select on public.real_estate_vote_stats to authenticated, anon;
grant select on public.review_vote_stats to authenticated, anon;
grant select on public.real_estate_review_vote_stats to authenticated, anon;

-- =============================================================================
-- SECCIÓN 5: REVOKE DE FUNCIONES INTERNAS
--            check_rate_limit y log_security_event NO se revocan de authenticated
--            porque son llamadas por funciones SECURITY INVOKER (las llamadas
--            anidadas heredan permisos del invocador).
-- =============================================================================
revoke execute on function public.check_rate_limit(text, integer, integer) from public, anon;
revoke execute on function public.log_security_event(text, text, text, jsonb) from public, anon;

-- Funciones admin (solo service_role)
revoke execute on function public.moderate_reports(uuid, text, text, text) from public, anon, authenticated;
revoke execute on function public.detect_suspicious_activity(uuid) from public, anon, authenticated;

-- Grant explícito a service_role para funciones admin
grant execute on function public.moderate_reports(uuid, text, text, text) to service_role;
grant execute on function public.detect_suspicious_activity(uuid) to service_role;

-- =============================================================================
-- SECCIÓN 7: REVOKE DE FUNCIONES DE TRIGGER Y MANTENIMIENTO
--            No deben ser llamadas directamente por usuarios.
-- =============================================================================
revoke execute on function public.cleanup_rate_limits_on_insert() from public, anon, authenticated;
revoke execute on function public.refresh_real_estate_vote_stats() from public, anon, authenticated;
revoke execute on function public.refresh_review_vote_stats() from public, anon, authenticated;
revoke execute on function public.refresh_real_estate_review_vote_stats() from public, anon, authenticated;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
revoke execute on function public.update_real_estate_counters() from public, anon, authenticated;
revoke execute on function public.log_review_changes() from public, anon, authenticated;
revoke execute on function public.log_review_deletion() from public, anon, authenticated;
revoke execute on function public.update_real_estate_rating_from_reviews() from public, anon, authenticated;
revoke execute on function public.cleanup_old_security_logs() from public, anon, authenticated;
revoke execute on function public.refresh_all_vote_stats() from public, anon, authenticated;

-- =============================================================================
-- SECCIÓN 8: REVOKE DE FUNCIONES RLS HELPERS (SECURITY DEFINER)
--            Solo accesibles por triggers y RLS policies, no por usuarios.
-- =============================================================================
revoke execute on function public.check_review_active(uuid) from public, anon, authenticated;
revoke execute on function public.check_review_owner(uuid) from public, anon, authenticated;

-- =============================================================================
-- SECCIÓN 9: REVOKE SELECT EN TABLAS CRUDAS CON user_id/created_by
--            Las tablas reviews, real_estates y real_estate_reviews contienen
--            columnas con identificadores de usuario. Supabase otorga SELECT
--            por defecto a anon/authenticated, exponiendo estos IDs via REST.
--            El acceso público debe usar exclusivamente las vistas _public.
-- =============================================================================
revoke select on public.reviews from anon, authenticated;
revoke select on public.real_estates from anon, authenticated;
revoke select on public.real_estate_reviews from anon, authenticated;

-- =============================================================================
-- SECCIÓN 10: REVOKE SELECT EN VISTAS NO-_public (exponen user_id/created_by)
-- =============================================================================
revoke select on public.reviews_with_votes from authenticated, anon;
revoke select on public.real_estates_with_votes from authenticated, anon;
revoke select on public.real_estate_reviews_with_votes from authenticated, anon;

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
-- SECCIÓN 11: REVOKE SELECT EN VISTA DE MONITOREO
-- =============================================================================
revoke select on public.rate_limit_stats from anon, authenticated;

-- =============================================================================
-- SECCIÓN 12: HARDENING PARA anon
--            anon nunca debe mutar tablas directamente. Las operaciones de
--            escritura deben pasar por funciones/capas de negocio.
-- =============================================================================
revoke insert, update, delete on all tables in schema public from anon;

-- Evita drift en nuevas tablas creadas en el futuro.
alter default privileges in schema public
  revoke insert, update, delete on tables
  from anon;
