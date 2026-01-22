--=============================================================================
-- Funciones
--=============================================================================
-- Función para crear inmobiliaria 
create or replace function create_real_estate (p_name text, p_description text default null) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$ DECLARE v_user_id uuid;

v_real_estate_id uuid;

BEGIN
    -- Obtener el ID del usuario autenticado
    v_user_id := auth.uid ();

IF v_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');

END IF;

-- Verificar rate limit (10 inmobiliarias por 60 minutos)
IF NOT check_rate_limit ('create_real_estate', 10, 60) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Has creado demasiadas inmobiliarias. Intenta más tarde.');

END IF;

-- Validar nombre
IF p_name IS NULL OR p_name = '' THEN
    RETURN json_build_object('success', FALSE, 'error', 'El nombre es obligatorio');

END IF;

-- Insertar la inmobiliaria
INSERT INTO public.real_estates (name, description, created_by, likes, dislikes)
    VALUES (p_name, p_description, v_user_id, 0, 0)
RETURNING
    id INTO v_real_estate_id;

RETURN json_build_object('success', TRUE, 'message', 'Inmobiliaria creada exitosamente', 'id', v_real_estate_id);

EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', FALSE, 'error', 'Ya existe una inmobiliaria con ese nombre');

    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', 'Error al crear la inmobiliaria: ' || SQLERRM);

END;

$$;

-- Función para votar inmobiliarias
-- Función trigger: actualizar contadores de votos de inmobiliarias a partir de real_estate_votes
create or replace function update_real_estate_votes_counters () RETURNS TRIGGER as $$
DECLARE
    v_real_estate_id UUID;
    v_vote_type TEXT;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        v_real_estate_id := NEW.real_estate_id;
        v_vote_type := NEW.vote_type;

        IF v_vote_type NOT IN ('like','dislike') THEN
            RAISE EXCEPTION 'Invalid vote type';
        END IF;

        UPDATE public.real_estates
        SET likes = CASE WHEN v_vote_type = 'like' THEN likes + 1 ELSE likes END,
            dislikes = CASE WHEN v_vote_type = 'dislike' THEN dislikes + 1 ELSE dislikes END,
            updated_at = NOW()
        WHERE id = v_real_estate_id;

        RETURN NEW;

    ELSIF (TG_OP = 'DELETE') THEN
        v_real_estate_id := OLD.real_estate_id;
        v_vote_type := OLD.vote_type;

        IF v_vote_type NOT IN ('like','dislike') THEN
            RAISE EXCEPTION 'Invalid vote type';
        END IF;

        UPDATE public.real_estates
        SET likes = CASE WHEN v_vote_type = 'like' THEN GREATEST(0, likes - 1) ELSE likes END,
            dislikes = CASE WHEN v_vote_type = 'dislike' THEN GREATEST(0, dislikes - 1) ELSE dislikes END,
            updated_at = NOW()
        WHERE id = v_real_estate_id;

        RETURN OLD;

    ELSIF (TG_OP = 'UPDATE') THEN
        -- Si cambia el tipo de voto, ajustar ambos contadores
        IF OLD.vote_type = NEW.vote_type THEN
            RETURN NEW;
        END IF;

        IF OLD.vote_type NOT IN ('like','dislike') OR NEW.vote_type NOT IN ('like','dislike') THEN
            RAISE EXCEPTION 'Invalid vote type';
        END IF;

        v_real_estate_id := NEW.real_estate_id;

        -- Restar antiguo
        UPDATE public.real_estates
        SET likes = CASE WHEN OLD.vote_type = 'like' THEN GREATEST(0, likes - 1) ELSE likes END,
            dislikes = CASE WHEN OLD.vote_type = 'dislike' THEN GREATEST(0, dislikes - 1) ELSE dislikes END,
            updated_at = NOW()
        WHERE id = v_real_estate_id;

        -- Sumar nuevo
        UPDATE public.real_estates
        SET likes = CASE WHEN NEW.vote_type = 'like' THEN likes + 1 ELSE likes END,
            dislikes = CASE WHEN NEW.vote_type = 'dislike' THEN dislikes + 1 ELSE dislikes END,
            updated_at = NOW()
        WHERE id = v_real_estate_id;

        RETURN NEW;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

create or replace function vote_real_estate (p_real_estate_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
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
    IF NOT check_rate_limit ('vote_real_estate', 30, 10) THEN
        RETURN json_build_object('success', FALSE, 'error', 'Has votado demasiado rápido. Intenta más tarde.');
    END IF;
    IF p_vote_type NOT IN ('like', 'dislike') THEN
        RETURN json_build_object('success', FALSE, 'error', 'Tipo de voto inválido');
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
        DELETE FROM public.real_estate_votes
        WHERE real_estate_id = p_real_estate_id
            AND user_id = v_user_id;
        -- Decrementar el contador correspondiente
        IF v_existing_vote = 'like' THEN
            UPDATE
                public.real_estates
            SET
                likes = GREATEST (0, likes - 1)
            WHERE
                id = p_real_estate_id;
        ELSE
            UPDATE
                public.real_estates
            SET
                dislikes = GREATEST (0, dislikes - 1)
            WHERE
                id = p_real_estate_id;
        END IF;
        RETURN json_build_object('success', TRUE, 'message', 'Voto eliminado exitosamente');
    END IF;
    -- Si existe un voto diferente, actualizar contadores 
    IF v_existing_vote IS NOT NULL THEN
        -- Decrementar el voto anterior 
        IF v_existing_vote = 'like' THEN
            UPDATE
                public.real_estates
            SET
                likes = GREATEST (0, likes - 1)
            WHERE
                id = p_real_estate_id;
        ELSE
            UPDATE
                public.real_estates
            SET
                dislikes = GREATEST (0, dislikes - 1)
            WHERE
                id = p_real_estate_id;
        END IF;
        -- Incrementar el nuevo voto 
        IF p_vote_type = 'like' THEN
        UPDATE
            public.real_estates
        SET
            likes = likes + 1
        WHERE
            id = p_real_estate_id;
    ELSE
        UPDATE
            public.real_estates
        SET
            dislikes = dislikes + 1
        WHERE
            id = p_real_estate_id;
    END IF;
    -- Actualizar el voto
    UPDATE
        public.real_estate_votes
    SET
        vote_type = p_vote_type
    WHERE
        real_estate_id = p_real_estate_id
        AND user_id = v_user_id;
ELSE
    -- Es un voto nuevo, solo incrementar 
    IF p_vote_type = 'like' THEN
        UPDATE
            public.real_estates
        SET
            likes = likes + 1
        WHERE
            id = p_real_estate_id;
    ELSE
        UPDATE
            public.real_estates
        SET
            dislikes = dislikes + 1
        WHERE
            id = p_real_estate_id;
    END IF;
    -- Insertar el nuevo voto
    INSERT INTO public.real_estate_votes (real_estate_id, user_id, vote_type)
        VALUES (p_real_estate_id, v_user_id, p_vote_type);
END IF;
    RETURN json_build_object('success', TRUE, 'message', 'Voto registrado exitosamente');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', 'Error al registrar el voto: ' || SQLERRM);
END;

$$;

-- Función para reportar inmobiliarias 
create or replace function report_real_estate (
  p_real_estate_id UUID,
  p_reason TEXT,
  p_description TEXT default null
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$ DECLARE v_user_id UUID;

BEGIN
    v_user_id := auth.uid ();

IF v_user_id IS NULL THEN
    RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');

END IF;

-- Verificar rate limit (3 reportes por 60 minutos)
IF NOT check_rate_limit ('report_real_estate', 3, 60) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Has reportado demasiadas inmobiliarias. Intenta más tarde.');

END IF;

-- Validar razón 
IF p_reason IS NULL
    OR TRIM(p_reason) = '' THEN
    RETURN json_build_object('success', FALSE, 'error', 'La razón del reporte es obligatoria');

END IF;

IF NOT EXISTS (
    SELECT
        1
    FROM
        public.real_estates
    WHERE
        id = p_real_estate_id) THEN
RETURN json_build_object('success', FALSE, 'error', 'La inmobiliaria no existe');

END IF;

INSERT INTO public.real_estate_reports (real_estate_id, reported_by_user_id, reason, description)
    VALUES (p_real_estate_id, v_user_id, p_reason, p_description)
ON CONFLICT (real_estate_id, reported_by_user_id)
    DO UPDATE SET
        reason = EXCLUDED.reason,
        description = EXCLUDED.description,
        status = 'pending',
        updated_at = now();

RETURN json_build_object('success', TRUE, 'message', 'Reporte enviado exitosamente');

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', 'Error interno del servidor');

END;

$$;

-- Función para verificar si usuario ya reportó una inmobiliaria
create or replace function has_user_reported_real_estate (p_real_estate_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT
            1
        FROM
            public.real_estate_reports
        WHERE
            real_estate_id = p_real_estate_id
            AND reported_by_user_id = v_user_id);
END;
$$;

-- =============================================================================
-- FUNCIÓN PARA AGREGAR / QUITAR FAVORITO (TOGGLE)
--=============================================================================
create or replace function toggle_favorite_real_estate (p_real_estate_id uuid) RETURNS public.toggle_favorite_result LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id uuid;
    result public.toggle_favorite_result;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        result.success := false;
        result.error := 'Usuario no autenticado';
        RETURN result;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.real_estate_favorites
        WHERE real_estate_id = p_real_estate_id
          AND user_id = v_user_id
    ) THEN
        DELETE FROM public.real_estate_favorites
        WHERE real_estate_id = p_real_estate_id
          AND user_id = v_user_id;

        result.success := true;
        result.is_favorite := false;
        result.message := 'Eliminado de favoritos';
    ELSE
        INSERT INTO public.real_estate_favorites(real_estate_id, user_id)
        VALUES (p_real_estate_id, v_user_id);

        result.success := true;
        result.is_favorite := true;
        result.message := 'Agregado a favoritos';
    END IF;

    RETURN result;
END;
$$;

-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI UNA INMOBILIARIA ES FAVORITA
--=============================================================================
create or replace function is_real_estate_favorite (p_real_estate_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT
            1
        FROM
            public.real_estate_favorites
        WHERE
            real_estate_id = p_real_estate_id
            AND user_id = v_user_id);
END;
$$;

-- =============================================================================
-- FUNCIÓN PARA AGREGAR / QUITAR FAVORITO DE RESEÑA (TOGGLE)
--=============================================================================
create or replace function toggle_favorite_review (p_review_id uuid) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id uuid;
    v_favorite_exists boolean;
BEGIN
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', FALSE, 'error', 'Usuario no autenticado');
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
                AND user_id = v_user_id) INTO v_favorite_exists;
    -- Si existe, eliminarlo 
    IF v_favorite_exists THEN
        DELETE FROM public.review_favorites
        WHERE review_id = p_review_id
            AND user_id = v_user_id;
        RETURN json_build_object('success', TRUE, 'isFavorite', FALSE, 'message', 'Eliminado de favoritos');
    ELSE
        -- Si NO existe, agregarlo 
        INSERT INTO public.review_favorites (review_id, user_id)
            VALUES (p_review_id, v_user_id);
        RETURN json_build_object('success', TRUE, 'isFavorite', TRUE, 'message', 'Agregado a favoritos');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', FALSE, 'error', 'Error al actualizar favoritos: ' || SQLERRM);
END;

$$;

--=============================================================================
-- FUNCIÓN PARA VERIFICAR SI UNA RESEÑA ES FAVORITA
--=============================================================================
create or replace function is_review_favorite (p_review_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid ();
    IF v_user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT
            1
        FROM
            public.review_favorites
        WHERE
            review_id = p_review_id
            AND user_id = v_user_id);
END;
$$;

create or replace function moderate_reports (report_id uuid) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
BEGIN
    IF auth.role () != 'service_role' THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    -- Lógica de moderación
END;
$$;

-- Función para detectar actividad sospechosa 
create or replace function detect_suspicious_activity (p_user_id UUID default null) RETURNS table (
  user_id UUID,
  total_requests INTEGER,
  blocked_requests INTEGER,
  suspicious_score INTEGER
) LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
BEGIN
    IF auth.role () != 'service_role' THEN
        RAISE EXCEPTION 'Access denied';

END IF;

RETURN QUERY
SELECT
    sl.user_id,
    COUNT(*)::integer AS total_requests,
    COUNT(
        CASE WHEN sl.status = 'blocked' THEN
            1
        END)::integer AS blocked_requests,
    (COUNT(
            CASE WHEN sl.status = 'blocked' THEN
                1
            END) * 10 + COUNT(
            CASE WHEN sl.action = 'report' THEN
                1
            END) * 2)::integer AS suspicious_score
FROM
    public.security_logs sl
WHERE
    sl.created_at >= now() - INTERVAL '1 hour'
    AND (p_user_id IS NULL
        OR sl.user_id = p_user_id)
GROUP BY
    sl.user_id
HAVING
    COUNT(*) > 50
    OR COUNT(
        CASE WHEN sl.status = 'blocked' THEN
            1
        END) > 5
ORDER BY
    suspicious_score DESC;

END;

$$;

-- =============================================================================
-- FUNCIONES AUXILIARES SIMPLIFICADAS (SIN TIPOS PROBLEMÁTICOS)
-- =============================================================================
-- Función simplificada para verificar el estado de las tablas
create or replace function check_migration_status_simple () RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
    v_rate_limits_count integer;
    v_security_logs_count integer;
    v_rate_columns text;
    v_security_columns text;
BEGIN
    -- Contar registros si la tabla existe 
    IF EXISTS (
        SELECT
        FROM
            information_schema.tables
        WHERE
            table_name = 'rate_limits'
            AND table_schema = 'public') THEN
    SELECT
        COUNT(*) INTO v_rate_limits_count
    FROM
        public.rate_limits;
    SELECT
        STRING_AGG(column_name, ', ') INTO v_rate_columns
    FROM
        information_schema.columns
    WHERE
        table_name = 'rate_limits'
        AND table_schema = 'public';
ELSE
    v_rate_limits_count := 0;
    v_rate_columns := 'Tabla no existe aún';
END IF;
    IF EXISTS (
        SELECT
        FROM
            information_schema.tables
        WHERE
            table_name = 'security_logs'
            AND table_schema = 'public') THEN
    SELECT
        COUNT(*) INTO v_security_logs_count
    FROM
        public.security_logs;
    SELECT
        STRING_AGG(column_name, ', ') INTO v_security_columns
    FROM
        information_schema.columns
    WHERE
        table_name = 'security_logs'
        AND table_schema = 'public';
ELSE
    v_security_logs_count := 0;
    v_security_columns := 'Tabla no existe aún';
END IF;
    RAISE NOTICE '=== ESTADO DE LA MIGRACIÓN ===';
    RAISE NOTICE 'Tabla rate_limits: % registros', v_rate_limits_count;
    RAISE NOTICE 'Columnas de rate_limits: %', COALESCE(v_rate_columns, 'No existe la tabla');
    RAISE NOTICE 'Tabla security_logs: % registros', v_security_logs_count;
    RAISE NOTICE 'Columnas de security_logs: %', COALESCE(v_security_columns, 'No existe la tabla');
    -- Verificar funciones 
    RAISE NOTICE '=== FUNCIONES ===';
    IF EXISTS (
        SELECT
        FROM
            pg_proc
        WHERE
            proname = 'check_rate_limit') THEN
    RAISE NOTICE '✓ Función check_rate_limit existe';
ELSE
    RAISE NOTICE '✗ Función check_rate_limit NO existe';
END IF;
    IF EXISTS (
        SELECT
        FROM
            pg_proc
        WHERE
            proname = 'log_security_event') THEN
    RAISE NOTICE '✓ Función log_security_event existe';
ELSE
    RAISE NOTICE '✗ Función log_security_event NO existe';
END IF;
    IF EXISTS (
        SELECT
        FROM
            pg_proc
        WHERE
            proname = 'cleanup_rate_limits') THEN
    RAISE NOTICE '✓ Función cleanup_rate_limits existe';
ELSE
    RAISE NOTICE '✗ Función cleanup_rate_limits NO existe';
END IF;
END;
$$;

-- Security fix: SET search_path TO public FOR ALL functions TO prevent search_path hijacking 
-- See: https: / / supabase.com / docs / guides / database / database - linter ? lint = 0011_function_search_path_mutable
alter function public.update_updated_at_column ()
set
  search_path = public;

alter function public.update_real_estate_counters ()
set
  search_path = public;

alter function public.vote_review (uuid, text)
set
  search_path = public;

alter function public.update_review (
  uuid,
  text,
  text,
  integer,
  text,
  integer,
  text,
  text,
  text
)
set
  search_path = public;

alter function public.has_user_reported_real_estate_review (uuid)
set
  search_path = public;

alter function public.log_review_changes ()
set
  search_path = public;

alter function public.log_review_deletion ()
set
  search_path = public;

alter function public.report_review (uuid, text, text)
set
  search_path = public;

alter function public.update_review_votes ()
set
  search_path = public;

alter function public.vote_real_estate (uuid, text)
set
  search_path = public;

alter function public.create_real_estate_review (uuid, text, text, integer)
set
  search_path = public;

alter function public.has_user_reported_review (uuid)
set
  search_path = public;

alter function public.update_real_estate_review_votes ()
set
  search_path = public;

alter function public.vote_real_estate_review (uuid, text)
set
  search_path = public;

alter function public.has_user_reported_real_estate (uuid)
set
  search_path = public;

alter function public.toggle_favorite_review (uuid)
set
  search_path = public;

alter function public.create_real_estate (text, text)
set
  search_path = public;

alter function public.report_real_estate (uuid, text, text)
set
  search_path = public;

alter function public.is_review_favorite (uuid)
set
  search_path = public;

alter function public.update_real_estate_rating_from_reviews ()
set
  search_path = public;

alter function public.get_review_delete_info (uuid)
set
  search_path = public;

alter function public.delete_review_safe (uuid)
set
  search_path = public;

alter function public.report_real_estate_review (uuid, text, text)
set
  search_path = public;

alter function public.toggle_favorite_real_estate (uuid)
set
  search_path = public;

alter function public.is_real_estate_favorite (uuid)
set
  search_path = public;