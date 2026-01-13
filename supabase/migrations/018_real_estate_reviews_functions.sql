-- =============================================================================
-- FUNCIONES PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================

-- Función para actualizar contadores de votos de reseñas de inmobiliarias
CREATE OR REPLACE FUNCTION update_real_estate_review_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.vote_type = 'like' THEN
            UPDATE public.real_estate_reviews SET likes = likes + 1 WHERE id = NEW.real_estate_review_id;
        ELSE
            UPDATE public.real_estate_reviews SET dislikes = dislikes + 1 WHERE id = NEW.real_estate_review_id;
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.vote_type = 'like' THEN
            UPDATE public.real_estate_reviews SET likes = likes - 1 WHERE id = OLD.real_estate_review_id;
        ELSE
            UPDATE public.real_estate_reviews SET dislikes = dislikes - 1 WHERE id = OLD.real_estate_review_id;
        END IF;
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF OLD.vote_type != NEW.vote_type THEN
            IF OLD.vote_type = 'like' THEN
                UPDATE public.real_estate_reviews SET likes = likes - 1 WHERE id = OLD.real_estate_review_id;
            ELSE
                UPDATE public.real_estate_reviews SET dislikes = dislikes - 1 WHERE id = OLD.real_estate_review_id;
            END IF;
            IF NEW.vote_type = 'like' THEN
                UPDATE public.real_estate_reviews SET likes = likes + 1 WHERE id = NEW.real_estate_review_id;
            ELSE
                UPDATE public.real_estate_reviews SET dislikes = dislikes + 1 WHERE id = NEW.real_estate_review_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar rating de inmobiliaria basado en sus reseñas
CREATE OR REPLACE FUNCTION update_real_estate_rating_from_reviews()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        UPDATE public.real_estates 
        SET 
            rating = (
                SELECT COALESCE(AVG(rating), 0) 
                FROM public.real_estate_reviews 
                WHERE real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
            ),
            review_count = (
                SELECT COUNT(*) 
                FROM public.real_estate_reviews 
                WHERE real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
            )
        WHERE id = COALESCE(NEW.real_estate_id, OLD.real_estate_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Función para crear reseña de inmobiliaria
CREATE OR REPLACE FUNCTION create_real_estate_review(
    p_real_estate_id UUID,
    p_title TEXT,
    p_description TEXT,
    p_rating INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_review_id UUID;
    v_user_id UUID;
    v_existing_review UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
    END IF;

    -- Validar que la inmobiliaria existe
    IF NOT EXISTS (SELECT 1 FROM public.real_estates WHERE id = p_real_estate_id) THEN
        RETURN json_build_object('success', false, 'error', 'La inmobiliaria no existe');
    END IF;

    -- Validar rating
    IF p_rating < 1 OR p_rating > 5 THEN
        RETURN json_build_object('success', false, 'error', 'El rating debe estar entre 1 y 5');
    END IF;

    -- Verificar si el usuario ya tiene una reseña para esta inmobiliaria
    SELECT id INTO v_existing_review
    FROM public.real_estate_reviews
    WHERE real_estate_id = p_real_estate_id AND user_id = v_user_id;

    IF v_existing_review IS NOT NULL THEN
        RETURN json_build_object('success', false, 'error', 'Ya has escrito una reseña para esta inmobiliaria');
    END IF;

    -- Insertar la nueva reseña
    INSERT INTO public.real_estate_reviews (
        real_estate_id,
        user_id,
        title,
        description,
        rating
    ) VALUES (
        p_real_estate_id,
        v_user_id,
        p_title,
        p_description,
        p_rating
    )
    RETURNING id INTO v_review_id;

    RETURN json_build_object(
        'success', true,
        'review_id', v_review_id,
        'message', 'Reseña de inmobiliaria creada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Error al crear la reseña: ' || SQLERRM);
END;
$$;

-- Función para votar reseñas de inmobiliarias
CREATE OR REPLACE FUNCTION vote_real_estate_review(
    p_review_id UUID,
    p_vote_type TEXT
) RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE 
    v_user_id UUID;
    v_existing_vote TEXT;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado'
        );
    END IF;
    
    IF p_vote_type NOT IN ('like', 'dislike') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Tipo de voto inválido'
        );
    END IF;
    
    -- Verificar si ya existe un voto
    SELECT vote_type INTO v_existing_vote
    FROM public.real_estate_review_votes
    WHERE real_estate_review_id = p_review_id AND user_id = v_user_id;
    
    -- Si el voto es el mismo, eliminarlo (toggle)
    IF v_existing_vote = p_vote_type THEN
        DELETE FROM public.real_estate_review_votes
        WHERE real_estate_review_id = p_review_id AND user_id = v_user_id;
        
        RETURN json_build_object(
            'success', true,
            'message', 'Voto eliminado exitosamente'
        );
    END IF;
    
    -- Insertar o actualizar el voto
    INSERT INTO public.real_estate_review_votes (real_estate_review_id, user_id, vote_type)
    VALUES (p_review_id, v_user_id, p_vote_type)
    ON CONFLICT (real_estate_review_id, user_id) 
    DO UPDATE SET vote_type = p_vote_type;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Voto registrado exitosamente'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Error al registrar el voto: ' || SQLERRM
        );
END;
$$;

-- Función para reportar reseñas de inmobiliarias
CREATE OR REPLACE FUNCTION report_real_estate_review(
    p_real_estate_review_id UUID,
    p_reason TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_report_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.real_estate_reviews WHERE id = p_real_estate_review_id) THEN
        RETURN json_build_object('success', false, 'error', 'La reseña no existe');
    END IF;

    INSERT INTO public.real_estate_review_reports (real_estate_review_id, reported_by_user_id, reason, description)
    VALUES (p_real_estate_review_id, v_user_id, p_reason, p_description)
    ON CONFLICT (real_estate_review_id, reported_by_user_id) 
    DO UPDATE SET 
        reason = EXCLUDED.reason,
        description = EXCLUDED.description,
        status = 'pending',
        updated_at = NOW()
    RETURNING id INTO v_report_id;

    RETURN json_build_object('success', true, 'report_id', v_report_id, 'message', 'Reporte enviado exitosamente');

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$$;


-- =============================================================================
-- FUNCIÓN PARA VERIFICAR SI USUARIO YA REPORTÓ UNA RESEÑA DE INMOBILIARIA
-- =============================================================================
CREATE OR REPLACE FUNCTION public.has_user_reported_real_estate_review(
    p_review_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS (
        SELECT 1
        FROM public.real_estate_review_reports
        WHERE real_estate_review_id = p_review_id
        AND reported_by_user_id = v_user_id
    );
END;
$$;

GRANT EXECUTE
ON FUNCTION public.has_user_reported_real_estate_review(UUID)
TO authenticated;
