-- =============================================================================
-- MIGRACIÓN 018: No-op confirmado
-- =============================================================================
-- Fecha: Mayo 2026
-- Propósito original: Agregar security_invoker = on a rate_limit_stats.
--
-- Estado: 🔴 NO-OP CONFIRMADO (F018)
-- La vista rate_limit_stats YA se creó con security_invoker = on en
-- 008_functions_a.sql. Al ejecutar esta migración no hay cambio real.
--
-- Decisión: Se mantiene el archivo por compatibilidad con el historial
-- de migraciones, pero no tiene efecto funcional.
-- =============================================================================
do $$
begin
  raise notice 'MIGRACIÓN 018: No-op. rate_limit_stats ya tiene security_invoker = on desde 008_functions_a.sql.';
end $$;
