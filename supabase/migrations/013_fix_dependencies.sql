-- =============================================================================
-- MIGRATION 013: DEPENDENCIAS PÓSTUMAS A VISTAS _public
-- =============================================================================
-- Esta migración contiene policies y grants que dependen de vistas _public
-- creadas en 009_public_views.sql. Se separan de 006_rls.sql y 007_grants.sql
-- para respetar el orden de dependencias en bases de datos nuevas.
-- =============================================================================

-- =============================================================================
-- RLS: REVIEW ROOMS (depende de reviews_public)
-- =============================================================================
-- NOTA: Se usa reviews_public (vista con SELECT grant) en lugar de reviews
-- (SELECT revocado de authenticated) porque las subconsultas en políticas RLS
-- se evalúan con permisos del usuario autenticado. reviews_public ya filtra
-- deleted_at IS NULL y reemplaza user_id por is_mine.

drop policy if exists review_rooms_select_public on public.review_rooms;

create policy review_rooms_select_public on public.review_rooms
  for select
  using (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_rooms.review_id
    )
  );

drop policy if exists review_rooms_manage_own on public.review_rooms;

create policy review_rooms_manage_own on public.review_rooms
  for all
  using (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_rooms.review_id
        and rp.is_mine
    )
  )
  with check (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_rooms.review_id
        and rp.is_mine
    )
  );

-- =============================================================================
-- RLS: REVIEW AUDIT (depende de reviews_public)
-- =============================================================================
-- NOTA: Se usa reviews_public en lugar de reviews por la misma razón que
-- en las políticas de review_rooms. is_mine reemplaza user_id = auth.uid().
-- Audit entries de reviews eliminadas no son visibles (tradeoff aceptable).

drop policy if exists review_audit_select_own on public.review_audit;

create policy review_audit_select_own on public.review_audit
  for select
  using (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_audit.review_id
        and rp.is_mine
    )
  );

-- =============================================================================
-- GRANTS PARA VISTAS _public
-- =============================================================================

grant select on public.reviews_public to authenticated, anon;
grant select on public.reviews_with_votes_public to authenticated, anon;
grant select on public.real_estate_reviews_public to authenticated, anon;
grant select on public.real_estate_reviews_with_votes_public to authenticated, anon;
grant select on public.real_estates_public to authenticated, anon;

-- =============================================================================
-- GRANTS PARA FUNCIONES MOVIDAS A 012_functions_dependent.sql
-- =============================================================================

grant execute on function public.get_reviews_by_current_user() to authenticated;
grant execute on function public.get_favorite_reviews_by_current_user() to authenticated;
grant execute on function public.get_real_estate_review_by_user(uuid) to authenticated;
