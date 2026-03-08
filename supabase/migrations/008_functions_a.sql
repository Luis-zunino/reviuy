--=============================================================================
-- MIGRACIÓN 002: FUNCIONES AUXILIARES
--=============================================================================
-- 1.Función de rate limiting optimizada 
drop function IF exists check_rate_limit (TEXT, INTEGER, INTEGER);

create or replace function check_rate_limit (
  p_endpoint text,
  p_max_requests integer default 10,
  p_window_minutes integer default 1
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id UUID;
    v_window_start TIMESTAMPTZ;
    v_current_count INTEGER;
 BEGIN
    v_user_id := auth.uid();

    -- Calcular ventana de tiempo (redondear a minuto completo)
    v_window_start := date_trunc('minute', NOW());
 
    -- Query optimizada: usar índice compuesto y evitar SUM()
    -- Solo contar en la ventana actual (reduce filas escaneadas)
    SELECT
        COALESCE(request_count, 0) INTO v_current_count
    FROM
        public.rate_limits
    WHERE
        user_id = v_user_id
        AND endpoint = p_endpoint
        AND window_start = v_window_start;

    -- Verificar límite
    IF v_current_count >= p_max_requests THEN
        -- Log solo en casos de rate LIMIT excedido (reduce writes)
        PERFORM log_security_event(
            'rate_limit_exceeded',
            'blocked',
            'Rate limit exceeded for endpoint: ' || p_endpoint,
            jsonb_build_object(
                'endpoint', p_endpoint,
                'max_requests', p_max_requests,
                'window_minutes', p_window_minutes,
                'current_count', v_current_count
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
        )
    ON CONFLICT (user_id, endpoint, window_start) DO UPDATE
    SET
        request_count = rate_limits.request_count + 1;

    RETURN TRUE;

EXCEPTION
    WHEN OTHERS THEN
        -- En caso de error, permitir (fail open) para no bloquear usuarios
        RAISE WARNING 'Error en check_rate_limit: %', SQLERRM;
        RETURN TRUE;
END;
$$;

-- 4. Mejorar la función de cleanup (no ejecutar COUNT en cada insert)
drop function IF exists cleanup_rate_limits_on_insert () CASCADE;

-- Nueva estrategia: Cleanup probabilístico (1% de chance por insert)
create or replace function cleanup_rate_limits_on_insert () RETURNS TRIGGER as $$
BEGIN
    -- Solo limpiar el 1% de las veces (reduce overhead)
    IF random() < 0.01 THEN
        -- DELETE con LIMIT para evitar locks largos
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
            1000  -- Limitar para evitar lock largo
    );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recrear TRIGGER (solo si la tabla existe)
do $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM
            information_schema.tables
        WHERE
            table_name = 'rate_limits'
            AND table_schema = 'public'
    ) THEN
        DROP TRIGGER IF EXISTS cleanup_rate_limits_trigger ON public.rate_limits;

        CREATE TRIGGER cleanup_rate_limits_trigger
            AFTER INSERT ON public.rate_limits
            FOR EACH ROW
            EXECUTE FUNCTION cleanup_rate_limits_on_insert();

        RAISE NOTICE 'Trigger cleanup_rate_limits_trigger recreado';
    ELSE
        RAISE WARNING 'Tabla rate_limits no existe aún. El trigger se creará cuando la tabla sea creada.';
    END IF;
END $$;

-- =============================================================================
-- MÉTRICAS Y MONITOREO
-- =============================================================================
-- View para monitorear rate limiting
do $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM
            information_schema.tables
        WHERE
            table_name = 'rate_limits'
            AND table_schema = 'public'
    ) THEN
       EXECUTE '
CREATE OR REPLACE VIEW rate_limit_stats AS
SELECT
    endpoint,
    COUNT(DISTINCT user_id) AS unique_users,
    SUM(request_count) AS total_requests,
    AVG(request_count) AS avg_requests_per_window,
    MAX(request_count) AS max_requests_per_window,
    MAX(window_start) AS last_request_time
FROM
    public.rate_limits
WHERE
    window_start > NOW() - INTERVAL ''1 hour''
GROUP BY
    endpoint
ORDER BY
    total_requests DESC
';
    ELSE
        RAISE WARNING 'Table rate_limits does not exist yet. View will be created when table is created.';
    END IF;
END $$;

COMMENT on FUNCTION check_rate_limit is 'Rate limiting en PostgreSQL (TEMPORAL). Migrar a Redis en producción para mejor performance.';

-- =============================================================================
-- FUNCIONES BASE
-- =============================================================================
-- Función para actualizar timestamp de updated_at
create or replace function update_updated_at_column () RETURNS TRIGGER as $$
BEGIN
    IF NEW IS DISTINCT FROM OLD THEN
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función básica de logging de seguridad
create or replace function log_security_event (
  p_action text,
  p_status text default 'success',
  p_error_message text default null,
  p_metadata jsonb default null
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
BEGIN
    INSERT INTO
        public.security_logs (
            user_id,
            ip_address,
            user_agent,
            endpoint,
            action,
            status,
            error_message,
            metadata,
            created_at
        )
    VALUES
        (
            COALESCE(auth.uid(), NULL),
            inet_client_addr(),
            COALESCE(
                current_setting('request.headers', true)::json->>'user-agent',
                'unknown'
            ),
            COALESCE(
                current_setting('request.headers', true)::json->>'referer',
                'unknown'
            ),
            p_action,
            p_status,
            p_error_message,
            COALESCE(p_metadata, '{}'::jsonb),
            now()
        );
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en log_security_event: %', SQLERRM;
END;
$$;

COMMENT on FUNCTION log_security_event is 'Función básica de logging. Puede ser sobrescrita en migraciones posteriores.';

-- =============================================================================
-- FUNCIONES PARA SISTEMA DE REVIEWS
-- =============================================================================
-- Los contadores de likes/dislikes se calculan dinámicamente usando vistas materializadas
DROP FUNCTION IF EXISTS update_review_votes() CASCADE;

-- Función para actualizar contadores de inmobiliarias
create or replace function update_real_estate_counters () RETURNS TRIGGER as $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.real_estate_id IS NOT NULL THEN
            PERFORM 1 FROM public.real_estates WHERE id = NEW.real_estate_id FOR UPDATE;
            UPDATE public.real_estates
            SET review_count = review_count + 1,
                updated_at = NOW()
            WHERE id = NEW.real_estate_id;
        END IF;

    ELSIF (TG_OP = 'UPDATE') THEN
        IF OLD.real_estate_id IS DISTINCT FROM NEW.real_estate_id THEN
            IF OLD.real_estate_id IS NOT NULL THEN
                PERFORM 1 FROM public.real_estates WHERE id = OLD.real_estate_id FOR UPDATE;
                UPDATE public.real_estates
                SET review_count = GREATEST(0, review_count - 1),
                    updated_at = NOW()
                WHERE id = OLD.real_estate_id;
            END IF;

            IF NEW.real_estate_id IS NOT NULL THEN
                PERFORM 1 FROM public.real_estates WHERE id = NEW.real_estate_id FOR UPDATE;
                UPDATE public.real_estates
                SET review_count = review_count + 1,
                    updated_at = NOW()
                WHERE id = NEW.real_estate_id;
            END IF;
        END IF;

    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.real_estate_id IS NOT NULL THEN
            PERFORM 1 FROM public.real_estates WHERE id = OLD.real_estate_id FOR UPDATE;
            UPDATE public.real_estates
            SET review_count = GREATEST(0, review_count - 1),
                updated_at = NOW()
            WHERE id = OLD.real_estate_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Función para auditoría completa de cambios
-- Con manejo de excepciones para no bloquear operaciones principales
create or replace function log_review_changes () RETURNS TRIGGER as $$
BEGIN
    BEGIN
        IF (
            TG_OP = 'UPDATE'
            AND OLD IS DISTINCT FROM NEW
        ) THEN
INSERT INTO
    public.review_audit (
        review_id,
        old_data,
        new_data,
        changed_by,
        change_type
    )
VALUES
    (
        OLD.id,
        row_to_json(OLD),
        row_to_json(NEW),
        auth.uid(),
        'update'
    );

    ELSIF (TG_OP = 'INSERT') THEN
INSERT INTO
    public.review_audit (
        review_id,
        new_data,
        changed_by,
        change_type
    )
VALUES
    (
        NEW.id,
        row_to_json(NEW),
        NEW.user_id,
        'create'
    );

END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Log del error pero NO bloquear la operación principal
        RAISE WARNING 'Error al registrar auditoría para review_id %: %',
COALESCE(NEW.id, OLD.id),
SQLERRM;

    END;

    RETURN COALESCE(NEW, OLD);
END;

$$ LANGUAGE plpgsql;

-- Función para registrar eliminaciones
-- Con manejo de excepciones para no bloquear la eliminación de reviews
create or replace function log_review_deletion () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
BEGIN
    BEGIN
        INSERT INTO public.review_deletions (
            review_id,
            deleted_by,
            review_title,
            review_rating,
            review_created_at
        )
        VALUES (
            OLD.id,
            COALESCE(auth.uid(), OLD.user_id),
            OLD.title,
            OLD.rating,
            OLD.created_at
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Log del error pero NO bloquear la eliminación
            RAISE WARNING 'Error al registrar eliminación de review_id %: %', OLD.id, SQLERRM;
    END;

    RETURN OLD;
END;
$$;

-- Función para crear reseñas
create or replace function public.create_review (
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
set
  search_path = public as $$
DECLARE
    v_review_id UUID;
    v_user_id UUID;
        v_room_count INTEGER := 0;
BEGIN
    -- Verificar rate limit (5 reseñas por 10 minutos)
    IF NOT check_rate_limit('create_review', 5, 10) THEN
        PERFORM log_security_event('create_review', 'blocked', 'Rate limit exceeded');
        RETURN ( false, NULL, NULL, 'Demasiadas reseñas. Intenta más tarde.');
    END IF;

    -- Usuario autenticado
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        PERFORM log_security_event('create_review', 'error', 'Usuario no autenticado');
        RETURN ( false, NULL, NULL, 'Usuario no autenticado. Debes iniciar sesión para crear una reseña.');
    END IF;
    -- Validaciones obligatorias
    IF p_title IS NULL OR btrim(p_title) = '' THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            'Título obligatorio faltante'
        );
        RETURN (
            false,
            NULL,
            NULL,
            'El título es obligatorio'
        );
    END IF;


    IF p_description IS NULL OR btrim(p_description) = '' THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            'Descripción obligatoria faltante'
        );
        RETURN (
            false,
            NULL,
            NULL,
            'La descripción es obligatoria'
        );
    END IF;

    IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            'Rating inválido'
        );

        RETURN (
            false,
            NULL,
            NULL,
            'El rating debe estar entre 1 y 5'
        );
    END IF;

    IF p_address_text IS NULL OR btrim(p_address_text) = '' THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            'address_text requerido'
        );

        RETURN (
            false,
            NULL,
            NULL,
            'La dirección (address_text) es obligatoria'
        );
    END IF;

    IF p_address_osm_id IS NULL OR btrim(p_address_osm_id) = '' THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            'address_osm_id requerido'
        );

        RETURN (
            false,
            NULL,
            NULL,
            'El OSM ID (address_osm_id) es obligatorio'
        );
    END IF;

    IF p_latitude IS NULL OR p_longitude IS NULL THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            'Coordenadas requeridas'
        );

        RETURN (
            false,
            NULL,
            NULL,
            'Latitud y longitud son obligatorias'
        );
    END IF;

    -- Normalizar campos opcionales vacíos
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

    -- Verificación de duplicados (una reseña por usuario y propiedad)
    IF EXISTS (
        SELECT 1
        FROM public.reviews
        WHERE user_id = v_user_id
          AND address_osm_id = p_address_osm_id
          AND deleted_at IS NULL
    ) THEN
        PERFORM log_security_event(
            'create_review',
            'blocked',
            'Duplicate review attempt (OSM ID)'
        );

        RETURN (
            false,
            NULL,
            NULL,
            'Ya has publicado una reseña para esta propiedad. Solo puedes escribir una reseña por propiedad.'
        );
    END IF;

    -- Insertar reseña
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
        winter_comfort,
        summer_comfort,
        humidity,
        real_estate_experience,
        apartment_number
    )
VALUES
    (
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
        p_winter_comfort,
        p_summer_comfort,
        p_humidity,
        p_real_estate_experience,
        p_apartment_number
    ) RETURNING id INTO v_review_id;

    -- Insertar habitaciones asociadas de forma atómica dentro de la misma transacción
    IF p_review_rooms IS NOT NULL THEN
        IF jsonb_typeof(p_review_rooms) <> 'array' THEN
            RETURN (
                false,
                NULL,
                NULL,
                'review_rooms debe ser un arreglo JSON'
            );
        END IF;

        IF jsonb_array_length(p_review_rooms) > 0 THEN
            INSERT INTO public.review_rooms (
                review_id,
                room_type,
                area_m2
            )
            SELECT
                v_review_id,
                NULLIF(btrim(room->>'room_type'), '')::text,
                CASE
                    WHEN room ? 'area_m2'
                     AND room->>'area_m2' IS NOT NULL
                     AND btrim(room->>'area_m2') <> ''
                    THEN (room->>'area_m2')::numeric
                    ELSE NULL
                END
            FROM jsonb_array_elements(p_review_rooms) AS room;

            GET DIAGNOSTICS v_room_count = ROW_COUNT;
        END IF;
    END IF;

    -- Log exitoso
    PERFORM log_security_event(
    'create_review',
    'success',
    NULL,
    jsonb_build_object('review_id', v_review_id)
);

    RETURN (
        true,
        v_review_id,
        CASE
            WHEN v_room_count > 0 THEN 'Reseña creada exitosamente con ' || v_room_count || ' habitaciones'
            ELSE 'Reseña creada exitosamente'
        END,
        NULL
    );

EXCEPTION 
  WHEN unique_violation THEN
    RETURN (
      false,
      NULL,
      NULL,
      'Ya has publicado una reseña para esta propiedad.'
    );
    WHEN OTHERS THEN
        PERFORM log_security_event(
            'create_review',
            'error',
            SQLERRM
        );

        RETURN (
            false,
            NULL,
            NULL,
            'Error al crear la reseña: ' || SQLERRM
        );
END;
$$;

-- Función para eliminar una reseña de forma segura
create or replace function delete_review_safe (review_id_param uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    review_owner UUID;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado';
    END IF;

    SELECT user_id INTO review_owner
    FROM public.reviews
    WHERE id = review_id_param;

    IF review_owner IS NULL THEN
        RAISE EXCEPTION 'Reseña no encontrada';
    END IF;

    IF review_owner != current_user_id THEN
        RAISE EXCEPTION 'No tienes permisos para eliminar esta reseña';
    END IF;

    DELETE FROM public.reviews
    WHERE id = review_id_param;

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al eliminar reseña: %', SQLERRM;
END;
$$;

-- Función para obtener estadísticas antes de eliminar
create or replace function public.get_review_delete_info (review_id_param uuid) RETURNS public.get_review_delete_info_result LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    result public.get_review_delete_info_result;
    current_user_id uuid;
BEGIN
    current_user_id := auth.uid();

    IF current_user_id IS NULL THEN
        result.error := 'Usuario no autenticado';
        RETURN result;
    END IF;

    SELECT
        r.id,
        r.title,
        r.created_at,
        r.rating,
        COALESCE(stats.likes, 0),
        COALESCE(stats.dislikes, 0),
        (r.user_id = current_user_id),
        (
            SELECT COUNT(*)
            FROM public.review_votes rv
            WHERE rv.review_id = r.id
        ),
        NULL
    INTO result
    FROM public.reviews r
    LEFT JOIN public.review_vote_stats stats ON r.id = stats.review_id
    WHERE r.id = review_id_param;

    IF NOT FOUND THEN
        result.error := 'Reseña no encontrada';
    END IF;

    RETURN result;
END;
$$;

-- Función para actualizar una reseña 
create or replace function public.update_review (
  p_review_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_rating INTEGER,
  p_property_type TEXT default null,
  p_zone_rating INTEGER default null,
  p_winter_comfort TEXT default null,
  p_summer_comfort TEXT default null,
  p_humidity TEXT default null
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id UUID;
    v_review_owner UUID;
BEGIN
    -- Usuario autenticado
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;

    -- Rate limiting: máx 10 actualizaciones por hora
    IF NOT check_rate_limit('update_review', 10, 3600) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Límite de actualizaciones alcanzado. Intenta nuevamente en una hora.'
        );
    END IF;

    -- Verificar existencia y ownership
    SELECT user_id
    INTO v_review_owner
    FROM public.reviews
    WHERE id = p_review_id
      AND deleted_at IS NULL;

    IF v_review_owner IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'La reseña no existe'
        );
    END IF;

    IF v_review_owner <> v_user_id THEN
        RETURN json_build_object(
            'success', false,
            'error', 'No tienes permisos para editar esta reseña'
        );
    END IF;

    -- Actualización
    UPDATE public.reviews
    SET
        title = p_title,
        description = p_description,
        rating = p_rating,
        property_type = COALESCE(p_property_type, property_type),
        zone_rating = COALESCE(p_zone_rating, zone_rating),
        winter_comfort = COALESCE(p_winter_comfort, winter_comfort),
        summer_comfort = COALESCE(p_summer_comfort, summer_comfort),
        humidity = COALESCE(p_humidity, humidity),
        updated_at = now()
    WHERE id = p_review_id;

    RETURN json_build_object(
        'success', true,
        'message', 'Reseña actualizada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error interno del servidor'
        );
END;
$$;