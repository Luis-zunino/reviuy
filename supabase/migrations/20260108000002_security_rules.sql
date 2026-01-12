-- Cambiar policies de audit y deletions
DROP POLICY IF EXISTS "System can insert audit records" ON review_audit;CREATE POLICY "System can insert audit records" ON review_audit 
FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "System can log review deletions" ON review_deletions;
CREATE POLICY "System can log review deletions" ON review_deletions 
FOR INSERT WITH CHECK (auth.role() = 'service_role');

ALTER TABLE reviews ADD CONSTRAINT check_latitude 
CHECK (latitude >= -90 AND latitude <= 90);
ALTER TABLE reviews ADD CONSTRAINT check_longitude 
CHECK (longitude >= -180 AND longitude <= 180);
ALTER TABLE real_estate_reviews ADD CONSTRAINT check_rating 
CHECK (rating >= 1 AND rating <= 5);

-- Crear policies para service_role
CREATE POLICY "Service role can manage reports" ON review_reports 
FOR ALL USING (auth.role() = 'service_role');

-- En real_estates
ALTER TABLE real_estates ADD CONSTRAINT check_rating_range 
CHECK (rating >= 0 AND rating <= 5);

-- En reviews
ALTER TABLE reviews ADD CONSTRAINT check_zone_rating 
CHECK (zone_rating >= 1 AND zone_rating <= 5);

CREATE OR REPLACE FUNCTION moderate_reports(report_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'Access denied';
    END IF;
    -- Lógica de moderación
END;
$$;

-- Agregar tabla de logs de seguridad
CREATE TABLE security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);