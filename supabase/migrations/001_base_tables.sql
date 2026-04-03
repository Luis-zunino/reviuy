-- =============================================================================
-- Tablas principales y estructura base
-- =============================================================================
-- Se crea esta extensión para manejar cadenas de texto case-insensitive
create extension IF not exists citext;

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
  deleted_at TIMESTAMPTZ -- Índice condicional para soft delete (ver migración 054)
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
-- VISTAS MATERIALIZADAS PARA CONTADORES DINÁMICOS
-- =============================================================================
-- Vista materializada para cachear contadores de votos de real_estates
-- Eliminar vista si existe para recrearla limpiamente
drop materialized view if exists public.real_estate_vote_stats cascade;

create materialized view public.real_estate_vote_stats as
select
  re.id as real_estate_id,
  coalesce(
    sum(
      case
        when rev.vote_type = 'like' then 1
        else 0
      end
    ),
    0
  )::integer as likes,
  coalesce(
    sum(
      case
        when rev.vote_type = 'dislike' then 1
        else 0
      end
    ),
    0
  )::integer as dislikes,
  count(rev.id)::integer as total_votes
from
  public.real_estates re
  left join public.real_estate_votes rev on re.id = rev.real_estate_id
where
  re.deleted_at is null
group by
  re.id;

-- Índice único en la vista materializada (necesario antes del REFRESH CONCURRENTLY)
create unique index idx_real_estate_vote_stats_real_estate_id on public.real_estate_vote_stats (real_estate_id);

-- Vista para facilitar consultas de real_estates con contadores
create or replace view public.real_estates_with_votes
with
  (security_invoker = on) as
select
  re.*,
  coalesce(stats.likes, 0) as likes,
  coalesce(stats.dislikes, 0) as dislikes,
  coalesce(stats.total_votes, 0) as total_votes
from
  public.real_estates re
  left join public.real_estate_vote_stats stats on re.id = stats.real_estate_id
where
  re.deleted_at is null;

-- Comentarios para documentación
comment on materialized view public.real_estate_vote_stats is 'Vista materializada que cachea los contadores de likes/dislikes para real_estates. Se actualiza automáticamente con cada cambio en real_estate_votes.';

comment on view public.real_estates_with_votes is 'Vista que combina real_estates con sus contadores de votos calculados dinámicamente. Usar esta vista en lugar de consultar real_estates directamente cuando se necesiten los contadores.';

-- Refrescar la vista materializada por primera vez
refresh materialized view public.real_estate_vote_stats;

-- =============================================================================
-- VISTAS MATERIALIZADAS PARA CONTADORES DINÁMICOS DE REVIEWS
-- =============================================================================
-- Vista materializada para cachear contadores de votos de reviews
-- Eliminar vista si existe para recrearla limpiamente
drop materialized view if exists public.review_vote_stats cascade;

create materialized view public.review_vote_stats as
select
  r.id as review_id,
  coalesce(
    sum(
      case
        when rv.vote_type = 'like' then 1
        else 0
      end
    ),
    0
  )::integer as likes,
  coalesce(
    sum(
      case
        when rv.vote_type = 'dislike' then 1
        else 0
      end
    ),
    0
  )::integer as dislikes,
  count(rv.id)::integer as total_votes
from
  public.reviews r
  left join public.review_votes rv on r.id = rv.review_id
where
  r.deleted_at is null
group by
  r.id;

-- Índice único en la vista materializada (necesario antes del REFRESH CONCURRENTLY)
create unique index idx_review_vote_stats_review_id on public.review_vote_stats (review_id);

-- Vista para facilitar consultas de reviews con contadores
create or replace view public.reviews_with_votes
with
  (security_invoker = on) as
select
  r.*,
  coalesce(stats.likes, 0) as likes,
  coalesce(stats.dislikes, 0) as dislikes,
  coalesce(stats.total_votes, 0) as total_votes
from
  public.reviews r
  left join public.review_vote_stats stats on r.id = stats.review_id
where
  r.deleted_at is null;

-- Comentarios para documentación
comment on materialized view public.review_vote_stats is 'Vista materializada que cachea los contadores de likes/dislikes para reviews. Se actualiza automáticamente con cada cambio en review_votes.';

comment on view public.reviews_with_votes is 'Vista que combina reviews con sus contadores de votos calculados dinámicamente. Usar esta vista en lugar de consultar reviews directamente cuando se necesiten los contadores.';

-- Refrescar la vista materializada por primera vez
refresh materialized view public.review_vote_stats;

-- =============================================================================
-- VISTAS MATERIALIZADAS PARA CONTADORES DINÁMICOS DE REAL ESTATE REVIEWS
-- =============================================================================
-- Vista materializada para cachear contadores de votos de real_estate_reviews
-- Eliminar vista si existe para recrearla limpiamente
drop materialized view if exists public.real_estate_review_vote_stats cascade;

create materialized view public.real_estate_review_vote_stats as
select
  rer.id as real_estate_review_id,
  coalesce(
    sum(
      case
        when rerv.vote_type = 'like' then 1
        else 0
      end
    ),
    0
  )::integer as likes,
  coalesce(
    sum(
      case
        when rerv.vote_type = 'dislike' then 1
        else 0
      end
    ),
    0
  )::integer as dislikes,
  count(rerv.id)::integer as total_votes
from
  public.real_estate_reviews rer
  left join public.real_estate_review_votes rerv on rer.id = rerv.real_estate_review_id
where
  rer.deleted_at is null
group by
  rer.id;

-- Índice único en la vista materializada (necesario antes del REFRESH CONCURRENTLY)
create unique index idx_real_estate_review_vote_stats_review_id on public.real_estate_review_vote_stats (real_estate_review_id);

drop view if exists public.real_estate_reviews_with_votes;

-- Vista para facilitar consultas de real_estate_reviews con contadores
create view public.real_estate_reviews_with_votes
with
  (security_invoker = on) as
select
  rer.*,
  coalesce(stats.likes, 0) as likes,
  coalesce(stats.dislikes, 0) as dislikes,
  coalesce(stats.total_votes, 0) as total_votes
from
  public.real_estate_reviews rer
  left join public.real_estate_review_vote_stats stats on rer.id = stats.real_estate_review_id
where
  rer.deleted_at is null;

-- Comentarios para documentación
comment on materialized view public.real_estate_review_vote_stats is 'Vista materializada que cachea los contadores de likes/dislikes para real_estate_reviews. Se actualiza automáticamente con cada cambio en real_estate_review_votes.';

comment on view public.real_estate_reviews_with_votes is 'Vista que combina real_estate_reviews con sus contadores de votos calculados dinámicamente. Usar esta vista en lugar de consultar real_estate_reviews directamente cuando se necesiten los contadores.';

-- Refrescar la vista materializada por primera vez
refresh materialized view public.real_estate_review_vote_stats;