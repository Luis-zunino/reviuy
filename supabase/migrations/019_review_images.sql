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
-- RLS
-- =============================================================================
alter table public.review_images enable row level security;

-- Lectura pública: cualquiera puede ver las imágenes de reseñas no eliminadas
create policy review_images_select_public on public.review_images for select
  using (
    exists (
      select 1 from public.reviews
      where reviews.id = review_images.review_id
        and reviews.deleted_at is null
    )
  );

-- Solo el owner de la reseña puede insertar imágenes
create policy review_images_insert_own on public.review_images for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.reviews
      where reviews.id = review_images.review_id
        and reviews.user_id = auth.uid()
    )
  );

-- Solo el owner de la reseña puede borrar sus imágenes
create policy review_images_delete_own on public.review_images for delete
  using (
    exists (
      select 1 from public.reviews
      where reviews.id = review_images.review_id
        and reviews.user_id = auth.uid()
    )
  );

-- =============================================================================
-- GRANTS
-- =============================================================================
grant select on public.review_images to anon, authenticated;
grant insert, delete on public.review_images to authenticated;
