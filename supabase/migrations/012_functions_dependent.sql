-- =============================================================================
-- MIGRATION 012: FUNCIONES DEPENDIENTES DE VISTAS PÚBLICAS
-- =============================================================================
-- Estas funciones dependen de vistas creadas en 009_public_views.sql
-- (reviews_with_votes_public, real_estate_reviews_with_votes_public).
-- Se separan de 003_functions_core.sql para respetar el orden de
-- dependencias en bases de datos nuevas (supabase start).
-- =============================================================================

-- =============================================================================
-- FUNCIONES PARA CONSULTAR REVIEWS DEL USUARIO
-- =============================================================================

create or replace function public.get_reviews_by_current_user () returns setof reviews_with_votes_public language plpgsql security invoker
set search_path = public, pg_temp
as $$
begin
  return query select * from reviews_with_votes_public
    where is_mine order by created_at desc
    limit 200;
end;
$$;

comment on function public.get_reviews_by_current_user is 'Obtiene todas las reviews del usuario autenticado';

create or replace function public.get_favorite_reviews_by_current_user () returns setof reviews_with_votes_public language plpgsql security invoker
set search_path = public, pg_temp
as $$
begin
  return query select rwv_p.* from review_favorites rf
    join reviews_with_votes_public rwv_p on rwv_p.id = rf.review_id
    where rf.user_id = auth.uid() order by rf.created_at desc
    limit 200;
end;
$$;

comment on function public.get_favorite_reviews_by_current_user is 'Obtiene las reviews favoritas del usuario autenticado';

-- =============================================================================
-- FUNCIÓN PARA SABER LA REVIEW DE UNA REAL ESTATE POR USUARIO
-- =============================================================================

create or replace function public.get_real_estate_review_by_user (p_real_estate_id uuid) returns setof public.real_estate_reviews_with_votes_public language plpgsql security invoker
set search_path = public, pg_temp
as $$
begin
  return query select * from public.real_estate_reviews_with_votes_public
    where is_mine and real_estate_id = p_real_estate_id limit 1;
end;
$$;

comment on function public.get_real_estate_review_by_user is 'Obtiene la review del usuario autenticado para una inmobiliaria específica';
