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