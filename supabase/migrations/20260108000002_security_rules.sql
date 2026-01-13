-- Cambiar policies de audit y deletions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_audit' AND policyname = 'System can insert audit records') THEN
        CREATE POLICY "System can insert audit records" ON review_audit 
        FOR INSERT WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_deletions' AND policyname = 'System can log review deletions') THEN
        CREATE POLICY "System can log review deletions" ON review_deletions 
        FOR INSERT WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_latitude' AND table_name = 'reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE reviews ADD CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_longitude' AND table_name = 'reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE reviews ADD CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_rating' AND table_name = 'real_estate_reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE real_estate_reviews ADD CONSTRAINT check_rating CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;

-- Crear policies para service_role
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_reports' AND policyname = 'Service role can manage reports') THEN
        CREATE POLICY "Service role can manage reports" ON review_reports 
        FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- En real_estates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_rating_range' AND table_name = 'real_estates' AND constraint_type = 'CHECK') THEN
        ALTER TABLE real_estates ADD CONSTRAINT check_rating_range CHECK (rating >= 0 AND rating <= 5);
    END IF;
END $$;

-- En reviews
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'check_zone_rating' AND table_name = 'reviews' AND constraint_type = 'CHECK') THEN
        ALTER TABLE reviews ADD CONSTRAINT check_zone_rating CHECK (zone_rating >= 1 AND zone_rating <= 5);
    END IF;
END $$;

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
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permitir a los usuarios leer todas las reseñas (si es público)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Public can read all reviews') THEN
        CREATE POLICY "Public can read all reviews" ON reviews
        FOR SELECT USING (true);
    END IF;
END $$;

-- Permitir a los usuarios crear sus propias reseñas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can create their own reviews') THEN
        CREATE POLICY "Users can create their own reviews" ON reviews
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Permitir a los usuarios actualizar sus propias reseñas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews') THEN
        CREATE POLICY "Users can update their own reviews" ON reviews
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Permitir a todos leer las reseñas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Public can read reviews') THEN
        CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);
    END IF;
END $$;
-- Permitir a usuarios autenticados crear reseñas
DO $$
BEGIN
    -- Note: This is a duplicate policy name, but since it's the same, it won't create again
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can create their own reviews') THEN
        CREATE POLICY "Users can create their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
-- Permitir a usuarios actualizar sus propias reseñas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Users can update their own reviews') THEN
        CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Permitir a todos leer los votos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_votes' AND policyname = 'Public can read votes') THEN
        CREATE POLICY "Public can read votes" ON review_votes FOR SELECT USING (true);
    END IF;
END $$;
-- Permitir a usuarios autenticados crear/modificar sus votos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_votes' AND policyname = 'Users can manage their own votes') THEN
        CREATE POLICY "Users can manage their own votes" ON review_votes FOR ALL
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

    -- Permitir a usuarios autenticados crear reportes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_reports' AND policyname = 'Users can create reports') THEN
        CREATE POLICY "Users can create reports" ON review_reports FOR INSERT
        WITH CHECK (auth.uid() = reported_by_user_id);
    END IF;
END $$;