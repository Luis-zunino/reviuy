-- =============================================================================
-- MIGRACIÓN 004: FUNCIONES AUXILIARES (SECURITY DEFINER + TRIGGERS)
-- =============================================================================
-- Funciones internas que necesitan ejecutarse con permisos de PostgreSQL:
-- - SECURITY DEFINER: helpers de RLS, MV refresh, conteo de votos, moderación
-- - Funciones de trigger: used by CREATE TRIGGER in migración 005
-- 
-- Todas tienen SET search_path = public para prevenir search path hijacking.
-- El EXECUTE de las funciones SECURITY DEFINER debe estar revocado para
-- public/anon/authenticated (ver migración 007).
-- =============================================================================

-- =============================================================================
-- FUNCIONES AUXILIARES (SECURITY DEFINER) para RLS
-- Las subqueries directas a public.reviews fallarían con SELECT revocado.
-- Estas funciones corren como owner y verifican existencia/ownership.
-- =============================================================================

create or replace function public.check_review_active (p_review_id uuid)
returns boolean language sql security definer
set search_path = public as $$
  select exists (
    select 1 from public.reviews
    where id = p_review_id and deleted_at is null
  );
$$;

create or replace function public.check_review_owner (p_review_id uuid)
returns boolean language sql security definer
set search_path = public as $$
  select exists (
    select 1 from public.reviews
    where id = p_review_id and user_id = auth.uid() and deleted_at is null
  );
$$;

-- Revocar acceso directo a estas funciones auxiliares
revoke execute on function public.check_review_active (uuid) from public, anon, authenticated;
revoke execute on function public.check_review_owner (uuid) from public, anon, authenticated;

-- =============================================================================
-- FUNCIÓN DEDICADA PARA CLEANUP DE SECURITY_LOGS
-- Separada del trigger de rate_limits para evitar efectos colaterales.
-- Diseñada para ejecutarse vía pg_cron o edge function.
-- =============================================================================
create or replace function public.cleanup_old_security_logs () returns void language plpgsql security definer
set
  search_path = public as $function$ begin -- Retención de 90 días, borrado en lotes para evitar locks largos
delete from
    public.security_logs
where
    id in (
        select
            id
        from
            public.security_logs
        where
            created_at < now() - interval '90 days'
        limit
            1000
    );

end;

$function$;

comment on function public.cleanup_old_security_logs is 'Limpia security_logs con más de 90 días. Diseñada para ejecutarse vía pg_cron o edge function.';

-- =============================================================================
-- FUNCIONES DE TRIGGER
-- =============================================================================

-- Nueva estrategia: Cleanup probabilístico (1% de chance por insert)
create or replace function cleanup_rate_limits_on_insert () RETURNS TRIGGER set search_path = public as $function$ BEGIN
-- Solo limpiar el 1% de las veces (reduce overhead)
IF random() < 0.01 THEN -- DELETE con LIMIT para evitar locks largos
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
            1000 -- Limitar para evitar lock largo
    );

END IF;

RETURN NEW;

END;

$function$ LANGUAGE plpgsql;

-- Función para actualizar timestamp de updated_at
create or replace function update_updated_at_column () RETURNS TRIGGER set search_path = public as $function$ BEGIN IF NEW IS DISTINCT FROM OLD THEN
    NEW.updated_at = now();

END IF;

RETURN NEW;

END;

$function$ LANGUAGE plpgsql;

-- Función para actualizar contadores de inmobiliarias
-- NOTA: review_count y rating se gestionan exclusivamente por update_real_estate_rating_from_reviews
-- (trigger en real_estate_reviews). Esta función solo actualiza updated_at cuando cambia real_estate_id.
create or replace function update_real_estate_counters () RETURNS TRIGGER set search_path = public as $function$ BEGIN IF (TG_OP = 'INSERT') THEN IF NEW.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = NEW.real_estate_id;

END IF;

ELSIF (TG_OP = 'UPDATE') THEN IF OLD.real_estate_id IS DISTINCT FROM
    NEW.real_estate_id THEN IF OLD.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = OLD.real_estate_id;

END IF;

IF NEW.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = NEW.real_estate_id;

END IF;

END IF;

ELSIF (TG_OP = 'DELETE') THEN IF OLD.real_estate_id IS NOT NULL THEN
UPDATE
    public.real_estates
SET
    updated_at = NOW()
WHERE
    id = OLD.real_estate_id;

END IF;

END IF;

RETURN COALESCE(NEW, OLD);

END;

$function$ LANGUAGE plpgsql;

-- Función para actualizar rating de inmobiliaria basado en sus reseñas
create or replace function update_real_estate_rating_from_reviews () RETURNS TRIGGER set search_path = public as $$
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
                    real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
                    AND deleted_at IS NULL),
            review_count = (
                SELECT
                    COUNT(*)
                FROM
                    public.real_estate_reviews
                WHERE
                    real_estate_id = COALESCE(NEW.real_estate_id, OLD.real_estate_id)
                    AND deleted_at IS NULL)
        WHERE
            id = COALESCE(NEW.real_estate_id, OLD.real_estate_id);

        END IF;

        RETURN COALESCE(NEW, OLD);

END;

$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCIONES DE AUDITORÍA (SECURITY DEFINER)
-- =============================================================================

-- Función para auditoría completa de cambios en reviews
-- Con manejo de excepciones para no bloquear operaciones principales
create or replace function log_review_changes () RETURNS TRIGGER SECURITY DEFINER
set
  search_path = public as $function$ BEGIN IF (
                TG_OP = 'UPDATE'
            AND OLD IS DISTINCT FROM
                NEW
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

RETURN COALESCE(NEW, OLD);

EXCEPTION
WHEN OTHERS THEN -- Registrar el error en logs del sistema con máximo detalle
-- Esto no bloquea la operación principal pero permite troubleshooting
RAISE WARNING 'review_audit_failure|review_id:%|op:%|msg:%|detail:%',
COALESCE(NEW.id, OLD.id),
TG_OP,
SQLERRM,
SQLSTATE;

RETURN COALESCE(NEW, OLD);

END;

$function$ LANGUAGE plpgsql;

-- Función para registrar eliminaciones de reviews
-- Con manejo de excepciones para no bloquear la eliminación de reviews
create or replace function log_review_deletion () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $function$ BEGIN BEGIN INSERT INTO
    public.review_deletions (
        review_id,
        deleted_by,
        review_title,
        review_rating,
        review_created_at
    )
VALUES
    (
        OLD.id,
        COALESCE(auth.uid(), OLD.user_id),
        OLD.title,
        OLD.rating,
        OLD.created_at
    );

EXCEPTION
WHEN OTHERS THEN -- Log del error pero NO bloquear la eliminación
RAISE WARNING 'Error al registrar eliminación de review_id %: %',
OLD.id,
SQLERRM;

END;

RETURN OLD;

END;

$function$;

-- =============================================================================
-- MODERACIÓN Y DETECCIÓN (SECURITY DEFINER)
-- =============================================================================

create or replace function moderate_reports (
  p_report_id uuid,
  p_target_type text,
  p_status text,
  p_moderation_note text default null
) RETURNS json LANGUAGE plpgsql SECURITY DEFINER
set
  search_path = public as $$
DECLARE
  v_updated boolean;
BEGIN
  IF auth.jwt() ->> 'role' != 'service_role' THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  IF p_status NOT IN ('reviewed', 'resolved', 'dismissed') THEN
    RAISE EXCEPTION 'Invalid status. Use: reviewed, resolved, or dismissed';
  END IF;

  CASE p_target_type
    WHEN 'review' THEN
      UPDATE public.review_reports
      SET status = p_status, updated_at = now()
      WHERE id = p_report_id;
    WHEN 'real_estate_review' THEN
      UPDATE public.real_estate_review_reports
      SET status = p_status, updated_at = now()
      WHERE id = p_report_id;
    WHEN 'real_estate' THEN
      UPDATE public.real_estate_reports
      SET status = p_status, updated_at = now()
      WHERE id = p_report_id;
    ELSE
      RAISE EXCEPTION 'Invalid target type. Use: review, real_estate_review, or real_estate';
  END CASE;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF NOT v_updated THEN
    RAISE EXCEPTION 'Report not found: %', p_report_id;
  END IF;

  PERFORM log_security_event(
    'moderate_report',
    'success',
    p_moderation_note,
    jsonb_build_object(
      'report_id', p_report_id,
      'target_type', p_target_type,
      'new_status', p_status
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'report_id', p_report_id,
    'target_type', p_target_type,
    'new_status', p_status
  );
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
  search_path = public as $$ BEGIN IF auth.jwt() ->> 'role' != 'service_role' THEN RAISE EXCEPTION 'Access denied';

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
-- FUNCIONES PARA CONTADORES DINÁMICOS DE VOTOS (SECURITY DEFINER)
-- =============================================================================

-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
-- NO cambiar el return type para incluir columnas de usuario (user_id, email, etc.).
-- Si se necesitan datos sensibles, convertir a SECURITY INVOKER primero y verificar grants.
-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
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

-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
-- NO cambiar el return type para incluir columnas de usuario (user_id, email, etc.).
-- Si se necesitan datos sensibles, convertir a SECURITY INVOKER primero y verificar grants.
-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
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

-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
-- NO cambiar el return type para incluir columnas de usuario (user_id, email, etc.).
-- Si se necesitan datos sensibles, convertir a SECURITY INVOKER primero y verificar grants.
-- ⚠️ ADVERTENCIA (F016): Esta función es SECURITY DEFINER con grant a anon + authenticated.
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

-- =============================================================================
-- FUNCIONES PARA REFRESH DE VISTAS MATERIALIZADAS (SECURITY DEFINER)
-- =============================================================================

-- NOTA: Solo se usa vía pg_cron o refresh_all_vote_stats(). No hay triggers que la llamen (ver migración 011).
create or replace function public.refresh_real_estate_vote_stats () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin refresh materialized view concurrently public.real_estate_vote_stats;

return null;

end;

$$;

-- NOTA: Solo se usa vía pg_cron o refresh_all_vote_stats(). No hay triggers que la llamen (ver migración 011).
create or replace function public.refresh_review_vote_stats () returns trigger language plpgsql security definer
set
  search_path = public as $$ begin refresh materialized view concurrently public.review_vote_stats;

return null;

end;

$$;

-- NOTA: Solo se usa vía pg_cron o refresh_all_vote_stats(). No hay triggers que la llamen (ver migración 011).
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
