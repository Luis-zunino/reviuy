-- =============================================================================
-- MIGRACIÓN 019: IMÁGENES DE RESEÑAS (Cloudflare R2)
-- =============================================================================
-- Las imágenes se almacenan en Cloudflare R2.
-- Supabase solo guarda la URL pública y el path para poder borrarlas del bucket.
-- =============================================================================

create table if not exists public.review_images (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid not null references public.reviews(id) on delete cascade,
  url         text not null,
  path        text not null,
  "order"     smallint not null default 0,
  created_at  timestamptz not null default now()
);

-- Índice para obtener imágenes de una reseña ordenadas
create index if not exists idx_review_images_review_id
  on public.review_images (review_id, "order");

-- Índice para borrado por path (usado al eliminar del bucket)
create index if not exists idx_review_images_path
  on public.review_images (path);

-- =============================================================================
-- FUNCIONES AUXILIARES (SECURITY DEFINER) para RLS
-- Las subqueries directas a public.reviews fallarían con SELECT revocado.
-- Estas funciones corren como owner y verifican existencia/ownership.
-- =============================================================================
create or replace function public.check_review_active (p_review_id uuid)
returns boolean language sql security definer
set search_path = public as $$
  select exists (
    select 1 from public.reviews
    where id = p_review_id and deleted_at is null
  );
$$;

create or replace function public.check_review_owner (p_review_id uuid)
returns boolean language sql security definer
set search_path = public as $$
  select exists (
    select 1 from public.reviews
    where id = p_review_id and user_id = auth.uid()
  );
$$;

-- Revocar acceso directo a estas funciones auxiliares
revoke execute on function public.check_review_active (uuid) from public, anon, authenticated;
revoke execute on function public.check_review_owner (uuid) from public, anon, authenticated;

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.review_images enable row level security;

-- Lectura pública: cualquiera puede ver las imágenes de reseñas no eliminadas
create policy review_images_select_public on public.review_images for select
  using (
    public.check_review_active(review_images.review_id)
  );

-- Solo el owner de la reseña puede insertar imágenes
create policy review_images_insert_own on public.review_images for insert
  with check (
    auth.uid() is not null
    and public.check_review_owner(review_images.review_id)
  );

-- Solo el owner de la reseña puede borrar sus imágenes
create policy review_images_delete_own on public.review_images for delete
  using (
    public.check_review_owner(review_images.review_id)
  );

-- =============================================================================
-- GRANTS
-- =============================================================================
grant select on public.review_images to anon, authenticated;
grant insert, delete on public.review_images to authenticated;
