-- =============================================================================
-- REVIUY — SCHEMA COMPLETO
-- =============================================================================

-- =============================================================================
-- SECCIÓN 2: EXTENSIONES
-- =============================================================================
create extension if not exists citext;

-- =============================================================================
-- SECCIÓN 3: TIPOS COMPUESTOS (from 002_types.sql)
-- =============================================================================

-- =============================================================================
-- Tipos compuestos (composite types) para resultados de funciones
-- =============================================================================
-- Cada tipo se elimina primero para garantizar idempotencia en un nuevo esquema.

-- =============================================================================
-- REVIEWS (USUARIOS)
-- =============================================================================
drop type if exists public.create_review_result cascade;
create type public.create_review_result as (
  success BOOLEAN,
  review_id UUID,
  message TEXT,
  error TEXT
);

drop type if exists public.toggle_favorite_result cascade;
create type public.toggle_favorite_result as (
  success BOOLEAN,
  is_favorite BOOLEAN,
  message TEXT,
  error TEXT
);

-- =============================================================================
-- SECCIÓN 4: TABLAS + COMMENTS (from 001_base_tables.sql lines 1-551)
-- =============================================================================

-- =============================================================================
-- Tablas principales y estructura base
-- =============================================================================

-- Tabla de inmobiliarias
create table if not exists public.real_estates (
  id UUID primary key default gen_random_uuid (),
  name CITEXT not null check (
    char_length(btrim(name)) > 0
    and char_length(name) <= 100
  ),
  description VARCHAR(500),
  review_count INTEGER not null default 0 check (review_count >= 0),
  rating DECIMAL(3, 2) not null default 0.00 check (
    rating >= 0
    and rating <= 5
  ),
  created_by UUID references auth.users (id) on delete set null,
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now() check (updated_at >= created_at),
  deleted_at TIMESTAMPTZ,
  unique (name)
);

-- Tabla principal de reseñas de propiedades
create table if not exists public.reviews (
  id UUID primary key default gen_random_uuid (),
  user_id UUID references auth.users (id) on delete set null,
  real_estate_id UUID references public.real_estates (id) on delete set null,
  title VARCHAR(200) not null check (char_length(btrim(title)) > 0),
  description VARCHAR(800) not null check (char_length(btrim(description)) > 0),
  rating INTEGER not null check (
    rating >= 1
    and rating <= 5
  ),
  property_type TEXT check (property_type in ('apartment', 'house', 'room')),
  address_text VARCHAR(200) not null check (char_length(btrim(address_text)) > 0),
  address_osm_id VARCHAR(100) not null check (char_length(btrim(address_osm_id)) > 0),
  latitude DECIMAL(10, 8) not null check (
    latitude >= -90
    and latitude <= 90
  ),
  longitude DECIMAL(11, 8) not null check (
    longitude >= -180
    and longitude <= 180
  ),
  zone_rating INTEGER check (
    zone_rating >= 1
    and zone_rating <= 5
  ),
  winter_comfort TEXT check (winter_comfort in ('hot', 'comfortable', 'cold')),
  summer_comfort TEXT check (summer_comfort in ('hot', 'comfortable', 'cold')),
  humidity TEXT check (humidity in ('high', 'normal', 'low')),
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now() check (updated_at >= created_at),
  apartment_number VARCHAR(10),
  real_estate_experience VARCHAR(200),
  deleted_at TIMESTAMPTZ
);

-- Tabla de rooms asociados a reviews
create table if not exists public.review_rooms (
  id uuid primary key default gen_random_uuid (),
  review_id uuid not null references public.reviews (id) on delete CASCADE,
  room_type TEXT check (
    room_type in (
      'bedroom',
      'living_room',
      'kitchen',
      'bathroom',
      'dining_room',
      'study',
      'storage'
    )
  ),
  area_m2 NUMERIC(7, 2) check (
    area_m2 >= 0
    and area_m2 <= 10000
  ),
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now() check (updated_at >= created_at)
);

-- Tabla para rate limiting
create table if not exists public.rate_limits (
  id UUID primary key default gen_random_uuid (),
  user_id UUID not null references auth.users (id) on delete CASCADE,
  ip_address INET,
  endpoint TEXT not null check (char_length(btrim(endpoint)) > 0),
  request_count INTEGER not null default 1 check (request_count >= 0),
  window_start TIMESTAMPTZ not null default now(),
  created_at TIMESTAMPTZ default now(),
  unique (user_id, endpoint, window_start)
);

-- Tabla de logs de seguridad
create table if not exists public.security_logs (
  id UUID primary key default gen_random_uuid (),
  user_id UUID references auth.users (id) on delete set null,
  ip_address INET,
  user_agent TEXT,
  endpoint TEXT,
  action TEXT,
  status TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ default now()
);

-- =============================================================================
-- TABLAS PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Tabla de votos para reviews
create table if not exists public.review_votes (
  id UUID primary key default gen_random_uuid (),
  review_id UUID not null references public.reviews (id) on delete CASCADE,
  user_id UUID not null references auth.users (id) on delete CASCADE,
  vote_type TEXT not null check (vote_type in ('like', 'dislike')),
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now() check (updated_at >= created_at),
  unique (review_id, user_id)
);

-- Tabla para reportes de reviews
create table if not exists public.review_reports (
  id UUID default gen_random_uuid () primary key,
  review_id UUID not null references public.reviews (id) on delete CASCADE,
  reported_by_user_id UUID references auth.users (id) on delete set null,
  reason VARCHAR(200) not null check (char_length(btrim(reason)) > 0),
  description VARCHAR(500),
  status TEXT default 'pending' check (
    status in ('pending', 'reviewed', 'resolved', 'dismissed')
  ),
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now() check (updated_at >= created_at),
  unique (review_id, reported_by_user_id)
);

-- Tabla de auditoría para eliminaciones
create table if not exists public.review_deletions (
  id UUID primary key default gen_random_uuid (),
  review_id UUID references public.reviews (id) on delete set null,
  deleted_by UUID references auth.users (id) on delete set null,
  review_title VARCHAR(200),
  review_rating INTEGER,
  review_created_at TIMESTAMPTZ,
  deletion_reason VARCHAR(200),
  deleted_at TIMESTAMPTZ not null default now()
);

-- Tabla de auditoría completa
create table if not exists public.review_audit (
  id UUID primary key default gen_random_uuid (),
  review_id UUID references public.reviews (id) on delete set null,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID references auth.users (id) on delete set null,
  change_type TEXT not null check (change_type in ('create', 'update', 'delete')),
  created_at TIMESTAMPTZ not null default now()
);

-- TABLA: Reseñas de inmobiliarias
create table if not exists public.real_estate_reviews (
  id UUID primary key default gen_random_uuid (),
  real_estate_id UUID not null references public.real_estates (id) on delete CASCADE,
  user_id UUID references auth.users (id) on delete set null,
  -- Contenido de la reseña sobre la inmobiliaria
  title VARCHAR(200) not null check (char_length(btrim(title)) > 0),
  description VARCHAR(400) not null check (char_length(btrim(description)) > 0),
  rating INTEGER not null check (
    rating >= 1
    and rating <= 5
  ),
  -- Timestamps
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now() check (updated_at >= created_at),
  deleted_at TIMESTAMPTZ -- Índice condicional para soft delete (ver migración 008)
);

-- TABLA: Votos para reseñas de inmobiliarias
create table if not exists public.real_estate_review_votes (
  id UUID primary key default gen_random_uuid (),
  real_estate_review_id UUID not null references public.real_estate_reviews (id) on delete CASCADE,
  user_id UUID not null references auth.users (id) on delete CASCADE,
  vote_type TEXT not null check (vote_type in ('like', 'dislike')),
  created_at TIMESTAMPTZ not null default now(),
  updated_at TIMESTAMPTZ not null default now() check (updated_at >= created_at),
  unique (real_estate_review_id, user_id)
);

-- TABLA: Reportes para reseñas de inmobiliarias
create table if not exists public.real_estate_review_reports (
  id UUID default gen_random_uuid () primary key,
  real_estate_review_id UUID not null references public.real_estate_reviews (id) on delete CASCADE,
  reported_by_user_id UUID references auth.users (id) on delete set null,
  reason VARCHAR(200) not null check (char_length(btrim(reason)) > 0),
  description VARCHAR(500),
  status TEXT default 'pending' check (
    status in ('pending', 'reviewed', 'resolved', 'dismissed')
  ),
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now() check (updated_at >= created_at),
  unique (real_estate_review_id, reported_by_user_id)
);

-- Tabla para reportes de inmobiliarias
create table if not exists public.real_estate_reports (
  id UUID primary key default gen_random_uuid (),
  real_estate_id UUID not null references public.real_estates (id) on delete CASCADE,
  reported_by_user_id UUID references auth.users (id) on delete set null,
  reason VARCHAR(200) not null check (char_length(btrim(reason)) > 0),
  description VARCHAR(500),
  status TEXT default 'pending' check (
    status in ('pending', 'reviewed', 'resolved', 'dismissed')
  ),
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now() check (updated_at >= created_at),
  unique (real_estate_id, reported_by_user_id)
);

-- Tabla para votos de inmobiliarias
create table if not exists public.real_estate_votes (
  id UUID primary key default gen_random_uuid (),
  real_estate_id UUID not null references public.real_estates (id) on delete CASCADE,
  user_id UUID not null references auth.users (id) on delete CASCADE,
  vote_type TEXT not null check (vote_type in ('like', 'dislike')),
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now() check (updated_at >= created_at),
  unique (real_estate_id, user_id)
);

-- Crear tabla de favoritos de inmobiliarias
create table if not exists public.real_estate_favorites (
  id UUID primary key default gen_random_uuid (),
  real_estate_id UUID not null references public.real_estates (id) on delete CASCADE,
  user_id UUID not null references auth.users (id) on delete CASCADE,
  created_at TIMESTAMPTZ default now(),
  unique (real_estate_id, user_id)
);

-- Crear tabla de favoritos de reseñas
create table if not exists public.review_favorites (
  id UUID primary key default gen_random_uuid (),
  review_id UUID not null references public.reviews (id) on delete CASCADE,
  user_id UUID not null references auth.users (id) on delete CASCADE,
  created_at TIMESTAMPTZ default now(),
  unique (review_id, user_id)
);

-- =============================================================================
-- DOCUMENTACIÓN POR TABLA Y COLUMNA
-- =============================================================================
-- public.real_estates
COMMENT on table public.real_estates is 'Catálogo de inmobiliarias creadas por usuarios. rating y review_count derivan de real_estate_reviews.';

COMMENT on column public.real_estates.id is 'Identificador único (UUID).';

COMMENT on column public.real_estates.name is 'Nombre de la inmobiliaria (único). Máximo 100 caracteres. La unicidad es case-insensitive.';

COMMENT on column public.real_estates.description is 'Descripción breve de la inmobiliaria. Máximo 500 caracteres.';

COMMENT on column public.real_estates.review_count is 'Cantidad de reseñas en real_estate_reviews; mantenido por triggers.';

COMMENT on column public.real_estates.rating is 'Promedio de rating (0..5) desde real_estate_reviews; mantenido por trigger. Minimo 0.00. Máximo 5.00.';

COMMENT on column public.real_estates.created_by is 'Usuario que creó la inmobiliaria (FK a auth.users). Likes y dislikes se calculan dinámicamente desde real_estate_votes usando vistas materializadas.';

COMMENT on column public.real_estates.created_at is 'Fecha de creación.';

COMMENT on column public.real_estates.updated_at is 'Fecha de última actualización (trigger).';

COMMENT on column public.real_estates.deleted_at is 'Soft delete; NULL si está activa.';

-- public.reviews
COMMENT on table public.reviews is 'Reseñas de propiedades individuales (texto, rating, atributos de confort y ubicación). Unicidad: por usuario solo 1 reseña por dirección (preferentemente por address_osm_id); se permiten múltiples direcciones por usuario. Si no hay OSM ID, se valida por address_text en la función create_review.';

COMMENT on column public.reviews.id is 'Identificador único (UUID).';

COMMENT on column public.reviews.user_id is 'Autor de la reseña (FK a auth.users).';

COMMENT on column public.reviews.real_estate_id is 'Inmobiliaria relacionada (opcional).';

COMMENT on column public.reviews.title is 'Título de la reseña. Maximo 200 caracteres.';

COMMENT on column public.reviews.description is 'Contenido de la reseña. Máximo 800 caracteres.';

COMMENT on column public.reviews.rating is 'Calificación de la propiedad (1..5). Minimo 1, máximo 5.';

COMMENT on column public.reviews.property_type is 'Tipo de propiedad (apartment|house|room).';

COMMENT on column public.reviews.address_text is 'Dirección en texto libre (si no hay OSM ID).';

COMMENT on column public.reviews.address_osm_id is 'Identificador OSM de la dirección (preferido para unicidad por usuario).';

COMMENT on column public.reviews.latitude is 'Latitud (-90..90); validada por CHECK.';

COMMENT on column public.reviews.longitude is 'Longitud (-180..180); validada por CHECK.';

COMMENT on column public.reviews.zone_rating is 'Valoración de la zona (1..5). Minimo 1, máximo 5.';

COMMENT on column public.reviews.winter_comfort is 'Confort térmico en invierno (hot|comfortable|cold).';

COMMENT on column public.reviews.summer_comfort is 'Confort térmico en verano (hot|comfortable|cold).';

COMMENT on column public.reviews.humidity is 'Humedad percibida (high|normal|low).';

COMMENT on column public.reviews.created_at is 'Fecha de creación.';

COMMENT on column public.reviews.updated_at is 'Fecha de última actualización (trigger).';

COMMENT on column public.reviews.apartment_number is 'Número de apartamento (si aplica).';

COMMENT on column public.reviews.real_estate_experience is 'Experiencia con la inmobiliaria (texto adicional). Opcional. Máximo 200 caracteres.';

COMMENT on column public.reviews.deleted_at is 'Soft delete de reseña.';

-- public.review_rooms
COMMENT on table public.review_rooms is 'Detalle de ambientes/habitaciones asociados a una reseña.';

COMMENT on column public.review_rooms.id is 'Identificador único (UUID).';

COMMENT on column public.review_rooms.review_id is 'Reseña a la que pertenece el ambiente (FK).';

COMMENT on column public.review_rooms.room_type is 'Tipo de ambiente (bedroom, kitchen, etc.).';

COMMENT on column public.review_rooms.area_m2 is 'Superficie aproximada en m².';

COMMENT on column public.review_rooms.created_at is 'Fecha de creación.';

COMMENT on column public.review_rooms.updated_at is 'Fecha de última actualización (trigger).';

-- public.rate_limits
COMMENT on table public.rate_limits is 'Ventanas de rate limiting por usuario/endpoint (temporal; idealmente migrar a Redis).';

COMMENT on column public.rate_limits.id is 'Identificador único (UUID).';

COMMENT on column public.rate_limits.user_id is 'Usuario afectado (FK a auth.users).';

COMMENT on column public.rate_limits.ip_address is 'IP del cliente (si corresponde).';

COMMENT on column public.rate_limits.endpoint is 'Endpoint o acción rate-limited.';

COMMENT on column public.rate_limits.request_count is 'Cantidad de requests en la ventana.';

COMMENT on column public.rate_limits.window_start is 'Inicio de la ventana temporal (redondeada).';

COMMENT on column public.rate_limits.created_at is 'Fecha de registro.';

-- public.security_logs
COMMENT on table public.security_logs is 'Logs de seguridad y auditoría (acciones, estados, metadata).';

COMMENT on column public.security_logs.id is 'Identificador único (UUID).';

COMMENT on column public.security_logs.user_id is 'Usuario relacionado al evento (FK a auth.users).';

COMMENT on column public.security_logs.ip_address is 'IP del cliente.';

COMMENT on column public.security_logs.user_agent is 'User-Agent del cliente.';

COMMENT on column public.security_logs.endpoint is 'Endpoint/Referer involucrado.';

COMMENT on column public.security_logs.action is 'Acción registrada (e.g., create_review).';

COMMENT on column public.security_logs.status is 'Estado (success|blocked|error).';

COMMENT on column public.security_logs.error_message is 'Mensaje de error (si aplica).';

COMMENT on column public.security_logs.metadata is 'Datos adicionales en JSONB.';

COMMENT on column public.security_logs.created_at is 'Fecha del evento.';

-- public.review_votes
COMMENT on table public.review_votes is 'Votos de reseñas (like/dislike).';

COMMENT on column public.review_votes.id is 'Identificador único (UUID).';

COMMENT on column public.review_votes.review_id is 'Reseña votada (FK).';

COMMENT on column public.review_votes.user_id is 'Usuario que vota (FK).';

COMMENT on column public.review_votes.vote_type is 'Tipo de voto (like|dislike).';

COMMENT on column public.review_votes.created_at is 'Fecha del voto.';

COMMENT on column public.review_votes.updated_at is 'Fecha de última actualización.';

-- public.review_reports
COMMENT on table public.review_reports is 'Reportes de reseñas por usuarios.';

COMMENT on column public.review_reports.id is 'Identificador único (UUID).';

COMMENT on column public.review_reports.review_id is 'Reseña reportada (FK).';

COMMENT on column public.review_reports.reported_by_user_id is 'Usuario que reporta (FK).';

COMMENT on column public.review_reports.reason is 'Motivo principal del reporte. Máximo 200 caracteres.';

COMMENT on column public.review_reports.description is 'Descripción adicional (opcional). Máximo 500 caracteres.';

COMMENT on column public.review_reports.status is 'Estado del reporte (pending|reviewed|resolved|dismissed).';

COMMENT on column public.review_reports.created_at is 'Fecha de creación del reporte.';

COMMENT on column public.review_reports.updated_at is 'Fecha de última actualización del reporte.';

-- public.review_deletions
COMMENT on table public.review_deletions is 'Auditoría de eliminaciones de reseñas (snapshot al borrar).';

COMMENT on column public.review_deletions.id is 'Identificador único (UUID).';

COMMENT on column public.review_deletions.review_id is 'Reseña eliminada (FK).';

COMMENT on column public.review_deletions.deleted_by is 'Usuario que realizó la eliminación (FK).';

COMMENT on column public.review_deletions.review_title is 'Título original de la reseña. Máximo 200 caracteres.';

COMMENT on column public.review_deletions.review_rating is 'Rating original de la reseña.';

COMMENT on column public.review_deletions.review_created_at is 'Fecha de creación original de la reseña.';

COMMENT on column public.review_deletions.deletion_reason is 'Motivo de la eliminación (si se registra). Máximo 200 caracteres.';

COMMENT on column public.review_deletions.deleted_at is 'Fecha de eliminación.';

-- public.review_audit
COMMENT on table public.review_audit is 'Auditoría de cambios (create/update/delete) en reseñas.';

COMMENT on column public.review_audit.id is 'Identificador único (UUID).';

COMMENT on column public.review_audit.review_id is 'Reseña afectada (FK).';

COMMENT on column public.review_audit.old_data is 'Versión anterior (JSONB).';

COMMENT on column public.review_audit.new_data is 'Versión nueva (JSONB).';

COMMENT on column public.review_audit.changed_by is 'Usuario que cambió (FK).';

COMMENT on column public.review_audit.change_type is 'Tipo de cambio (create|update|delete).';

COMMENT on column public.review_audit.created_at is 'Fecha del evento de auditoría.';

-- public.real_estate_reviews
COMMENT on table public.real_estate_reviews is 'Reseñas sobre inmobiliarias (no propiedades). Unicidad: por usuario solo 1 reseña por inmobiliaria (excluye soft-deletes). Likes y dislikes se calculan dinámicamente desde real_estate_review_votes usando vistas materializadas.';

COMMENT on column public.real_estate_reviews.id is 'Identificador único (UUID).';

COMMENT on column public.real_estate_reviews.real_estate_id is 'Inmobiliaria reseñada (FK).';

COMMENT on column public.real_estate_reviews.user_id is 'Autor de la reseña (FK).';

COMMENT on column public.real_estate_reviews.title is 'Título de la reseña de inmobiliaria. Máximo 200 caracteres.';

COMMENT on column public.real_estate_reviews.description is 'Contenido de la reseña de inmobiliaria. Máximo 400 caracteres.';

COMMENT on column public.real_estate_reviews.rating is 'Calificación (1..5) de la inmobiliaria.';

COMMENT on column public.real_estate_reviews.created_at is 'Fecha de creación.';

COMMENT on column public.real_estate_reviews.updated_at is 'Fecha de última actualización (trigger).';

COMMENT on column public.real_estate_reviews.deleted_at is 'Soft delete; NULL si está activa.';

-- public.real_estate_review_votes
COMMENT on table public.real_estate_review_votes is 'Votos (like/dislike) sobre reseñas de inmobiliarias.';

COMMENT on column public.real_estate_review_votes.id is 'Identificador único (UUID).';

COMMENT on column public.real_estate_review_votes.real_estate_review_id is 'Reseña de inmobiliaria votada (FK).';

COMMENT on column public.real_estate_review_votes.user_id is 'Usuario que vota (FK).';

COMMENT on column public.real_estate_review_votes.vote_type is 'Tipo de voto (like|dislike).';

COMMENT on column public.real_estate_review_votes.created_at is 'Fecha del voto.';

COMMENT on column public.real_estate_review_votes.updated_at is 'Fecha de última actualización.';

-- public.real_estate_review_reports
COMMENT on table public.real_estate_review_reports is 'Reportes sobre reseñas de inmobiliarias.';

COMMENT on column public.real_estate_review_reports.id is 'Identificador único (UUID).';

COMMENT on column public.real_estate_review_reports.real_estate_review_id is 'Reseña de inmobiliaria reportada (FK).';

COMMENT on column public.real_estate_review_reports.reported_by_user_id is 'Usuario que reporta (FK).';

COMMENT on column public.real_estate_review_reports.reason is 'Motivo principal del reporte. Máximo 200 caracteres. Máximo 200 caracteres.';

COMMENT on column public.real_estate_review_reports.description is 'Descripción adicional del reporte (opcional). Máximo 500 caracteres.';

COMMENT on column public.real_estate_review_reports.status is 'Estado (pending|reviewed|resolved|dismissed).';

COMMENT on column public.real_estate_review_reports.created_at is 'Fecha de creación del reporte.';

COMMENT on column public.real_estate_review_reports.updated_at is 'Fecha de última actualización del reporte.';

-- public.real_estate_reports
COMMENT on table public.real_estate_reports is 'Reportes sobre inmobiliarias.';

COMMENT on column public.real_estate_reports.id is 'Identificador único (UUID).';

COMMENT on column public.real_estate_reports.real_estate_id is 'Inmobiliaria reportada (FK).';

COMMENT on column public.real_estate_reports.reported_by_user_id is 'Usuario que reporta (FK).';

COMMENT on column public.real_estate_reports.reason is 'Motivo del reporte. Máximo 200 caracteres.';

COMMENT on column public.real_estate_reports.description is 'Descripción adicional (opcional). Máximo 500 caracteres.';

COMMENT on column public.real_estate_reports.status is 'Estado (pending|reviewed|resolved|dismissed).';

COMMENT on column public.real_estate_reports.created_at is 'Fecha de creación del reporte.';

COMMENT on column public.real_estate_reports.updated_at is 'Fecha de última actualización del reporte.';

-- public.real_estate_votes
COMMENT on table public.real_estate_votes is 'Votos (like/dislike) sobre inmobiliarias. Los contadores agregados se calculan mediante vistas materializadas.';

COMMENT on column public.real_estate_votes.id is 'Identificador único (UUID).';

COMMENT on column public.real_estate_votes.real_estate_id is 'Inmobiliaria votada (FK).';

COMMENT on column public.real_estate_votes.user_id is 'Usuario que vota (FK).';

COMMENT on column public.real_estate_votes.vote_type is 'Tipo de voto (like|dislike).';

COMMENT on column public.real_estate_votes.created_at is 'Fecha del voto.';

COMMENT on column public.real_estate_votes.updated_at is 'Fecha de última actualización (cuando cambia de like a dislike o viceversa).';

-- public.real_estate_favorites
COMMENT on table public.real_estate_favorites is 'Favoritos de inmobiliarias por usuario.';

COMMENT on column public.real_estate_favorites.id is 'Identificador único (UUID).';

COMMENT on column public.real_estate_favorites.real_estate_id is 'Inmobiliaria marcada como favorita (FK).';

COMMENT on column public.real_estate_favorites.user_id is 'Usuario que marca como favorito (FK).';

COMMENT on column public.real_estate_favorites.created_at is 'Fecha de creación del favorito.';

-- public.review_favorites
COMMENT on table public.review_favorites is 'Favoritos de reseñas por usuario.';

COMMENT on column public.review_favorites.id is 'Identificador único (UUID).';

COMMENT on column public.review_favorites.review_id is 'Reseña marcada como favorita (FK).';

COMMENT on column public.review_favorites.user_id is 'Usuario que marca como favorito (FK).';

COMMENT on column public.review_favorites.created_at is 'Fecha de creación del favorito.';

-- =============================================================================
-- SECCIÓN 5: VISTA DE MONITOREO DE RATE LIMITING
-- NOTA (018-fix): Las MVs de contadores (real_estate_vote_stats,
-- review_vote_stats, real_estate_review_vote_stats) y las vistas non-public
-- (real_estates_with_votes, reviews_with_votes, real_estate_reviews_with_votes)
-- fueron ELIMINADAS: la app consume solo las vistas _public, que calculan los
-- contadores en vivo con LEFT JOIN LATERAL (sin MVs ni cron de refresh).
-- =============================================================================

create or replace view public.rate_limit_stats
with
  (security_invoker = on) as
select
    endpoint,
    count(distinct user_id) as unique_users,
    sum(request_count) as total_requests,
    avg(request_count) as avg_requests_per_window,
    max(request_count) as max_requests_per_window,
    max(window_start) as last_request_time
from
    public.rate_limits
where
    window_start > now() - interval '1 hour'
group by
    endpoint
order by
    total_requests desc;

comment on view public.rate_limit_stats is 'Vista de monitoreo de rate limiting: muestra métricas agregadas por endpoint en la última hora.';

-- =============================================================================
-- SECCIÓN 6: FUNCIONES HELPER/INFRAESTRUCTURA (SECURITY DEFINER)
-- =============================================================================

-- =============================================================================
-- 6a. log_security_event (SECURITY INVOKER — versión final from 011)
-- =============================================================================
create or replace function public.log_security_event (
  p_action text,
  p_status text default 'success',
  p_error_message text default null,
  p_metadata jsonb default null
) RETURNS VOID LANGUAGE plpgsql SECURITY INVOKER
set search_path = public, pg_temp
as $function$ BEGIN
  INSERT INTO public.security_logs (
    user_id, ip_address, user_agent, endpoint,
    action, status, error_message, metadata, created_at
  ) VALUES (
    COALESCE(auth.uid(), NULL),
    inet_client_addr(),
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    COALESCE(current_setting('request.headers', true)::json->>'referer', 'unknown'),
    p_action, p_status, p_error_message,
    COALESCE(p_metadata, '{}'::jsonb),
    now()
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error en log_security_event: %', SQLERRM;
END;
$function$;

comment on FUNCTION public.log_security_event is
  'Logging de seguridad con SECURITY INVOKER. Las funciones que la llaman deben tener permiso de INSERT en security_logs.';

-- =============================================================================
-- 6b. check_rate_limit (versión final from 015, con e2e bypass)
-- =============================================================================
create or replace function public.check_rate_limit (
  p_endpoint text,
  p_max_requests integer default 10,
  p_window_minutes integer default 1
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$
declare
  v_user_id UUID;
  v_window_from TIMESTAMPTZ;
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
begin
  v_user_id := auth.uid();

  -- Fix S1: El bypass por email (e2e-test@reviuy.qa) fue eliminado. Los tests
  -- e2e deben correr contra una instancia dedicada sin signup abierto (ver docs).

  -- Motivo: Evitar configuraciones inválidas que podrían desactivar o romper el control.
  IF p_max_requests < 1
  OR p_window_minutes < 1 THEN RAISE WARNING 'Parámetros inválidos en check_rate_limit. endpoint=%, max_requests=%, window_minutes=%',
    p_endpoint,
    p_max_requests,
    p_window_minutes;

    RETURN FALSE;
  END IF;

  -- Motivo: Mantener buckets por minuto para el UPSERT, pero aplicar realmente
  -- la ventana configurable en la consulta agregada.
  v_window_start := date_trunc('minute', NOW());

  -- Motivo: Usar exactamente N buckets de minuto (incluyendo el actual),
  -- en lugar de forzar siempre una sola ventana de 1 minuto.
  v_window_from := v_window_start - make_interval(mins=> p_window_minutes - 1);

  -- Motivo: Enforce real del límite en toda la ventana solicitada.
  -- El índice (user_id, endpoint, window_start) soporta este rango.
  SELECT
      COALESCE(SUM(request_count), 0) :: INTEGER INTO v_current_count
  FROM
      public.rate_limits
  WHERE
      user_id = v_user_id
      AND endpoint = p_endpoint
      AND window_start BETWEEN v_window_from
      AND v_window_start;

  -- Verificar límite
  IF v_current_count >= p_max_requests THEN -- Log solo en casos de rate LIMIT excedido (reduce writes)
    PERFORM log_security_event(
        'rate_limit_exceeded',
        'blocked',
        'Rate limit exceeded for endpoint: ' || p_endpoint,
        jsonb_build_object(
            'endpoint',
            p_endpoint,
            'max_requests',
            p_max_requests,
            'window_minutes',
            p_window_minutes,
            'current_count',
            v_current_count
        )
    );

    RETURN FALSE;
  END IF;

  -- Registrar request (UPSERT optimizado)
  INSERT INTO
      public.rate_limits (
          user_id,
          endpoint,
          window_start,
          request_count
      )
  VALUES
      (
          v_user_id,
          p_endpoint,
          v_window_start,
          1
      ) ON CONFLICT (user_id, endpoint, window_start) DO
  UPDATE
  SET
      request_count = rate_limits.request_count + 1;

  RETURN TRUE;

EXCEPTION
  WHEN OTHERS THEN -- En caso de error, bloquear (fail closed) para no omitir el rate limit
    RAISE WARNING 'Error en check_rate_limit: %',
      SQLERRM;

    RETURN FALSE;
END;
$function$;

-- =============================================================================
-- 6d. cleanup_old_security_logs (from 004)
-- =============================================================================
create or replace function public.cleanup_old_security_logs () returns void language plpgsql security definer
set search_path = public, pg_temp
set row_security = on
as $function$ begin -- Retención de 90 días, borrado en lotes para evitar locks largos
delete from
    public.security_logs
where
    id in (
        select
            id
        from
            public.security_logs
        where
            created_at < now() - interval '90 days'
        limit
            1000
    );

end;

$function$;

comment on function public.cleanup_old_security_logs is 'Limpia security_logs con más de 90 días. Diseñada para ejecutarse vía pg_cron o edge function.';

-- =============================================================================
-- 6e. Trigger functions (from 004)
-- =============================================================================

-- Nueva estrategia: Cleanup probabilístico (1% de chance por insert)
create or replace function cleanup_rate_limits_on_insert () RETURNS TRIGGER set search_path = public, pg_temp as $function$ BEGIN
IF random() < 0.01 THEN -- DELETE con LIMIT para evitar locks largos
DELETE FROM
    public.rate_limits
WHERE
    id IN (
        SELECT
            id
        FROM
            public.rate_limits
        WHERE
            window_start < NOW() - INTERVAL '24 hours'
        LIMIT
            1000 -- Limitar para evitar lock largo
    );

END IF;

RETURN NEW;

END;

$function$ LANGUAGE plpgsql;

-- Función para actualizar timestamp de updated_at
create or replace function update_updated_at_column () RETURNS TRIGGER set search_path = public, pg_temp as $function$ BEGIN IF NEW IS DISTINCT FROM OLD THEN
    NEW.updated_at = now();

END IF;

RETURN NEW;

END;

$function$ LANGUAGE plpgsql;

-- Función para actualizar contadores de inmobiliarias
-- NOTA: review_count y rating se gestionan exclusivamente por update_real_estate_rating_from_reviews
-- (trigger en real_estate_reviews). Esta función solo actualiza updated_at cuando cambia real_estate_id.
create or replace function update_real_estate_counters () RETURNS TRIGGER SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$ BEGIN IF (TG_OP = 'INSERT') THEN IF NEW.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = NEW.real_estate_id;

END IF;

ELSIF (TG_OP = 'UPDATE') THEN IF OLD.real_estate_id IS DISTINCT FROM
    NEW.real_estate_id THEN IF OLD.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = OLD.real_estate_id;

END IF;

IF NEW.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = NEW.real_estate_id;

END IF;

END IF;

ELSIF (TG_OP = 'DELETE') THEN IF OLD.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = OLD.real_estate_id;

END IF;

END IF;

RETURN COALESCE(NEW, OLD);

END;

$function$ LANGUAGE plpgsql;

-- Función para actualizar rating de inmobiliaria basado en sus reseñas
create or replace function update_real_estate_rating_from_reviews () RETURNS TRIGGER SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        UPDATE
            public.real_estates
        SET
            rating = (
                SELECT
                    COALESCE(AVG(rating), 0)
                FROM
                    public.real_estate_reviews
                WHERE
                    real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
                    AND deleted_at IS NULL),
            review_count = (
                SELECT
                    COUNT(*)
                FROM
                    public.real_estate_reviews
                WHERE
                    real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
                    AND deleted_at IS NULL)
        WHERE
            id = COALESCE(NEW.real_estate_id, OLD.real_estate_id);

        END IF;

        RETURN COALESCE(NEW, OLD);

END;

$$ LANGUAGE plpgsql;

-- =============================================================================
-- 6f. Audit functions (from 004 y 011)
-- =============================================================================

-- log_review_changes (versión final from 011)
create or replace function public.log_review_changes () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$ BEGIN
  IF (TG_OP = 'UPDATE' AND OLD IS DISTINCT FROM NEW) THEN
    INSERT INTO public.review_audit (
      review_id, old_data, new_data, changed_by, change_type
    ) VALUES (
      OLD.id, row_to_json(OLD), row_to_json(NEW), auth.uid(), 'update'
    );
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.review_audit (
      review_id, new_data, changed_by, change_type
    ) VALUES (
      NEW.id, row_to_json(NEW), auth.uid(), 'create'
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'review_audit_failure|review_id:%|op:%|msg:%|detail:%',
      COALESCE(NEW.id, OLD.id), TG_OP, SQLERRM, SQLSTATE;
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- log_review_deletion (from 004)
create or replace function log_review_deletion () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$ BEGIN BEGIN INSERT INTO
    public.review_deletions (
        review_id,
        deleted_by,
        review_title,
        review_rating,
        review_created_at
    )
VALUES
    (
        OLD.id,
        COALESCE(auth.uid(), OLD.user_id),
        OLD.title,
        OLD.rating,
        OLD.created_at
    );

EXCEPTION
WHEN OTHERS THEN -- Log del error pero NO bloquear la eliminación
RAISE WARNING 'Error al registrar eliminación de review_id %: %',
OLD.id,
SQLERRM;

END;

RETURN OLD;

END;

$function$;

-- =============================================================================
-- 6g. Moderation functions (from 004)
-- =============================================================================

create or replace function moderate_reports (
  p_report_id uuid,
  p_target_type text,
  p_status text,
  p_moderation_note text default null
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$
DECLARE
  -- Fix V1: ROW_COUNT es bigint; un boolean no puede recibirlo (error de coercion
  -- en runtime). Se declara bigint y se compara con 0.
  v_updated bigint;
BEGIN
  -- Fix V1: sin JWT, auth.jwt() ->> 'role' es NULL y la comparacion original
  -- no entraba al RAISE. coalesce fuerza fail-closed.
  IF coalesce(auth.jwt() ->> 'role', '') != 'service_role' THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  IF p_status NOT IN ('reviewed', 'resolved', 'dismissed') THEN
    RAISE EXCEPTION 'Invalid status. Use: reviewed, resolved, or dismissed';
  END IF;

  CASE p_target_type
    WHEN 'review' THEN
      UPDATE public.review_reports
      SET status = p_status, updated_at = now()
      WHERE id = p_report_id;
    WHEN 'real_estate_review' THEN
      UPDATE public.real_estate_review_reports
      SET status = p_status, updated_at = now()
      WHERE id = p_report_id;
    WHEN 'real_estate' THEN
      UPDATE public.real_estate_reports
      SET status = p_status, updated_at = now()
      WHERE id = p_report_id;
    ELSE
      RAISE EXCEPTION 'Invalid target type. Use: review, real_estate_review, or real_estate';
  END CASE;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RAISE EXCEPTION 'Report not found: %', p_report_id;
  END IF;

  PERFORM log_security_event(
    'moderate_report',
    'success',
    p_moderation_note,
    jsonb_build_object(
      'report_id', p_report_id,
      'target_type', p_target_type,
      'new_status', p_status
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'report_id', p_report_id,
    'target_type', p_target_type,
    'new_status', p_status
  );
END;
$$;

-- =============================================================================
-- 6h. Vote count functions (SECURITY DEFINER, from 004)
-- =============================================================================

-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
-- NO cambiar el return type para incluir columnas de usuario (user_id, email, etc.).
-- Si se necesitan datos sensibles, convertir a SECURITY INVOKER primero y verificar grants.
-- Función para obtener contadores de likes/dislikes en tiempo real
create or replace function public.get_real_estate_vote_counts (p_real_estate_id uuid) returns table (likes_count bigint, dislikes_count bigint) language plpgsql stable security definer
set search_path = public, pg_temp
set row_security = on
as $$ begin return query
select
    coalesce(
        sum(
            case
                when rev.vote_type = 'like' then 1
                else 0
            end
        ),
        0
    ) as likes_count,
    coalesce(
        sum(
            case
                when rev.vote_type = 'dislike' then 1
                else 0
            end
        ),
        0
    ) as dislikes_count
from
    public.real_estate_votes rev
    join public.real_estates re on re.id = rev.real_estate_id
where
    rev.real_estate_id = p_real_estate_id
    and re.deleted_at is null;

end;

$$;

-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
-- NO cambiar el return type para incluir columnas de usuario (user_id, email, etc.).
-- Si se necesitan datos sensibles, convertir a SECURITY INVOKER primero y verificar grants.
-- Función para obtener contadores de likes/dislikes de reviews en tiempo real
create or replace function public.get_review_vote_counts (p_review_id uuid) returns table (likes_count bigint, dislikes_count bigint) language plpgsql stable security definer
set search_path = public, pg_temp
set row_security = on
as $$ begin return query
select
    coalesce(
        sum(
            case
                when rv.vote_type = 'like' then 1
                else 0
            end
        ),
        0
    ) as likes_count,
    coalesce(
        sum(
            case
                when rv.vote_type = 'dislike' then 1
                else 0
            end
        ),
        0
    ) as dislikes_count
from
    public.review_votes rv
    join public.reviews r on r.id = rv.review_id
where
    rv.review_id = p_review_id
    and r.deleted_at is null;

end;

$$;

-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
-- NO cambiar el return type para incluir columnas de usuario (user_id, email, etc.).
-- Si se necesitan datos sensibles, convertir a SECURITY INVOKER primero y verificar grants.
-- Función para obtener contadores de votos de real_estate_reviews en tiempo real
create or replace function public.get_real_estate_review_vote_counts (p_real_estate_review_id uuid) returns table (likes_count bigint, dislikes_count bigint) language plpgsql stable security definer
set search_path = public, pg_temp
set row_security = on
as $$ begin return query
select
    coalesce(
        sum(
            case
                when rerv.vote_type = 'like' then 1
                else 0
            end
        ),
        0
    ) as likes_count,
    coalesce(
        sum(
            case
                when rerv.vote_type = 'dislike' then 1
                else 0
            end
        ),
        0
    ) as dislikes_count
from
    public.real_estate_review_votes rerv
    join public.real_estate_reviews rer on rer.id = rerv.real_estate_review_id
where
    rerv.real_estate_review_id = p_real_estate_review_id
    and rer.deleted_at is null;

end;

$$;

-- =============================================================================
-- (018-fix) Las funciones refresh de MVs (refresh_*_vote_stats) fueron
-- eliminadas junto con las MVs (ver sección 5).
-- =============================================================================

-- =============================================================================
-- SECCIÓN 7: CORE RPC FUNCTIONS
-- =============================================================================

-- =============================================================================
-- 7a. Core RPC functions (from 003, except those replaced by 017)
-- =============================================================================

-- Función para eliminar una reseña de forma segura
-- SECURITY DEFINER porque UPDATE en PostgreSQL requiere SELECT (revocado en 007).
create or replace function delete_review_safe (review_id_param uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$ DECLARE v_is_mine boolean;


current_user_id UUID;

v_review_title VARCHAR(200);

v_review_rating INTEGER;

v_review_created_at TIMESTAMPTZ;

BEGIN current_user_id := auth.uid();

IF current_user_id IS NULL THEN RAISE EXCEPTION 'Usuario no autenticado';

END IF;

SELECT
    rp.title,
    rp.rating,
    rp.created_at,
    rp.is_mine INTO v_review_title,
    v_review_rating,
    v_review_created_at,
    v_is_mine
FROM
    public.reviews_public rp
WHERE
    rp.id = review_id_param;

IF NOT FOUND THEN RAISE EXCEPTION 'Reseña no encontrada';

END IF;

IF NOT v_is_mine THEN RAISE EXCEPTION 'No tienes permisos para eliminar esta reseña';

END IF;

-- Soft delete: marcar como eliminada en vez de borrar físicamente
-- Preserva el historial de votos, reportes y auditoría
UPDATE
    public.reviews
SET
    deleted_at = NOW()
WHERE
    id = review_id_param AND user_id = current_user_id;

-- Registrar la eliminación en auditoría manualmente
-- (el trigger BEFORE DELETE ya no se dispara con soft delete)
BEGIN
INSERT INTO
    public.review_deletions (
        review_id,
        deleted_by,
        review_title,
        review_rating,
        review_created_at
    )
VALUES
    (
        review_id_param,
        current_user_id,
        v_review_title,
        v_review_rating,
        v_review_created_at
    );

EXCEPTION
WHEN OTHERS THEN RAISE WARNING 'Error al registrar eliminación de review_id %: %',
review_id_param,
SQLERRM;

END;

RETURN TRUE;

EXCEPTION
WHEN OTHERS THEN RAISE EXCEPTION 'Error al eliminar reseña';

END;

$function$;

-- =============================================================================
-- VOTOS DE REVIEWS
-- =============================================================================

-- Función para votar reviews (con toggle)
create or replace function vote_review (p_review_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$
DECLARE
    v_user_id uuid;
    v_existing_vote text;
    v_result json;
BEGIN
    -- Usuario autenticado (antes del rate limit para evitar fail-closed engañoso)
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        PERFORM
            log_security_event ('vote_review', 'error', 'Usuario no autenticado');
        RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');
    END IF;
    -- Verificar rate limit (20 votos por hora)
    IF NOT check_rate_limit ('vote_review', 20, 60) THEN
        RETURN json_build_object('success', FALSE, 'error', 'Demasiados votos. Intenta más tarde.');
    END IF;
    IF p_vote_type NOT IN ('like', 'dislike') THEN
        PERFORM
            log_security_event ('vote_review', 'error', 'Tipo de voto inválido');
        RETURN json_build_object('success', FALSE, 'error', 'Tipo de voto inválido. Use like o dislike');
    END IF;
    -- Verificar si existe un voto previo
    SELECT
        vote_type INTO v_existing_vote
    FROM
        public.review_votes
    WHERE
        review_id = p_review_id
        AND user_id = v_user_id;

    -- M11: Verificar que la review exista y esté activa (no soft-deleted)
    IF NOT EXISTS (
        SELECT 1 FROM public.reviews_public
        WHERE id = p_review_id
    ) THEN
        PERFORM log_security_event('vote_review', 'error', 'Review no existe o fue eliminada');
        RETURN json_build_object('success', FALSE, 'error', 'La reseña no existe o fue eliminada');
    END IF;
    -- M4: No permitir votar la propia reseña
    IF EXISTS (
        SELECT 1 FROM public.reviews_public
        WHERE id = p_review_id AND is_mine
    ) THEN
        PERFORM log_security_event('vote_review', 'blocked', 'Self-vote attempt');
        RETURN json_build_object('success', FALSE, 'error', 'No puedes votar tu propia reseña');
    END IF;
    -- Si existe y es del mismo tipo, eliminar (toggle off)
    IF v_existing_vote = p_vote_type THEN
        DELETE FROM public.review_votes
        WHERE review_id = p_review_id
            AND user_id = v_user_id;
        v_result := json_build_object('success', TRUE, 'message', 'Voto eliminado exitosamente', 'action', 'deleted');
    ELSE
        -- Insertar o actualizar voto (si es diferente tipo o no existe)
        INSERT INTO public.review_votes (review_id, user_id, vote_type)
            VALUES (p_review_id, v_user_id, p_vote_type)
        ON CONFLICT (review_id, user_id)
            DO UPDATE SET
                vote_type = p_vote_type;
        v_result := json_build_object('success', TRUE, 'message', 'Voto registrado exitosamente', 'action', CASE WHEN v_existing_vote IS NULL THEN
                'inserted'
            ELSE
                'updated'
            END);
    END IF;
    -- Logging exitoso
    PERFORM
        log_security_event ('vote_review', 'success', NULL, jsonb_build_object('review_id', p_review_id, 'vote_type', p_vote_type, 'action', v_result ->> 'action'));
    RETURN v_result;
EXCEPTION
    WHEN OTHERS THEN
        PERFORM
            log_security_event ('vote_review', 'error', SQLERRM);
            RETURN json_build_object('success', FALSE, 'error', 'Error interno del servidor');
END;

$$;

-- =============================================================================
-- REPORTES DE REVIEWS
-- =============================================================================

-- Función para reportar reviews
create or replace function report_review (
  p_review_id UUID,
  p_reason TEXT,
  p_description TEXT default null
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$ DECLARE v_user_id UUID;

v_report_id UUID;

v_existing_report UUID;

BEGIN
    -- Usuario autenticado (antes del rate limit para evitar fail-closed engañoso)
    v_user_id := auth.uid ();

    IF v_user_id IS NULL THEN
        PERFORM
            log_security_event ('report_review', 'error', 'Usuario no autenticado');

RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');

END IF;

    -- Verificar rate limit (3 reports por hora)
    IF NOT check_rate_limit ('report_review', 3, 60) THEN

RETURN json_build_object('success', FALSE, 'error', 'Demasiados reportes. Intenta más tarde.');

END IF;

-- Validar razón
IF p_reason IS NULL OR TRIM(p_reason) = '' THEN
    PERFORM
        log_security_event ('report_review', 'error', 'Razón del reporte obligatoria');

RETURN json_build_object('success', FALSE, 'error', 'La razón del reporte es obligatoria');

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        public.reviews_public
    WHERE
        id = p_review_id) THEN
PERFORM
    log_security_event ('report_review', 'error', 'Review not found or deleted');

RETURN json_build_object('success', FALSE, 'error', 'La reseña no existe o fue eliminada');

END IF;

-- M3: No permitir reportar la propia reseña
IF EXISTS (
    SELECT
        1
    FROM
        public.reviews_public
    WHERE
        id = p_review_id
        AND is_mine) THEN
PERFORM
    log_security_event ('report_review', 'blocked', 'Self-report attempt');

RETURN json_build_object('success', FALSE, 'error', 'No puedes reportar tu propia reseña');

END IF;

SELECT
    id INTO v_existing_report
FROM
    public.review_reports
WHERE
    review_id = p_review_id
    AND reported_by_user_id = v_user_id;

IF v_existing_report IS NOT NULL THEN
    PERFORM
        log_security_event ('report_review', 'blocked', 'Duplicate report attempt');

RETURN json_build_object('success', FALSE, 'error', 'Ya has reportado esta reseña anteriormente');

END IF;

INSERT INTO public.review_reports (review_id, reported_by_user_id, reason, description)
    VALUES (p_review_id, v_user_id, p_reason, p_description)
RETURNING
    id INTO v_report_id;

-- Logging exitoso
PERFORM
    log_security_event ('report_review', 'success', NULL, jsonb_build_object('report_id', v_report_id, 'review_id', p_review_id, 'reason', p_reason));

RETURN json_build_object('success', TRUE, 'report_id', v_report_id, 'message', 'Reporte enviado exitosamente');

EXCEPTION
    WHEN unique_violation THEN
        PERFORM
            log_security_event ('report_review', 'blocked', 'Unique violation');

            RETURN json_build_object('success', FALSE, 'error', 'Ya has reportado esta reseña anteriormente');

    WHEN OTHERS THEN
        PERFORM
            log_security_event ('report_review', 'error', SQLERRM);

            RETURN json_build_object('success', FALSE, 'error', 'Error interno del servidor');

END;

$$;

-- Función para verificar si usuario ya reportó una review
create or replace function has_user_reported_review (p_review_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY INVOKER
set search_path = public, pg_temp
as $$ DECLARE v_user_id UUID;

BEGIN
    v_user_id := auth.uid ();

    IF v_user_id IS NULL THEN
        RETURN FALSE;

        END IF;

        RETURN EXISTS (
            SELECT
                1
            FROM
                public.review_reports
            WHERE
                review_id = p_review_id
                AND reported_by_user_id = v_user_id);

END;

$$;

-- =============================================================================
-- RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Función para crear reseña de inmobiliaria
create or replace function create_real_estate_review (
  p_real_estate_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_rating INTEGER
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$ DECLARE v_review_id UUID;

        v_user_id UUID;

BEGIN
    v_user_id := auth.uid ();

    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');

        END IF;

        -- Verificar rate limit (5 reseñas por 60 minutos)
        IF NOT check_rate_limit ('create_real_estate_review', 5, 60) THEN
            RETURN json_build_object('success', FALSE, 'error', 'Has creado muchas reseñas. Intenta más tarde.');

            END IF;

            -- Validar título
            IF p_title IS NULL OR TRIM(p_title) = '' THEN
                RETURN json_build_object('success', FALSE, 'error', 'El título es obligatorio');

                END IF;

                -- Validar descripción
                IF p_description IS NULL OR TRIM(p_description) = '' THEN
                    RETURN json_build_object('success', FALSE, 'error', 'La descripción es obligatoria');

                    END IF;

                    -- Validar que la inmobiliaria existe
                    IF NOT EXISTS (
                        SELECT
                            1
                        FROM
                            public.real_estates_public
                        WHERE
                            id = p_real_estate_id) THEN
                    RETURN json_build_object('success', FALSE, 'error', 'La inmobiliaria no existe');

    END IF;

    -- Validar rating
    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN json_build_object('success', FALSE, 'error', 'El rating debe estar entre 1 y 5');

        END IF;

        -- Verificar si el usuario ya tiene una reseña para esta inmobiliaria
        IF EXISTS (
            SELECT
                1
            FROM
                public.real_estate_reviews_public
            WHERE
                real_estate_id = p_real_estate_id
                AND is_mine) THEN
        RETURN json_build_object('success', FALSE, 'error', 'Ya has escrito una reseña para esta inmobiliaria');

                END IF;

                -- Insertar la nueva reseña
                INSERT INTO public.real_estate_reviews (real_estate_id, user_id, title, description, rating)
                    VALUES (p_real_estate_id, v_user_id, p_title, p_description, p_rating)
                RETURNING
                    id INTO v_review_id;

RETURN json_build_object('success', TRUE, 'review_id', v_review_id, 'message', 'Reseña de inmobiliaria creada exitosamente');

EXCEPTION
    WHEN OTHERS THEN
        PERFORM log_security_event('create_real_estate_review', 'error', SQLERRM);
        RETURN json_build_object('success', FALSE, 'error', 'Error interno del servidor');

END;
$$;

-- =============================================================================
-- update_real_estate_review: actualizar reseña de inmobiliaria
-- SECURITY DEFINER porque UPDATE en PostgreSQL requiere SELECT (revocado en 007)
-- =============================================================================
create or replace function public.update_real_estate_review(
  p_review_id UUID,
  p_title TEXT default null,
  p_description TEXT default null,
  p_rating INTEGER default null
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
AS $$
DECLARE
  v_user_id UUID;
  v_is_mine boolean;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;
  IF NOT check_rate_limit('update_real_estate_review', 10, 60) THEN
    RETURN json_build_object('success', false, 'error', 'Límite de actualizaciones alcanzado');
  END IF;
  SELECT is_mine INTO v_is_mine
  FROM public.real_estate_reviews_public
  WHERE id = p_review_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'La reseña no existe');
  END IF;
  IF NOT v_is_mine THEN
    RETURN json_build_object('success', false, 'error', 'No tienes permisos para editar esta reseña');
  END IF;
  IF p_title IS NOT NULL AND char_length(trim(p_title)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'El título no puede estar vacío');
  END IF;
  IF p_description IS NOT NULL AND char_length(trim(p_description)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'La descripción no puede estar vacía');
  END IF;
  IF p_rating IS NOT NULL AND (p_rating < 1 OR p_rating > 5) THEN
    RETURN json_build_object('success', false, 'error', 'La calificación debe estar entre 1 y 5');
  END IF;
  UPDATE public.real_estate_reviews SET
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    rating = COALESCE(p_rating, rating),
    updated_at = now()
  WHERE id = p_review_id AND user_id = v_user_id;
  RETURN json_build_object('success', true, 'message', 'Reseña actualizada exitosamente');
EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event('update_real_estate_review', 'error', SQLERRM);
    RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$$;

-- =============================================================================
-- delete_real_estate_review_safe: soft delete de reseña de inmobiliaria
-- SECURITY DEFINER porque DELETE en PostgreSQL requiere SELECT (revocado en 007)
-- =============================================================================
create or replace function public.delete_real_estate_review_safe(p_review_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
AS $$
DECLARE
  v_user_id UUID;
  v_is_mine boolean;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;
  SELECT is_mine INTO v_is_mine
  FROM public.real_estate_reviews_public
  WHERE id = p_review_id;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'La reseña no existe');
  END IF;
  IF NOT v_is_mine THEN
    RETURN json_build_object('success', false, 'error', 'No tienes permisos para eliminar esta reseña');
  END IF;
  UPDATE public.real_estate_reviews SET deleted_at = now()
  WHERE id = p_review_id AND user_id = v_user_id;
  RETURN json_build_object('success', true, 'message', 'Reseña eliminada exitosamente');
EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event('delete_real_estate_review_safe', 'error', SQLERRM);
    RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$$;

-- Función para votar reseñas de inmobiliarias
create or replace function vote_real_estate_review (p_real_estate_review_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$
DECLARE
    v_user_id uuid;
    v_existing_vote text;
BEGIN
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');
    END IF;
    -- Verificar rate limit (30 votos por 10 minutos)
    IF NOT check_rate_limit ('vote_real_estate_review', 30, 10) THEN
        RETURN json_build_object('success', FALSE, 'error', 'Has votado demasiado rápido. Intenta más tarde.');
    END IF;
    -- Verificar que la reseña existe y está activa (Fix)
    IF NOT EXISTS (
        SELECT 1 FROM public.real_estate_reviews_public
        WHERE id = p_real_estate_review_id
    ) THEN
        RETURN json_build_object('success', FALSE, 'error', 'La reseña no existe o fue eliminada');
    END IF;
    -- M4: No permitir votar la propia reseña
    IF EXISTS (
        SELECT 1 FROM public.real_estate_reviews_public
        WHERE id = p_real_estate_review_id AND is_mine
    ) THEN
        RETURN json_build_object('success', FALSE, 'error', 'No puedes votar tu propia reseña');
    END IF;
    IF p_vote_type NOT IN ('like', 'dislike') THEN
        RETURN json_build_object('success', FALSE, 'error', 'Tipo de voto inválido');
    END IF;
    -- Verificar si ya existe un voto
    SELECT
        vote_type INTO v_existing_vote
    FROM
        public.real_estate_review_votes
    WHERE
        real_estate_review_id = p_real_estate_review_id
        AND user_id = v_user_id;
    -- Si el voto es el mismo, eliminarlo (toggle)
    IF v_existing_vote = p_vote_type THEN
        DELETE FROM public.real_estate_review_votes
        WHERE real_estate_review_id = p_real_estate_review_id
            AND user_id = v_user_id;
        PERFORM log_security_event('vote_real_estate_review', 'success', NULL, jsonb_build_object('real_estate_review_id', p_real_estate_review_id, 'vote_type', p_vote_type, 'action', 'deleted'));
        RETURN json_build_object('success', TRUE, 'message', 'Voto eliminado exitosamente', 'action', 'deleted');
    END IF;
    -- Insertar o actualizar el voto
    INSERT INTO public.real_estate_review_votes (real_estate_review_id, user_id, vote_type)
        VALUES (p_real_estate_review_id, v_user_id, p_vote_type)
    ON CONFLICT (real_estate_review_id, user_id)
        DO UPDATE SET
            vote_type = p_vote_type,
            updated_at = now();
    PERFORM log_security_event('vote_real_estate_review', 'success', NULL, jsonb_build_object('real_estate_review_id', p_real_estate_review_id, 'vote_type', p_vote_type, 'action', CASE WHEN v_existing_vote IS NULL THEN 'inserted' ELSE 'updated' END));
    RETURN json_build_object('success', TRUE, 'message', 'Voto registrado exitosamente', 'action', CASE WHEN v_existing_vote IS NULL THEN 'inserted' ELSE 'updated' END);
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', 'Error interno del servidor');
END;

$$;

-- Función para reportar reseñas de inmobiliarias
create or replace function report_real_estate_review (
  p_real_estate_review_id uuid,
  p_reason text,
  p_description text default null
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$
DECLARE
    v_user_id uuid;
    v_report_id uuid;
BEGIN
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');
    END IF;
    -- Verificar rate limit (3 reportes por 60 minutos)
    IF NOT check_rate_limit ('report_real_estate_review', 3, 60) THEN
        RETURN json_build_object('success', FALSE, 'error', 'Has reportado demasiadas reseñas. Intenta más tarde.');
    END IF;
    -- Validar razón
    IF p_reason IS NULL OR TRIM(p_reason) = '' THEN
        RETURN json_build_object('success', FALSE, 'error', 'La razón del reporte es obligatoria');
    END IF;
    -- Validar que review existe
    IF NOT EXISTS (
        SELECT
            1
        FROM
            public.real_estate_reviews_public
        WHERE
            id = p_real_estate_review_id) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Reseña no encontrada');
END IF;
    -- Validar que usuario no reporta propia reseña
    IF EXISTS (
        SELECT
            1
        FROM
            public.real_estate_reviews_public
        WHERE
            id = p_real_estate_review_id
            AND is_mine) THEN
    RETURN json_build_object('success', FALSE, 'error', 'No puedes reportar tu propia reseña');
END IF;
-- Verificar reporte duplicado
IF EXISTS (
    SELECT 1 FROM public.real_estate_review_reports
    WHERE real_estate_review_id = p_real_estate_review_id
      AND reported_by_user_id = v_user_id
) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Ya has reportado esta reseña anteriormente');
END IF;

INSERT INTO public.real_estate_review_reports (real_estate_review_id, reported_by_user_id, reason, description)
    VALUES (p_real_estate_review_id, v_user_id, p_reason, p_description)
    RETURNING
        id INTO v_report_id;
    RETURN json_build_object('success', TRUE, 'report_id', v_report_id, 'message', 'Reporte enviado exitosamente');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', 'Error interno del servidor');
END;

$$;

-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI USUARIO YA REPORTÓ UNA RESEÑA DE INMOBILIARIA
-- =============================================================================
create or replace function public.has_user_reported_real_estate_review (p_review_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY INVOKER
set search_path = public, pg_temp
as $$ DECLARE v_user_id UUID;

BEGIN
    v_user_id := auth.uid ();

IF v_user_id IS NULL THEN
    RETURN FALSE;

END IF;

RETURN EXISTS (
    SELECT
        1
    FROM
        public.real_estate_review_reports
    WHERE
        real_estate_review_id = p_review_id
        AND reported_by_user_id = v_user_id);

END;

$$;

-- =============================================================================
-- FUNCIONES PARA INMOBILIARIAS
-- =============================================================================

-- Función para crear inmobiliaria
create or replace function create_real_estate (p_name text, p_description text default null) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$ DECLARE v_user_id uuid;

v_real_estate_id uuid;

BEGIN
v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Usuario no autenticado'
);

END IF;

-- Verificar rate limit (10 inmobiliarias por 60 minutos)
IF NOT check_rate_limit ('create_real_estate', 10, 60) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Has creado demasiadas inmobiliarias. Intenta más tarde.'
);

END IF;

-- Validar nombre
IF p_name IS NULL
OR p_name = '' THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'El nombre es obligatorio'
);

END IF;

-- Insertar la inmobiliaria
INSERT INTO
    public.real_estates (name, description, created_by)
VALUES
    (p_name, p_description, v_user_id) RETURNING id INTO v_real_estate_id;

RETURN json_build_object(
    'success',
    TRUE,
    'message',
    'Inmobiliaria creada exitosamente',
    'id',
    v_real_estate_id
);

EXCEPTION
WHEN unique_violation THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Ya existe una inmobiliaria con ese nombre'
);

WHEN OTHERS THEN
    PERFORM log_security_event('create_real_estate', 'error', SQLERRM);
    RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Error interno del servidor'
);

END;

$function$;

-- =============================================================================
-- VOTOS DE INMOBILIARIAS
-- =============================================================================

-- Función para votar inmobiliarias (simplificada - contadores se calculan con SELECT)
create or replace function vote_real_estate (p_real_estate_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$ DECLARE v_user_id uuid;

v_existing_vote text;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Usuario no autenticado'
);

END IF;

-- Verificar rate limit (30 votos por 10 minutos)
IF NOT check_rate_limit ('vote_real_estate', 30, 10) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Has votado demasiado rápido. Intenta más tarde.'
);

END IF;

IF p_vote_type NOT IN ('like', 'dislike') THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Tipo de voto inválido'
);

END IF;

-- Verificar que la inmobiliaria existe y está activa (Fix)
IF NOT EXISTS (
    SELECT 1 FROM public.real_estates_public
    WHERE id = p_real_estate_id
) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'La inmobiliaria no existe o fue eliminada'
);

END IF;

-- M4: No permitir votar la propia inmobiliaria
IF EXISTS (
    SELECT 1 FROM public.real_estates_public
    WHERE id = p_real_estate_id AND is_mine
) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'No puedes votar tu propia inmobiliaria'
);

END IF;

-- Verificar si ya existe un voto
SELECT
    vote_type INTO v_existing_vote
FROM
    public.real_estate_votes
WHERE
    real_estate_id = p_real_estate_id
    AND user_id = v_user_id;

-- Si el voto es el mismo, eliminarlo (toggle)
IF v_existing_vote = p_vote_type THEN
DELETE FROM
    public.real_estate_votes
WHERE
    real_estate_id = p_real_estate_id
    AND user_id = v_user_id;

RETURN json_build_object(
    'success',
    TRUE,
    'message',
    'Voto eliminado exitosamente',
    'action',
    'removed'
);

END IF;

-- Si existe un voto diferente, actualizarlo
IF v_existing_vote IS NOT NULL THEN
UPDATE
    public.real_estate_votes
SET
    vote_type = p_vote_type,
    updated_at = NOW()
WHERE
    real_estate_id = p_real_estate_id
    AND user_id = v_user_id;

RETURN json_build_object(
    'success',
    TRUE,
    'message',
    'Voto actualizado exitosamente',
    'action',
    'updated'
);

END IF;

-- Es un voto nuevo, insertarlo
INSERT INTO
    public.real_estate_votes(real_estate_id, user_id, vote_type)
VALUES
    (p_real_estate_id, v_user_id, p_vote_type);

RETURN json_build_object(
    'success',
    TRUE,
    'message',
    'Voto registrado exitosamente',
    'action',
    'created'
);

EXCEPTION
WHEN OTHERS THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Error interno del servidor'
);

END;

$$;

-- =============================================================================
-- REPORTES DE INMOBILIARIAS
-- =============================================================================

-- Función para reportar inmobiliarias
create or replace function report_real_estate (
  p_real_estate_id UUID,
  p_reason TEXT,
  p_description TEXT default null
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$ DECLARE v_user_id UUID;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Usuario no autenticado'
);

END IF;

-- Verificar rate limit (3 reportes por 60 minutos)
IF NOT check_rate_limit ('report_real_estate', 3, 60) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Has reportado demasiadas inmobiliarias. Intenta más tarde.'
);

END IF;

-- Validar razón
IF p_reason IS NULL
OR TRIM(p_reason) = '' THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'La razón del reporte es obligatoria'
);

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        public.real_estates_public
    WHERE
        id = p_real_estate_id
) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'La inmobiliaria no existe'
);

END IF;

-- M3: No permitir reportar la propia inmobiliaria
IF EXISTS (
    SELECT
        1
    FROM
        public.real_estates_public
    WHERE
        id = p_real_estate_id
        AND is_mine
) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'No puedes reportar tu propia inmobiliaria'
);

END IF;

-- Verificar reporte duplicado
IF EXISTS (
    SELECT
        1
    FROM
        public.real_estate_reports
    WHERE
        real_estate_id = p_real_estate_id
        AND reported_by_user_id = v_user_id
) THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Ya has reportado esta inmobiliaria anteriormente'
);

END IF;

INSERT INTO
    public.real_estate_reports (
        real_estate_id,
        reported_by_user_id,
        reason,
        description
    )
VALUES
    (
        p_real_estate_id,
        v_user_id,
        p_reason,
        p_description
    );

RETURN json_build_object(
    'success',
    TRUE,
    'message',
    'Reporte enviado exitosamente'
);

EXCEPTION
WHEN OTHERS THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Error interno del servidor'
);

END;

$$;

-- Función para verificar si usuario ya reportó una inmobiliaria
create or replace function has_user_reported_real_estate (p_real_estate_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER
set search_path = public, pg_temp
as $$ DECLARE v_user_id uuid;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN FALSE;

END IF;

RETURN EXISTS (
    SELECT
        1
    FROM
        public.real_estate_reports
    WHERE
        real_estate_id = p_real_estate_id
        AND reported_by_user_id = v_user_id
);

END;

$$;

-- =============================================================================
-- FAVORITOS DE INMOBILIARIAS
-- =============================================================================

create or replace function toggle_favorite_real_estate (p_real_estate_id uuid) RETURNS public.toggle_favorite_result LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$ DECLARE v_user_id uuid;

result public.toggle_favorite_result;

BEGIN v_user_id := auth.uid();

IF v_user_id IS NULL THEN result.success := false;

result.error := 'Usuario no autenticado';

RETURN result;

END IF;

-- Rate limit (30 favoritos por 10 minutos)
IF NOT check_rate_limit ('toggle_favorite_real_estate', 30, 10) THEN result.success := false;

result.error := 'Demasiados cambios de favorito. Intenta más tarde.';

RETURN result;

END IF;

-- Verificar que la inmobiliaria existe y está activa (Fix)
IF NOT EXISTS (
    SELECT 1 FROM public.real_estates_public
    WHERE id = p_real_estate_id
) THEN
result.success := false;

result.error := 'La inmobiliaria no existe o fue eliminada';

RETURN result;

END IF;

-- M-S2: No permitir favoritar la propia inmobiliaria
IF EXISTS (
    SELECT 1 FROM public.real_estates_public
    WHERE id = p_real_estate_id AND is_mine
) THEN
result.success := false;

result.error := 'No puedes favoritar tu propia inmobiliaria';

RETURN result;

END IF;

IF EXISTS (
    SELECT
        1
    FROM
        public.real_estate_favorites
    WHERE
        real_estate_id = p_real_estate_id
        AND user_id = v_user_id
) THEN
DELETE FROM
    public.real_estate_favorites
WHERE
    real_estate_id = p_real_estate_id
    AND user_id = v_user_id;

result.success := true;

result.is_favorite := false;

result.message := 'Eliminado de favoritos';

ELSE
INSERT INTO
    public.real_estate_favorites(real_estate_id, user_id)
VALUES
    (p_real_estate_id, v_user_id);

result.success := true;

result.is_favorite := true;

result.message := 'Agregado a favoritos';

END IF;

RETURN result;

END;

$$;

-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI UNA INMOBILIARIA ES FAVORITA
-- =============================================================================
create or replace function is_real_estate_favorite (p_real_estate_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER
set search_path = public, pg_temp
as $$ DECLARE v_user_id uuid;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN FALSE;

END IF;

RETURN EXISTS (
    SELECT
        1
    FROM
        public.real_estate_favorites
    WHERE
        real_estate_id = p_real_estate_id
        AND user_id = v_user_id
);

END;

$$;

-- =============================================================================
-- FUNCIONES DE CONSULTA (VOTOS, REVIEWS, FAVORITOS)
-- =============================================================================

-- Función para saber el voto del usuario sobre una real estate
create or replace function public.get_user_real_estate_vote (p_real_estate_id uuid) returns text language sql stable security invoker
set search_path = public, pg_temp
as $$
  select vote_type
  from public.real_estate_votes
  where real_estate_id = p_real_estate_id
    and user_id = auth.uid()
  limit 1;
$$;

-- Función para saber el voto del usuario sobre una review
create or replace function public.get_user_review_vote (p_review_id uuid) returns text language sql stable security invoker
set search_path = public, pg_temp
as $$
select vote_type from public.review_votes
  where review_id = p_review_id and user_id = auth.uid()
  limit 1;
$$;

-- Función para saber el voto del usuario sobre una reseña de inmobiliaria
create or replace function public.get_user_vote_on_real_estate_review (p_real_estate_review_id uuid) returns text language sql stable security invoker
set search_path = public, pg_temp
as $$
  select vote_type from public.real_estate_review_votes
    where real_estate_review_id = p_real_estate_review_id and user_id = auth.uid()
    limit 1;
$$;

comment on function public.get_user_vote_on_real_estate_review is 'Obtiene el voto del usuario autenticado en una reseña de inmobiliaria';

-- =============================================================================
-- FUNCIONES DE FAVORITOS DE RESEÑAS
-- =============================================================================

-- Función para agregar / quitar favorito de reseña (toggle)
create or replace function toggle_favorite_review (p_review_id uuid) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $$ DECLARE v_user_id uuid;

v_favorite_exists boolean;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Usuario no autenticado'
);

END IF;

-- Rate limit (30 favoritos por 10 minutos)
IF NOT check_rate_limit ('toggle_favorite_review', 30, 10) THEN
    RETURN json_build_object(
        'success',
        FALSE,
        'error',
        'Demasiados cambios de favorito. Intenta más tarde.'
    );
END IF;

-- Verificar que la reseña existe y está activa (Fix)
IF NOT EXISTS (
    SELECT 1 FROM public.reviews_public
    WHERE id = p_review_id
) THEN
RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'La reseña no existe o fue eliminada'
);

END IF;

-- M-S2: No permitir favoritar la propia reseña
IF EXISTS (
    SELECT 1 FROM public.reviews_public
    WHERE id = p_review_id AND is_mine
) THEN
RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'No puedes favoritar tu propia reseña'
);

END IF;

-- Verificar si ya existe en favoritos
SELECT
    EXISTS (
        SELECT
            1
        FROM
            public.review_favorites
        WHERE
            review_id = p_review_id
            AND user_id = v_user_id
    ) INTO v_favorite_exists;

-- Si existe, eliminarlo
IF v_favorite_exists THEN
DELETE FROM
    public.review_favorites
WHERE
    review_id = p_review_id
    AND user_id = v_user_id;

RETURN json_build_object(
    'success',
    TRUE,
    'is_favorite',
    FALSE,
    'message',
    'Eliminado de favoritos'
);

ELSE -- Si NO existe, agregarlo
INSERT INTO
    public.review_favorites (review_id, user_id)
VALUES
    (p_review_id, v_user_id);

RETURN json_build_object(
    'success',
    TRUE,
    'is_favorite',
    TRUE,
    'message',
    'Agregado a favoritos'
);

END IF;

EXCEPTION
WHEN OTHERS THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Error interno del servidor'
);

END;

$$;

-- Función para verificar si una reseña es favorita
create or replace function is_review_favorite (p_review_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER
set search_path = public, pg_temp
as $$ DECLARE v_user_id uuid;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN FALSE;

END IF;

RETURN EXISTS (
    SELECT
        1
    FROM
        public.review_favorites
    WHERE
        review_id = p_review_id
        AND user_id = v_user_id
);

END;

$$;

-- =============================================================================
-- 7b. create_review (versión final from 017)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.create_review (
  p_title text,
  p_description text,
  p_rating integer,
  p_address_text text,
  p_address_osm_id text,
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_real_estate_id uuid default null,
  p_property_type text default null,
  p_zone_rating integer default null,
  p_winter_comfort text default null,
  p_summer_comfort text default null,
  p_humidity text default null,
  p_real_estate_experience text default null,
  p_apartment_number text default null,
  p_review_rooms jsonb default null
) RETURNS public.create_review_result LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
AS $function$
DECLARE
  v_review_id UUID;
  v_user_id UUID;
  v_room_count INTEGER := 0;
BEGIN
  -- Usuario autenticado
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    PERFORM log_security_event('create_review', 'error', 'Usuario no autenticado');
    RETURN (false, NULL :: uuid, NULL :: text,
      'Usuario no autenticado. Debes iniciar sesión para crear una reseña.' :: text);
  END IF;

  -- Verificar rate limit (5 reseñas por 10 minutos)
  IF NOT check_rate_limit('create_review', 5, 10) THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'Demasiadas reseñas. Intenta más tarde.' :: text);
  END IF;

  -- Validaciones obligatorias
  IF p_title IS NULL OR btrim(p_title) = '' THEN
    PERFORM log_security_event('create_review', 'error', 'Título obligatorio faltante');
    RETURN (false, NULL :: uuid, NULL :: text, 'El título es obligatorio' :: text);
  END IF;

  IF p_description IS NULL OR btrim(p_description) = '' THEN
    PERFORM log_security_event('create_review', 'error', 'Descripción obligatoria faltante');
    RETURN (false, NULL :: uuid, NULL :: text, 'La descripción es obligatoria' :: text);
  END IF;

  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    PERFORM log_security_event('create_review', 'error', 'Rating inválido');
    RETURN (false, NULL :: uuid, NULL :: text, 'El rating debe estar entre 1 y 5' :: text);
  END IF;

  IF p_address_text IS NULL OR btrim(p_address_text) = '' THEN
    PERFORM log_security_event('create_review', 'error', 'address_text requerido');
    RETURN (false, NULL :: uuid, NULL :: text, 'La dirección (address_text) es obligatoria' :: text);
  END IF;

  IF p_address_osm_id IS NULL OR btrim(p_address_osm_id) = '' THEN
    PERFORM log_security_event('create_review', 'error', 'address_osm_id requerido');
    RETURN (false, NULL :: uuid, NULL :: text, 'El OSM ID (address_osm_id) es obligatorio' :: text);
  END IF;

  IF p_latitude IS NULL OR p_longitude IS NULL THEN
    PERFORM log_security_event('create_review', 'error', 'Coordenadas requeridas');
    RETURN (false, NULL :: uuid, NULL :: text, 'Latitud y longitud son obligatorias' :: text);
  END IF;

  -- P1: Validar enums y longitudes antes de los CHECK constraints de la tabla
  IF char_length(p_title) > 200 THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'El título supera los 200 caracteres' :: text);
  END IF;

  IF char_length(p_description) > 800 THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'La descripción supera los 800 caracteres' :: text);
  END IF;

  IF p_property_type IS NOT NULL
    AND p_property_type NOT IN ('apartment', 'house', 'room') THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'property_type inválido' :: text);
  END IF;

  IF p_zone_rating IS NOT NULL AND (p_zone_rating < 1 OR p_zone_rating > 5) THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'zone_rating debe estar entre 1 y 5' :: text);
  END IF;

  IF p_winter_comfort IS NOT NULL
    AND p_winter_comfort NOT IN ('hot', 'comfortable', 'cold') THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'winter_comfort inválido' :: text);
  END IF;

  IF p_summer_comfort IS NOT NULL
    AND p_summer_comfort NOT IN ('hot', 'comfortable', 'cold') THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'summer_comfort inválido' :: text);
  END IF;

  IF p_humidity IS NOT NULL AND p_humidity NOT IN ('high', 'normal', 'low') THEN
    RETURN (false, NULL :: uuid, NULL :: text, 'humidity inválido' :: text);
  END IF;

  -- Normalizar campos opcionales vacíos a NULL
  IF p_property_type IS NOT NULL AND btrim(p_property_type) = '' THEN
    p_property_type := NULL;
  END IF;

  IF p_winter_comfort IS NOT NULL AND btrim(p_winter_comfort) = '' THEN
    p_winter_comfort := NULL;
  END IF;

  IF p_summer_comfort IS NOT NULL AND btrim(p_summer_comfort) = '' THEN
    p_summer_comfort := NULL;
  END IF;

  IF p_humidity IS NOT NULL AND btrim(p_humidity) = '' THEN
    p_humidity := NULL;
  END IF;

  IF p_real_estate_experience IS NOT NULL AND btrim(p_real_estate_experience) = '' THEN
    p_real_estate_experience := NULL;
  END IF;

  IF p_apartment_number IS NOT NULL AND btrim(p_apartment_number) = '' THEN
    p_apartment_number := NULL;
  END IF;

  -- S3: Validar que la inmobiliaria exista y esté activa
  IF p_real_estate_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.real_estates_public
    WHERE id = p_real_estate_id
  ) THEN
    PERFORM log_security_event('create_review', 'error', 'Inmobiliaria inexistente o eliminada');
    RETURN (false, NULL :: uuid, NULL :: text,
      'La inmobiliaria no existe o fue eliminada' :: text);
  END IF;

  -- =========================================================================
  -- Verificación de duplicados (CONDICIONAL según property_type)
  -- =========================================================================
  IF p_property_type IN ('house', 'room') THEN
    -- CASAS / HABITACIONES: 1 reseña por usuario por dirección OSM
    -- No importa el apartment_number.
    IF EXISTS (
      SELECT 1 FROM public.reviews_public
      WHERE is_mine AND address_osm_id = p_address_osm_id
    ) THEN
      PERFORM log_security_event('create_review', 'blocked',
        'Duplicate review attempt (house/room - same address)');
      RETURN (false, NULL :: uuid, NULL :: text,
        'Ya has publicado una reseña para esta dirección. Solo puedes escribir una reseña por propiedad.' :: text);
    END IF;
  ELSE
    -- EDIFICIOS (apartment o property_type NULL):
    -- 1 reseña por usuario por dirección OSM + apartment_number.
    -- COALESCE unifica NULL y '' en '__general__' para que el índice funcione.
    IF EXISTS (
      SELECT 1 FROM public.reviews_public
      WHERE is_mine
        AND address_osm_id = p_address_osm_id
        AND COALESCE(apartment_number, '__general__') = COALESCE(p_apartment_number, '__general__')
    ) THEN
      PERFORM log_security_event('create_review', 'blocked',
        'Duplicate review attempt (apartment - same address + apartment_number)');
      RETURN (false, NULL :: uuid, NULL :: text,
        'Ya has publicado una reseña para este apartamento en esta dirección.' :: text);
    END IF;
  END IF;

  -- Fix V2: validar review_rooms ANTES del INSERT de la reseña. Las validaciones
  -- originales estaban después, y un RETURN (false,...) no hace rollback: la reseña
  -- quedaba persistida mientras el cliente recibía error (estado parcial).
  IF p_review_rooms IS NOT NULL THEN
    IF jsonb_typeof(p_review_rooms) <> 'array' THEN
      RETURN (false, NULL :: uuid, NULL :: text, 'review_rooms debe ser un arreglo JSON' :: text);
    END IF;

    IF jsonb_array_length(p_review_rooms) > 10 THEN
      RETURN (false, NULL :: uuid, NULL :: text, 'Máximo 10 habitaciones por reseña' :: text);
    END IF;
  END IF;

  -- Insertar reseña
  INSERT INTO public.reviews (
    user_id, title, description, rating, real_estate_id, property_type,
    address_text, address_osm_id, latitude, longitude, zone_rating,
    winter_comfort, summer_comfort, humidity, real_estate_experience,
    apartment_number
  ) VALUES (
    v_user_id, p_title, p_description, p_rating, p_real_estate_id, p_property_type,
    p_address_text, p_address_osm_id, p_latitude, p_longitude, p_zone_rating,
    p_winter_comfort, p_summer_comfort, p_humidity, p_real_estate_experience,
    p_apartment_number
  ) RETURNING id INTO v_review_id;

  -- Insertar habitaciones asociadas de forma atómica
  -- (Fix V2: la validación de tipo y tope se movió antes del INSERT de la reseña)
  IF p_review_rooms IS NOT NULL THEN
    IF jsonb_array_length(p_review_rooms) > 0 THEN
      INSERT INTO public.review_rooms (review_id, room_type, area_m2)
      SELECT
        v_review_id,
        NULLIF(btrim(room ->> 'room_type'), '') :: text,
        CASE
          WHEN room ? 'area_m2' AND room ->> 'area_m2' IS NOT NULL AND btrim(room ->> 'area_m2') <> ''
            THEN (room ->> 'area_m2') :: numeric
          ELSE NULL
        END
      FROM jsonb_array_elements(p_review_rooms) AS room;

      GET DIAGNOSTICS v_room_count = ROW_COUNT;
    END IF;
  END IF;

  -- Log exitoso
  PERFORM log_security_event('create_review', 'success', NULL,
    jsonb_build_object('review_id', v_review_id));

  RETURN (
    true,
    v_review_id,
    CASE
      WHEN v_room_count > 0 THEN 'Reseña creada exitosamente con ' || v_room_count || ' habitaciones'
      ELSE 'Reseña creada exitosamente'
    END,
    NULL :: text
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN (false, NULL :: uuid, NULL :: text,
      'Ya has publicado una reseña para esta dirección o apartamento.' :: text);
  WHEN OTHERS THEN
    PERFORM log_security_event('create_review', 'error', SQLERRM);
    RETURN (false, NULL :: uuid, NULL :: text, 'Error interno del servidor' :: text);
END;
$function$;

-- =============================================================================
-- 7c. update_review (versión final from 017)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_review(
  p_review_id UUID,
  p_title TEXT default null,
  p_description TEXT default null,
  p_rating INTEGER default null,
  p_property_type TEXT default null,
  p_address_text TEXT default null,
  p_address_osm_id TEXT default null,
  p_latitude NUMERIC default null,
  p_longitude NUMERIC default null,
  p_zone_rating INTEGER default null,
  p_winter_comfort TEXT default null,
  p_summer_comfort TEXT default null,
  p_humidity TEXT default null,
  p_real_estate_id UUID default null,
  p_real_estate_experience TEXT default null,
  p_apartment_number TEXT default null,
  p_review_rooms JSONB default null
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
AS $function$
DECLARE
  v_user_id UUID;
  v_is_mine boolean;
BEGIN
  -- 1. Autenticación
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;

  -- 2. Rate limiting: máx 10 actualizaciones por hora
  IF NOT check_rate_limit('update_review', 10, 60) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Límite de actualizaciones alcanzado. Intenta nuevamente en una hora.'
    );
  END IF;

  -- 3. Verificar existencia y ownership
  SELECT is_mine INTO v_is_mine
  FROM public.reviews_public
  WHERE id = p_review_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'La reseña no existe');
  END IF;

  IF NOT v_is_mine THEN
    RETURN json_build_object('success', false, 'error', 'No tienes permisos para editar esta reseña');
  END IF;

  -- 4. Validación de campos (solo si fueron provistos)
  IF p_title IS NOT NULL AND char_length(trim(p_title)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'El título no puede estar vacío');
  END IF;

  IF p_description IS NOT NULL AND char_length(trim(p_description)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'La descripción no puede estar vacía');
  END IF;

  IF p_rating IS NOT NULL AND (p_rating < 1 OR p_rating > 5) THEN
    RETURN json_build_object('success', false, 'error', 'La calificación debe estar entre 1 y 5');
  END IF;

  -- P1: Validar enums y longitudes antes de los CHECK constraints de la tabla
  IF p_title IS NOT NULL AND char_length(p_title) > 200 THEN
    RETURN json_build_object('success', false, 'error', 'El título supera los 200 caracteres');
  END IF;

  IF p_description IS NOT NULL AND char_length(p_description) > 800 THEN
    RETURN json_build_object('success', false, 'error', 'La descripción supera los 800 caracteres');
  END IF;

  IF p_property_type IS NOT NULL
    AND p_property_type NOT IN ('apartment', 'house', 'room') THEN
    RETURN json_build_object('success', false, 'error', 'property_type inválido');
  END IF;

  IF p_zone_rating IS NOT NULL AND (p_zone_rating < 1 OR p_zone_rating > 5) THEN
    RETURN json_build_object('success', false, 'error', 'zone_rating debe estar entre 1 y 5');
  END IF;

  IF p_winter_comfort IS NOT NULL
    AND p_winter_comfort NOT IN ('hot', 'comfortable', 'cold') THEN
    RETURN json_build_object('success', false, 'error', 'winter_comfort inválido');
  END IF;

  IF p_summer_comfort IS NOT NULL
    AND p_summer_comfort NOT IN ('hot', 'comfortable', 'cold') THEN
    RETURN json_build_object('success', false, 'error', 'summer_comfort inválido');
  END IF;

  IF p_humidity IS NOT NULL AND p_humidity NOT IN ('high', 'normal', 'low') THEN
    RETURN json_build_object('success', false, 'error', 'humidity inválido');
  END IF;

  -- 5. Normalizar campos opcionales vacíos a NULL (consistencia con create_review)
  IF p_property_type IS NOT NULL AND btrim(p_property_type) = '' THEN
    p_property_type := NULL;
  END IF;

  IF p_apartment_number IS NOT NULL AND btrim(p_apartment_number) = '' THEN
    p_apartment_number := NULL;
  END IF;

  IF p_winter_comfort IS NOT NULL AND btrim(p_winter_comfort) = '' THEN
    p_winter_comfort := NULL;
  END IF;

  IF p_summer_comfort IS NOT NULL AND btrim(p_summer_comfort) = '' THEN
    p_summer_comfort := NULL;
  END IF;

  IF p_humidity IS NOT NULL AND btrim(p_humidity) = '' THEN
    p_humidity := NULL;
  END IF;

  IF p_real_estate_experience IS NOT NULL AND btrim(p_real_estate_experience) = '' THEN
    p_real_estate_experience := NULL;
  END IF;

  -- S3: Validar que la inmobiliaria exista y esté activa
  IF p_real_estate_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.real_estates_public
    WHERE id = p_real_estate_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'La inmobiliaria no existe o fue eliminada');
  END IF;

  -- P2: Revalidar unicidad de dirección (misma regla que create_review).
  -- La review actual se excluye via id != p_review_id.
  IF p_address_osm_id IS NOT NULL THEN
    IF p_property_type IN ('house', 'room')
      OR (p_property_type IS NULL AND EXISTS (
        SELECT 1 FROM public.reviews_public WHERE id = p_review_id AND property_type IN ('house', 'room')
      )) THEN
      IF EXISTS (
        SELECT 1 FROM public.reviews_public
        WHERE is_mine AND address_osm_id = p_address_osm_id AND id != p_review_id
      ) THEN
        RETURN json_build_object('success', false, 'error',
          'Ya has publicado una reseña para esta dirección. Solo puedes escribir una por propiedad.');
      END IF;
    ELSE
      IF EXISTS (
        SELECT 1 FROM public.reviews_public
        WHERE is_mine
          AND address_osm_id = p_address_osm_id
          AND id != p_review_id
          AND COALESCE(apartment_number, '__general__') = COALESCE(p_apartment_number, '__general__')
      ) THEN
        RETURN json_build_object('success', false, 'error',
          'Ya has publicado una reseña para este apartamento en esta dirección.');
      END IF;
    END IF;
  END IF;

  -- 5b. Reemplazo atómico de rooms (Fix). La app pasa p_review_rooms por la RPC
  -- en vez de escribir review_rooms por REST. NULL = no tocar rooms; array
  -- (incluso vacío) = reemplaza todos. Atómico con el UPDATE de la review.
  IF p_review_rooms IS NOT NULL THEN
    IF jsonb_typeof(p_review_rooms) <> 'array' THEN
      RETURN json_build_object('success', false, 'error', 'review_rooms debe ser un arreglo JSON');
    END IF;

    IF jsonb_array_length(p_review_rooms) > 10 THEN
      RETURN json_build_object('success', false, 'error', 'Máximo 10 habitaciones por reseña');
    END IF;

    DELETE FROM public.review_rooms WHERE review_id = p_review_id;

    IF jsonb_array_length(p_review_rooms) > 0 THEN
      INSERT INTO public.review_rooms (review_id, room_type, area_m2)
      SELECT
        p_review_id,
        NULLIF(btrim(room ->> 'room_type'), '') :: text,
        CASE
          WHEN room ? 'area_m2' AND room ->> 'area_m2' IS NOT NULL AND btrim(room ->> 'area_m2') <> ''
            THEN (room ->> 'area_m2') :: numeric
          ELSE NULL
        END
      FROM jsonb_array_elements(p_review_rooms) AS room;
    END IF;
  END IF;

  -- 6. Actualización (COALESCE mantiene valores existentes si el parámetro es NULL)
  UPDATE public.reviews SET
    title = COALESCE(p_title, title),
    description = COALESCE(p_description, description),
    rating = COALESCE(p_rating, rating),
    property_type = COALESCE(p_property_type, property_type),
    address_text = COALESCE(p_address_text, address_text),
    address_osm_id = COALESCE(p_address_osm_id, address_osm_id),
    latitude = COALESCE(p_latitude, latitude),
    longitude = COALESCE(p_longitude, longitude),
    zone_rating = COALESCE(p_zone_rating, zone_rating),
    winter_comfort = COALESCE(p_winter_comfort, winter_comfort),
    summer_comfort = COALESCE(p_summer_comfort, summer_comfort),
    humidity = COALESCE(p_humidity, humidity),
    real_estate_id = COALESCE(p_real_estate_id, real_estate_id),
    real_estate_experience = COALESCE(p_real_estate_experience, real_estate_experience),
    apartment_number = COALESCE(p_apartment_number, apartment_number),
    updated_at = now()
  WHERE id = p_review_id AND user_id = v_user_id;

  RETURN json_build_object('success', true, 'message', 'Reseña actualizada exitosamente');

EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event('update_review', 'error', SQLERRM);
    RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$function$;

-- =============================================================================
-- 7d. check_user_review_for_address (versión final from 017)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.check_user_review_for_address (
  p_osm_id text,
  p_property_type text default null,
  p_apartment_number text default null
) RETURNS uuid LANGUAGE plpgsql stable security invoker
set search_path = public, pg_temp
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  IF p_property_type IN ('house', 'room') THEN
    SELECT id INTO v_id FROM public.reviews_public
      WHERE is_mine AND address_osm_id = p_osm_id
      LIMIT 1;
  ELSE
    SELECT id INTO v_id FROM public.reviews_public
      WHERE is_mine
        AND address_osm_id = p_osm_id
        AND COALESCE(apartment_number, '__general__') = COALESCE(p_apartment_number, '__general__')
      LIMIT 1;
  END IF;

  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.check_user_review_for_address(text, text, text) IS
  'Verifica si el usuario autenticado ya tiene una reseña para una dirección. '
  'Para house/room: busca cualquier reseña en la dirección. '
  'Para apartment: busca por dirección + apartment_number específico.';
-- =============================================================================
-- MIGRACIÓN 005: TRIGGERS
-- =============================================================================
-- Automatizan mantenimiento de datos: updated_at, contadores, auditoría.
-- Las funciones invocadas están definidas en las secciones previas de
-- esta migración (6d. cleanup_old_security_logs y 6e. trigger functions).
-- =============================================================================

-- =============================================================================
-- TRIGGERS PARA updated_at EN TABLAS BASE
-- =============================================================================
drop trigger if exists update_reviews_updated_at on public.reviews;

create trigger update_reviews_updated_at
  before update on public.reviews
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_real_estates_updated_at on public.real_estates;

create trigger update_real_estates_updated_at
  before update on public.real_estates
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_review_rooms_updated_at on public.review_rooms;

create trigger update_review_rooms_updated_at
  before update on public.review_rooms
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Contadores de inmobiliarias
drop trigger if exists update_real_estate_counters_trigger on public.reviews;

create trigger update_real_estate_counters_trigger
  after insert or update or delete on public.reviews
  for each row
  execute function update_real_estate_counters();

-- Auditoría de cambios
drop trigger if exists review_changes_audit on public.reviews;

create trigger review_changes_audit
  after insert or update on public.reviews
  for each row
  execute function log_review_changes();

-- Auditoría de eliminaciones
drop trigger if exists review_deletion_audit on public.reviews;

create trigger review_deletion_audit
  before delete on public.reviews
  for each row
  execute function log_review_deletion();

-- =============================================================================
-- TRIGGERS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- updated_at en real_estate_reviews
drop trigger if exists update_real_estate_reviews_updated_at on public.real_estate_reviews;

create trigger update_real_estate_reviews_updated_at
  before update on public.real_estate_reviews
  for each row
  execute function update_updated_at_column();

-- Rating de inmobiliaria cuando cambian sus reseñas
drop trigger if exists update_real_estate_rating_trigger on public.real_estate_reviews;

create trigger update_real_estate_rating_trigger
  after insert or update or delete on public.real_estate_reviews
  for each row
  execute function update_real_estate_rating_from_reviews();

-- =============================================================================
-- TRIGGERS PARA SISTEMA DE REPORTES Y VOTOS
-- =============================================================================
-- updated_at en real_estate_reports
drop trigger if exists update_real_estate_reports_updated_at on public.real_estate_reports;

create trigger update_real_estate_reports_updated_at
  before update on public.real_estate_reports
  for each row
  execute function update_updated_at_column();

-- updated_at en real_estate_votes
drop trigger if exists update_real_estate_votes_updated_at on public.real_estate_votes;

create trigger update_real_estate_votes_updated_at
  before update on public.real_estate_votes
  for each row
  execute function update_updated_at_column();

-- Fase 1 (C1): updated_at en real_estate_review_votes
drop trigger if exists update_real_estate_review_votes_updated_at on public.real_estate_review_votes;

create trigger update_real_estate_review_votes_updated_at
  before update on public.real_estate_review_votes
  for each row
  execute function update_updated_at_column();

-- Fase 2 (M6): updated_at en review_votes (simetría con las otras tablas de votos)
drop trigger if exists update_review_votes_updated_at on public.review_votes;

create trigger update_review_votes_updated_at
  before update on public.review_votes
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRIGGERS FALTANTES DE updated_at (reportes de reviews)
-- =============================================================================
drop trigger if exists update_review_reports_updated_at on public.review_reports;

create trigger update_review_reports_updated_at
  before update on public.review_reports
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_real_estate_review_reports_updated_at on public.real_estate_review_reports;

create trigger update_real_estate_review_reports_updated_at
  before update on public.real_estate_review_reports
  for each row
  execute function update_updated_at_column();

-- =============================================================================
-- TRIGGER DE RATE LIMITING (cleanup automático)
-- =============================================================================
-- Elimina registros expirados después de cada INSERT en rate_limits.
drop trigger if exists cleanup_rate_limits_trigger on public.rate_limits;

create trigger cleanup_rate_limits_trigger
  after insert on public.rate_limits
  for each row
  execute function cleanup_rate_limits_on_insert();

-- =============================================================================
-- NOTA (018-fix): Las MVs de contadores de votos fueron eliminadas (ver
-- sección 5). No hay triggers de refresh. Los contadores se calculan en vivo
-- en las vistas _public mediante LEFT JOIN LATERAL.
-- =============================================================================
-- =============================================================================
-- MIGRACIÓN 006: ROW LEVEL SECURITY
-- =============================================================================
-- Políticas de acceso a nivel de fila.
-- Principio: cada usuario ve/modifica solo sus propios datos.
-- INSERT: auth.uid() = user_id
-- UPDATE/DELETE: auth.uid() = user_id
-- SELECT: defense-in-depth (SELECT está revocado en 007, pero por si se re-grant)
--
-- NOTA: review_deletions y review_audit tienen políticas más restrictivas
-- (solo service_role puede insertar en audit, solo el usuario puede ver sus
-- propias eliminaciones).
-- =============================================================================

-- =============================================================================
-- HABILITAR RLS EN TABLAS
-- =============================================================================
alter table public.reviews enable row level security;
alter table public.review_rooms enable row level security;
alter table public.review_votes enable row level security;
alter table public.review_reports enable row level security;
alter table public.review_deletions enable row level security;
alter table public.review_audit enable row level security;
alter table public.review_favorites enable row level security;
alter table public.real_estates enable row level security;
alter table public.real_estate_votes enable row level security;
alter table public.real_estate_reviews enable row level security;
alter table public.real_estate_review_votes enable row level security;
alter table public.real_estate_review_reports enable row level security;
alter table public.real_estate_favorites enable row level security;
alter table public.real_estate_reports enable row level security;
alter table public.rate_limits enable row level security;
alter table public.security_logs enable row level security;

-- =============================================================================
-- REVIEWS
-- =============================================================================
drop policy if exists reviews_select_public on public.reviews;

create policy reviews_select_public on public.reviews
  for select
  using (deleted_at is null);

drop policy if exists reviews_insert_own on public.reviews;

create policy reviews_insert_own on public.reviews
  for insert
  with check (
    (select auth.uid()) is not null
    and user_id = (select auth.uid())
  );

drop policy if exists reviews_update_own on public.reviews;

create policy reviews_update_own on public.reviews
  for update
  using (
    user_id = (select auth.uid())
    and deleted_at is null
  )
  with check (user_id = (select auth.uid()));

drop policy if exists reviews_delete_own on public.reviews;

create policy reviews_delete_own on public.reviews
  for delete
  using (user_id = (select auth.uid()));

-- =============================================================================
-- REVIEW VOTES
-- =============================================================================
-- Solo mostrar votos propios. Los contadores agregados se obtienen
-- vía vistas _public (que corren como owner y bypasean RLS)
-- y funciones get_*_vote_counts (SECURITY DEFINER).
drop policy if exists review_votes_select_own on public.review_votes;

create policy review_votes_select_own on public.review_votes
  for select
  using (user_id = (select auth.uid()));

drop policy if exists review_votes_insert_own on public.review_votes;

create policy review_votes_insert_own on public.review_votes
  for insert
  with check (
    (select auth.uid()) is not null
    and user_id = (select auth.uid())
  );

drop policy if exists review_votes_update_own on public.review_votes;

create policy review_votes_update_own on public.review_votes
  for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists review_votes_delete_own on public.review_votes;

create policy review_votes_delete_own on public.review_votes
  for delete
  using (user_id = (select auth.uid()));

-- =============================================================================
-- REVIEW FAVORITES (NO PÚBLICO)
-- =============================================================================
drop policy if exists review_favorites_select_own on public.review_favorites;

create policy review_favorites_select_own on public.review_favorites
  for select
  using (user_id = (select auth.uid()));

drop policy if exists review_favorites_insert_own on public.review_favorites;

create policy review_favorites_insert_own on public.review_favorites
  for insert
  with check (user_id = (select auth.uid()));

drop policy if exists review_favorites_delete_own on public.review_favorites;

create policy review_favorites_delete_own on public.review_favorites
  for delete
  using (user_id = (select auth.uid()));

-- =============================================================================
-- REVIEW REPORTS
-- =============================================================================
drop policy if exists review_reports_select_own on public.review_reports;

create policy review_reports_select_own on public.review_reports
  for select
  using (reported_by_user_id = (select auth.uid()));

drop policy if exists review_reports_insert_own on public.review_reports;

create policy review_reports_insert_own on public.review_reports
  for insert
  with check (
    (select auth.uid()) is not null
    and reported_by_user_id = (select auth.uid())
  );

drop policy if exists review_reports_service_role_all on public.review_reports;

create policy review_reports_service_role_all on public.review_reports
  for all
  to service_role
  using (true);

-- =============================================================================
-- REVIEW DELETIONS (AUDITORÍA)
-- =============================================================================
-- Policy select_own de review_deletions ELIMINADA: no hay grant SELECT para
-- authenticated/anon en esta tabla de auditoría (solo service_role inserta y
-- cleanup_test_data lee vía service_role). Sin grant, la policy es inerte y
-- contradice el mínimo privilegio. Review_delete_audit completa = audit-only.

drop policy if exists review_deletions_system_insert on public.review_deletions;

create policy review_deletions_system_insert on public.review_deletions
  for insert
  to service_role
  with check (true);

drop policy if exists review_audit_system_insert on public.review_audit;

-- Solo service_role puede insertar directamente. Las funciones SECURITY DEFINER
-- (como log_review_changes) bypasean RLS al ejecutarse como el owner (postgres).
create policy review_audit_system_insert on public.review_audit
  for insert
  to service_role
  with check (true);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
drop policy if exists real_estates_select_public on public.real_estates;

create policy real_estates_select_public on public.real_estates
  for select
  using (deleted_at is null);

drop policy if exists real_estates_insert_authenticated on public.real_estates;

create policy real_estates_insert_authenticated on public.real_estates
  for insert
  with check (
    (select auth.uid()) is not null
    and created_by = (select auth.uid())
  );

drop policy if exists real_estates_update_creator on public.real_estates;

-- Solo el creador original puede actualizar. Inmobiliarias huérfanas (created_by IS NULL)
-- solo se modifican via service_role.
create policy real_estates_update_creator on public.real_estates
  for update
  using (
    (select auth.uid()) is not null
    and created_by = (select auth.uid())
  )
  with check (
    (select auth.uid()) is not null
    and created_by = (select auth.uid())
  );

drop policy if exists real_estates_delete_creator on public.real_estates;

create policy real_estates_delete_creator on public.real_estates
  for delete
  using (
    (select auth.uid()) is not null
    and created_by = (select auth.uid())
  );

-- =============================================================================
-- REAL ESTATE REVIEWS
-- =============================================================================
drop policy if exists real_estate_reviews_select_public on public.real_estate_reviews;

create policy real_estate_reviews_select_public on public.real_estate_reviews
  for select
  using (deleted_at is null);

drop policy if exists real_estate_reviews_insert_own on public.real_estate_reviews;

create policy real_estate_reviews_insert_own on public.real_estate_reviews
  for insert
  with check (
    (select auth.uid()) is not null
    and user_id = (select auth.uid())
  );

drop policy if exists real_estate_reviews_update_own on public.real_estate_reviews;

create policy real_estate_reviews_update_own on public.real_estate_reviews
  for update
  using (
    user_id = (select auth.uid())
    and deleted_at is null
  )
  with check (user_id = (select auth.uid()));

drop policy if exists real_estate_reviews_delete_own on public.real_estate_reviews;

create policy real_estate_reviews_delete_own on public.real_estate_reviews
  for delete
  using (user_id = (select auth.uid()));

-- =============================================================================
-- REAL ESTATE FAVORITES (NO PÚBLICO)
-- =============================================================================
drop policy if exists real_estate_favorites_select_own on public.real_estate_favorites;

create policy real_estate_favorites_select_own on public.real_estate_favorites
  for select
  using (user_id = (select auth.uid()));

drop policy if exists real_estate_favorites_insert_own on public.real_estate_favorites;

create policy real_estate_favorites_insert_own on public.real_estate_favorites
  for insert
  with check (user_id = (select auth.uid()));

drop policy if exists real_estate_favorites_delete_own on public.real_estate_favorites;

create policy real_estate_favorites_delete_own on public.real_estate_favorites
  for delete
  using (user_id = (select auth.uid()));

-- =============================================================================
-- REAL ESTATE VOTES
-- =============================================================================
-- Solo mostrar votos propios al usuario autenticado.
-- Contadores agregados vía vistas _public y funciones get_*_vote_counts.
drop policy if exists real_estate_votes_select_own on public.real_estate_votes;

create policy real_estate_votes_select_own on public.real_estate_votes
  for select
  using (user_id = (select auth.uid()));

drop policy if exists real_estate_votes_insert_own on public.real_estate_votes;

create policy real_estate_votes_insert_own on public.real_estate_votes
  for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists real_estate_votes_update_own on public.real_estate_votes;

create policy real_estate_votes_update_own on public.real_estate_votes
  for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists real_estate_votes_delete_own on public.real_estate_votes;

create policy real_estate_votes_delete_own on public.real_estate_votes
  for delete
  using ((select auth.uid()) = user_id);

-- =============================================================================
-- REAL ESTATE REVIEW VOTES
-- =============================================================================
-- Solo mostrar votos propios al usuario autenticado.
-- Contadores agregados vía vistas _public y funciones get_*_vote_counts.
drop policy if exists real_estate_review_votes_select_own on public.real_estate_review_votes;

create policy real_estate_review_votes_select_own on public.real_estate_review_votes
  for select
  using (user_id = (select auth.uid()));

drop policy if exists real_estate_review_votes_insert_own on public.real_estate_review_votes;

create policy real_estate_review_votes_insert_own on public.real_estate_review_votes
  for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists real_estate_review_votes_update_own on public.real_estate_review_votes;

create policy real_estate_review_votes_update_own on public.real_estate_review_votes
  for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists real_estate_review_votes_delete_own on public.real_estate_review_votes;

create policy real_estate_review_votes_delete_own on public.real_estate_review_votes
  for delete
  using ((select auth.uid()) = user_id);

-- =============================================================================
-- REAL ESTATE REVIEW REPORTS
-- =============================================================================
drop policy if exists real_estate_review_reports_select_own on public.real_estate_review_reports;

create policy real_estate_review_reports_select_own on public.real_estate_review_reports
  for select
  using (reported_by_user_id = (select auth.uid()));

drop policy if exists real_estate_review_reports_insert_own on public.real_estate_review_reports;

create policy real_estate_review_reports_insert_own on public.real_estate_review_reports
  for insert
  with check (
    (select auth.uid()) is not null
    and reported_by_user_id = (select auth.uid())
  );

drop policy if exists real_estate_review_reports_service_role_all on public.real_estate_review_reports;

create policy real_estate_review_reports_service_role_all on public.real_estate_review_reports
  for all
  to service_role
  using (true);

-- =============================================================================
-- REAL ESTATE REPORTS
-- =============================================================================
drop policy if exists real_estate_reports_select_own on public.real_estate_reports;

create policy real_estate_reports_select_own on public.real_estate_reports
  for select
  using (reported_by_user_id = (select auth.uid()));

drop policy if exists real_estate_reports_insert_own on public.real_estate_reports;

create policy real_estate_reports_insert_own on public.real_estate_reports
  for insert
  with check (
    (select auth.uid()) is not null
    and reported_by_user_id = (select auth.uid())
  );

drop policy if exists real_estate_reports_service_role_all on public.real_estate_reports;

create policy real_estate_reports_service_role_all on public.real_estate_reports
  for all
  to service_role
  using (true);

-- =============================================================================
-- RATE LIMITS
-- =============================================================================
drop policy if exists rate_limits_select_own on public.rate_limits;

create policy rate_limits_select_own on public.rate_limits
  for select
  using (user_id = (select auth.uid()));

drop policy if exists rate_limits_insert_own on public.rate_limits;

create policy rate_limits_insert_own on public.rate_limits
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists rate_limits_update_own on public.rate_limits;

create policy rate_limits_update_own on public.rate_limits
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists rate_limits_system_manage on public.rate_limits;

create policy rate_limits_system_manage on public.rate_limits
  for all
  to service_role
  using (true);

-- =============================================================================
-- SECURITY LOGS
-- =============================================================================
drop policy if exists security_logs_service_role on public.security_logs;

create policy security_logs_service_role on public.security_logs
  for select
  to service_role
  using (true);

drop policy if exists security_logs_insert_authenticated on public.security_logs;

create policy security_logs_insert_authenticated on public.security_logs
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));
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
-- Nota (L4): el unique (user_id, endpoint, window_start) de la tabla ya
-- soporta la query principal de rate limiting; no se crea índice adicional.

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
-- REVIEWS (10 índices)
-- =============================================================================
create index if not exists idx_reviews_created_at
  on public.reviews (created_at desc);

create index if not exists idx_reviews_rating
  on public.reviews (rating);

create index if not exists idx_reviews_real_estate_id_rating
  on public.reviews (real_estate_id, rating);

-- Nota (L4): no se crea btree sobre address_text; la búsqueda es ilike '%q%'
-- (wildcard inicial) y requeriría GIN trigram (pg_trgm), no un btree.

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

-- =============================================================================
-- REVIEW VOTES
-- =============================================================================
-- Índice compuesto para optimizar consultas por review, usuario y tipo de voto
create index if not exists idx_review_votes_composite
  on public.review_votes (review_id, user_id, vote_type);

-- Fix P1 (auditoría): índice por user_id para el FK CASCADE desde auth.users
-- (sin él, DELETE de usuarios escanea la tabla completa) y para queries "mis votos".
create index if not exists idx_review_votes_user_id
  on public.review_votes (user_id);

-- =============================================================================
-- REVIEW REPORTS
-- =============================================================================
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
-- Nota (L4): unique (name) ya genera su propio índice; no se crea btree adicional.

create index if not exists idx_real_estates_created_by
  on public.real_estates (created_by);

create index if not exists idx_real_estates_created_at
  on public.real_estates (created_at desc);

create index if not exists idx_real_estates_review_count
  on public.real_estates (review_count desc);

-- =============================================================================
-- REAL ESTATE REVIEWS (8 índices)
-- =============================================================================
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

-- Fix P1 (auditoría): índice por user_id para el FK CASCADE desde auth.users.
create index if not exists idx_real_estate_review_votes_user_id
  on public.real_estate_review_votes (user_id);

-- =============================================================================
-- REAL ESTATE REVIEW REPORTS
-- =============================================================================
create index if not exists idx_real_estate_review_reports_reported_by
  on public.real_estate_review_reports (reported_by_user_id);

create index if not exists idx_real_estate_review_reports_status
  on public.real_estate_review_reports (status);

create index if not exists idx_real_estate_review_reports_created_at
  on public.real_estate_review_reports (created_at);

-- =============================================================================
-- REAL ESTATE REPORTS
-- =============================================================================
create index if not exists idx_real_estate_reports_reported_by
  on public.real_estate_reports (reported_by_user_id);

create index if not exists idx_real_estate_reports_status
  on public.real_estate_reports (status);

-- =============================================================================
-- REAL ESTATE FAVORITES
-- =============================================================================
create index if not exists idx_real_estate_favorites_user_id
  on public.real_estate_favorites (user_id);

-- =============================================================================
-- NOTA SOBRE VISTAS MATERIALIZADAS
-- =============================================================================
-- (018-fix) Los índices de las MVs fueron eliminados junto con las MVs.
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
-- =============================================================================
-- MIGRACIÓN 009: VISTAS PÚBLICAS (_public)
-- =============================================================================
-- Única puerta de acceso público a datos.
-- Reemplazan user_id/created_by por flag booleano is_mine.
--
-- DECISIÓN DE DISEÑO (supabase db advisors warning `security_definer_view`):
--   Las vistas NO usan WITH (security_invoker = true) a propósito.
--   SELECT está revocado de anon/authenticated en las tablas base (007_grants),
--   entonces security_invoker rompería el acceso. Al correr como owner, las
--   vistas pueden leer las tablas sin exponer REST endpoints crudos.
--   auth.uid() funciona igual (lee del JWT, no de la sesión de PG).
--   Esto NO es una vulnerabilidad: el gateway controlado es más seguro que
--   exponer las tablas con RLS.
-- =============================================================================

-- =============================================================================
-- VISTA SEGURA: reviews_public
-- Oculta user_id y proporciona flag is_mine para verificar ownership
-- =============================================================================
drop view if exists public.reviews_public cascade;

create view public.reviews_public with (security_invoker = false, security_barrier = true) as
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

create view public.reviews_with_votes_public with (security_invoker = false, security_barrier = true) as
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

create view public.real_estate_reviews_public with (security_invoker = false, security_barrier = true) as
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

create view public.real_estate_reviews_with_votes_public with (security_invoker = false, security_barrier = true) as
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
-- FUNCIONES PAGINADAS (F006)
-- Límite server-side forzado para evitar queries sin paginación.
-- =============================================================================

create or replace function public.get_reviews_paginated (
  p_limit int default 50,
  p_offset int default 0
) returns setof public.reviews_public language sql stable security invoker
set search_path = public, pg_temp
as $$
  select * from public.reviews_public
  order by created_at desc
  limit least(p_limit, 100)
  offset p_offset;
$$;

comment on function public.get_reviews_paginated is
  'Retorna reseñas paginadas con límite máximo de 100 filas.';

-- Grants para las funciones paginadas
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
-- Fix V3 (auditoría): hardening de review_images
-- El upload de imágenes es el ÚNICO canal DML directo por REST del proyecto,
-- así que la validación de verdad vive en la BD.
-- =============================================================================
-- 1) Saneo de path: bloquea URLs externas (http/://), rutas absolutas o vacías.
--    Si la convención del bucket cambia, ajustar al prefijo real.
alter table public.review_images
  add constraint review_images_path_sane_chk
  check (
    path !~ '^(https?:|//|/|$)'
    and not (path like '%://%')
    and btrim(path) = path
  );

-- 2) Tope de 5 imágenes por reseña (evita abuso de almacenamiento vía REST).
create or replace function public.enforce_review_images_cap ()
returns trigger language plpgsql security definer
set search_path = public, pg_temp
as $$
BEGIN
  IF (SELECT count(*) FROM public.review_images WHERE review_id = NEW.review_id) >= 5 THEN
    RAISE EXCEPTION 'Máximo 5 imágenes por reseña';
  END IF;
  RETURN NEW;
END;
$$;

revoke execute on function public.enforce_review_images_cap() from public, anon, authenticated;

drop trigger if exists enforce_review_images_cap on public.review_images;
create trigger enforce_review_images_cap
  before insert on public.review_images
  for each row execute function public.enforce_review_images_cap();

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.review_images enable row level security;

-- Lectura pública: cualquiera puede ver las imágenes de reseñas no eliminadas.
-- Se usa reviews_public (id + deleted_at is null) en vez de check_review_active,
-- que fue eliminada del squash (una policy que llama una función sin EXECUTE
-- para el rol que ejecuta la query falla en runtime).
drop policy if exists review_images_select_public on public.review_images;
create policy review_images_select_public on public.review_images for select
  using (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_images.review_id
    )
  );

-- Solo el owner de la reseña puede insertar imágenes.
-- is_mine (de reviews_public) reemplaza a check_review_owner, eliminada del squash.
drop policy if exists review_images_insert_own on public.review_images;
create policy review_images_insert_own on public.review_images for insert
  with check (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_images.review_id
        and rp.is_mine
    )
  );

-- Solo el owner de la reseña puede borrar sus imágenes.
drop policy if exists review_images_delete_own on public.review_images;
create policy review_images_delete_own on public.review_images for delete
  using (
    exists (
      select 1
      from public.reviews_public rp
      where rp.id = review_images.review_id
        and rp.is_mine
    )
  );

-- =============================================================================
-- GRANTS
-- =============================================================================
grant select on public.review_images to anon, authenticated;
grant insert, delete on public.review_images to authenticated;
-- =============================================================================
-- MIGRACIÓN 011: AUDIT Y FIXES DE SEGURIDAD
-- =============================================================================
-- Test de regresión DO block que corre en cada deploy.
-- Si una vista _public expone accidentalmente user_id/created_by,
-- la migración falla y el deploy se revierte.
--
-- También incluye configuraciones globales.
-- =============================================================================

-- =============================================================================
-- F014 (LOW): Configuración global de timeouts
-- =============================================================================
-- Opcional: asegura que si el proyecto se recrea, estas configuraciones
-- se restauran automáticamente.
alter database postgres set statement_timeout = '30000';
alter database postgres set idle_in_transaction_session_timeout = '60000';

-- =============================================================================
-- =============================================================================
-- MIGRATION 012: FUNCIONES DEPENDIENTES DE VISTAS PÚBLICAS
-- =============================================================================
-- Estas funciones dependen de las vistas _public definidas en esta misma
-- migración (reviews_with_votes_public, real_estate_reviews_with_votes_public).
-- Se agrupan separadas de las core RPC para respetar el orden de dependencias.
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
-- =============================================================================
-- MIGRATION 013: DEPENDENCIAS PÓSTUMAS A VISTAS _public
-- =============================================================================
-- Policies y grants que dependen de las vistas _public y se agrupan aquí
-- para respetar el orden de dependencias dentro de esta migración.
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

-- Fix F1: review_rooms_manage_own eliminada. Sin grants DML para authenticated,
-- la policy era inerte (los writes de rooms van por RPC, no por REST).
drop policy if exists review_rooms_manage_own on public.review_rooms;

-- =============================================================================
-- RLS: REVIEW AUDIT (depende de reviews_public)
-- =============================================================================
-- NOTA: Se usa reviews_public en lugar de reviews por la misma razón que
-- en las políticas de review_rooms. is_mine reemplaza user_id = auth.uid().
-- Audit entries de reviews eliminadas no son visibles (tradeoff aceptado):
-- la tabla es audit-only y no expone SELECT a authenticated/anon.
-- Policy select_own ELIMINADA: sin grant SELECT es inerte y contradice el
-- mínimo privilegio. Solo service_role inserta; cleanup_test_data lee
-- explícitamente con service_role.

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
-- =============================================================================
-- SECCIÓN 10: GRANTS (from 007 + 013 + 010 + 014 + 016 + 017)
-- =============================================================================

-- =============================================================================
-- 10a. PERMISOS Y GRANTS (from 007_grants.sql - ALL)
-- =============================================================================
-- Control granular de acceso:
-- - SELECT REVOCADO en tablas raw con user_id (la única lectura pública es vía _public views)
-- - ESCRITURA revocada para anon (todo pasa por funciones RPC)
-- - Grants específicos para funciones SECURITY INVOKER
-- - Grants restringidos para funciones SECURITY DEFINER (solo service_role)

-- =============================================================================
-- SECCIÓN 1: GRANTS PARA FUNCIONES DE NEGOCIO (SECURITY INVOKER)
-- =============================================================================
grant execute on function public.toggle_favorite_real_estate(uuid) to authenticated;
revoke execute on function public.toggle_favorite_real_estate(uuid) from public, anon;
grant execute on function public.is_real_estate_favorite(uuid) to authenticated;
revoke execute on function public.is_real_estate_favorite(uuid) from public, anon;
grant execute on function public.get_user_real_estate_vote(uuid) to authenticated;
revoke execute on function public.get_user_real_estate_vote(uuid) from public, anon;
grant execute on function public.get_user_review_vote(uuid) to authenticated;
revoke execute on function public.get_user_review_vote(uuid) from public, anon;
grant execute on function public.toggle_favorite_review(uuid) to authenticated;
revoke execute on function public.toggle_favorite_review(uuid) from public, anon;
grant execute on function public.is_review_favorite(uuid) to authenticated;
revoke execute on function public.is_review_favorite(uuid) from public, anon;
grant execute on function public.create_review(text, text, integer, text, text, numeric, numeric, uuid, text, integer, text, text, text, text, text, jsonb) to authenticated;
revoke execute on function public.create_review(text, text, integer, text, text, numeric, numeric, uuid, text, integer, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.delete_review_safe(uuid) to authenticated;
revoke execute on function public.delete_review_safe(uuid) from public, anon;
grant execute on function public.vote_review(uuid, text) to authenticated;
revoke execute on function public.vote_review(uuid, text) from public, anon;
grant execute on function public.update_review(uuid, text, text, integer, text, text, text, numeric, numeric, integer, text, text, text, uuid, text, text, jsonb) to authenticated;
revoke execute on function public.update_review(uuid, text, text, integer, text, text, text, numeric, numeric, integer, text, text, text, uuid, text, text, jsonb) from public, anon;
grant execute on function public.report_review(uuid, text, text) to authenticated;
revoke execute on function public.report_review(uuid, text, text) from public, anon;
grant execute on function public.has_user_reported_review(uuid) to authenticated;
revoke execute on function public.has_user_reported_review(uuid) from public, anon;
grant execute on function public.create_real_estate_review(uuid, text, text, integer) to authenticated;
revoke execute on function public.create_real_estate_review(uuid, text, text, integer) from public, anon;
grant execute on function public.vote_real_estate_review(uuid, text) to authenticated;
revoke execute on function public.vote_real_estate_review(uuid, text) from public, anon;
grant execute on function public.report_real_estate_review(uuid, text, text) to authenticated;
revoke execute on function public.report_real_estate_review(uuid, text, text) from public, anon;
grant execute on function public.update_real_estate_review(uuid, text, text, integer) to authenticated;
revoke execute on function public.update_real_estate_review(uuid, text, text, integer) from public, anon;
grant execute on function public.delete_real_estate_review_safe(uuid) to authenticated;
revoke execute on function public.delete_real_estate_review_safe(uuid) from public, anon;
grant execute on function public.create_real_estate(text, text) to authenticated;
revoke execute on function public.create_real_estate(text, text) from public, anon;
grant execute on function public.vote_real_estate(uuid, text) to authenticated;
revoke execute on function public.vote_real_estate(uuid, text) from public, anon;
grant execute on function public.report_real_estate(uuid, text, text) to authenticated;
revoke execute on function public.report_real_estate(uuid, text, text) from public, anon;
grant execute on function public.has_user_reported_real_estate(uuid) to authenticated;
revoke execute on function public.has_user_reported_real_estate(uuid) from public, anon;
grant execute on function public.has_user_reported_real_estate_review(uuid) to authenticated;
revoke execute on function public.has_user_reported_real_estate_review(uuid) from public, anon;

-- =============================================================================
-- SECCIÓN 2: GRANTS PARA FUNCIONES DE CONTADORES DE VOTOS (SECURITY DEFINER)
--            Acceso público para lecturas agregadas
-- =============================================================================
grant execute on function public.get_real_estate_vote_counts(uuid) to authenticated, anon;
revoke execute on function public.get_real_estate_vote_counts(uuid) from public;
grant execute on function public.get_review_vote_counts(uuid) to authenticated, anon;
revoke execute on function public.get_review_vote_counts(uuid) from public;
grant execute on function public.get_real_estate_review_vote_counts(uuid) to authenticated, anon;
revoke execute on function public.get_real_estate_review_vote_counts(uuid) from public;

-- =============================================================================
-- SECCIÓN 5: REVOKE DE FUNCIONES INTERNAS (Fix S3)
--            check_rate_limit y log_security_event son internas: las llaman
--            funciones SECURITY DEFINER que corren como postgres, no necesitan
--            grants del cliente. Se revocan también de authenticated para evitar
--            spam/contaminación de rate_limits y security_logs.
-- =============================================================================
revoke execute on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke execute on function public.log_security_event(text, text, text, jsonb) from public, anon, authenticated;

-- Funciones admin (solo service_role)
revoke execute on function public.moderate_reports(uuid, text, text, text) from public, anon, authenticated;

-- Grant explícito a service_role para funciones admin
grant execute on function public.moderate_reports(uuid, text, text, text) to service_role;

-- =============================================================================
-- SECCIÓN 7: REVOKE DE FUNCIONES DE TRIGGER Y MANTENIMIENTO
--            No deben ser llamadas directamente por usuarios.
-- =============================================================================
revoke execute on function public.cleanup_rate_limits_on_insert() from public, anon, authenticated;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;
revoke execute on function public.update_real_estate_counters() from public, anon, authenticated;
revoke execute on function public.log_review_changes() from public, anon, authenticated;
revoke execute on function public.log_review_deletion() from public, anon, authenticated;
revoke execute on function public.update_real_estate_rating_from_reviews() from public, anon, authenticated;
revoke execute on function public.cleanup_old_security_logs() from public, anon, authenticated;

-- =============================================================================
-- SECCIÓN 9: REVOKE SELECT EN TABLAS CRUDAS CON user_id/created_by
--            Las tablas reviews, real_estates y real_estate_reviews contienen
--            columnas con identificadores de usuario. Supabase otorga SELECT
--            por defecto a anon/authenticated, exponiendo estos IDs via REST.
--            El acceso público debe usar exclusivamente las vistas _public.
-- =============================================================================
revoke select on public.reviews from anon, authenticated;
revoke select on public.real_estates from anon, authenticated;
revoke select on public.real_estate_reviews from anon, authenticated;

-- =============================================================================
-- (018-fix) Revokes de vistas non-public eliminados junto con las vistas.
-- =============================================================================

-- =============================================================================
-- NOTA: Tablas con columnas user_id pero con RLS + funciones SECURITY INVOKER
-- =============================================================================
-- Las siguientes tablas contienen FKs a auth.users pero NO se revoca SELECT
-- porque son consultadas por funciones SECURITY INVOKER (que se ejecutan con
-- permisos del llamante). La protección es RLS: cada política filtra por
-- auth.uid(), asegurando que cada usuario solo ve sus propios datos.
--
-- Tablas protegidas por RLS (SELECT mantenido):
--   review_votes, real_estate_votes, real_estate_review_votes
--   review_reports, review_deletions, review_audit
--   review_favorites, real_estate_favorites
--   real_estate_review_reports, real_estate_reports
--   rate_limits
--
-- Si en el futuro se convierten las funciones a SECURITY DEFINER, se puede
-- revocar SELECT de authenticated y anon como defensa en profundidad.

-- =============================================================================
-- SECCIÓN 11: GRANTS SELECT EXPLÍCITOS PARA TABLAS CON RLS
--            Necesarios cuando Supabase no aplica el grant automático
--            (ej. bases creadas desde migraciones puras).
--            RLS filtra por auth.uid() — cada usuario ve solo sus datos.
-- =============================================================================
grant select on public.review_votes to authenticated;
grant select on public.review_reports to authenticated;
grant select on public.review_favorites to authenticated;
grant select on public.real_estate_votes to authenticated;
grant select on public.real_estate_review_votes to authenticated;
grant select on public.real_estate_review_reports to authenticated;
grant select on public.real_estate_reports to authenticated;
grant select on public.real_estate_favorites to authenticated;
grant select on public.rate_limits to authenticated;
grant select on public.review_rooms to anon, authenticated;

-- NOTA: Sección 12 eliminada por seguridad (Zero-Trust).
-- Todos los writes ahora son vía funciones SECURITY DEFINER
-- que corren como postgres y no necesitan DML grants directos.

-- =============================================================================
-- SECCIÓN 13: REVOKE SELECT EN VISTA DE MONITOREO
-- =============================================================================
revoke select on public.rate_limit_stats from anon, authenticated;

-- =============================================================================
-- SECCIÓN 14: HARDENING PARA anon
--            anon nunca debe mutar tablas directamente. Las operaciones de
--            escritura deben pasar por funciones/capas de negocio.
-- =============================================================================
revoke insert, update, delete on all tables in schema public from anon;

-- Evita drift en nuevas tablas creadas en el futuro.
alter default privileges in schema public
  revoke insert, update, delete on tables
  from anon;

-- =============================================================================
-- SECCIÓN 15: HARDENING PARA authenticated (Fix S2)
--            La app escribe SOLO vía RPC (create_review, update_review, vote_*,
--            toggle_favorite_*, report_*, update/delete_real_estate*). Los grants
--            DML default de Supabase permiten INSERT/UPDATE/DELETE por REST,
--            evadiendo rate limiting y validaciones (ej. reset de rate_limits).
--            Se revocan. review_images conserva sus grants (la app la escribe
--            por REST para el upload de fotos).
-- =============================================================================
revoke insert, update, delete on public.reviews from authenticated;
revoke insert, update, delete on public.real_estates from authenticated;
revoke insert, update, delete on public.real_estate_reviews from authenticated;
revoke insert, update, delete on public.review_votes from authenticated;
revoke insert, update, delete on public.real_estate_votes from authenticated;
revoke insert, update, delete on public.real_estate_review_votes from authenticated;
revoke insert, update, delete on public.review_reports from authenticated;
revoke insert, update, delete on public.real_estate_review_reports from authenticated;
revoke insert, update, delete on public.real_estate_reports from authenticated;
revoke insert, update, delete on public.review_favorites from authenticated;
revoke insert, update, delete on public.real_estate_favorites from authenticated;
revoke insert, update, delete on public.rate_limits from authenticated;
revoke insert, update, delete on public.security_logs from authenticated;
-- Fix F1: review_rooms conservaba DML directo. La app escribe rooms SOLO vía RPC
-- (create_review/update_review con p_review_rooms, reemplazo atómico). El único
-- uso REST es SELECT (fetchReviewRooms). Con esto, la tabla queda como el resto
-- de las tablas de negocio revocadas por el test RLS #42.
revoke insert, update, delete on public.review_rooms from authenticated;
-- Fix F3: review_audit y review_deletions son escritas SOLO por triggers y funciones
-- SECURITY DEFINER (log_review_changes, log_review_deletion, delete_review_safe) que
-- corren como owner postgres — no dependen de grants del cliente. Las policies de
-- insert son `to service_role` (RLS bloquea a authenticated igual). Se revocan los
-- grants DML default por mínimo privilegio; SELECT_own se conserva.
revoke insert, update, delete on public.review_audit from authenticated;
revoke insert, update, delete on public.review_deletions from authenticated;

-- Evita drift en nuevas tablas creadas en el futuro.
alter default privileges in schema public
  revoke insert, update, delete on tables
  from authenticated;
-- =============================================================================
-- 10b. GRANTS PARA VISTAS _public Y FUNCIONES (from 013_fix_dependencies.sql lines 71-86)
-- =============================================================================
-- Estado final de grants para vistas _public (consolidado; una sola copia)
grant select on public.reviews_public to authenticated, anon;
grant select on public.reviews_with_votes_public to authenticated, anon;
grant select on public.real_estate_reviews_public to authenticated, anon;
grant select on public.real_estate_reviews_with_votes_public to authenticated, anon;
grant select on public.real_estates_public to authenticated, anon;
-- F001 (HIGH): Test de privacidad en vistas _public
-- =============================================================================
-- Verifica que ninguna vista _public expone columnas de identidad de usuario.
-- Corre en cada deploy como test de regresión.
-- =============================================================================
do $$
declare
  v_sensitive_columns text[] := array[
    'user_id', 'created_by', 'reported_by_user_id',
    'deleted_by', 'changed_by'
  ];
  v_views_to_check text[] := array[
    'reviews_public',
    'reviews_with_votes_public',
    'real_estates_public',
    'real_estate_reviews_public',
    'real_estate_reviews_with_votes_public'
  ];
  v_view text;
  v_col text;
  v_found_sensitive boolean := false;
begin
  foreach v_view in array v_views_to_check loop
    if exists (
      select 1 from information_schema.views
      where table_schema = 'public' and table_name = v_view
    ) then
      foreach v_col in array v_sensitive_columns loop
        if exists (
          select 1 from information_schema.columns
          where table_schema = 'public'
            and table_name = v_view
            and column_name = v_col
        ) then
          raise warning 'PRIVACY_VIOLATION: Vista % expone columna "%"',
            v_view, v_col;
          v_found_sensitive := true;
        end if;
      end loop;
    else
      raise notice 'TEST_SKIP: Vista % no existe, se omite', v_view;
    end if;
  end loop;

  if v_found_sensitive then
    raise exception 'PRIVACY_TEST_FAILED: Una o más vistas _public exponen columnas sensibles. Revisar warnings.';
  else
    raise notice 'PRIVACY_TEST_PASSED: Ninguna vista _public expone columnas de identidad de usuario.';
  end if;
end $$;

-- Fix F3: las vistas _public y rate_limit_stats no son auto-updatables (no tienen
-- INSTEAD OF triggers) → los grants DML default de Supabase son inertes. Se revocan
-- para cumplir mínimo privilegio; solo SELECT se conserva.
revoke insert, update, delete on public.reviews_public from authenticated;
revoke insert, update, delete on public.reviews_with_votes_public from authenticated;
revoke insert, update, delete on public.real_estate_reviews_public from authenticated;
revoke insert, update, delete on public.real_estate_reviews_with_votes_public from authenticated;
revoke insert, update, delete on public.real_estates_public from authenticated;
revoke insert, update, delete on public.rate_limit_stats from authenticated;

-- Grants para funciones de 012_functions_dependent.sql
grant execute on function public.get_reviews_by_current_user() to authenticated;
revoke execute on function public.get_reviews_by_current_user() from public;
grant execute on function public.get_favorite_reviews_by_current_user() to authenticated;
revoke execute on function public.get_favorite_reviews_by_current_user() from public;
grant execute on function public.get_real_estate_review_by_user(uuid) to authenticated;
revoke execute on function public.get_real_estate_review_by_user(uuid) from public;

-- =============================================================================
-- GRANTS PARA FUNCIONES get_user_vote_on_* (consolidadas de 009)
-- =============================================================================
grant execute on function public.get_user_vote_on_real_estate_review(uuid) to authenticated;
revoke execute on function public.get_user_vote_on_real_estate_review(uuid) from public;

-- =============================================================================
-- GRANTS PARA FUNCIONES PAGINADAS (consolidadas de 009)
-- =============================================================================
grant execute on function public.get_reviews_paginated(int, int) to authenticated, anon;
revoke execute on function public.get_reviews_paginated(int, int) from public;

-- =============================================================================
-- 10c. GRANTS REVIEW IMAGES (from 010_review_images.sql lines 92-94)
-- =============================================================================
grant select on public.review_images to anon, authenticated;
grant insert, delete on public.review_images to authenticated;

-- =============================================================================
-- 10d. GRANTS REAL ESTATES PUBLIC (from 014_real_estates_public_votes.sql)
--      El grant select en real_estates_public ya se otorgó en 10b.
-- =============================================================================
grant execute on function public.get_real_estates_paginated(int, int) to authenticated, anon;
revoke execute on function public.get_real_estates_paginated(int, int) from public;

-- =============================================================================
-- 10e. GRANT check_user_review_for_address (firma extendida, sección 7d)
-- =============================================================================
GRANT EXECUTE ON FUNCTION public.check_user_review_for_address(text, text, text) TO authenticated;
revoke execute on function public.check_user_review_for_address(text, text, text) from public;
-- =============================================================================
-- Migration 016: Load test cleanup function
-- =============================================================================
-- Creates the cleanup_test_data() RPC used by load tests to purge test data.
-- This is safe for all environments because it only creates a function.
--
-- The actual seed data (users, properties, reviews) lives in
-- supabase/seed-test-data.sql and is NEVER applied via migrations.
-- Run it explicitly against staging with:
--   supabase db query --db-url "$STAGING_DB_URL" < supabase/seed-test-data.sql
-- =============================================================================

-- =============================================================================
-- 1. Load test cleanup function
-- =============================================================================
-- SECURITY DEFINER so it can delete across schemas (auth.users references).
-- Called via REST API: POST /rest/v1/rpc/cleanup_test_data
-- Only callable with service_role key.

create or replace function public.cleanup_test_data()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- M1: Guard de rol — superuser (load-test via psql) o JWT service_role
  if not exists (
    select 1 from pg_roles where rolname = current_user and rolsuper
  ) and coalesce(auth.jwt() ->> 'role', '') != 'service_role' then
    raise exception 'Acceso denegado: cleanup_test_data requiere service_role';
  end if;

  -- Delete review_rooms belonging to load test reviews
  delete from review_rooms
  where review_id in (
    select id from reviews
    where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  -- Delete review_votes by load test users or on their reviews
  delete from review_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
     or review_id in (
      select id from reviews
      where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  -- Delete review_favorites by load test users
  delete from review_favorites
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete reviews by load test users
  delete from reviews
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real_estate_reviews and related data by load test users
  delete from real_estate_review_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
     or real_estate_review_id in (
      select id from real_estate_reviews
      where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  delete from real_estate_review_reports
  where reported_by_user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  delete from real_estate_reviews
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete review reports by load test users
  delete from review_reports
  where reported_by_user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete review audit trail for load test reviews
  delete from review_audit
  where review_id in (
    select id from reviews
    where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );

  -- Delete review deletions audit
  delete from review_deletions
  where deleted_by in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real estate votes by load test users
  delete from real_estate_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real estate favorites by load test users
  delete from real_estate_favorites
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete real estate reports by load test users
  delete from real_estate_reports
  where reported_by_user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete rate limits for load test users
  delete from rate_limits
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete security logs for load test users
  delete from security_logs
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete load test real estates (created by loadtest-0)
  delete from real_estates
  where name like 'Test Property %'
    and created_by in (select id from auth.users where email like 'loadtest-%@reviuy.qa');

  -- Delete the load test users themselves
  delete from auth.users
  where email like 'loadtest-%@reviuy.qa';

  -- (018-fix) Refreshes de MVs eliminados junto con las MVs.
end;
$$;

-- Revoke from anon/authenticated, grant only to service_role
-- (matches the project security pattern from 007_grants.sql)
revoke execute on function public.cleanup_test_data() from public, anon, authenticated;
grant execute on function public.cleanup_test_data() to service_role;

comment on function public.cleanup_test_data() is
  'Deletes all load test data (users, properties, reviews). SECURITY DEFINER — service_role only.';
-- =============================================================================
-- MIGRACIÓN 017: UNICIDAD DE RESEÑAS POR APARTAMENTO
-- =============================================================================
-- Objetivo: Permitir que un usuario escriba múltiples reseñas para la misma
-- dirección OSM si son apartamentos distintos dentro de un edificio.
--
-- Regla de negocio:
--   - Edificios (property_type = 'apartment'):
--     1 reseña por usuario por dirección OSM + apartment_number.
--   - Casas (property_type = 'house'):
--     1 reseña por usuario por dirección OSM (ignora apartment_number).
--   - Habitaciones (property_type = 'room'):
--     1 reseña por usuario por dirección OSM (ignora apartment_number).
--
-- Implementación:
--   1. Índice único con COALESCE para manejar NULLs en apartment_number.
--   2. Validación en create_review según property_type.
--   3. check_user_review_for_address acepta property_type + apartment_number.
--
-- Sentinel: COALESCE(apartment_number, '__general__') unifica todos los NULL
-- y vacíos en un solo valor para que el índice único funcione correctamente
-- (PostgreSQL trata NULLs como distintos en UNIQUE indexes).
-- =============================================================================

-- =============================================================================
-- 1. REEMPLAZAR ÍNDICE ÚNICO
-- =============================================================================
-- El viejo índice (user_id, address_osm_id) solo permitía 1 reseña por dirección.
-- El nuevo índice (user_id, address_osm_id, COALESCE(apartment_number, '__general__))
-- permite múltiples reseñas si apartment_number difiere.

DROP INDEX IF EXISTS public.idx_reviews_user_address_osm_unique;
DROP INDEX IF EXISTS public.idx_reviews_user_address_apt_unique;

CREATE UNIQUE INDEX idx_reviews_user_address_apt_unique
  ON public.reviews (user_id, address_osm_id, COALESCE(apartment_number, '__general__'))
  WHERE deleted_at IS NULL;

COMMENT ON INDEX public.idx_reviews_user_address_apt_unique IS
  'Unicidad por usuario+address_osm_id+apartment_number en reviews. '
  'COALESCE(apartment_number, ''__general__'') unifica NULLs. '
  'Permite múltiples reseñas por dirección si el número de apartamento difiere.';

-- =============================================================================
-- 018-FIX: CRON DE LIMPIEZA DE LOGS (Fix A1)
-- =============================================================================
-- security_logs y rate_limits acumulan IP + datos personales indefinidamente
-- (riesgo legal Ley 18.331 y storage DoS). cleanup_old_security_logs() ya
-- existe; solo faltaba agendarlo. El bloque DO es condicional para no romper
-- ambientes sin pg_cron (Supabase cloud/local lo incluyen).
-- Fix P6 (auditoría): verificación por jobname → cron.schedule no es idempotente
-- y duplicaría el job si el esquema se re-aplica sobre una BD existente.
-- Importante: SQL ESTÁTICO no sirve acá. El IF de plpgsql planifica todas sus
-- subconsultas juntas, y un EXISTS sobre cron.job explota en planificación cuando
-- pg_cron no está instalado (aunque el check pg_extension sea falso). El SQL
-- dinámico (execute) se parsea recién en ejecución, dentro de la rama.
do $$
declare
  v_missing_job boolean;
begin
  if to_regclass('cron.job') is not null then
    execute 'select not exists (select 1 from cron.job
              where jobname = ''cleanup_old_security_logs_daily'')'
      into v_missing_job;
    if v_missing_job then
      perform cron.schedule(
        'cleanup_old_security_logs_daily',
        '0 4 * * *',
        'select public.cleanup_old_security_logs()'
      );
    end if;
  end if;
end;
$$;
