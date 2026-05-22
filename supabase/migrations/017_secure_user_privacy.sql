-- =============================================================================
-- PROTECCIÓN DE PRIVACIDAD Y ANONIMATO DE USUARIOS
-- =============================================================================
-- Fecha: 6 de marzo de 2026
-- Propósito: Ocultar user_id de queries públicos para prevenir tracking
--           y perfilamiento de usuarios.
-- 
-- IMPORTANTE: Esta migración crea vistas que reemplazan el acceso directo
--            a las tablas para queries públicos.
-- =============================================================================
-- =============================================================================
-- VISTA SEGURA: reviews_public
-- Oculta user_id y proporciona flag is_mine para verificar ownership
-- =============================================================================
drop view if exists public.reviews_public cascade;

create view public.reviews_public as
select
  r.id,
  r.real_estate_id,
  r.title,
  r.description,
  r.rating,
  r.property_type,
  r.address_text,
  r.address_osm_id,
  r.latitude,
  r.longitude,
  r.zone_rating,
  r.winter_comfort,
  r.summer_comfort,
  r.humidity,
  r.created_at,
  r.updated_at,
  r.apartment_number,
  r.real_estate_experience,
  -- Flag para saber si es tu review (en vez de exponer user_id)
  coalesce((r.user_id = auth.uid ()), false) as is_mine
from
  public.reviews r
where
  r.deleted_at is null;

comment on view public.reviews_public is 'Vista pública de reviews sin user_id para proteger anonimato de usuarios';

grant
select
  on public.reviews_public to authenticated,
  anon;

-- =============================================================================
-- VISTA SEGURA: reviews_with_votes_public
-- Versión pública de reviews_with_votes sin user_id
-- =============================================================================
drop view if exists public.reviews_with_votes_public cascade;

create view public.reviews_with_votes_public as
select
  r.id,
  r.real_estate_id,
  r.title,
  r.description,
  r.rating,
  r.property_type,
  r.address_text,
  r.address_osm_id,
  r.latitude,
  r.longitude,
  r.zone_rating,
  r.winter_comfort,
  r.summer_comfort,
  r.humidity,
  r.created_at,
  r.updated_at,
  r.apartment_number,
  r.real_estate_experience,
  -- Flag is_mine
  coalesce((r.user_id = auth.uid ()), false) as is_mine,
  -- Estadísticas de votos
  coalesce(stats.likes, 0) as likes,
  coalesce(stats.dislikes, 0) as dislikes,
  coalesce(stats.total_votes, 0) as total_votes
from
  public.reviews r
  left join lateral (
    select
      count(*) filter (
        where
          vote_type = 'like'
      ) as likes,
      count(*) filter (
        where
          vote_type = 'dislike'
      ) as dislikes,
      count(*) as total_votes
    from
      public.review_votes rv
    where
      rv.review_id = r.id
  ) stats on true
where
  r.deleted_at is null;

comment on view public.reviews_with_votes_public is 'Vista pública de reviews con estadísticas de votos, sin user_id';

grant
select
  on public.reviews_with_votes_public to authenticated,
  anon;

-- =============================================================================
-- VISTA SEGURA: real_estate_reviews_public
-- Versión pública de real_estate_reviews sin user_id
-- =============================================================================
drop view if exists public.real_estate_reviews_public cascade;

create view public.real_estate_reviews_public as
select
  rer.id,
  rer.real_estate_id,
  rer.title,
  rer.description,
  rer.rating,
  rer.created_at,
  rer.updated_at,
  -- Flag is_mine
  coalesce((rer.user_id = auth.uid ()), false) as is_mine
from
  public.real_estate_reviews rer
where
  rer.deleted_at is null;

comment on view public.real_estate_reviews_public is 'Vista pública de reseñas de inmobiliarias sin user_id';

grant
select
  on public.real_estate_reviews_public to authenticated,
  anon;

-- =============================================================================
-- VISTA SEGURA: real_estate_reviews_with_votes_public
-- Versión pública con estadísticas de votos
-- =============================================================================
drop view if exists public.real_estate_reviews_with_votes_public cascade;

create view public.real_estate_reviews_with_votes_public as
select
  rer.id,
  rer.real_estate_id,
  rer.title,
  rer.description,
  rer.rating,
  rer.created_at,
  rer.updated_at,
  -- Flag is_mine
  coalesce((rer.user_id = auth.uid ()), false) as is_mine,
  -- Estadísticas de votos
  coalesce(stats.likes, 0) as likes,
  coalesce(stats.dislikes, 0) as dislikes,
  coalesce(stats.total_votes, 0) as total_votes
from
  public.real_estate_reviews rer
  left join lateral (
    select
      count(*) filter (
        where
          vote_type = 'like'
      ) as likes,
      count(*) filter (
        where
          vote_type = 'dislike'
      ) as dislikes,
      count(*) as total_votes
    from
      public.real_estate_review_votes rerv
    where
      rerv.real_estate_review_id = rer.id
  ) stats on true
where
  rer.deleted_at is null;

comment on view public.real_estate_reviews_with_votes_public is 'Vista pública de reseñas de inmobiliarias con votos, sin user_id';

grant
select
  on public.real_estate_reviews_with_votes_public to authenticated,
  anon;

-- =============================================================================
-- VISTA SEGURA: real_estates_public
-- Versión pública de real_estates sin created_by (user_id)
-- =============================================================================
drop view if exists public.real_estates_public cascade;

create view public.real_estates_public as
select
  re.id,
  re.name,
  re.description,
  re.review_count,
  re.rating,
  re.created_at,
  re.updated_at,
  -- Flag is_mine (en vez de exponer created_by)
  coalesce((re.created_by = auth.uid ()), false) as is_mine
from
  public.real_estates re
where
  re.deleted_at is null;

comment on view public.real_estates_public is 'Vista pública de inmobiliarias sin created_by para proteger anonimato de usuarios';

grant
select
  on public.real_estates_public to authenticated,
  anon;

-- =============================================================================
-- FUNCIÓN AUXILIAR: get_user_vote_on_real_estate_review
-- Obtener el voto del usuario actual en una reseña de inmobiliaria
-- =============================================================================
create or replace function public.get_user_vote_on_real_estate_review (p_real_estate_review_id uuid) returns text language sql stable security invoker
set search_path = public as $$
  select vote_type from public.real_estate_review_votes
    where real_estate_review_id = p_real_estate_review_id and user_id = auth.uid()
    limit 1;
$$;

comment on function public.get_user_vote_on_real_estate_review is 'Obtiene el voto del usuario autenticado en una reseña de inmobiliaria';

grant
execute on function public.get_user_vote_on_real_estate_review (uuid) to authenticated;

-- =============================================================================
-- NOTAS IMPORTANTES PARA DESARROLLO
-- =============================================================================
-- NOTA 1: Las tablas crudas (reviews, real_estates, real_estate_reviews)
-- tienen SELECT REVOCADO para anon y authenticated en 014_grants.sql.
-- El ÚNICO acceso público es vía estas vistas _public.
-- NOTA 2: Migración de queries en TypeScript
-- Antes:  await supabase.from('reviews').select('*')
--         await supabase.from('reviews_with_votes').select('*')
-- Después: await supabase.from('reviews_public').select('*')
--          await supabase.from('reviews_with_votes_public').select('*')
-- NOTA 3: Verificar ownership
-- Antes: if (review.user_id === currentUserId)
-- Después: if (review.is_mine)
-- NOTA 4: Las vistas _public NO exponen user_id/created_by.
-- Al no tener security_invoker (son gateways que corren como owner),
-- son el único camino de acceso ya que SELECT está revocado en tablas crudas.