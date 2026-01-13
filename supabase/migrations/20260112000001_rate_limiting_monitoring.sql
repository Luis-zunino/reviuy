-- =============================================================================
-- MIGRACIÓN: RATE LIMITING Y MONITOREO DE SEGURIDAD
-- Fecha: 11 de enero de 2026
-- Descripción: Implementa rate limiting y logging de seguridad
-- =============================================================================

-- Tabla para rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    endpoint TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, endpoint, window_start)
);

-- Si la tabla ya existe pero le falta la columna endpoint, agregarla
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_name = 'rate_limits' AND table_schema = 'public' 
               AND column_name = 'endpoint') THEN
        RAISE NOTICE 'Columna endpoint ya existe en rate_limits';
    ELSE
        -- Verificar si la tabla existe
        IF EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_name = 'rate_limits' AND table_schema = 'public') THEN
            ALTER TABLE public.rate_limits ADD COLUMN endpoint TEXT NOT NULL DEFAULT 'unknown';
            -- Actualizar el constraint UNIQUE para incluir endpoint
            ALTER TABLE public.rate_limits DROP CONSTRAINT IF EXISTS rate_limits_user_id_endpoint_window_start_key;
            ALTER TABLE public.rate_limits ADD UNIQUE(user_id, endpoint, window_start);
            RAISE NOTICE 'Columna endpoint agregada a rate_limits';
        END IF;
    END IF;
END $$;

-- Tabla de logs de seguridad
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    endpoint TEXT,
    action TEXT,
    status TEXT,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verificar y agregar columnas faltantes a security_logs si ya existe
DO $$ 
BEGIN
    -- Verificar si la tabla existe
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_name = 'security_logs' AND table_schema = 'public') THEN
        -- Agregar columnas faltantes
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'security_logs' AND table_schema = 'public' 
                      AND column_name = 'endpoint') THEN
            ALTER TABLE public.security_logs ADD COLUMN endpoint TEXT;
            RAISE NOTICE 'Columna endpoint agregada a security_logs';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'security_logs' AND table_schema = 'public' 
                      AND column_name = 'action') THEN
            ALTER TABLE public.security_logs ADD COLUMN action TEXT;
            RAISE NOTICE 'Columna action agregada a security_logs';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'security_logs' AND table_schema = 'public' 
                      AND column_name = 'status') THEN
            ALTER TABLE public.security_logs ADD COLUMN status TEXT;
            RAISE NOTICE 'Columna status agregada a security_logs';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns 
                      WHERE table_name = 'security_logs' AND table_schema = 'public' 
                      AND column_name = 'error_message') THEN
            ALTER TABLE public.security_logs ADD COLUMN error_message TEXT;
            RAISE NOTICE 'Columna error_message agregada a security_logs';
        END IF;
    END IF;
END $$;

-- Índices para rate_limits (solo crear si no existen)
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);

-- Índices para security_logs (solo crear si no existen)
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_endpoint ON public.security_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_status ON public.security_logs(status);

-- RLS para rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Eliminar política si existe antes de crearla
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.rate_limits;
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits 
FOR SELECT USING (auth.uid() = user_id);

-- RLS para security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Eliminar política si existe antes de crearla
DROP POLICY IF EXISTS "Service role can view all logs" ON public.security_logs;
CREATE POLICY "Service role can view all logs" ON public.security_logs 
FOR SELECT USING (auth.role() = 'service_role');

-- Función de rate limiting (reemplazar si existe)
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_endpoint TEXT,
    p_max_requests INTEGER DEFAULT 10,
    p_window_minutes INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_ip_address INET;
    v_window_start TIMESTAMPTZ;
    v_current_count INTEGER;
BEGIN
    v_user_id := auth.uid();
    v_ip_address := inet_client_addr();
    v_window_start := date_trunc('minute', NOW()) - INTERVAL '1 minute' * (EXTRACT(MINUTE FROM NOW()) % p_window_minutes);
    
    SELECT COALESCE(SUM(request_count), 0) INTO v_current_count
    FROM public.rate_limits
    WHERE (user_id = v_user_id OR ip_address = v_ip_address)
      AND endpoint = p_endpoint
      AND window_start >= v_window_start;
    
    IF v_current_count >= p_max_requests THEN
        -- Log de intento bloqueado
        PERFORM public.log_security_event(
            'rate_limit_exceeded',
            'blocked',
            'Rate limit exceeded for endpoint: ' || p_endpoint,
            jsonb_build_object(
                'endpoint', p_endpoint,
                'max_requests', p_max_requests,
                'window_minutes', p_window_minutes,
                'current_count', v_current_count
            )
        );
        RETURN FALSE;
    END IF;
    
    INSERT INTO public.rate_limits (user_id, ip_address, endpoint, window_start)
    VALUES (v_user_id, v_ip_address, p_endpoint, v_window_start)
    ON CONFLICT (user_id, endpoint, window_start) 
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN TRUE;
END;
$$;

-- Función para logging de seguridad (reemplazar si existe)
CREATE OR REPLACE FUNCTION log_security_event(
    p_action TEXT,
    p_status TEXT DEFAULT 'success',
    p_error_message TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.security_logs (
        user_id, 
        ip_address, 
        user_agent,
        endpoint,
        action, 
        status, 
        error_message, 
        metadata,
        created_at
    ) VALUES (
        COALESCE(auth.uid(), NULL),
        inet_client_addr(),
        COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown'),
        COALESCE(current_setting('request.headers', true)::json->>'referer', 'unknown'),
        p_action,
        p_status,
        p_error_message,
        COALESCE(p_metadata, '{}'::jsonb),
        NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Si hay un error al loguear, al menos registra algo
        RAISE NOTICE 'Error en log_security_event: %', SQLERRM;
END;
$$;

-- Función para detectar actividad sospechosa
CREATE OR REPLACE FUNCTION detect_suspicious_activity(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
    user_id UUID,
    total_requests INTEGER,
    blocked_requests INTEGER,
    suspicious_score INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    
    RETURN QUERY
    SELECT 
        sl.user_id,
        COUNT(*)::INTEGER as total_requests,
        COUNT(CASE WHEN sl.status = 'blocked' THEN 1 END)::INTEGER as blocked_requests,
        (COUNT(CASE WHEN sl.status = 'blocked' THEN 1 END) * 10 + 
         COUNT(CASE WHEN sl.action = 'report' THEN 1 END) * 2)::INTEGER as suspicious_score
    FROM public.security_logs sl
    WHERE sl.created_at >= NOW() - INTERVAL '1 hour'
      AND (p_user_id IS NULL OR sl.user_id = p_user_id)
    GROUP BY sl.user_id
    HAVING COUNT(*) > 50 OR COUNT(CASE WHEN sl.status = 'blocked' THEN 1 END) > 5
    ORDER BY suspicious_score DESC;
END;
$$;

-- Función para limpiar rate limits antiguos
CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS VOID AS $$
BEGIN
    DELETE FROM public.rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FUNCIONES AUXILIARES SIMPLIFICADAS (SIN TIPOS PROBLEMÁTICOS)
-- =============================================================================

-- Función simplificada para verificar el estado de las tablas
CREATE OR REPLACE FUNCTION check_migration_status_simple() 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_rate_limits_count INTEGER;
    v_security_logs_count INTEGER;
    v_rate_columns TEXT;
    v_security_columns TEXT;
BEGIN
    -- Contar registros
    SELECT COUNT(*) INTO v_rate_limits_count FROM public.rate_limits;
    SELECT COUNT(*) INTO v_security_logs_count FROM public.security_logs;
    
    -- Obtener columnas de rate_limits
    SELECT STRING_AGG(column_name, ', ') INTO v_rate_columns
    FROM information_schema.columns
    WHERE table_name = 'rate_limits' AND table_schema = 'public';
    
    -- Obtener columnas de security_logs
    SELECT STRING_AGG(column_name, ', ') INTO v_security_columns
    FROM information_schema.columns
    WHERE table_name = 'security_logs' AND table_schema = 'public';
    
    RAISE NOTICE '=== ESTADO DE LA MIGRACIÓN ===';
    RAISE NOTICE 'Tabla rate_limits: % registros', v_rate_limits_count;
    RAISE NOTICE 'Columnas de rate_limits: %', COALESCE(v_rate_columns, 'No existe la tabla');
    RAISE NOTICE 'Tabla security_logs: % registros', v_security_logs_count;
    RAISE NOTICE 'Columnas de security_logs: %', COALESCE(v_security_columns, 'No existe la tabla');
    
    -- Verificar funciones
    RAISE NOTICE '=== FUNCIONES ===';
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'check_rate_limit') THEN
        RAISE NOTICE '✓ Función check_rate_limit existe';
    ELSE
        RAISE NOTICE '✗ Función check_rate_limit NO existe';
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'log_security_event') THEN
        RAISE NOTICE '✓ Función log_security_event existe';
    ELSE
        RAISE NOTICE '✗ Función log_security_event NO existe';
    END IF;
    
    IF EXISTS (SELECT FROM pg_proc WHERE proname = 'cleanup_rate_limits') THEN
        RAISE NOTICE '✓ Función cleanup_rate_limits existe';
    ELSE
        RAISE NOTICE '✗ Función cleanup_rate_limits NO existe';
    END IF;
END;
$$;

-- =============================================================================
-- MIGRACIÓN COMPLETADA
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Iniciando migración de rate limiting y monitoreo...';
    
    -- Llamar a la función simplificada
    PERFORM check_migration_status_simple();
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migración completada exitosamente';
    RAISE NOTICE '';
    RAISE NOTICE 'Funcionalidades implementadas:';
    RAISE NOTICE '1. ✅ Tabla rate_limits para control de límites de peticiones';
    RAISE NOTICE '2. ✅ Tabla security_logs para registro de eventos de seguridad';
    RAISE NOTICE '3. ✅ Función check_rate_limit(endpoint, max_requests, window_minutes)';
    RAISE NOTICE '4. ✅ Función log_security_event(action, status, error_message, metadata)';
    RAISE NOTICE '5. ✅ Función cleanup_rate_limits() para limpieza automática';
    RAISE NOTICE '6. ✅ Row Level Security configurado correctamente';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Para usar:';
    RAISE NOTICE '   - check_rate_limit(''/api/endpoint'', 10, 1) -- 10 peticiones por minuto';
    RAISE NOTICE '   - log_security_event(''login'', ''success'') -- Registrar evento';
    RAISE NOTICE '';
END $$;