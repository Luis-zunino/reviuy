-- =============================================================================
-- Tablas principales y estructura base
-- =============================================================================
-- Se crea esta extensión para manejar cadenas de texto case-insensitive
CREATE EXTENSION IF NOT EXISTS citext;

-- Tabla de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        name CITEXT NOT NULL CHECK (
            char_length(btrim (name)) > 0
            AND char_length(name) <= 100
        ),
        description VARCHAR(500),
        review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
        rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00 CHECK (
            rating >= 0
            AND rating <= 5
        ),
        likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
        dislikes INTEGER NOT NULL DEFAULT 0 CHECK (dislikes >= 0),
        created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now () CHECK (updated_at >= created_at),
        deleted_at TIMESTAMPTZ,
        UNIQUE (name)
    );

-- Tabla principal de reseñas de propiedades
CREATE TABLE
    IF NOT EXISTS public.reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        real_estate_id UUID REFERENCES public.real_estates (id) ON DELETE SET NULL,
        title VARCHAR(200) NOT NULL CHECK (char_length(btrim (title)) > 0),
        description VARCHAR(800) NOT NULL CHECK (char_length(btrim (description)) > 0),
        rating INTEGER NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        property_type TEXT CHECK (property_type IN ('apartment', 'house', 'room')),
        address_text VARCHAR(200) NOT NULL CHECK (char_length(btrim (address_text)) > 0),
        address_osm_id VARCHAR(100) NOT NULL CHECK (char_length(btrim (address_osm_id)) > 0),
        latitude DECIMAL(10, 8) NOT NULL CHECK (
            latitude >= -90
            AND latitude <= 90
        ),
        longitude DECIMAL(11, 8) NOT NULL CHECK (
            longitude >= -180
            AND longitude <= 180
        ),
        zone_rating INTEGER CHECK (
            zone_rating >= 1
            AND zone_rating <= 5
        ),
        winter_comfort TEXT CHECK (winter_comfort IN ('hot', 'comfortable', 'cold')),
        summer_comfort TEXT CHECK (summer_comfort IN ('hot', 'comfortable', 'cold')),
        humidity TEXT CHECK (humidity IN ('high', 'normal', 'low')),
        likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
        dislikes INTEGER NOT NULL DEFAULT 0 CHECK (dislikes >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now () CHECK (updated_at >= created_at),
        apartment_number VARCHAR(10),
        real_estate_experience VARCHAR(200),
        deleted_at TIMESTAMPTZ
    );

-- Tabla de rooms asociados a reviews
CREATE TABLE
    IF NOT EXISTS public.review_rooms (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        review_id uuid NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        room_type TEXT CHECK (
            room_type IN (
                'bedroom',
                'living_room',
                'kitchen',
                'bathroom',
                'dining_room',
                'study',
                'storage'
            )
        ),
        area_m2 NUMERIC(7, 2) CHECK (
            area_m2 >= 0
            AND area_m2 <= 10000
        ),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now () CHECK (updated_at >= created_at)
    );

-- Tabla para rate limiting
CREATE TABLE
    IF NOT EXISTS public.rate_limits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
        ip_address INET,
        endpoint TEXT NOT NULL CHECK (char_length(btrim (endpoint)) > 0),
        request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count >= 0),
        window_start TIMESTAMPTZ NOT NULL DEFAULT now (),
        created_at TIMESTAMPTZ DEFAULT now (),
        UNIQUE (user_id, endpoint, window_start)
    );

-- Tabla de logs de seguridad
CREATE TABLE
    IF NOT EXISTS public.security_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        ip_address INET,
        user_agent TEXT,
        endpoint TEXT,
        action TEXT,
        status TEXT,
        error_message TEXT,
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT now ()
    );

-- =============================================================================
-- TABLAS PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Tabla de votos para reviews
CREATE TABLE
    IF NOT EXISTS public.review_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        review_id UUID NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        UNIQUE (review_id, user_id)
    );

-- Tabla para reportes de reviews
CREATE TABLE
    IF NOT EXISTS public.review_reports (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        review_id UUID NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        reported_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        reason VARCHAR(200) NOT NULL CHECK (char_length(btrim (reason)) > 0),
        description VARCHAR(500),
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'reviewed', 'resolved', 'dismissed')
        ),
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now () CHECK (updated_at >= created_at),
        UNIQUE (review_id, reported_by_user_id)
    );

-- Tabla de auditoría para eliminaciones
CREATE TABLE
    IF NOT EXISTS public.review_deletions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        review_id UUID NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        deleted_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        review_title VARCHAR(200),
        review_rating INTEGER,
        review_created_at TIMESTAMPTZ,
        deletion_reason VARCHAR(200),
        deleted_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

-- Tabla de auditoría completa
CREATE TABLE
    IF NOT EXISTS public.review_audit (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        review_id UUID NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        old_data JSONB,
        new_data JSONB,
        changed_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

-- TABLA: Reseñas de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estate_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        real_estate_id UUID NOT NULL REFERENCES public.real_estates (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        -- Contenido de la reseña sobre la inmobiliaria
        title VARCHAR(200) NOT NULL CHECK (char_length(btrim (title)) > 0),
        description VARCHAR(400) NOT NULL CHECK (char_length(btrim (description)) > 0),
        rating INTEGER NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        -- Contadores
        likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
        dislikes INTEGER NOT NULL DEFAULT 0 CHECK (dislikes >= 0),
        -- Timestamps
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now () CHECK (updated_at >= created_at),
        deleted_at TIMESTAMPTZ -- Índice condicional para soft delete (ver migración 054)
    );

-- TABLA: Votos para reseñas de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estate_review_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        real_estate_review_id UUID NOT NULL REFERENCES public.real_estate_reviews (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        user_id_snapshot UUID NOT NULL CHECK (user_id_snapshot = user_id),
        vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now () CHECK (updated_at >= created_at),
        UNIQUE (real_estate_review_id, user_id)
    );

-- TABLA: Reportes para reseñas de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estate_review_reports (
        id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
        real_estate_review_id UUID NOT NULL REFERENCES public.real_estate_reviews (id) ON DELETE CASCADE,
        reported_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        reason VARCHAR(200) NOT NULL CHECK (char_length(btrim (reason)) > 0),
        description VARCHAR(500),
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'reviewed', 'resolved', 'dismissed')
        ),
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now () CHECK (updated_at >= created_at),
        UNIQUE (real_estate_review_id, reported_by_user_id)
    );

-- Tabla para reportes de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estate_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        real_estate_id UUID NOT NULL REFERENCES public.real_estates (id) ON DELETE CASCADE,
        reported_by_user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
        reason VARCHAR(200) NOT NULL CHECK (char_length(btrim (reason)) > 0),
        description VARCHAR(500),
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'reviewed', 'resolved', 'dismissed')
        ),
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now () CHECK (updated_at >= created_at),
        UNIQUE (real_estate_id, reported_by_user_id)
    );

-- Tabla para votos de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estate_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        real_estate_id UUID NOT NULL REFERENCES public.real_estates (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
        created_at TIMESTAMPTZ DEFAULT now (),
        updated_at TIMESTAMPTZ DEFAULT now () CHECK (updated_at >= created_at),
        UNIQUE (real_estate_id, user_id)
    );

-- Crear tabla de favoritos de inmobiliarias
CREATE TABLE
    IF NOT EXISTS public.real_estate_favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        real_estate_id UUID NOT NULL REFERENCES public.real_estates (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now (),
        UNIQUE (real_estate_id, user_id)
    );

-- Crear tabla de favoritos de reseñas
CREATE TABLE
    IF NOT EXISTS public.review_favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        review_id UUID NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now (),
        UNIQUE (review_id, user_id)
    );

-- =============================================================================
-- DOCUMENTACIÓN POR TABLA Y COLUMNA
-- =============================================================================
-- public.real_estates
COMMENT ON TABLE public.real_estates IS 'Catálogo de inmobiliarias creadas por usuarios. rating y review_count derivan de real_estate_reviews.';

COMMENT ON COLUMN public.real_estates.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estates.name IS 'Nombre de la inmobiliaria (único). Máximo 100 caracteres. La unicidad es case-insensitive.';

COMMENT ON COLUMN public.real_estates.description IS 'Descripción breve de la inmobiliaria. Máximo 500 caracteres.';

COMMENT ON COLUMN public.real_estates.review_count IS 'Cantidad de reseñas en real_estate_reviews; mantenido por triggers.';

COMMENT ON COLUMN public.real_estates.rating IS 'Promedio de rating (0..5) desde real_estate_reviews; mantenido por trigger. Minimo 0.00. Máximo 5.00.';

COMMENT ON COLUMN public.real_estates.likes IS 'Cantidad de likes agregados por usuarios; derivado de real_estate_votes.';

COMMENT ON COLUMN public.real_estates.dislikes IS 'Cantidad de dislikes agregados por usuarios; derivado de real_estate_votes.';

COMMENT ON COLUMN public.real_estates.created_by IS 'Usuario que creó la inmobiliaria (FK a auth.users).';

COMMENT ON COLUMN public.real_estates.created_at IS 'Fecha de creación.';

COMMENT ON COLUMN public.real_estates.updated_at IS 'Fecha de última actualización (trigger).';

COMMENT ON COLUMN public.real_estates.deleted_at IS 'Soft delete; NULL si está activa.';

-- public.reviews
COMMENT ON TABLE public.reviews IS 'Reseñas de propiedades individuales (texto, rating, atributos de confort y ubicación). Unicidad: por usuario solo 1 reseña por dirección (preferentemente por address_osm_id); se permiten múltiples direcciones por usuario. Si no hay OSM ID, se valida por address_text en la función create_review.';

COMMENT ON COLUMN public.reviews.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.reviews.user_id IS 'Autor de la reseña (FK a auth.users).';

COMMENT ON COLUMN public.reviews.real_estate_id IS 'Inmobiliaria relacionada (opcional).';

COMMENT ON COLUMN public.reviews.title IS 'Título de la reseña. Maximo 200 caracteres.';

COMMENT ON COLUMN public.reviews.description IS 'Contenido de la reseña. Máximo 800 caracteres.';

COMMENT ON COLUMN public.reviews.rating IS 'Calificación de la propiedad (1..5). Minimo 1, máximo 5.';

COMMENT ON COLUMN public.reviews.property_type IS 'Tipo de propiedad (apartment|house|room).';

COMMENT ON COLUMN public.reviews.address_text IS 'Dirección en texto libre (si no hay OSM ID).';

COMMENT ON COLUMN public.reviews.address_osm_id IS 'Identificador OSM de la dirección (preferido para unicidad por usuario).';

COMMENT ON COLUMN public.reviews.latitude IS 'Latitud (-90..90); validada por CHECK.';

COMMENT ON COLUMN public.reviews.longitude IS 'Longitud (-180..180); validada por CHECK.';

COMMENT ON COLUMN public.reviews.zone_rating IS 'Valoración de la zona (1..5). Minimo 1, máximo 5.';

COMMENT ON COLUMN public.reviews.winter_comfort IS 'Confort térmico en invierno (hot|comfortable|cold).';

COMMENT ON COLUMN public.reviews.summer_comfort IS 'Confort térmico en verano (hot|comfortable|cold).';

COMMENT ON COLUMN public.reviews.humidity IS 'Humedad percibida (high|normal|low).';

COMMENT ON COLUMN public.reviews.likes IS 'Contador derivado por votos; mantenido por triggers.';

COMMENT ON COLUMN public.reviews.dislikes IS 'Contador derivado por votos; mantenido por triggers.';

COMMENT ON COLUMN public.reviews.created_at IS 'Fecha de creación.';

COMMENT ON COLUMN public.reviews.updated_at IS 'Fecha de última actualización (trigger).';

COMMENT ON COLUMN public.reviews.apartment_number IS 'Número de apartamento (si aplica).';

COMMENT ON COLUMN public.reviews.real_estate_experience IS 'Experiencia con la inmobiliaria (texto adicional). Opcional. Máximo 200 caracteres.';

COMMENT ON COLUMN public.reviews.deleted_at IS 'Soft delete de reseña.';

-- public.review_rooms
COMMENT ON TABLE public.review_rooms IS 'Detalle de ambientes/habitaciones asociados a una reseña.';

COMMENT ON COLUMN public.review_rooms.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.review_rooms.review_id IS 'Reseña a la que pertenece el ambiente (FK).';

COMMENT ON COLUMN public.review_rooms.room_type IS 'Tipo de ambiente (bedroom, kitchen, etc.).';

COMMENT ON COLUMN public.review_rooms.area_m2 IS 'Superficie aproximada en m².';

COMMENT ON COLUMN public.review_rooms.created_at IS 'Fecha de creación.';

COMMENT ON COLUMN public.review_rooms.updated_at IS 'Fecha de última actualización (trigger).';

-- public.rate_limits
COMMENT ON TABLE public.rate_limits IS 'Ventanas de rate limiting por usuario/endpoint (temporal; idealmente migrar a Redis).';

COMMENT ON COLUMN public.rate_limits.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.rate_limits.user_id IS 'Usuario afectado (FK a auth.users).';

COMMENT ON COLUMN public.rate_limits.ip_address IS 'IP del cliente (si corresponde).';

COMMENT ON COLUMN public.rate_limits.endpoint IS 'Endpoint o acción rate-limited.';

COMMENT ON COLUMN public.rate_limits.request_count IS 'Cantidad de requests en la ventana.';

COMMENT ON COLUMN public.rate_limits.window_start IS 'Inicio de la ventana temporal (redondeada).';

COMMENT ON COLUMN public.rate_limits.created_at IS 'Fecha de registro.';

-- public.security_logs
COMMENT ON TABLE public.security_logs IS 'Logs de seguridad y auditoría (acciones, estados, metadata).';

COMMENT ON COLUMN public.security_logs.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.security_logs.user_id IS 'Usuario relacionado al evento (FK a auth.users).';

COMMENT ON COLUMN public.security_logs.ip_address IS 'IP del cliente.';

COMMENT ON COLUMN public.security_logs.user_agent IS 'User-Agent del cliente.';

COMMENT ON COLUMN public.security_logs.endpoint IS 'Endpoint/Referer involucrado.';

COMMENT ON COLUMN public.security_logs.action IS 'Acción registrada (e.g., create_review).';

COMMENT ON COLUMN public.security_logs.status IS 'Estado (success|blocked|error).';

COMMENT ON COLUMN public.security_logs.error_message IS 'Mensaje de error (si aplica).';

COMMENT ON COLUMN public.security_logs.metadata IS 'Datos adicionales en JSONB.';

COMMENT ON COLUMN public.security_logs.created_at IS 'Fecha del evento.';

-- public.review_votes
COMMENT ON TABLE public.review_votes IS 'Votos de reseñas (like/dislike).';

COMMENT ON COLUMN public.review_votes.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.review_votes.review_id IS 'Reseña votada (FK).';

COMMENT ON COLUMN public.review_votes.user_id IS 'Usuario que vota (FK).';

COMMENT ON COLUMN public.review_votes.vote_type IS 'Tipo de voto (like|dislike).';

COMMENT ON COLUMN public.review_votes.created_at IS 'Fecha del voto.';

-- public.review_reports
COMMENT ON TABLE public.review_reports IS 'Reportes de reseñas por usuarios.';

COMMENT ON COLUMN public.review_reports.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.review_reports.review_id IS 'Reseña reportada (FK).';

COMMENT ON COLUMN public.review_reports.reported_by_user_id IS 'Usuario que reporta (FK).';

COMMENT ON COLUMN public.review_reports.reason IS 'Motivo principal del reporte. Máximo 200 caracteres.';

COMMENT ON COLUMN public.review_reports.description IS 'Descripción adicional (opcional). Máximo 500 caracteres.';

COMMENT ON COLUMN public.review_reports.status IS 'Estado del reporte (pending|reviewed|resolved|dismissed).';

COMMENT ON COLUMN public.review_reports.created_at IS 'Fecha de creación del reporte.';

COMMENT ON COLUMN public.review_reports.updated_at IS 'Fecha de última actualización del reporte.';

-- public.review_deletions
COMMENT ON TABLE public.review_deletions IS 'Auditoría de eliminaciones de reseñas (snapshot al borrar).';

COMMENT ON COLUMN public.review_deletions.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.review_deletions.review_id IS 'Reseña eliminada (FK).';

COMMENT ON COLUMN public.review_deletions.deleted_by IS 'Usuario que realizó la eliminación (FK).';

COMMENT ON COLUMN public.review_deletions.review_title IS 'Título original de la reseña. Máximo 200 caracteres.';

COMMENT ON COLUMN public.review_deletions.review_rating IS 'Rating original de la reseña.';

COMMENT ON COLUMN public.review_deletions.review_created_at IS 'Fecha de creación original de la reseña.';

COMMENT ON COLUMN public.review_deletions.deletion_reason IS 'Motivo de la eliminación (si se registra). Máximo 200 caracteres.';

COMMENT ON COLUMN public.review_deletions.deleted_at IS 'Fecha de eliminación.';

-- public.review_audit
COMMENT ON TABLE public.review_audit IS 'Auditoría de cambios (create/update/delete) en reseñas.';

COMMENT ON COLUMN public.review_audit.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.review_audit.review_id IS 'Reseña afectada (FK).';

COMMENT ON COLUMN public.review_audit.old_data IS 'Versión anterior (JSONB).';

COMMENT ON COLUMN public.review_audit.new_data IS 'Versión nueva (JSONB).';

COMMENT ON COLUMN public.review_audit.changed_by IS 'Usuario que cambió (FK).';

COMMENT ON COLUMN public.review_audit.change_type IS 'Tipo de cambio (create|update|delete).';

COMMENT ON COLUMN public.review_audit.created_at IS 'Fecha del evento de auditoría.';

-- public.real_estate_reviews
COMMENT ON TABLE public.real_estate_reviews IS 'Reseñas sobre inmobiliarias (no propiedades). Unicidad: por usuario solo 1 reseña por inmobiliaria (excluye soft-deletes).';

COMMENT ON COLUMN public.real_estate_reviews.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estate_reviews.real_estate_id IS 'Inmobiliaria reseñada (FK).';

COMMENT ON COLUMN public.real_estate_reviews.user_id IS 'Autor de la reseña (FK).';

COMMENT ON COLUMN public.real_estate_reviews.title IS 'Título de la reseña de inmobiliaria. Máximo 200 caracteres.';

COMMENT ON COLUMN public.real_estate_reviews.description IS 'Contenido de la reseña de inmobiliaria. Máximo 400 caracteres.';

COMMENT ON COLUMN public.real_estate_reviews.rating IS 'Calificación (1..5) de la inmobiliaria.';

COMMENT ON COLUMN public.real_estate_reviews.likes IS 'Likes recibidos (derivado por votos).';

COMMENT ON COLUMN public.real_estate_reviews.dislikes IS 'Dislikes recibidos (derivado por votos).';

COMMENT ON COLUMN public.real_estate_reviews.created_at IS 'Fecha de creación.';

COMMENT ON COLUMN public.real_estate_reviews.updated_at IS 'Fecha de última actualización (trigger).';

COMMENT ON COLUMN public.real_estate_reviews.deleted_at IS 'Soft delete; NULL si está activa.';

-- public.real_estate_review_votes
COMMENT ON TABLE public.real_estate_review_votes IS 'Votos (like/dislike) sobre reseñas de inmobiliarias.';

COMMENT ON COLUMN public.real_estate_review_votes.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estate_review_votes.real_estate_review_id IS 'Reseña de inmobiliaria votada (FK).';

COMMENT ON COLUMN public.real_estate_review_votes.user_id IS 'Usuario que vota (FK).';

COMMENT ON COLUMN public.real_estate_review_votes.user_id_snapshot IS 'Snapshot del user_id para auditoría/compliance.';

COMMENT ON COLUMN public.real_estate_review_votes.vote_type IS 'Tipo de voto (like|dislike).';

COMMENT ON COLUMN public.real_estate_review_votes.created_at IS 'Fecha del voto.';

COMMENT ON COLUMN public.real_estate_review_votes.updated_at IS 'Fecha de última actualización.';

-- public.real_estate_review_reports
COMMENT ON TABLE public.real_estate_review_reports IS 'Reportes sobre reseñas de inmobiliarias.';

COMMENT ON COLUMN public.real_estate_review_reports.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estate_review_reports.real_estate_review_id IS 'Reseña de inmobiliaria reportada (FK).';

COMMENT ON COLUMN public.real_estate_review_reports.reported_by_user_id IS 'Usuario que reporta (FK).';

COMMENT ON COLUMN public.real_estate_review_reports.reason IS 'Motivo principal del reporte. Máximo 200 caracteres. Máximo 200 caracteres.';

COMMENT ON COLUMN public.real_estate_review_reports.description IS 'Descripción adicional del reporte (opcional). Máximo 500 caracteres.';

COMMENT ON COLUMN public.real_estate_review_reports.status IS 'Estado (pending|reviewed|resolved|dismissed).';

COMMENT ON COLUMN public.real_estate_review_reports.created_at IS 'Fecha de creación del reporte.';

COMMENT ON COLUMN public.real_estate_review_reports.updated_at IS 'Fecha de última actualización del reporte.';

-- public.real_estate_reports
COMMENT ON TABLE public.real_estate_reports IS 'Reportes sobre inmobiliarias.';

COMMENT ON COLUMN public.real_estate_reports.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estate_reports.real_estate_id IS 'Inmobiliaria reportada (FK).';

COMMENT ON COLUMN public.real_estate_reports.reported_by_user_id IS 'Usuario que reporta (FK).';

COMMENT ON COLUMN public.real_estate_reports.reason IS 'Motivo del reporte. Máximo 200 caracteres.';

COMMENT ON COLUMN public.real_estate_reports.description IS 'Descripción adicional (opcional). Máximo 500 caracteres.';

COMMENT ON COLUMN public.real_estate_reports.status IS 'Estado (pending|reviewed|resolved|dismissed).';

COMMENT ON COLUMN public.real_estate_reports.created_at IS 'Fecha de creación del reporte.';

COMMENT ON COLUMN public.real_estate_reports.updated_at IS 'Fecha de última actualización del reporte.';

-- public.real_estate_votes
COMMENT ON TABLE public.real_estate_votes IS 'Votos (like/dislike) sobre inmobiliarias.';

COMMENT ON COLUMN public.real_estate_votes.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estate_votes.real_estate_id IS 'Inmobiliaria votada (FK).';

COMMENT ON COLUMN public.real_estate_votes.user_id IS 'Usuario que vota (FK).';

COMMENT ON COLUMN public.real_estate_votes.vote_type IS 'Tipo de voto (like|dislike).';

COMMENT ON COLUMN public.real_estate_votes.created_at IS 'Fecha del voto.';

COMMENT ON COLUMN public.real_estate_votes.updated_at IS 'Fecha de última actualización.';

-- public.real_estate_favorites
COMMENT ON TABLE public.real_estate_favorites IS 'Favoritos de inmobiliarias por usuario.';

COMMENT ON COLUMN public.real_estate_favorites.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.real_estate_favorites.real_estate_id IS 'Inmobiliaria marcada como favorita (FK).';

COMMENT ON COLUMN public.real_estate_favorites.user_id IS 'Usuario que marca como favorito (FK).';

COMMENT ON COLUMN public.real_estate_favorites.created_at IS 'Fecha de creación del favorito.';

-- public.review_favorites
COMMENT ON TABLE public.review_favorites IS 'Favoritos de reseñas por usuario.';

COMMENT ON COLUMN public.review_favorites.id IS 'Identificador único (UUID).';

COMMENT ON COLUMN public.review_favorites.review_id IS 'Reseña marcada como favorita (FK).';

COMMENT ON COLUMN public.review_favorites.user_id IS 'Usuario que marca como favorito (FK).';

COMMENT ON COLUMN public.review_favorites.created_at IS 'Fecha de creación del favorito.';