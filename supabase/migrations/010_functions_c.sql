--=============================================================================
-- Funciones
--=============================================================================
-- Función para crear inmobiliaria 
create or replace function create_real_estate (p_name text, p_description text default null) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $function$ DECLARE v_user_id uuid;

v_real_estate_id uuid;

BEGIN -- Obtener el ID del usuario autenticado
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
    'Error interno del servidor'
);

END;

$function$;

-- Función para votar inmobiliarias (simplificada - contadores se calculan con SELECT)
create or replace function vote_real_estate (p_real_estate_id uuid, p_vote_type text) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
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

-- Función para reportar inmobiliarias 
create or replace function report_real_estate (
  p_real_estate_id UUID,
  p_reason TEXT,
  p_description TEXT default null
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER
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
        public.real_estates
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
-- FUNCIÓN PARA AGREGAR / QUITAR FAVORITO (TOGGLE)
--=============================================================================
create or replace function toggle_favorite_real_estate (p_real_estate_id uuid) RETURNS public.toggle_favorite_result LANGUAGE plpgsql SECURITY DEFINER
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
--=============================================================================
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
-- FUNCIÓN PARA SABER EL VOTO DEL USUARIO SOBRE UNA REAL ESTATE
--=============================================================================
create or replace function get_user_real_estate_vote (p_real_estate_id uuid) returns text language sql as $$
select
    vote_type
from
    real_estate_votes
where
    real_estate_id = p_real_estate_id
    and user_id = auth.uid()
limit
    1;

$$;

-- =============================================================================
-- FUNCIÓN PARA SABER LAS REVIEWS DEL USUARIO
--=============================================================================
create or replace function public.get_reviews_by_current_user () returns setof reviews_with_votes language sql security definer
set
  search_path = public as $$
select
    *
from
    reviews_with_votes
where
    user_id = auth.uid()
order by
    created_at desc;

$$;

-- =============================================================================
-- FUNCIÓN PARA SABER LOs FAVORITOS DEL USUARIO
--=============================================================================
create or replace function public.get_favorite_reviews_by_current_user () returns setof reviews_with_votes language sql security definer
set
  search_path = public as $$
select
    rwv.*
from
    review_favorites rf
    join reviews_with_votes rwv on rwv.id = rf.review_id
where
    rf.user_id = auth.uid()
order by
    rf.created_at desc;

$$;

-- =============================================================================
-- FUNCIÓN PARA SABER EL VOTO DEL USUARIO SOBRE UNA REVIEW
--=============================================================================
create or replace function public.get_user_review_vote (p_review_id uuid) returns text language sql stable security invoker as $$
select
    vote_type
from
    public.review_votes
where
    review_id = p_review_id
    and user_id = auth.uid()
limit
    1;

$$;

-- =============================================================================
-- FUNCIÓN PARA SABER SI EL USUARIO TIENE UNA REVIEW SEGUN LA ADDRESS
--=============================================================================
create or replace function public.check_user_review_for_address (p_osm_id text) returns uuid language sql stable security invoker as $$
select
    id
from
    public.reviews
where
    user_id = auth.uid()
    and address_osm_id = p_osm_id
limit
    1;

$$;

-- =============================================================================
-- FUNCIÓN PARA SABER LA REVIEW DE UNA REAL ESTATE POR USUARIO
--=============================================================================
create or replace function public.get_real_estate_review_by_user (p_real_estate_id uuid) returns setof public.real_estate_reviews_with_votes language sql security definer
set
  search_path = public as $$
select
    *
from
    public.real_estate_reviews_with_votes
where
    user_id = auth.uid()
    and real_estate_id = p_real_estate_id
limit
    1;

$$;

-- =============================================================================
-- FUNCIÓN PARA AGREGAR / QUITAR FAVORITO DE RESEÑA (TOGGLE)
--=============================================================================
create or replace function toggle_favorite_review (p_review_id uuid) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
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

--=============================================================================
-- FUNCIÓN PARA VERIFICAR SI UNA RESEÑA ES FAVORITA
--=============================================================================
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

create or replace function moderate_reports (report_id uuid) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$ BEGIN -- Placeholder: mantener el parámetro como usado hasta implementar moderación.
    PERFORM report_id;

IF auth.role () != 'service_role' THEN RAISE EXCEPTION 'Access denied';

END IF;

-- TODO: Implementar lógica de moderación
-- Placeholder: esta función requiere implementación antes de uso en producción
RAISE EXCEPTION 'Función de moderación aún no implementada';

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
  search_path = public as $$ BEGIN IF auth.role () != 'service_role' THEN RAISE EXCEPTION 'Access denied';

END IF;

RETURN QUERY
SELECT
    sl.user_id,
    COUNT(*) :: integer AS total_requests,
    COUNT(
        CASE
            WHEN sl.status = 'blocked' THEN 1
        END
    ) :: integer AS blocked_requests,
    (
        COUNT(
            CASE
                WHEN sl.status = 'blocked' THEN 1
            END
        ) * 10 + COUNT(
            CASE
                WHEN sl.action = 'report' THEN 1
            END
        ) * 2
    ) :: integer AS suspicious_score
FROM
    public.security_logs sl
WHERE
    sl.created_at >= now() - INTERVAL '1 hour'
    AND (
        p_user_id IS NULL
        OR sl.user_id = p_user_id
    )
GROUP BY
    sl.user_id
HAVING
    COUNT(*) > 50
    OR COUNT(
        CASE
            WHEN sl.status = 'blocked' THEN 1
        END
    ) > 5
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
  search_path = public as $$ DECLARE v_rate_limits_count integer;

v_security_logs_count integer;

v_rate_columns text;

v_security_columns text;

BEGIN -- Contar registros si la tabla existe 
IF EXISTS (
    SELECT
    FROM
        information_schema.tables
    WHERE
        table_name = 'rate_limits'
        AND table_schema = 'public'
) THEN
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

ELSE v_rate_limits_count := 0;

v_rate_columns := 'Tabla no existe aún';

END IF;

IF EXISTS (
    SELECT
    FROM
        information_schema.tables
    WHERE
        table_name = 'security_logs'
        AND table_schema = 'public'
) THEN
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

ELSE v_security_logs_count := 0;

v_security_columns := 'Tabla no existe aún';

END IF;

RAISE NOTICE '=== ESTADO DE LA MIGRACIÓN ===';

RAISE NOTICE 'Tabla rate_limits: % registros',
v_rate_limits_count;

RAISE NOTICE 'Columnas de rate_limits: %',
COALESCE(v_rate_columns, 'No existe la tabla');

RAISE NOTICE 'Tabla security_logs: % registros',
v_security_logs_count;

RAISE NOTICE 'Columnas de security_logs: %',
COALESCE(v_security_columns, 'No existe la tabla');

-- Verificar funciones 
RAISE NOTICE '=== FUNCIONES ===';

IF EXISTS (
    SELECT
    FROM
        pg_proc
    WHERE
        proname = 'check_rate_limit'
) THEN RAISE NOTICE '✓ Función check_rate_limit existe';

ELSE RAISE NOTICE '✗ Función check_rate_limit NO existe';

END IF;

IF EXISTS (
    SELECT
    FROM
        pg_proc
    WHERE
        proname = 'log_security_event'
) THEN RAISE NOTICE '✓ Función log_security_event existe';

ELSE RAISE NOTICE '✗ Función log_security_event NO existe';

END IF;

IF EXISTS (
    SELECT
    FROM
        pg_proc
    WHERE
        proname = 'cleanup_rate_limits'
) THEN RAISE NOTICE '✓ Función cleanup_rate_limits existe';

ELSE RAISE NOTICE '✗ Función cleanup_rate_limits NO existe';

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

alter function public.vote_real_estate (uuid, text)
set
  search_path = public;

alter function public.create_real_estate_review (uuid, text, text, integer)
set
  search_path = public;

alter function public.has_user_reported_review (uuid)
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

alter function public.get_user_real_estate_vote (uuid)
set
  search_path = public;

-- =============================================================================
-- FUNCIONES PARA CONTADORES DINÁMICOS DE VOTOS DE REAL_ESTATES
-- =============================================================================
-- Función para obtener contadores de likes/dislikes en tiempo real
create or replace function public.get_real_estate_vote_counts (p_real_estate_id uuid) returns table (likes_count bigint, dislikes_count bigint) language plpgsql stable security definer
set
  search_path = public as $$ begin return query
select
    coalesce(
        sum(
            case
                when rev.vote_type = 'like' then 1
                else 0
            end
        ),
        0
    ) as likes_count,
    coalesce(
        sum(
            case
                when rev.vote_type = 'dislike' then 1
                else 0
            end
        ),
        0
    ) as dislikes_count
from
    public.real_estate_votes rev
    join public.real_estates re on re.id = rev.real_estate_id
where
    rev.real_estate_id = p_real_estate_id
    and re.deleted_at is null;

end;

$$;

-- Función para refrescar la vista materializada de contadores
create or replace function public.refresh_real_estate_vote_stats () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin refresh materialized view concurrently public.real_estate_vote_stats;

return null;

end;

$$;

-- =============================================================================
-- FUNCIONES PARA CONTADORES DINÁMICOS DE VOTOS DE REVIEWS
-- =============================================================================
-- Función para obtener contadores de likes/dislikes de reviews en tiempo real
create or replace function public.get_review_vote_counts (p_review_id uuid) returns table (likes_count bigint, dislikes_count bigint) language plpgsql stable security definer
set
  search_path = public as $$ begin return query
select
    coalesce(
        sum(
            case
                when rv.vote_type = 'like' then 1
                else 0
            end
        ),
        0
    ) as likes_count,
    coalesce(
        sum(
            case
                when rv.vote_type = 'dislike' then 1
                else 0
            end
        ),
        0
    ) as dislikes_count
from
    public.review_votes rv
    join public.reviews r on r.id = rv.review_id
where
    rv.review_id = p_review_id
    and r.deleted_at is null;

end;

$$;

-- Función para refrescar la vista materializada de contadores de reviews
create or replace function public.refresh_review_vote_stats () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin refresh materialized view concurrently public.review_vote_stats;

return null;

end;

$$;

-- Función para obtener contadores de votos de real_estate_reviews en tiempo real
create or replace function public.get_real_estate_review_vote_counts (p_real_estate_review_id uuid) returns table (likes_count bigint, dislikes_count bigint) language plpgsql stable security definer
set
  search_path = public as $$ begin return query
select
    coalesce(
        sum(
            case
                when rerv.vote_type = 'like' then 1
                else 0
            end
        ),
        0
    ) as likes_count,
    coalesce(
        sum(
            case
                when rerv.vote_type = 'dislike' then 1
                else 0
            end
        ),
        0
    ) as dislikes_count
from
    public.real_estate_review_votes rerv
    join public.real_estate_reviews rer on rer.id = rerv.real_estate_review_id
where
    rerv.real_estate_review_id = p_real_estate_review_id
    and rer.deleted_at is null;

end;

$$;

-- Función para refrescar la vista materializada de contadores de real_estate_reviews
create or replace function public.refresh_real_estate_review_vote_stats () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin refresh materialized view concurrently public.real_estate_review_vote_stats;

return null;

end;

$$;

-- =============================================================================
-- FUNCIÓN PARA REFRESH DE TODAS LAS MVs DE VOTOS
-- =============================================================================
create or replace function public.refresh_all_vote_stats () returns void language plpgsql security definer
set
  search_path = public as $$ begin refresh materialized view concurrently public.review_vote_stats;

refresh materialized view concurrently public.real_estate_vote_stats;

refresh materialized view concurrently public.real_estate_review_vote_stats;

end;

$$;

comment on function public.refresh_all_vote_stats is 'Refresca todas las MVs de contadores de votos. Usar vía pg_cron cada 1-5 minutos.';

-- =============================================================================
-- CONFIGURAR PG_CRON SI ESTÁ DISPONIBLE
-- =============================================================================
do $cron$ begin if exists (
    select
        1
    from
        pg_extension
    where
        extname = 'pg_cron'
) then perform cron.schedule(
    'refresh-all-vote-stats',
    '*/2 * * * *',
    $$
    select
        public.refresh_all_vote_stats() $$
);

perform cron.schedule(
    'cleanup-security-logs',
    '0 3 * * *',
    $$
    select
        public.cleanup_old_security_logs() $$
);

perform cron.schedule(
    'cleanup-old-rate-limits',
    '15 3 * * *',
    $$
    delete from
        public.rate_limits
    where
        window_start < now() - interval '24 hours' $$
);

raise notice 'pg_cron jobs configurados: refresh-all-vote-stats (2min), cleanup-security-logs (diario), cleanup-old-rate-limits (diario)';

else raise warning 'pg_cron NO disponible. Las vistas materializadas deben refrescarse manualmente o vía Supabase Edge Function con schedule. Ejecutar periódicamente: SELECT public.refresh_all_vote_stats(); SELECT public.cleanup_old_security_logs();';

end if;

exception
when others then raise warning 'Error configurando pg_cron: %. Las MVs deben refrescarse manualmente.',
sqlerrm;

end $cron$;