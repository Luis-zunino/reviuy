-- =============================================================================
-- MIGRACIÓN 011: AUDIT Y FIXES DE SEGURIDAD
-- =============================================================================
-- Test de regresión DO block que corre en cada deploy.
-- Si una vista _public expone accidentalmente user_id/created_by,
-- la migración falla y el deploy se revierte.
--
-- También incluye configuraciones globales y el índice compuesto
-- para detección de actividad sospechosa.
-- =============================================================================

-- =============================================================================
-- F004 (MEDIUM): log_security_event como SECURITY INVOKER
-- =============================================================================
-- Antes: SECURITY DEFINER + grant a authenticated permitía log forgery.
-- Ahora: SECURITY INVOKER + RLS policy para INSERT controlado desde funciones.
create or replace function public.log_security_event (
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

comment on FUNCTION public.log_security_event is
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
create or replace function public.log_review_changes () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
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
