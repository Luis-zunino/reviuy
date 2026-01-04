-- =============================================================================
-- MIGRACIÓN: RESTRICCIÓN DE RESEÑA ÚNICA POR PROPIEDAD
-- Fecha: 03 de enero de 2026
-- Descripción: Restringe a los usuarios a una sola reseña por propiedad (usando address_osm_id)
-- =============================================================================

-- 1. Agregar restricción única a la tabla reviews
-- Nota: Esto fallará si ya existen duplicados. 
-- Asumimos que es una base de datos nueva o limpia, o que el usuario limpiará duplicados manualmente si falla.
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_user_property_review UNIQUE (user_id, address_osm_id);

-- 2. Actualizar función create_review para manejar la restricción elegantemente
CREATE OR REPLACE FUNCTION create_review(
    p_title TEXT,
    p_description TEXT,
    p_rating INTEGER,
    p_real_estate_id UUID DEFAULT NULL,
    p_property_type TEXT DEFAULT NULL,
    p_address_text TEXT DEFAULT NULL,
    p_address_osm_id TEXT DEFAULT NULL,
    p_latitude DECIMAL DEFAULT NULL,
    p_longitude DECIMAL DEFAULT NULL,
    p_zone_rating INTEGER DEFAULT NULL,
    p_winter_comfort_rating INTEGER DEFAULT NULL,
    p_summer_comfort_rating INTEGER DEFAULT NULL,
    p_winter_comfort TEXT DEFAULT NULL,
    p_summer_comfort TEXT DEFAULT NULL,
    p_humidity TEXT DEFAULT NULL,
    p_humidity_level TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_review_id UUID;
    v_user_id UUID;
BEGIN
    -- Obtener el ID del usuario autenticado
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado. Debes iniciar sesión para crear una reseña.'
        );
    END IF;

    -- Validar campos obligatorios
    IF p_title IS NULL OR p_title = '' THEN
        RETURN json_build_object('success', false, 'error', 'El título es obligatorio');
    END IF;

    IF p_description IS NULL OR p_description = '' THEN
        RETURN json_build_object('success', false, 'error', 'La descripción es obligatoria');
    END IF;

    -- Validar rating
    IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
        RETURN json_build_object('success', false, 'error', 'El rating debe estar entre 1 y 5');
    END IF;

    -- Limpiar campos opcionales que vengan vacíos
    IF p_property_type IS NOT NULL AND p_property_type = '' THEN
        p_property_type := NULL;
    END IF;
    IF p_address_text IS NOT NULL AND p_address_text = '' THEN
        p_address_text := NULL;
    END IF;
    IF p_address_osm_id IS NOT NULL AND p_address_osm_id = '' THEN
        p_address_osm_id := NULL;
    END IF;
    IF p_winter_comfort IS NOT NULL AND p_winter_comfort = '' THEN
        p_winter_comfort := NULL;
    END IF;
    IF p_summer_comfort IS NOT NULL AND p_summer_comfort = '' THEN
        p_summer_comfort := NULL;
    END IF;
    IF p_humidity IS NOT NULL AND p_humidity = '' THEN
        p_humidity := NULL;
    END IF;
    IF p_humidity_level IS NOT NULL AND p_humidity_level = '' THEN
        p_humidity_level := NULL;
    END IF;

    -- VERIFICACIÓN DE DUPLICADOS
    -- Si tenemos un address_osm_id, verificar si ya existe una reseña para este usuario y propiedad
    IF p_address_osm_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 
            FROM public.reviews 
            WHERE user_id = v_user_id 
            AND address_osm_id = p_address_osm_id
        ) THEN
            RETURN json_build_object(
                'success', false,
                'error', 'Ya has publicado una reseña para esta propiedad. Solo puedes escribir una reseña por propiedad.'
            );
        END IF;
    END IF;

    -- Insertar la nueva reseña
    INSERT INTO public.reviews (
        user_id,
        title,
        description,
        rating,
        real_estate_id,
        property_type,
        address_text,
        address_osm_id,
        latitude,
        longitude,
        zone_rating,
        winter_comfort_rating,
        summer_comfort_rating,
        winter_comfort,
        summer_comfort,
        humidity,
        humidity_level
    ) VALUES (
        v_user_id,
        p_title,
        p_description,
        p_rating,
        p_real_estate_id,
        p_property_type,
        p_address_text,
        p_address_osm_id,
        p_latitude,
        p_longitude,
        p_zone_rating,
        p_winter_comfort_rating,
        p_summer_comfort_rating,
        p_winter_comfort,
        p_summer_comfort,
        p_humidity,
        p_humidity_level
    )
    RETURNING id INTO v_review_id;

    RETURN json_build_object(
        'success', true,
        'review_id', v_review_id,
        'message', 'Reseña creada exitosamente'
    );

EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Ya has publicado una reseña para esta propiedad.'
        );
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error al crear la reseña: ' || SQLERRM
        );
END;
$$;
