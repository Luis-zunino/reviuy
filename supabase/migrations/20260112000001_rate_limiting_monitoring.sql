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

-- Índices para rate_limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);

-- RLS para rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits 
FOR SELECT USING (auth.uid() = user_id);

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

-- Índices para security_logs
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_endpoint ON public.security_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_status ON public.security_logs(status);

-- RLS para security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can view all logs" ON public.security_logs 
FOR SELECT USING (auth.role() = 'service_role');

-- Función de rate limiting
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
        RETURN FALSE;
    END IF;
    
    INSERT INTO public.rate_limits (user_id, ip_address, endpoint, window_start)
    VALUES (v_user_id, v_ip_address, p_endpoint, v_window_start)
    ON CONFLICT (user_id, endpoint, window_start) 
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN TRUE;
END;
$$;

-- Función para logging de seguridad
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
        metadata
    ) VALUES (
        auth.uid(),
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent',
        current_setting('request.headers', true)::json->>'referer',
        p_action,
        p_status,
        p_error_message,
        p_metadata
    );
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
-- MIGRACIÓN COMPLETADA
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Migración de rate limiting y monitoreo completada';
END $$;