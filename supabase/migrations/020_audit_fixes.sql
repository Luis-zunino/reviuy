-- =============================================================================
-- MIGRACIÓN 020: CORRECCIONES DE AUDITORÍA
-- =============================================================================
-- Fecha: 2026-05-21
-- Propósito: Corregir hallazgos identificados en la auditoría de seguridad
--            y mantenibilidad de la base de datos.
-- Ver: .audit-findings.json
-- =============================================================================

-- =============================================================================
-- F003 (HIGH): check_review_owner debe verificar deleted_at
-- =============================================================================
-- Antes: solo verificaba user_id, permitía operaciones en imágenes de reseñas
--        soft-deleteadas. check_review_active SÍ lo verificaba, inconsistencia.
create or replace function public.check_review_owner (p_review_id uuid)
returns boolean language sql security definer
set search_path = public as $$
  select exists (
    select 1 from public.reviews
    where id = p_review_id and user_id = auth.uid()
      and deleted_at is null
  );
$$;

comment on function public.check_review_owner is
  'Verifica que el usuario autenticado es el owner de la review y que ésta no está eliminada.';

-- =============================================================================
-- F004 (MEDIUM): log_security_event como SECURITY INVOKER
-- =============================================================================
-- Antes: SECURITY DEFINER + grant a authenticated permitía log forgery.
-- Ahora: SECURITY INVOKER + RLS policy para INSERT controlado desde funciones.
create or replace function log_security_event (
  p_action text,
  p_status text default 'success',
  p_error_message text default null,
  p_metadata jsonb default null
) RETURNS VOID LANGUAGE plpgsql SECURITY INVOKER
set search_path = public as $function$ BEGIN
  INSERT INTO public.security_logs (
    user_id, ip_address, user_agent, endpoint,
    action, status, error_message, metadata, created_at
  ) VALUES (
    COALESCE(auth.uid(), NULL),
    inet_client_addr(),
    COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
    COALESCE(current_setting('request.headers', true)::json->>'referer', 'unknown'),
    p_action, p_status, p_error_message,
    COALESCE(p_metadata, '{}'::jsonb),
    now()
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error en log_security_event: %', SQLERRM;
END;
$function$;

comment on FUNCTION log_security_event is
  'Logging de seguridad con SECURITY INVOKER. Las funciones que la llaman deben tener permiso de INSERT en security_logs.';

-- RLS policy para permitir INSERT desde funciones SECURITY INVOKER
-- (antes solo había policy de SELECT para service_role)
drop policy if exists security_logs_insert_authenticated on public.security_logs;
create policy security_logs_insert_authenticated on public.security_logs
  for insert to authenticated with check (user_id = auth.uid());

-- =============================================================================
-- F005 (MEDIUM): Índice compuesto para detección de actividad sospechosa
-- =============================================================================
-- La función detect_suspicious_activity filtra por created_at + group by user_id.
-- Un índice compuesto evita seq scan parcial en security_logs.
create index if not exists idx_security_logs_suspicious_activity
  on public.security_logs (created_at, user_id);

comment on index idx_security_logs_suspicious_activity is
  'Optimiza detect_suspicious_activity: filtro por created_at + group by user_id.';

-- =============================================================================
-- F007 (MEDIUM): log_review_changes usa auth.uid() en INSERT
-- =============================================================================
-- Antes: la rama INSERT usaba NEW.user_id (quien CREÓ la review).
--        la rama UPDATE usaba auth.uid() (quien EJECUTÓ la acción).
-- Ahora: ambas ramas usan auth.uid() para consistencia en auditoría.
create or replace function log_review_changes () RETURNS TRIGGER SECURITY DEFINER
set search_path = public as $function$ BEGIN
  IF (TG_OP = 'UPDATE' AND OLD IS DISTINCT FROM NEW) THEN
    INSERT INTO public.review_audit (
      review_id, old_data, new_data, changed_by, change_type
    ) VALUES (
      OLD.id, row_to_json(OLD), row_to_json(NEW), auth.uid(), 'update'
    );
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.review_audit (
      review_id, new_data, changed_by, change_type
    ) VALUES (
      NEW.id, row_to_json(NEW), auth.uid(), 'create'
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'review_audit_failure|review_id:%|op:%|msg:%|detail:%',
      COALESCE(NEW.id, OLD.id), TG_OP, SQLERRM, SQLSTATE;
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- =============================================================================
-- F002 (HIGH): Eliminar tipo público detect_suspicious_activity_result
-- =============================================================================
-- El tipo exponía user_id en schema public. La función ya usa RETURNS TABLE
-- directamente (no depende del tipo). Se elimina el tipo por seguridad.
do $$
begin
  if exists (
    select 1 from pg_type t
    join pg_namespace n on t.typnamespace = n.oid
    where n.nspname = 'public'
      and t.typname = 'detect_suspicious_activity_result'
  ) then
    -- Verificar que ningún objeto depende de este tipo
    if not exists (
      select 1 from pg_depend d
      join pg_class c on d.objid = c.oid
      where c.relname = 'detect_suspicious_activity_result'
    ) then
      drop type public.detect_suspicious_activity_result;
      raise notice 'Tipo detect_suspicious_activity_result eliminado';
    else
      raise warning 'detect_suspicious_activity_result tiene dependencias, no se puede eliminar automáticamente';
    end if;
  end if;
end $$;

-- =============================================================================
-- F006 (MEDIUM): Funciones paginadas para vistas _public
-- =============================================================================
-- Proveen límite server-side forzado para evitar queries sin paginación.

create or replace function public.get_reviews_paginated (
  p_limit int default 50,
  p_offset int default 0
) returns setof public.reviews_public language sql stable security invoker
set search_path = public as $$
  select * from public.reviews_public
  order by created_at desc
  limit least(p_limit, 100)
  offset p_offset;
$$;

comment on function public.get_reviews_paginated is
  'Retorna reseñas paginadas con límite máximo de 100 filas.';

create or replace function public.get_reviews_with_votes_paginated (
  p_limit int default 50,
  p_offset int default 0
) returns setof public.reviews_with_votes_public language sql stable security invoker
set search_path = public as $$
  select * from public.reviews_with_votes_public
  order by created_at desc
  limit least(p_limit, 100)
  offset p_offset;
$$;

comment on function public.get_reviews_with_votes_paginated is
  'Retorna reseñas con votos paginadas con límite máximo de 100 filas.';

create or replace function public.get_real_estates_paginated (
  p_limit int default 50,
  p_offset int default 0
) returns setof public.real_estates_public language sql stable security invoker
set search_path = public as $$
  select * from public.real_estates_public
  order by created_at desc
  limit least(p_limit, 100)
  offset p_offset;
$$;

comment on function public.get_real_estates_paginated is
  'Retorna inmobiliarias paginadas con límite máximo de 100 filas.';

create or replace function public.get_real_estate_reviews_paginated (
  p_real_estate_id uuid,
  p_limit int default 50,
  p_offset int default 0
) returns setof public.real_estate_reviews_with_votes_public language sql stable security invoker
set search_path = public as $$
  select * from public.real_estate_reviews_with_votes_public
  where real_estate_id = p_real_estate_id
  order by created_at desc
  limit least(p_limit, 100)
  offset p_offset;
$$;

comment on function public.get_real_estate_reviews_paginated is
  'Retorna reseñas de una inmobiliaria paginadas con límite máximo de 100 filas.';

-- Grants para las funciones paginadas
grant execute on function public.get_reviews_paginated(int, int) to authenticated, anon;
grant execute on function public.get_reviews_with_votes_paginated(int, int) to authenticated, anon;
grant execute on function public.get_real_estates_paginated(int, int) to authenticated, anon;
grant execute on function public.get_real_estate_reviews_paginated(uuid, int, int) to authenticated, anon;

-- =============================================================================
-- F014 (LOW): Configuración global de timeouts
-- =============================================================================
-- Opcional: asegura que si el proyecto se recrea, estas configuraciones
-- se restauran automáticamente.
alter database postgres set statement_timeout = '30000';
alter database postgres set idle_in_transaction_session_timeout = '60000';

-- =============================================================================
-- F001 (HIGH): Test de privacidad en vistas _public
-- =============================================================================
-- Verifica que ninguna vista _public expone columnas de identidad de usuario.
-- Corre en cada deploy como test de regresión.
-- =============================================================================
do $$
declare
  v_sensitive_columns text[] := array[
    'user_id', 'created_by', 'reported_by_user_id',
    'deleted_by', 'changed_by'
  ];
  v_views_to_check text[] := array[
    'reviews_public',
    'reviews_with_votes_public',
    'real_estates_public',
    'real_estate_reviews_public',
    'real_estate_reviews_with_votes_public'
  ];
  v_view text;
  v_col text;
  v_found_sensitive boolean := false;
begin
  foreach v_view in array v_views_to_check loop
    if exists (
      select 1 from information_schema.views
      where table_schema = 'public' and table_name = v_view
    ) then
      foreach v_col in array v_sensitive_columns loop
        if exists (
          select 1 from information_schema.columns
          where table_schema = 'public'
            and table_name = v_view
            and column_name = v_col
        ) then
          raise warning 'PRIVACY_VIOLATION: Vista % expone columna "%"',
            v_view, v_col;
          v_found_sensitive := true;
        end if;
      end loop;
    else
      raise notice 'TEST_SKIP: Vista % no existe, se omite', v_view;
    end if;
  end loop;

  if v_found_sensitive then
    raise exception 'PRIVACY_TEST_FAILED: Una o más vistas _public exponen columnas sensibles. Revisar warnings.';
  else
    raise notice 'PRIVACY_TEST_PASSED: Ninguna vista _public expone columnas de identidad de usuario.';
  end if;
end $$;

-- NOTA: Estas vistas NO tienen security_invoker = on intencionalmente.
-- Ver 017_secure_user_privacy.sql y .audit-findings.json (F001).
-- El acceso público está mediado por estas vistas que corren como owner,
-- ya que SELECT está revocado en las tablas base (014_grants.sql).

-- =============================================================================
-- NOTAS FINALES
-- =============================================================================
-- Hallazgos que no requirieron cambios de código:
--   F009 (LOW):  Sin estrategia de rollback - requiere proceso, no código.
--   F013 (LOW):  Numeración salta 003-007 - documentado en README.md.
-- =============================================================================
