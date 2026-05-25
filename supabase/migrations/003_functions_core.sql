-- =============================================================================
-- MIGRACIÓN 003: FUNCIONES CORE
-- =============================================================================
-- Este archivo agrupa las funciones RPC del sistema.
--  
-- SECURITY INVOKER es el estándar del proyecto. Sin embargo, las funciones que
-- hacen UPDATE o DELETE en tablas raw (reviews, real_estates, real_estate_reviews)
-- son SECURITY DEFINER porque PostgreSQL requiere SELECT para esas operaciones,
-- y SELECT fue revocado de authenticated en migración 007.
--  
-- Las funciones leen de las vistas _public (migración 009) para verificar
-- ownership, y ejecutan UPDATE/DELETE solo después de validar is_mine.
-- =============================================================================

-- =============================================================================
-- LOGGING DE SEGURIDAD
-- =============================================================================

create or replace function log_security_event (
  p_action text,
  p_status text default 'success',
  p_error_message text default null,
  p_metadata jsonb default null
) RETURNS VOID LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $function$ BEGIN INSERT INTO
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
            current_setting('request.headers', true) :: json ->> 'user-agent',
            'unknown'
        ),
        COALESCE(
            current_setting('request.headers', true) :: json ->> 'referer',
            'unknown'
        ),
        p_action,
        p_status,
        p_error_message,
        COALESCE(p_metadata, '{}' :: jsonb),
        now()
    );

EXCEPTION
WHEN OTHERS THEN RAISE NOTICE 'Error en log_security_event: %',
SQLERRM;

END;

$function$;

COMMENT on FUNCTION log_security_event is 'Función básica de logging. Puede ser sobrescrita en migraciones posteriores.';

-- =============================================================================
-- RATE LIMITING
-- =============================================================================

create or replace function check_rate_limit (
  p_endpoint text,
  p_max_requests integer default 10,
  p_window_minutes integer default 1
) RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $function$ DECLARE v_user_id UUID;


v_window_from TIMESTAMPTZ;

v_window_start TIMESTAMPTZ;

v_current_count INTEGER;

BEGIN v_user_id := auth.uid();

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

COMMENT on FUNCTION check_rate_limit is 'Rate limiting en PostgreSQL (TEMPORAL). Migrar a Redis en producción para mejor performance.';

-- =============================================================================
-- FUNCIONES PARA SISTEMA DE REVIEWS
-- =============================================================================

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
) RETURNS public.create_review_result LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $function$ DECLARE v_review_id UUID;


v_user_id UUID;

v_room_count INTEGER := 0;

BEGIN -- Verificar rate limit (5 reseñas por 10 minutos)
IF NOT check_rate_limit('create_review', 5, 10) THEN PERFORM log_security_event(
    'create_review',
    'blocked',
    'Rate limit exceeded'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'Demasiadas reseñas. Intenta más tarde.' :: text
);

END IF;

-- Usuario autenticado
v_user_id := auth.uid();

IF v_user_id IS NULL THEN PERFORM log_security_event(
    'create_review',
    'error',
    'Usuario no autenticado'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'Usuario no autenticado. Debes iniciar sesión para crear una reseña.' :: text
);

END IF;

-- Validaciones obligatorias
IF p_title IS NULL
OR btrim(p_title) = '' THEN PERFORM log_security_event(
    'create_review',
    'error',
    'Título obligatorio faltante'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'El título es obligatorio' :: text
);

END IF;

IF p_description IS NULL
OR btrim(p_description) = '' THEN PERFORM log_security_event(
    'create_review',
    'error',
    'Descripción obligatoria faltante'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'La descripción es obligatoria' :: text
);

END IF;

IF p_rating IS NULL
OR p_rating < 1
OR p_rating > 5 THEN PERFORM log_security_event(
    'create_review',
    'error',
    'Rating inválido'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'El rating debe estar entre 1 y 5' :: text
);

END IF;

IF p_address_text IS NULL
OR btrim(p_address_text) = '' THEN PERFORM log_security_event(
    'create_review',
    'error',
    'address_text requerido'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'La dirección (address_text) es obligatoria' :: text
);

END IF;

IF p_address_osm_id IS NULL
OR btrim(p_address_osm_id) = '' THEN PERFORM log_security_event(
    'create_review',
    'error',
    'address_osm_id requerido'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'El OSM ID (address_osm_id) es obligatorio' :: text
);

END IF;

IF p_latitude IS NULL
OR p_longitude IS NULL THEN PERFORM log_security_event(
    'create_review',
    'error',
    'Coordenadas requeridas'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'Latitud y longitud son obligatorias' :: text
);

END IF;

-- Normalizar campos opcionales vacíos
IF p_property_type IS NOT NULL
AND btrim(p_property_type) = '' THEN p_property_type := NULL;

END IF;

IF p_winter_comfort IS NOT NULL
AND btrim(p_winter_comfort) = '' THEN p_winter_comfort := NULL;

END IF;

IF p_summer_comfort IS NOT NULL
AND btrim(p_summer_comfort) = '' THEN p_summer_comfort := NULL;

END IF;

IF p_humidity IS NOT NULL
AND btrim(p_humidity) = '' THEN p_humidity := NULL;

END IF;

IF p_real_estate_experience IS NOT NULL
AND btrim(p_real_estate_experience) = '' THEN p_real_estate_experience := NULL;

END IF;

IF p_apartment_number IS NOT NULL
AND btrim(p_apartment_number) = '' THEN p_apartment_number := NULL;

END IF;

-- Verificación de duplicados (una reseña por usuario y propiedad)
IF EXISTS (
    SELECT
        1
    FROM
        public.reviews_public
    WHERE
        is_mine
        AND address_osm_id = p_address_osm_id
) THEN PERFORM log_security_event(
    'create_review',
    'blocked',
    'Duplicate review attempt (OSM ID)'
);

RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'Ya has publicado una reseña para esta propiedad. Solo puedes escribir una reseña por propiedad.' :: text
);

END IF;

-- Insertar reseña
INSERT INTO
    public.reviews (
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
IF p_review_rooms IS NOT NULL THEN IF jsonb_typeof(p_review_rooms) <> 'array' THEN RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'review_rooms debe ser un arreglo JSON' :: text
);

END IF;

IF jsonb_array_length(p_review_rooms) > 0 THEN
INSERT INTO
    public.review_rooms (
        review_id,
        room_type,
        area_m2
    )
SELECT
    v_review_id,
    NULLIF(btrim(room ->> 'room_type'), '') :: text,
    CASE
        WHEN room ? 'area_m2'
        AND room ->> 'area_m2' IS NOT NULL
        AND btrim(room ->> 'area_m2') <> '' THEN (room ->> 'area_m2') :: numeric
        ELSE NULL
    END
FROM
    jsonb_array_elements(p_review_rooms) AS room;

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
    NULL :: text
);

EXCEPTION
WHEN unique_violation THEN RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'Ya has publicado una reseña para esta propiedad.' :: text
);

WHEN OTHERS THEN PERFORM log_security_event('create_review', 'error', SQLERRM);


RETURN (
    false,
    NULL :: uuid,
    NULL :: text,
    'Error interno del servidor' :: text
);

END;

$function$;

-- Función para eliminar una reseña de forma segura
-- SECURITY DEFINER porque UPDATE en PostgreSQL requiere SELECT (revocado en 007).
create or replace function delete_review_safe (review_id_param uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $function$ DECLARE v_is_mine boolean;


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
    id = review_id_param AND created_by = current_user_id;

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

-- Función para obtener estadísticas antes de eliminar
create or replace function public.get_review_delete_info (review_id_param uuid) RETURNS public.get_review_delete_info_result LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $function$ DECLARE result public.get_review_delete_info_result;

BEGIN
SELECT
    rwv.id,
    rwv.title,
    rwv.created_at,
    rwv.rating,
    rwv.likes :: integer,
    rwv.dislikes :: integer,
    rwv.is_mine,
    rwv.total_votes :: integer,
    NULL INTO result
FROM
    public.reviews_with_votes_public rwv
WHERE
    rwv.id = review_id_param;

IF NOT FOUND THEN result.error := 'Reseña no encontrada';

END IF;

RETURN result;

END;

$function$;

-- =============================================================================
-- update_review: función RPC para actualizar reseñas
-- SECURITY DEFINER → corre como postgres, necesario porque UPDATE en PostgreSQL
-- requiere SELECT (revocado de authenticated en 007_grants.sql).
-- La seguridad está en la verificación explícita de ownership vía is_mine.
-- Se llama via supabase.rpc() → bypasea RETURNING * de PostgREST
-- Todos los parámetros tienen default null; el UPDATE usa COALESCE para
-- actualización parcial (solo cambia lo que se pasa explícitamente).
-- =============================================================================
create or replace function public.update_review(
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
  p_apartment_number TEXT default null
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
set
  search_path = public
AS $function$
DECLARE
  v_user_id UUID;
  v_is_mine boolean;
BEGIN
  -- ===========================================================================
  -- 1. Autenticación
  -- ===========================================================================
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;

  -- ===========================================================================
  -- 2. Rate limiting: máx 10 actualizaciones por hora
  -- ===========================================================================
  IF NOT check_rate_limit('update_review', 10, 60) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Límite de actualizaciones alcanzado. Intenta nuevamente en una hora.'
    );
  END IF;

  -- ===========================================================================
  -- 3. Verificar existencia y ownership
  -- ===========================================================================
  SELECT is_mine INTO v_is_mine
  FROM public.reviews_public
  WHERE id = p_review_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'La reseña no existe');
  END IF;

  IF NOT v_is_mine THEN
    RETURN json_build_object('success', false, 'error', 'No tienes permisos para editar esta reseña');
  END IF;

  -- ===========================================================================
  -- 4. Validación de campos (solo si fueron provistos)
  -- ===========================================================================
  IF p_title IS NOT NULL AND char_length(trim(p_title)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'El título no puede estar vacío');
  END IF;

  IF p_description IS NOT NULL AND char_length(trim(p_description)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'La descripción no puede estar vacía');
  END IF;

  IF p_rating IS NOT NULL AND (p_rating < 1 OR p_rating > 5) THEN
    RETURN json_build_object('success', false, 'error', 'La calificación debe estar entre 1 y 5');
  END IF;

  -- ===========================================================================
  -- 5. Actualización (COALESCE mantiene valores existentes si el parámetro es NULL)
  -- ===========================================================================
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
  WHERE id = p_review_id AND created_by = v_user_id;

  RETURN json_build_object('success', true, 'message', 'Reseña actualizada exitosamente');

  -- ===========================================================================
  -- 6. Manejo de errores inesperados
  -- ===========================================================================
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM, 'sqlstate', SQLSTATE);
END;
$function$;

-- =============================================================================
-- VOTOS DE REVIEWS
-- =============================================================================

-- Función para votar reviews (con toggle)
create or replace function vote_review (p_review_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$
DECLARE
    v_user_id uuid;
    v_existing_vote text;
    v_result json;
BEGIN
    -- Verificar rate limit (20 votos por hora)
    IF NOT check_rate_limit ('vote_review', 20, 60) THEN
        PERFORM
            log_security_event ('vote_review', 'blocked', 'Rate limit exceeded');
        RETURN json_build_object('success', FALSE, 'error', 'Demasiados votos. Intenta más tarde.');
    END IF;
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        PERFORM
            log_security_event ('vote_review', 'error', 'Usuario no autenticado');
        RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');
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
) RETURNS JSON LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id UUID;

v_report_id UUID;

v_existing_report UUID;

BEGIN
    -- Verificar rate limit (3 reports por hora)
    IF NOT check_rate_limit ('report_review', 3, 60) THEN
        PERFORM
            log_security_event ('report_review', 'blocked', 'Rate limit exceeded');

RETURN json_build_object('success', FALSE, 'error', 'Demasiados reportes. Intenta más tarde.');

END IF;

v_user_id := auth.uid ();

IF v_user_id IS NULL THEN
    PERFORM
        log_security_event ('report_review', 'error', 'Usuario no autenticado');

RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');

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

-- Función para verificar si usuario ya reportóuna review 
create or replace function has_user_reported_review (p_review_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id UUID;

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
) RETURNS JSON LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_review_id UUID;

        v_user_id UUID;

        v_existing_review UUID;

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
        RETURN json_build_object('success', FALSE, 'error', SQLERRM, 'sqlstate', SQLSTATE);

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
set search_path = public
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
  WHERE id = p_review_id AND created_by = v_user_id;
  RETURN json_build_object('success', true, 'message', 'Reseña actualizada exitosamente');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM, 'sqlstate', SQLSTATE);
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
set search_path = public
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
  WHERE id = p_review_id AND created_by = v_user_id;
  RETURN json_build_object('success', true, 'message', 'Reseña eliminada exitosamente');
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM, 'sqlstate', SQLSTATE);
END;
$$;

-- Función para votar reseñas de inmobiliarias
create or replace function vote_real_estate_review (p_real_estate_review_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$
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
        RETURN json_build_object('success', TRUE, 'message', 'Voto eliminado exitosamente');
    END IF;
    -- Insertar o actualizar el voto
    INSERT INTO public.real_estate_review_votes (real_estate_review_id, user_id, vote_type)
        VALUES (p_real_estate_review_id, v_user_id, p_vote_type)
    ON CONFLICT (real_estate_review_id, user_id)
        DO UPDATE SET
            vote_type = p_vote_type,
            updated_at = now();
    RETURN json_build_object('success', TRUE, 'message', 'Voto registrado exitosamente');
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
) RETURNS json LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$
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
-- FUNCIÓN PARA VERIFICAR SI USUARIO YA REPORTÓUNA RESEÑA DE INMOBILIARIA 
-- =============================================================================
create or replace function public.has_user_reported_real_estate_review (p_review_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id UUID;

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
create or replace function create_real_estate (p_name text, p_description text default null) RETURNS json LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $function$ DECLARE v_user_id uuid;

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

WHEN OTHERS THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    SQLERRM,
    'sqlstate',
    SQLSTATE
);

END;

$function$;

-- =============================================================================
-- VOTOS DE INMOBILIARIAS
-- =============================================================================

-- Función para votar inmobiliarias (simplificada - contadores se calculan con SELECT)
create or replace function vote_real_estate (p_real_estate_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id uuid;

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
) RETURNS JSON LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id UUID;

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
set
  search_path = public as $$ DECLARE v_user_id uuid;

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

create or replace function toggle_favorite_real_estate (p_real_estate_id uuid) RETURNS public.toggle_favorite_result LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id uuid;

result public.toggle_favorite_result;

BEGIN v_user_id := auth.uid();

IF v_user_id IS NULL THEN result.success := false;

result.error := 'Usuario no autenticado';

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
set
  search_path = public as $$ DECLARE v_user_id uuid;

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
set search_path = public as $$
  select vote_type
  from public.real_estate_votes
  where real_estate_id = p_real_estate_id
    and user_id = auth.uid()
  limit 1;
$$;

-- Función para saber el voto del usuario sobre una review
create or replace function public.get_user_review_vote (p_review_id uuid) returns text language sql stable security invoker
set search_path = public as $$
select vote_type from public.review_votes
  where review_id = p_review_id and user_id = auth.uid()
  limit 1;
$$;

-- Función para saber el voto del usuario sobre una review (from 017)
create or replace function public.get_user_vote_on_review (p_review_id uuid) returns text language sql stable security invoker
set search_path = public as $$
  select vote_type from public.review_votes
    where review_id = p_review_id and user_id = auth.uid()
    limit 1;
$$;

-- Función para saber el voto del usuario sobre una reseña de inmobiliaria (from 017)
create or replace function public.get_user_vote_on_real_estate_review (p_real_estate_review_id uuid) returns text language sql stable security invoker
set search_path = public as $$
  select vote_type from public.real_estate_review_votes
    where real_estate_review_id = p_real_estate_review_id and user_id = auth.uid()
    limit 1;
$$;

comment on function public.get_user_vote_on_real_estate_review is 'Obtiene el voto del usuario autenticado en una reseña de inmobiliaria';

-- =============================================================================
-- FUNCIÓN PARA SABER SI EL USUARIO TIENE UNA REVIEW SEGUN LA ADDRESS
-- =============================================================================
create or replace function public.check_user_review_for_address (p_osm_id text) returns uuid language plpgsql stable security invoker
set search_path = public as $$
declare
  v_id uuid;
begin
  select id into v_id from public.reviews_public
    where is_mine and address_osm_id = p_osm_id limit 1;
  return v_id;
end;
$$;

-- =============================================================================
-- FUNCIONES DE FAVORITOS DE RESEÑAS
-- =============================================================================

-- Función para agregar / quitar favorito de reseña (toggle)
create or replace function toggle_favorite_review (p_review_id uuid) RETURNS json LANGUAGE plpgsql SECURITY INVOKER
set
  search_path = public as $$ DECLARE v_user_id uuid;

v_favorite_exists boolean;

BEGIN v_user_id := auth.uid ();

IF v_user_id IS NULL THEN RETURN json_build_object(
    'success',
    FALSE,
    'error',
    'Usuario no autenticado'
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
    'isFavorite',
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
    'isFavorite',
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
set
  search_path = public as $$ DECLARE v_user_id uuid;

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
