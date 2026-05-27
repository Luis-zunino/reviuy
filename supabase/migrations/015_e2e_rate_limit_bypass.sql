-- =============================================================================
-- Migration 015: Bypass rate limit for e2e test user
-- =============================================================================
-- Modifica check_rate_limit para saltar el límite si el usuario autenticado
-- es el usuario de pruebas e2e (e2e-test@reviuy.qa). Esto permite que los
-- tests end-to-end creen reseñas sin esperar la ventana de rate limit.
-- =============================================================================

create or replace function public.check_rate_limit (
  p_endpoint text,
  p_max_requests integer default 10,
  p_window_minutes integer default 1
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
set search_path = public, pg_temp
set row_security = on
as $function$
declare
  v_user_id UUID;
  v_window_from TIMESTAMPTZ;
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
begin
  v_user_id := auth.uid();

  -- ===========================================================================
  -- Bypass para e2e tests
  -- ===========================================================================
  -- Si el usuario autenticado es e2e-test@reviuy.qa, omitimos el rate limit.
  -- Este usuario existe solo en staging/prod para pruebas automatizadas.
  if exists (
    select 1
    from auth.users
    where id = v_user_id
      and email = 'e2e-test@reviuy.qa'
  ) then
    return true;
  end if;

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
