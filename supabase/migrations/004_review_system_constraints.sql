-- =============================================================================
-- VALIDACIÓN Y LIMPIEZA DE DATOS ANTES DE AGREGAR CONSTRAINTS
-- =============================================================================

-- Paso 1: Ahora agregar los constraints (los datos ya están limpios)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_latitude' AND table_name = 'reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE reviews ADD CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_longitude' AND table_name = 'reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE reviews ADD CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_rating' AND table_name = 'real_estate_reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE real_estate_reviews ADD CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;


-- En real_estates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_rating_range' AND table_name = 'real_estates' AND constraint_type = 'CHECK') THEN
        ALTER TABLE real_estates ADD CONSTRAINT check_rating_range CHECK (rating >= 0 AND rating <= 5);
    END IF;
END $$;

-- En reviews
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_zone_rating' AND table_name = 'reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE reviews ADD CONSTRAINT check_zone_rating CHECK (zone_rating >= 1 AND zone_rating <= 5);
    END IF;
END $$;
