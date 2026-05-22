-- =============================================================================
-- MIGRACIÓN 010: IMÁGENES DE RESEÑAS
-- =============================================================================
-- review_images: imágenes asociadas a reseñas (almacenadas en Cloudflare R2).
-- Usa funciones SECURITY DEFINER como helpers de RLS porque SELECT está
-- revocado en reviews y las políticas RLS necesitan verificar ownership.
-- =============================================================================

-- =============================================================================
-- TABLA: review_images
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
      and deleted_at is null
  );
$$;

comment on function public.check_review_owner is
  'Verifica que el usuario autenticado es el owner de la review y que ésta no está eliminada.';

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
    public.check_review_owner(review_images.review_id)
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
