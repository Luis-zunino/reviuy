-- =============================================================================
-- FIX: rate_limit_stats debe respetar RLS del usuario que consulta
-- =============================================================================
-- Fecha: 17 de marzo de 2026
-- Propósito: Evitar comportamiento tipo SECURITY DEFINER en la vista
--            public.rate_limit_stats.
--
-- Nota: Usamos security_invoker = on para que la vista se ejecute con
--       permisos del rol invocador y no del owner.
-- =============================================================================
do $$
begin
  if exists (
    select 1
    from information_schema.views
    where table_schema = 'public'
      and table_name = 'rate_limit_stats'
  ) then
    alter view public.rate_limit_stats set (security_invoker = on);

    comment on view public.rate_limit_stats is
      'Métricas de rate limiting; usa security_invoker para respetar RLS y permisos del usuario que consulta.';
  else
    raise notice 'View public.rate_limit_stats no existe; se omite alter view.';
  end if;
end $$;