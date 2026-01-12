-- Nueva migración: 20260112000001_rate_limiting.sql

-- Tabla para rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    endpoint TEXT NOT NULL, -- ej: 'create_review', 'vote_review'
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, endpoint, window_start)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON public.rate_limits(user_id, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);

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
    
    -- Contar requests en la ventana
    SELECT COALESCE(SUM(request_count), 0) INTO v_current_count
    FROM public.rate_limits
    WHERE (user_id = v_user_id OR ip_address = v_ip_address)
      AND endpoint = p_endpoint
      AND window_start >= v_window_start;
    
    -- Si excede límite, bloquear
    IF v_current_count >= p_max_requests THEN
        RETURN FALSE;
    END IF;
    
    -- Registrar el request
    INSERT INTO public.rate_limits (user_id, ip_address, endpoint, window_start)
    VALUES (v_user_id, v_ip_address, p_endpoint, v_window_start)
    ON CONFLICT (user_id, endpoint, window_start) 
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN TRUE;
END;
$$;

-- RLS para rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.rate_limits;
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits 
FOR SELECT USING (auth.uid() = user_id);

-- Limpiar rate limits antiguos (trigger o función periódica)
CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS VOID AS $$
BEGIN
    DELETE FROM public.rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;