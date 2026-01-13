
-- Funciones stub para rate limiting y logging (se reemplazarán en migraciones posteriores)
CREATE OR REPLACE FUNCTION check_rate_limit(p_endpoint TEXT, p_max_requests INTEGER DEFAULT 10, p_window_minutes INTEGER DEFAULT 1) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
AS $$ BEGIN RETURN TRUE; END; $$;

CREATE OR REPLACE FUNCTION log_security_event(p_action TEXT, p_status TEXT DEFAULT 'success', p_error_message TEXT DEFAULT NULL, p_metadata JSONB DEFAULT NULL) 
RETURNS VOID 
LANGUAGE plpgsql 
AS $$ BEGIN RETURN; END; $$;


-- =============================================================================
-- FUNCIONES PARA SISTEMA DE REVIEWS
-- =============================================================================

-- Función para actualizar contadores de votos de reviews
DROP TRIGGER IF EXISTS review_votes_trigger ON public.review_votes;

-- Recrear función de actualización de votos
CREATE OR REPLACE FUNCTION update_review_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- En update_review_votes, agregar validación
IF NEW.vote_type NOT IN ('like', 'dislike') THEN
    RAISE EXCEPTION 'Invalid vote type';
END IF;
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.reviews 
        SET likes = likes + 1 
        WHERE id = NEW.review_id AND NEW.vote_type = 'like';
        
        UPDATE public.reviews 
        SET dislikes = dislikes + 1 
        WHERE id = NEW.review_id AND NEW.vote_type = 'dislike';
        
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.reviews 
        SET likes = likes - 1 
        WHERE id = OLD.review_id AND OLD.vote_type = 'like';
        
        UPDATE public.reviews 
        SET dislikes = dislikes - 1 
        WHERE id = OLD.review_id AND OLD.vote_type = 'dislike';
        
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Restar el voto antiguo
        UPDATE public.reviews 
        SET likes = likes - 1 
        WHERE id = OLD.review_id AND OLD.vote_type = 'like';
        
        UPDATE public.reviews 
        SET dislikes = dislikes - 1 
        WHERE id = OLD.review_id AND OLD.vote_type = 'dislike';
        
        -- Sumar el nuevo voto
        UPDATE public.reviews 
        SET likes = likes + 1 
        WHERE id = NEW.review_id AND NEW.vote_type = 'like';
        
        UPDATE public.reviews 
        SET dislikes = dislikes + 1 
        WHERE id = NEW.review_id AND NEW.vote_type = 'dislike';
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recrear trigger
CREATE TRIGGER review_votes_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.review_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_review_votes();

-- Función para actualizar contadores de inmobiliarias
CREATE OR REPLACE FUNCTION update_real_estate_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.real_estates 
        SET 
            review_count = review_count + 1
        WHERE id = NEW.real_estate_id;
        
    ELSIF (TG_OP = 'UPDATE' AND OLD.real_estate_id IS DISTINCT FROM NEW.real_estate_id) THEN
        IF OLD.real_estate_id IS NOT NULL THEN
            UPDATE public.real_estates 
            SET 
                review_count = review_count - 1
            WHERE id = OLD.real_estate_id;
        END IF;
        
        IF NEW.real_estate_id IS NOT NULL THEN
            UPDATE public.real_estates 
            SET 
                review_count = review_count + 1
            WHERE id = NEW.real_estate_id;
        END IF;
        
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.real_estate_id IS NOT NULL THEN
            UPDATE public.real_estates 
            SET 
                review_count = review_count - 1
            WHERE id = OLD.real_estate_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Función para auditoría completa de cambios
CREATE OR REPLACE FUNCTION log_review_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.* IS DISTINCT FROM NEW.*) THEN
        INSERT INTO public.review_audit (
            review_id, 
            old_data, 
            new_data, 
            changed_by,
            change_type
        ) VALUES (
            OLD.id,
            row_to_json(OLD),
            row_to_json(NEW), 
            auth.uid(),
            'update'
        );
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.review_audit (
            review_id,
            new_data,
            changed_by, 
            change_type
        ) VALUES (
            NEW.id,
            row_to_json(NEW),
            NEW.user_id,
            'create'
        );
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Función para registrar eliminaciones
CREATE OR REPLACE FUNCTION log_review_deletion()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.review_deletions (
        review_id,
        deleted_by,
        review_title,
        review_rating,
        review_created_at
    ) VALUES (
        OLD.id,
        COALESCE(auth.uid(), OLD.user_id),
        OLD.title,
        OLD.rating,
        OLD.created_at
    );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCIONES DE APLICACIÓN PARA REVIEWS
-- =============================================================================

-- Función para crear reseñas
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
    p_winter_comfort TEXT DEFAULT NULL,
    p_summer_comfort TEXT DEFAULT NULL,
    p_humidity TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_review_id UUID;
    v_user_id UUID;
BEGIN
    -- Verificar rate limit (5 reseñas por 10 minutos)
    IF NOT check_rate_limit('create_review', 5, 10) THEN
        PERFORM log_security_event('create_review', 'blocked', 'Rate limit exceeded');
        RETURN json_build_object('success', false, 'error', 'Demasiadas reseñas. Intenta más tarde.');
    END IF;

    -- Obtener el ID del usuario autenticado
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        PERFORM log_security_event('create_review', 'error', 'Usuario no autenticado');
        RETURN json_build_object(
            'success', false,
            'error', 'Usuario no autenticado. Debes iniciar sesión para crear una reseña.'
        );
    END IF;

    -- Validar campos obligatorios
    IF p_title IS NULL OR p_title = '' THEN
        PERFORM log_security_event('create_review', 'error', 'Título obligatorio faltante');
        RETURN json_build_object('success', false, 'error', 'El título es obligatorio');
    END IF;

    IF p_description IS NULL OR p_description = '' THEN
        PERFORM log_security_event('create_review', 'error', 'Descripción obligatoria faltante');
        RETURN json_build_object('success', false, 'error', 'La descripción es obligatoria');
    END IF;

    -- Validar rating
    IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
        PERFORM log_security_event('create_review', 'error', 'Rating inválido');
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

    -- VERIFICACIÓN DE DUPLICADOS
    -- Si tenemos un address_osm_id, verificar si ya existe una reseña para este usuario y propiedad
    IF p_address_osm_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 
            FROM public.reviews 
            WHERE user_id = v_user_id 
            AND address_osm_id = p_address_osm_id
        ) THEN
            PERFORM log_security_event('create_review', 'blocked', 'Duplicate review attempt');
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
        winter_comfort,
        summer_comfort,
        humidity
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
        p_winter_comfort,
        p_summer_comfort,
        p_humidity
    )
    RETURNING id INTO v_review_id;

    -- Logging exitoso
    PERFORM log_security_event('create_review', 'success', NULL, 
        jsonb_build_object('review_id', v_review_id));

    RETURN json_build_object(
        'success', true,
        'review_id', v_review_id,
        'message', 'Reseña creada exitosamente'
    );

EXCEPTION
    WHEN OTHERS THEN
        PERFORM log_security_event('create_review', 'error', SQLERRM);
        RETURN json_build_object(
            'success', false,
            'error', 'Error al crear la reseña: ' || SQLERRM
        );
END;
$$;

-- Función para eliminar una reseña de forma segura
CREATE OR REPLACE FUNCTION delete_review_safe(review_id_param UUID)
RETURNS BOOLEAN AS $$
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
    
    DELETE FROM public.reviews WHERE id = review_id_param;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al eliminar reseña: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas antes de eliminar
CREATE OR REPLACE FUNCTION get_review_delete_info(review_id_param UUID)
RETURNS JSON AS $$
DECLARE
    review_info JSON;
    current_user_id UUID;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RETURN json_build_object('error', 'Usuario no autenticado');
    END IF;
    
    SELECT json_build_object(
        'id', r.id,
        'title', r.title,
        'created_at', r.created_at,
        'rating', r.rating,
        'likes', r.likes,
        'dislikes', r.dislikes,
        'can_delete', (r.user_id = current_user_id),
        'vote_count', (
            SELECT COUNT(*) 
            FROM public.review_votes rv 
            WHERE rv.review_id = r.id
        )
    ) INTO review_info
    FROM public.reviews r
    WHERE r.id = review_id_param;
    
    RETURN COALESCE(review_info, json_build_object('error', 'Reseña no encontrada'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar una reseña
CREATE OR REPLACE FUNCTION update_review(
  p_review_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_rating INTEGER,
  p_property_type TEXT DEFAULT NULL,
  p_zone_rating INTEGER DEFAULT NULL,
  p_winter_comfort TEXT DEFAULT NULL,
  p_summer_comfort TEXT DEFAULT NULL,
  p_humidity TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_review_owner UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;

  SELECT user_id INTO v_review_owner
  FROM public.reviews
  WHERE id = p_review_id;

  IF v_review_owner IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'La reseña no existe');
  END IF;

  IF v_review_owner != v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'No tienes permisos para editar esta reseña');
  END IF;

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
    updated_at = NOW()
  WHERE id = p_review_id;

  RETURN json_build_object('success', true, 'message', 'Reseña actualizada exitosamente');

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$$;

-- Función para votar reviews (con toggle)
CREATE OR REPLACE FUNCTION vote_review(
  p_review_id UUID,
  p_vote_type TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_existing_vote TEXT;
  v_result JSON;
BEGIN
  -- Verificar rate limit (20 votos por hora)
  IF NOT check_rate_limit('vote_review', 20, 60) THEN
    PERFORM log_security_event('vote_review', 'blocked', 'Rate limit exceeded');
    RETURN json_build_object('success', false, 'error', 'Demasiados votos. Intenta más tarde.');
  END IF;

  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    PERFORM log_security_event('vote_review', 'error', 'Usuario no autenticado');
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;

  IF p_vote_type NOT IN ('like', 'dislike') THEN
    PERFORM log_security_event('vote_review', 'error', 'Tipo de voto inválido');
    RETURN json_build_object('success', false, 'error', 'Tipo de voto inválido. Use like o dislike');
  END IF;

  -- Verificar si existe un voto previo
  SELECT vote_type INTO v_existing_vote
  FROM public.review_votes
  WHERE review_id = p_review_id AND user_id = v_user_id;

  -- Si existe y es del mismo tipo, eliminar (toggle off)
  IF v_existing_vote = p_vote_type THEN
    DELETE FROM public.review_votes
    WHERE review_id = p_review_id AND user_id = v_user_id;
    v_result := json_build_object(
      'success', true, 
      'message', 'Voto eliminado exitosamente', 
      'action', 'deleted'
    );
  ELSE
    -- Insertar o actualizar voto (si es diferente tipo o no existe)
    INSERT INTO public.review_votes (review_id, user_id, vote_type)
    VALUES (p_review_id, v_user_id, p_vote_type)
    ON CONFLICT (review_id, user_id) 
    DO UPDATE SET vote_type = p_vote_type;
    
    v_result := json_build_object(
      'success', true, 
      'message', 'Voto registrado exitosamente', 
      'action', CASE WHEN v_existing_vote IS NULL THEN 'inserted' ELSE 'updated' END
    );
  END IF;

  -- Logging exitoso
  PERFORM log_security_event('vote_review', 'success', NULL, 
    jsonb_build_object('review_id', p_review_id, 'vote_type', p_vote_type, 'action', v_result->>'action'));

  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event('vote_review', 'error', SQLERRM);
    RETURN json_build_object('success', false, 'error', 'Error al registrar el voto: ' || SQLERRM);
END;
$$;

-- Función para reportar reviews
CREATE OR REPLACE FUNCTION report_review(
  p_review_id UUID,
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
  v_existing_report UUID;
BEGIN
  -- Verificar rate limit (3 reports por hora)
  IF NOT check_rate_limit('report_review', 3, 60) THEN
    PERFORM log_security_event('report_review', 'blocked', 'Rate limit exceeded');
    RETURN json_build_object('success', false, 'error', 'Demasiados reportes. Intenta más tarde.');
  END IF;

  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    PERFORM log_security_event('report_review', 'error', 'Usuario no autenticado');
    RETURN json_build_object('success', false, 'error', 'Usuario no autenticado');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE id = p_review_id) THEN
    PERFORM log_security_event('report_review', 'error', 'Review not found');
    RETURN json_build_object('success', false, 'error', 'La reseña no existe');
  END IF;

  SELECT id INTO v_existing_report
  FROM public.review_reports
  WHERE review_id = p_review_id AND reported_by_user_id = v_user_id;

  IF v_existing_report IS NOT NULL THEN
    PERFORM log_security_event('report_review', 'blocked', 'Duplicate report attempt');
    RETURN json_build_object('success', false, 'error', 'Ya has reportado esta reseña anteriormente');
  END IF;

  INSERT INTO public.review_reports (review_id, reported_by_user_id, reason, description)
  VALUES (p_review_id, v_user_id, p_reason, p_description)
  RETURNING id INTO v_report_id;

  -- Logging exitoso
  PERFORM log_security_event('report_review', 'success', NULL, 
    jsonb_build_object('report_id', v_report_id, 'review_id', p_review_id, 'reason', p_reason));

  RETURN json_build_object('success', true, 'report_id', v_report_id, 'message', 'Reporte enviado exitosamente');

EXCEPTION
  WHEN unique_violation THEN
    PERFORM log_security_event('report_review', 'blocked', 'Unique violation');
    RETURN json_build_object('success', false, 'error', 'Ya has reportado esta reseña anteriormente');
  WHEN OTHERS THEN
    PERFORM log_security_event('report_review', 'error', SQLERRM);
    RETURN json_build_object('success', false, 'error', 'Error interno del servidor');
END;
$$;

-- Función para verificar si usuario ya reportó una review
CREATE OR REPLACE FUNCTION has_user_reported_review(p_review_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RETURN false; END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM public.review_reports 
    WHERE review_id = p_review_id 
    AND reported_by_user_id = v_user_id
  );
END;
$$;