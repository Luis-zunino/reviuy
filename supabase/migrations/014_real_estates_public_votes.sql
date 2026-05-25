-- =============================================================================
-- Migration 014: Add vote stats to real_estates_public view
-- =============================================================================
-- La vista original no incluía likes, dislikes, total_votes,
-- lo que obligaba al frontend a usar real_estates_with_votes
-- (con security_invoker = on y SELECT revocado para anon).
-- Ahora la vista pública incluye los contadores para que funcione
-- sin autenticación.
-- =============================================================================

-- =============================================================================
-- VISTA SEGURA: real_estates_public (con votos)
-- Versión pública de real_estates sin created_by, con contadores de votos
-- =============================================================================
drop view if exists public.real_estates_public cascade;

create view public.real_estates_public with (security_invoker = false, security_barrier = true) as
select
  re.id,
  re.name,
  re.description,
  re.review_count,
  re.rating,
  re.created_at,
  re.updated_at,
  re.deleted_at,
  coalesce(stats.likes, 0) as likes,
  coalesce(stats.dislikes, 0) as dislikes,
  coalesce(stats.total_votes, 0) as total_votes,
  coalesce((re.created_by = auth.uid ()), false) as is_mine
from
  public.real_estates re
  left join lateral (
    select
      count(*) filter (where vote_type = 'like') as likes,
      count(*) filter (where vote_type = 'dislike') as dislikes,
      count(*) as total_votes
    from public.real_estate_votes rev
    where rev.real_estate_id = re.id
  ) stats on true
where
  re.deleted_at is null;

comment on view public.real_estates_public is 'Vista pública de inmobiliarias sin created_by para proteger anonimato de usuarios, con contadores de votos';

grant
select
  on public.real_estates_public to authenticated,
  anon;

-- =============================================================================
-- Recrear función que fue eliminada por el CASCADE del drop view
-- =============================================================================
create or replace function public.get_real_estates_paginated (
  p_limit int default 50,
  p_offset int default 0
) returns setof public.real_estates_public language sql stable security invoker
set search_path = public, pg_temp
as $$
  select * from public.real_estates_public
  order by created_at desc
  limit least(p_limit, 100)
  offset p_offset;
$$;

comment on function public.get_real_estates_paginated is
  'Retorna inmobiliarias paginadas con límite máximo de 100 filas.';

grant execute on function public.get_real_estates_paginated(int, int) to authenticated, anon;
