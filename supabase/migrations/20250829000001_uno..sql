-- =============================================================================
-- MIGRACIÓN 1: ESTRUCTURA BASE DE REVIUY
-- Fecha: 09 de octubre de 2025
-- Descripción: Tablas principales y estructura base
-- =============================================================================
-- Tabla de inmobiliarias
CREATE TABLE IF NOT EXISTS public.real_estates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    review_count INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_by UUID REFERENCES auth.users(id) ON DELETE
    SET
        NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(name)
);

-- Tabla principal de reseñas de propiedades
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    real_estate_id UUID REFERENCES public.real_estates(id) ON DELETE
    SET
        NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (
            rating >= 1
            AND rating <= 5
        ),
        property_type TEXT CHECK (property_type IN ('apartment', 'house', 'room')),
        address_text TEXT,
        address_osm_id TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        zone_rating INTEGER CHECK (
            zone_rating >= 1
            AND zone_rating <= 5
        ),
        winter_comfort_rating INTEGER CHECK (
            winter_comfort_rating >= 1
            AND winter_comfort_rating <= 5
        ),
        summer_comfort_rating INTEGER CHECK (
            summer_comfort_rating >= 1
            AND summer_comfort_rating <= 5
        ),
        winter_comfort TEXT CHECK (winter_comfort IN ('hot', 'comfortable', 'cold')),
        summer_comfort TEXT CHECK (summer_comfort IN ('hot', 'comfortable', 'cold')),
        humidity TEXT CHECK (humidity IN ('high', 'normal', 'low')),
        humidity_level TEXT CHECK (humidity_level IN ('Bajo', 'Medio', 'Alto')),
        likes INTEGER NOT NULL DEFAULT 0,
        dislikes INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla de rooms asociados a reviews
CREATE TABLE IF NOT EXISTS public.review_rooms (
    id uuid primary key default gen_random_uuid(),
    review_id uuid not null references public.reviews(id) on delete cascade,
    room_type text,
    area_m2 numeric,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- =============================================================================
-- ÍNDICES PARA TABLAS BASE
-- =============================================================================
-- Índices para real_estates
CREATE INDEX IF NOT EXISTS idx_real_estates_name ON public.real_estates(name);

CREATE INDEX IF NOT EXISTS idx_real_estates_created_by ON public.real_estates(created_by);

CREATE INDEX IF NOT EXISTS idx_real_estates_created_at ON public.real_estates(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_real_estates_review_count ON public.real_estates(review_count DESC);

-- Índices para reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

CREATE INDEX IF NOT EXISTS idx_reviews_real_estate_id ON public.reviews(real_estate_id);

CREATE INDEX IF NOT EXISTS idx_reviews_real_estate_id_rating ON public.reviews(real_estate_id, rating);

-- Índice de búsqueda de texto completo
CREATE INDEX IF NOT EXISTS idx_reviews_text_search ON public.reviews USING gin(
    to_tsvector('spanish', title || ' ' || description)
);

-- Índices condicionales para columnas opcionales
DO $$ BEGIN -- Índice para address_osm_id
IF EXISTS (
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
WHERE
    latitude IS NOT NULL
    AND longitude IS NOT NULL;

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

-- =============================================================================
-- FUNCIONES BASE
-- =============================================================================
-- Función para actualizar timestamp de updated_at
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ LANGUAGE plpgsql;

-- =============================================================================
-- TRIGGERS BASE
-- =============================================================================
-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;

CREATE TRIGGER update_reviews_updated_at BEFORE
UPDATE
    ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_real_estates_updated_at ON public.real_estates;

CREATE TRIGGER update_real_estates_updated_at BEFORE
UPDATE
    ON public.real_estates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_review_rooms_updated_at ON public.review_rooms;

CREATE TRIGGER update_review_rooms_updated_at BEFORE
UPDATE
    ON public.review_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- RLS BASE
-- =============================================================================
-- Habilitar RLS en tablas base
ALTER TABLE
    public.reviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    public.real_estates ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    public.review_rooms ENABLE ROW LEVEL SECURITY;

-- Políticas para REVIEWS
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;

CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR
INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Users can update own reviews" ON public.reviews FOR
UPDATE
    USING (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    ) WITH CHECK (
        auth.uid() IS NOT NULL
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
);

-- Políticas para REAL_ESTATES
DROP POLICY IF EXISTS "Anyone can view real estates" ON public.real_estates;

CREATE POLICY "Anyone can view real estates" ON public.real_estates FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create real estates" ON public.real_estates;

CREATE POLICY "Authenticated users can create real estates" ON public.real_estates FOR
INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
            created_by = auth.uid()
            OR created_by IS NULL
        )
    );

DROP POLICY IF EXISTS "Creators can update their real estates" ON public.real_estates;

CREATE POLICY "Creators can update their real estates" ON public.real_estates FOR
UPDATE
    USING (
        auth.uid() IS NOT NULL
        AND (
            created_by = auth.uid()
            OR created_by IS NULL
        )
    );

DROP POLICY IF EXISTS "Creators can delete their real estates" ON public.real_estates;

CREATE POLICY "Creators can delete their real estates" ON public.real_estates FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND (
        created_by = auth.uid()
        OR created_by IS NULL
    )
);

-- Políticas para REVIEW_ROOMS
DROP POLICY IF EXISTS "Anyone can view review rooms" ON public.review_rooms;

CREATE POLICY "Anyone can view review rooms" ON public.review_rooms FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage rooms of their reviews" ON public.review_rooms;

CREATE POLICY "Users can manage rooms of their reviews" ON public.review_rooms FOR ALL USING (
    EXISTS (
        SELECT
            1
        FROM
            public.reviews
        WHERE
            reviews.id = review_rooms.review_id
            AND reviews.user_id = auth.uid()
    )
);

-- =============================================================================
-- MIGRACIÓN 1 COMPLETADA
-- =============================================================================
DO $$ BEGIN RAISE NOTICE 'Migración 1 completada: Estructura base creada (real_estates, reviews, review_rooms)';

END $$;