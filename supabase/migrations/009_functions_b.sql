-- Función para votar reviews (con toggle)
create or replace function vote_review (p_review_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
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
            RETURN json_build_object('success', FALSE, 'error', 'Error al registrar el voto: ' || SQLERRM);
END;

$$;

-- Función para reportar reviews 
create or replace function report_review (
  p_review_id UUID,
  p_reason TEXT,
  p_description TEXT default null
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
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
        public.reviews
    WHERE
        id = p_review_id) THEN
PERFORM
    log_security_event ('report_review', 'error', 'Review not found');

RETURN json_build_object('success', FALSE, 'error', 'La reseña no existe');

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
create or replace function has_user_reported_review (p_review_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER
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
-- FUNCIONES PARA RESEÑAS DE INMOBILIARIAS 
-- ============================================================================= 
-- Limpiar funciones anteriores si existen 
drop function IF exists public.update_real_estate_review_votes () CASCADE;

drop function IF exists public.update_real_estate_rating_from_reviews () CASCADE;

drop function IF exists public.create_real_estate_review (UUID, TEXT, TEXT, INTEGER) CASCADE;

drop function IF exists public.report_real_estate_review (UUID, TEXT, TEXT) CASCADE;

-- Función para actualizar rating de inmobiliaria basado en sus reseñas
create or replace function update_real_estate_rating_from_reviews () RETURNS TRIGGER as $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        UPDATE
            public.real_estates
        SET
            rating = (
                SELECT
                    COALESCE(AVG(rating), 0)
                FROM
                    public.real_estate_reviews
                WHERE
                    real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)),
            review_count = (
                SELECT
                    COUNT(*)
                FROM
                    public.real_estate_reviews
                WHERE
                    real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id))
        WHERE
            id = COALESCE(NEW.real_estate_id, OLD.real_estate_id);

        END IF;

        RETURN COALESCE(NEW, OLD);

END;

$$ LANGUAGE plpgsql;

-- Función para crear reseña de inmobiliaria
create or replace function create_real_estate_review (
  p_real_estate_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_rating INTEGER
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
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
                            public.real_estates
                        WHERE
                            id = p_real_estate_id) THEN
                    RETURN json_build_object('success', FALSE, 'error', 'La inmobiliaria no existe');

    END IF;

    -- Validar rating
    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN json_build_object('success', FALSE, 'error', 'El rating debe estar entre 1 y 5');

        END IF;

        -- Verificar si el usuario ya tiene una reseña para esta inmobiliaria
        SELECT
            id INTO v_existing_review
        FROM
            public.real_estate_reviews
        WHERE
            real_estate_id = p_real_estate_id
            AND user_id = v_user_id;

            IF v_existing_review IS NOT NULL THEN
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
        RETURN json_build_object('success', FALSE, 'error', 'Error al crear la reseña: ' || SQLERRM);

END;

$$;

-- Función para votar reseñas de inmobiliarias
create or replace function vote_real_estate_review (p_real_estate_review_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
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
        RETURN json_build_object('success', FALSE, 'error', 'Error al registrar el voto: ' || SQLERRM);
END;

$$;

-- Función para reportar reseñas de inmobiliarias
create or replace function report_real_estate_review (
  p_real_estate_review_id uuid,
  p_reason text,
  p_description text default null
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
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
            public.real_estate_reviews
        WHERE
            id = p_real_estate_review_id) THEN
    RETURN json_build_object('success', FALSE, 'error', 'Reseña no encontrada');
END IF;
    -- Validar que usuario no reporta propia reseña
    IF EXISTS (
        SELECT
            1
        FROM
            public.real_estate_reviews
        WHERE
            id = p_real_estate_review_id
            AND user_id = auth.uid ()) THEN
    RETURN json_build_object('success', FALSE, 'error', 'No puedes reportar tu propia reseña');
END IF;
INSERT INTO public.real_estate_review_reports (real_estate_review_id, reported_by_user_id, reason, description)
    VALUES (p_real_estate_review_id, v_user_id, p_reason, p_description)
ON CONFLICT (real_estate_review_id, reported_by_user_id)
    DO UPDATE SET
        reason = EXCLUDED.reason,
        description = EXCLUDED.description,
        status = 'pending',
        updated_at = now()
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
create or replace function public.has_user_reported_real_estate_review (p_review_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER
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

grant
execute on FUNCTION public.has_user_reported_real_estate_review (UUID) to authenticated;

drop function IF exists public.sync_user_snapshot () CASCADE;

create or replace function public.sync_user_snapshot () RETURNS TRIGGER as $$
BEGIN
    NEW.user_id_snapshot := COALESCE(NEW.user_id_snapshot, NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public;
