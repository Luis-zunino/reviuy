-- =============================================================================
-- ÍNDICES PARA TABLAS BASE
-- =============================================================================
-- Índices básicos para rate_limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON public.rate_limits (user_id, endpoint);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits (window_start);

-- Índice compuesto optimizado para check_rate_limit
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint_window ON public.rate_limits (user_id, endpoint, window_start);

-- Índices básicos para security_logs
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON public.security_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_security_logs_endpoint ON public.security_logs (endpoint);

CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_logs_status ON public.security_logs (status);

-- Índices para real_estates
CREATE INDEX IF NOT EXISTS idx_real_estates_name ON public.real_estates (name);

CREATE INDEX IF NOT EXISTS idx_real_estates_created_by ON public.real_estates (created_by);

CREATE INDEX IF NOT EXISTS idx_real_estates_created_at ON public.real_estates (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_real_estates_review_count ON public.real_estates (review_count DESC);

-- Índices para reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews (user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews (rating);

CREATE INDEX IF NOT EXISTS idx_reviews_real_estate_id ON public.reviews (real_estate_id);

CREATE INDEX IF NOT EXISTS idx_reviews_real_estate_id_rating ON public.reviews (real_estate_id, rating);

-- Búsqueda por dirección exacta
CREATE INDEX IF NOT EXISTS idx_reviews_address_text ON public.reviews (address_text);

-- Índice de búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_reviews_text_search ON public.reviews USING gin (
    to_tsvector('spanish', title || ' ' || description)
);

-- Índices condicionales para columnas opcionales
DO $$ BEGIN IF EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'reviews'
        AND column_name = 'address_osm_id'
) THEN CREATE INDEX IF NOT EXISTS idx_reviews_address_osm_id ON public.reviews(address_osm_id);

END IF;

-- Índices geográficos
IF EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'reviews'
        AND column_name = 'latitude'
)
AND EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'reviews'
        AND column_name = 'longitude'
) THEN CREATE INDEX IF NOT EXISTS idx_reviews_coordinates ON public.reviews(latitude, longitude)
;

END IF;

-- Índice para zone_rating
IF EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'reviews'
        AND column_name = 'zone_rating'
) THEN CREATE INDEX IF NOT EXISTS idx_reviews_zone_rating ON public.reviews(zone_rating)
WHERE
    zone_rating IS NOT NULL;

END IF;

-- Índice para property_type
IF EXISTS (
    SELECT
        1
    FROM
        information_schema.columns
    WHERE
        table_name = 'reviews'
        AND column_name = 'property_type'
) THEN CREATE INDEX IF NOT EXISTS idx_reviews_property_type ON public.reviews(property_type)
WHERE
    property_type IS NOT NULL;

END IF;

END $$;

CREATE INDEX IF NOT EXISTS idx_reviews_active ON public.reviews (id)
WHERE
    deleted_at IS NULL;

-- =============================================================================
-- ÍNDICES PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Índices para review_votes
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON public.review_votes (review_id);

CREATE INDEX IF NOT EXISTS idx_review_votes_user_id ON public.review_votes (user_id);

-- Índices para review_reports
CREATE INDEX IF NOT EXISTS idx_review_reports_review_id ON public.review_reports (review_id);

CREATE INDEX IF NOT EXISTS idx_review_reports_status ON public.review_reports (status);

CREATE INDEX IF NOT EXISTS idx_review_reports_created_at ON public.review_reports (created_at);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_review_deletions_deleted_by ON public.review_deletions (deleted_by);

CREATE INDEX IF NOT EXISTS idx_review_deletions_deleted_at ON public.review_deletions (deleted_at);

CREATE INDEX IF NOT EXISTS idx_review_audit_review_id ON public.review_audit (review_id);

CREATE INDEX IF NOT EXISTS idx_review_audit_change_type ON public.review_audit (change_type);

CREATE INDEX IF NOT EXISTS idx_review_audit_created_at ON public.review_audit (created_at DESC);

-- =============================================================================
-- ÍNDICES PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- Índices para real_estate_reviews
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_real_estate_id ON public.real_estate_reviews (real_estate_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_user_id ON public.real_estate_reviews (user_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_created_at ON public.real_estate_reviews (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_rating ON public.real_estate_reviews (rating);

CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_real_estate_rating ON public.real_estate_reviews (real_estate_id, rating);

-- Índices para real_estate_review_votes
CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_review_id ON public.real_estate_review_votes (real_estate_review_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_review_votes_user_id ON public.real_estate_review_votes (user_id);

-- Índices para real_estate_review_reports
CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_review_id ON public.real_estate_review_reports (real_estate_review_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_status ON public.real_estate_review_reports (status);

CREATE INDEX IF NOT EXISTS idx_real_estate_review_reports_created_at ON public.real_estate_review_reports (created_at);

-- Índices de búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_text_search ON public.real_estate_reviews USING gin (
    to_tsvector('spanish', title || ' ' || description)
);

CREATE INDEX IF NOT EXISTS idx_real_estate_reviews_active ON public.real_estate_reviews (id)
WHERE
    deleted_at IS NULL;

-- =============================================================================
-- Índices para mejor rendimiento
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_real_estate_votes_real_estate_id ON public.real_estate_votes (real_estate_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_votes_user_id ON public.real_estate_votes (user_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_reports_real_estate_id ON public.real_estate_reports (real_estate_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_reports_reported_by ON public.real_estate_reports (reported_by_user_id);

-- Índice compuesto para búsquedas de voto único por usuario y propiedad
CREATE INDEX IF NOT EXISTS idx_real_estate_votes_composite ON public.real_estate_votes (real_estate_id, user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_real_estate_id ON public.real_estate_favorites (real_estate_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_user_id ON public.real_estate_favorites (user_id);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_review_favorites_review_id ON public.review_favorites (review_id);

CREATE INDEX IF NOT EXISTS idx_review_favorites_user_id ON public.review_favorites (user_id);

-- Add missing indexes for foreign keys to improve join performance and avoid linter warnings.
-- 1. review_audit.changed_by
CREATE INDEX IF NOT EXISTS idx_review_audit_changed_by ON public.review_audit (changed_by);

-- 2. review_reports.reported_by_user_id
CREATE INDEX IF NOT EXISTS idx_review_reports_reported_by_user_id ON public.review_reports (reported_by_user_id);

-- 3. review_rooms.review_id
CREATE INDEX IF NOT EXISTS idx_review_rooms_review_id ON public.review_rooms (review_id);

-- Limpiar constraint antiguo si existe (mantener esta parte por seguridad)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_user_property_review' 
        AND table_name = 'reviews'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.reviews DROP CONSTRAINT unique_user_property_review;
        RAISE NOTICE 'Constraint antiguo unique_user_property_review eliminado';
    END IF;
END $$;

-- Eliminar índice antiguo si fue creado por error (preparar para 054)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_reviews_unique_user_property'
    ) THEN
        DROP INDEX CONCURRENTLY IF EXISTS public.idx_reviews_unique_user_property;
        RAISE NOTICE 'Índice antiguo idx_reviews_unique_user_property eliminado (será reemplazado por 054)';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error eliminando índice antiguo: %', SQLERRM;
END $$;

-- Add missing indexes for foreign keys to improve join performance and avoid linter warnings.
-- Uses CONCURRENTLY to avoid locking tables in production
-- NOTA: CONCURRENTLY + IF NOT EXISTS no funciona bien en transacciones, por eso usamos bloques DO
-- 1. review_audit.changed_by
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_review_audit_changed_by'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_review_audit_changed_by ON public.review_audit(changed_by)';
        RAISE NOTICE 'Índice idx_review_audit_changed_by creado';
    ELSE
        RAISE NOTICE 'Índice idx_review_audit_changed_by ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_review_audit_changed_by: %', SQLERRM;
END $$;

-- 2. review_reports.reported_by_user_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_review_reports_reported_by_user_id'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_review_reports_reported_by_user_id ON public.review_reports(reported_by_user_id)';
        RAISE NOTICE 'Índice idx_review_reports_reported_by_user_id creado';
    ELSE
        RAISE NOTICE 'Índice idx_review_reports_reported_by_user_id ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_review_reports_reported_by_user_id: %', SQLERRM;
END $$;

-- 3. review_rooms.review_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_review_rooms_review_id'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_review_rooms_review_id ON public.review_rooms(review_id)';
        RAISE NOTICE 'Índice idx_review_rooms_review_id creado';
    ELSE
        RAISE NOTICE 'Índice idx_review_rooms_review_id ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_review_rooms_review_id: %', SQLERRM;
END $$;

-- Enforce 1 review per user per property at the Database level (Review uniqueness constraints)
-- Uses CONCURRENTLY to avoid locking tables in production
-- NOTA: CONCURRENTLY + IF NOT EXISTS no funciona bien en transacciones, por eso usamos bloques DO
-- 1. Uniqueness for Reviews based on OSM ID
DO $$
BEGIN
    -- Primero eliminar índice antiguo si existe
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_reviews_user_address_osm_unique'
    ) THEN
        EXECUTE 'DROP INDEX CONCURRENTLY idx_reviews_user_address_osm_unique';
        RAISE NOTICE 'Índice antiguo idx_reviews_user_address_osm_unique eliminado';
    END IF;
    
    -- Crear nuevo índice
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_reviews_user_address_osm_unique'
    ) THEN
        EXECUTE 'CREATE UNIQUE INDEX CONCURRENTLY idx_reviews_user_address_osm_unique ON public.reviews(user_id, address_osm_id) WHERE deleted_at IS NULL';
        RAISE NOTICE 'Índice idx_reviews_user_address_osm_unique creado';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error manejando índice idx_reviews_user_address_osm_unique: %', SQLERRM;
END $$;

-- 2. Uniqueness for Real Estate Reviews table
DO $$
BEGIN
    -- Primero eliminar índice antiguo si existe
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_real_estate_reviews_user_re_unique'
    ) THEN
        EXECUTE 'DROP INDEX CONCURRENTLY public.idx_real_estate_reviews_user_re_unique';
        RAISE NOTICE 'Índice antiguo idx_real_estate_reviews_user_re_unique eliminado';
    END IF;
    
    -- Crear nuevo índice
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_real_estate_reviews_user_re_unique'
    ) THEN
        EXECUTE 'CREATE UNIQUE INDEX CONCURRENTLY idx_real_estate_reviews_user_re_unique ON public.real_estate_reviews(user_id, real_estate_id) WHERE deleted_at IS NULL';
        RAISE NOTICE 'Índice idx_real_estate_reviews_user_re_unique creado';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error manejando índice idx_real_estate_reviews_user_re_unique: %', SQLERRM;
END $$;

-- Enforce 1 review per user per property at the Database level (Review uniqueness constraints)
-- 1. Uniqueness for Reviews based on OSM ID

-- 2. Uniqueness for Real Estate Reviews table

-- Documentación de índices únicos (aclara condiciones parciales)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname = 'idx_reviews_user_address_osm_unique'
    ) THEN
        COMMENT ON INDEX idx_reviews_user_address_osm_unique IS
        'Unicidad por usuario+address_osm_id en reviews; aplica solo cuando deleted_at IS NULL. Garantiza 1 reseña por dirección OSM por usuario.';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname = 'idx_real_estate_reviews_user_re_unique'
    ) THEN
        COMMENT ON INDEX idx_real_estate_reviews_user_re_unique IS
        'Unicidad por usuario+real_estate_id en real_estate_reviews; aplica solo cuando deleted_at IS NULL. Garantiza 1 reseña por inmobiliaria por usuario.';
    END IF;
END $$;
-- =============================================================================
-- Usa CONCURRENTLY para evitar locks en tablas con datos existentes
-- NOTA: CONCURRENTLY + IF NOT EXISTS no funciona bien en transacciones, por eso usamos bloques DO
-- =============================================================================
-- Índice para búsquedas "Mis reseñas" (user_id + ordenado por created_at DESC)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_reviews_user_created_at'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_reviews_user_created_at ON public.reviews(user_id, created_at DESC) WHERE deleted_at IS NULL';
        RAISE NOTICE 'Índice idx_reviews_user_created_at creado';
    ELSE
        RAISE NOTICE 'Índice idx_reviews_user_created_at ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_reviews_user_created_at: %', SQLERRM;
END $$;

-- Índice para búsquedas de reseñas recientes por propiedad
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_real_estate_reviews_re_created'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_real_estate_reviews_re_created ON public.real_estate_reviews(real_estate_id, created_at DESC) WHERE deleted_at IS NULL';
        RAISE NOTICE 'Índice idx_real_estate_reviews_re_created creado';
    ELSE
        RAISE NOTICE 'Índice idx_real_estate_reviews_re_created ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_real_estate_reviews_re_created: %', SQLERRM;
END $$;

-- Índice para contar votos por tipo en una propiedad
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_real_estate_votes_type'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_real_estate_votes_type ON public.real_estate_votes(real_estate_id, vote_type)';
        RAISE NOTICE 'Índice idx_real_estate_votes_type creado';
    ELSE
        RAISE NOTICE 'Índice idx_real_estate_votes_type ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_real_estate_votes_type: %', SQLERRM;
END $$;

-- Índice para búsquedas en reported_by_user_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_real_estate_votes_reported_by'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_real_estate_votes_reported_by ON public.real_estate_reports(reported_by_user_id)';
        RAISE NOTICE 'Índice idx_real_estate_votes_reported_by creado';
    ELSE
        RAISE NOTICE 'Índice idx_real_estate_votes_reported_by ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_real_estate_votes_reported_by: %', SQLERRM;
END $$;

-- Índice para búsquedas por status en reports
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_real_estate_reports_status'
    ) THEN
        EXECUTE 'CREATE INDEX CONCURRENTLY idx_real_estate_reports_status ON public.real_estate_reports(status)';
        RAISE NOTICE 'Índice idx_real_estate_reports_status creado';
    ELSE
        RAISE NOTICE 'Índice idx_real_estate_reports_status ya existe';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creando índice idx_real_estate_reports_status: %', SQLERRM;
END $$;

-- =============================================================================
-- =============================================================================
-- Descripción: Optimiza queries de rate limiting y documenta migración a Redis
-- =============================================================================
-- PostgreSQL NO es ideal para rate limiting por:
-- 1. High-frequency writes causan contención en la tabla
-- 2. COUNT(*) queries son lentas con muchos registros
-- 3. Autovacuum overhead puede causar lock contention
--
-- =============================================================================
-- NOTA: CONCURRENTLY + IF NOT EXISTS no funciona bien en transacciones, por eso usamos bloques DO
-- 1. Índice compuesto para optimizar la query principal
DO $$
BEGIN
    -- Eliminar índice antiguo si existe
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_rate_limits_lookup'
    ) THEN
        DROP INDEX IF EXISTS idx_rate_limits_lookup;
        RAISE NOTICE 'Índice antiguo idx_rate_limits_lookup eliminado';
    END IF;
    
    -- Crear nuevo índice
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_rate_limits_lookup'
    ) THEN
        EXECUTE 'CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(user_id, endpoint, window_start DESC)';
        RAISE NOTICE 'Índice idx_rate_limits_lookup creado';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error manejando índice idx_rate_limits_lookup: %', SQLERRM;
END $$;

-- 2. Índice para cleanup eficiente
DO $$
BEGIN
    -- Eliminar índice antiguo si existe
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_rate_limits_cleanup'
    ) THEN
        DROP INDEX IF EXISTS idx_rate_limits_cleanup;
        RAISE NOTICE 'Índice antiguo idx_rate_limits_cleanup eliminado';
    END IF;
    
    -- Crear nuevo índice
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND indexname = 'idx_rate_limits_cleanup'
    ) THEN
        EXECUTE 'CREATE INDEX idx_rate_limits_cleanup ON public.rate_limits(window_start) WHERE window_start < NOW() - INTERVAL ''24 hours''';
        RAISE NOTICE 'Índice idx_rate_limits_cleanup creado';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error manejando índice idx_rate_limits_cleanup: %', SQLERRM;
END $$;