-- =============================================================================
-- MIGRACIÓN 008: ÍNDICES
-- =============================================================================
-- Optimización de queries frecuentes.
-- Incluye índices compuestos, GIN para full-text search en español,
-- e índices únicos parciales para soft delete (1 review por usuario por entidad).
-- =============================================================================

-- =============================================================================
-- RATE LIMITS
-- =============================================================================
-- Índice compuesto para optimizar la query principal de rate limiting
create index if not exists idx_rate_limits_lookup
  on public.rate_limits (user_id, endpoint, window_start desc);

-- Índice para cleanup eficiente de registros expirados
create index if not exists idx_rate_limits_cleanup
  on public.rate_limits (window_start);

-- =============================================================================
-- SECURITY LOGS
-- =============================================================================
create index if not exists idx_security_logs_user
  on public.security_logs (user_id);

create index if not exists idx_security_logs_endpoint
  on public.security_logs (endpoint);

create index if not exists idx_security_logs_created_at
  on public.security_logs (created_at desc);

create index if not exists idx_security_logs_status
  on public.security_logs (status);

-- Índice compuesto para detección de actividad sospechosa (filtra por created_at + group by user_id)
create index if not exists idx_security_logs_suspicious_activity
  on public.security_logs (created_at, user_id);

-- =============================================================================
-- REVIEWS (15 índices)
-- =============================================================================
create index if not exists idx_reviews_user_id
  on public.reviews (user_id);

create index if not exists idx_reviews_created_at
  on public.reviews (created_at desc);

create index if not exists idx_reviews_rating
  on public.reviews (rating);

create index if not exists idx_reviews_real_estate_id
  on public.reviews (real_estate_id);

create index if not exists idx_reviews_real_estate_id_rating
  on public.reviews (real_estate_id, rating);

create index if not exists idx_reviews_address_text
  on public.reviews (address_text);

-- Índice de búsqueda de texto completo en español
create index if not exists idx_reviews_text_search
  on public.reviews using gin (
    to_tsvector('spanish', title || ' ' || description)
  );

-- Índices condicionales para columnas opcionales
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'address_osm_id'
  ) then
    create index if not exists idx_reviews_address_osm_id on public.reviews (address_osm_id);
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'latitude'
  ) and exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'longitude'
  ) then
    create index if not exists idx_reviews_coordinates on public.reviews (latitude, longitude);
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'zone_rating'
  ) then
    create index if not exists idx_reviews_zone_rating on public.reviews (zone_rating)
      where zone_rating is not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_name = 'reviews' and column_name = 'property_type'
  ) then
    create index if not exists idx_reviews_property_type on public.reviews (property_type)
      where property_type is not null;
  end if;
end $$;

-- Índice parcial para reviews activas (no eliminadas)
create index if not exists idx_reviews_active
  on public.reviews (id)
  where deleted_at is null;

-- Índice para búsquedas "Mis reseñas" (user_id + ordenado por created_at DESC)
create index if not exists idx_reviews_user_created_at
  on public.reviews (user_id, created_at desc)
  where deleted_at is null;

-- Índice único parcial: 1 review por usuario por dirección OSM
drop index if exists idx_reviews_user_address_osm_unique;

create unique index idx_reviews_user_address_osm_unique
  on public.reviews (user_id, address_osm_id)
  where deleted_at is null;

comment on index idx_reviews_user_address_osm_unique is
  'Unicidad por usuario+address_osm_id en reviews; aplica solo cuando deleted_at IS NULL. Garantiza 1 reseña por dirección OSM por usuario.';

-- =============================================================================
-- REVIEW VOTES
-- =============================================================================
-- Índice compuesto para optimizar consultas por review, usuario y tipo de voto
create index if not exists idx_review_votes_composite
  on public.review_votes (review_id, user_id, vote_type);

-- =============================================================================
-- REVIEW REPORTS
-- =============================================================================
create index if not exists idx_review_reports_review_id
  on public.review_reports (review_id);

create index if not exists idx_review_reports_status
  on public.review_reports (status);

create index if not exists idx_review_reports_created_at
  on public.review_reports (created_at);

create index if not exists idx_review_reports_reported_by_user_id
  on public.review_reports (reported_by_user_id);

-- =============================================================================
-- REVIEW DELETIONS (auditoría)
-- =============================================================================
create index if not exists idx_review_deletions_review_id
  on public.review_deletions (review_id);

create index if not exists idx_review_deletions_deleted_by
  on public.review_deletions (deleted_by);

create index if not exists idx_review_deletions_deleted_at
  on public.review_deletions (deleted_at);

-- =============================================================================
-- REVIEW AUDIT
-- =============================================================================
create index if not exists idx_review_audit_review_id
  on public.review_audit (review_id);

create index if not exists idx_review_audit_change_type
  on public.review_audit (change_type);

create index if not exists idx_review_audit_created_at
  on public.review_audit (created_at desc);

create index if not exists idx_review_audit_changed_by
  on public.review_audit (changed_by);

-- =============================================================================
-- REVIEW FAVORITES
-- =============================================================================
create index if not exists idx_review_favorites_review_id
  on public.review_favorites (review_id);

create index if not exists idx_review_favorites_user_id
  on public.review_favorites (user_id);

-- =============================================================================
-- REVIEW ROOMS
-- =============================================================================
create index if not exists idx_review_rooms_review_id
  on public.review_rooms (review_id);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
create index if not exists idx_real_estates_name
  on public.real_estates (name);

create index if not exists idx_real_estates_created_by
  on public.real_estates (created_by);

create index if not exists idx_real_estates_created_at
  on public.real_estates (created_at desc);

create index if not exists idx_real_estates_review_count
  on public.real_estates (review_count desc);

-- =============================================================================
-- REAL ESTATE REVIEWS (9 índices)
-- =============================================================================
create index if not exists idx_real_estate_reviews_real_estate_id
  on public.real_estate_reviews (real_estate_id);

create index if not exists idx_real_estate_reviews_user_id
  on public.real_estate_reviews (user_id);

create index if not exists idx_real_estate_reviews_created_at
  on public.real_estate_reviews (created_at desc);

create index if not exists idx_real_estate_reviews_rating
  on public.real_estate_reviews (rating);

create index if not exists idx_real_estate_reviews_real_estate_rating
  on public.real_estate_reviews (real_estate_id, rating);

-- Índice de búsqueda de texto completo en español
create index if not exists idx_real_estate_reviews_text_search
  on public.real_estate_reviews using gin (
    to_tsvector('spanish', title || ' ' || description)
  );

-- Índice parcial para reseñas activas (no eliminadas)
create index if not exists idx_real_estate_reviews_active
  on public.real_estate_reviews (id)
  where deleted_at is null;

-- Índice único parcial: 1 reseña por usuario por inmobiliaria
drop index if exists idx_real_estate_reviews_user_re_unique;

create unique index idx_real_estate_reviews_user_re_unique
  on public.real_estate_reviews (user_id, real_estate_id)
  where deleted_at is null;

comment on index idx_real_estate_reviews_user_re_unique is
  'Unicidad por usuario+real_estate_id en real_estate_reviews; aplica solo cuando deleted_at IS NULL. Garantiza 1 reseña por inmobiliaria por usuario.';

-- Índice para búsquedas de reseñas recientes por propiedad
create index if not exists idx_real_estate_reviews_re_created
  on public.real_estate_reviews (real_estate_id, created_at desc)
  where deleted_at is null;

-- =============================================================================
-- REAL ESTATE VOTES
-- =============================================================================
create index if not exists idx_real_estate_votes_real_estate_id
  on public.real_estate_votes (real_estate_id);

create index if not exists idx_real_estate_votes_user_id
  on public.real_estate_votes (user_id);

-- Índice compuesto para búsquedas de voto único por usuario y propiedad
-- Incluye vote_type para cubrir las consultas de conteo sin tener que acceder a la tabla
create index if not exists idx_real_estate_votes_composite
  on public.real_estate_votes (real_estate_id, user_id, vote_type);

-- =============================================================================
-- REAL ESTATE REVIEW VOTES
-- =============================================================================
-- Índice compuesto para optimizar consultas por review, usuario y tipo de voto
create index if not exists idx_real_estate_review_votes_composite
  on public.real_estate_review_votes (real_estate_review_id, user_id, vote_type);

-- =============================================================================
-- REAL ESTATE REVIEW REPORTS
-- =============================================================================
create index if not exists idx_real_estate_review_reports_review_id
  on public.real_estate_review_reports (real_estate_review_id);

create index if not exists idx_real_estate_review_reports_reported_by
  on public.real_estate_review_reports (reported_by_user_id);

create index if not exists idx_real_estate_review_reports_status
  on public.real_estate_review_reports (status);

create index if not exists idx_real_estate_review_reports_created_at
  on public.real_estate_review_reports (created_at);

-- =============================================================================
-- REAL ESTATE REPORTS
-- =============================================================================
create index if not exists idx_real_estate_reports_real_estate_id
  on public.real_estate_reports (real_estate_id);

create index if not exists idx_real_estate_reports_reported_by
  on public.real_estate_reports (reported_by_user_id);

create index if not exists idx_real_estate_reports_status
  on public.real_estate_reports (status);

-- =============================================================================
-- REAL ESTATE FAVORITES
-- =============================================================================
create index if not exists idx_real_estate_favorites_real_estate_id
  on public.real_estate_favorites (real_estate_id);

create index if not exists idx_real_estate_favorites_user_id
  on public.real_estate_favorites (user_id);

-- =============================================================================
-- NOTA SOBRE VISTAS MATERIALIZADAS
-- =============================================================================
-- Los índices en MVs (review_vote_stats, real_estate_vote_stats,
-- real_estate_review_vote_stats) se definen junto con la creación de las MVs.
-- =============================================================================

-- =============================================================================
-- LIMPIEZA DE OBJETOS ANTIGUOS (seguridad para fresh start)
-- =============================================================================
-- Eliminar constraint antiguo si existe en la migración (para limpieza)
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'unique_user_property_review'
      and table_name = 'reviews'
      and table_schema = 'public'
  ) then
    alter table public.reviews drop constraint unique_user_property_review;
  end if;
end $$;

-- Eliminar índice antiguo si fue creado por error
drop index if exists public.idx_reviews_unique_user_property;
