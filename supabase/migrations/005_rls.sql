-- =============================================================================
-- RLS BASE
-- =============================================================================
-- Políticas para REAL_ESTATES
DROP POLICY IF EXISTS "Anyone can view real estates" ON public.real_estates;

CREATE POLICY "Anyone can view real estates" ON public.real_estates FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create real estates" ON public.real_estates;

CREATE POLICY "Authenticated users can create real estates" ON public.real_estates FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND (
            created_by = auth.uid ()
            OR created_by IS NULL
        )
    );

DROP POLICY IF EXISTS "Creators can update their real estates" ON public.real_estates;

CREATE POLICY "Creators can update their real estates" ON public.real_estates FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND (
        created_by = auth.uid ()
        OR created_by IS NULL
    )
);

DROP POLICY IF EXISTS "Creators can delete their real estates" ON public.real_estates;

CREATE POLICY "Creators can delete their real estates" ON public.real_estates FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND (
        created_by = auth.uid ()
        OR created_by IS NULL
    )
);

--------- RLS para rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits" ON public.rate_limits FOR
SELECT
    USING (auth.uid () = user_id);

-- RLS para security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can view all logs" ON public.security_logs FOR
SELECT
    USING (auth.role () = 'service_role');

-- Habilitar RLS en tablas base
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.real_estates ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.review_rooms ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Políticas para REVIEW_ROOMS
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can view review rooms" ON public.review_rooms;

CREATE POLICY "Anyone can view review rooms" ON public.review_rooms FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage rooms of their reviews" ON public.review_rooms;

CREATE POLICY "Users can manage rooms of their reviews" ON public.review_rooms FOR ALL USING (
    EXISTS (
        SELECT
            1
        FROM
            public.reviews
        WHERE
            reviews.id = review_rooms.review_id
            AND reviews.user_id = auth.uid ()
    )
);

-- ---------------------------------------------------------------------------
-- review_votes
-- ---------------------------------------------------------------------------
-- Lectura pública de votos
CREATE POLICY "review_votes_select_all" ON public.review_votes FOR
SELECT
    USING (true);

-- Insertar solo tu propio voto
CREATE POLICY "review_votes_insert_own" ON public.review_votes FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

-- Actualizar solo tu propio voto
CREATE POLICY "review_votes_update_own" ON public.review_votes FOR
UPDATE USING (auth.uid () = user_id)
WITH
    CHECK (auth.uid () = user_id);

-- Borrar solo tu propio voto
CREATE POLICY "review_votes_delete_own" ON public.review_votes FOR DELETE USING (auth.uid () = user_id);

-- =============================================================================
-- Políticas para REVIEWS
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;

CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Users can update own reviews" ON public.reviews FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND user_id = auth.uid ()
)
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;

CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND user_id = auth.uid ()
);

-- ---------------------------------------------------------------------------
-- Habilitar RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.review_deletions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.review_audit ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- review_reports
-- ---------------------------------------------------------------------------
-- Crear reportes (solo usuarios autenticados)
CREATE POLICY "review_reports_insert_own" ON public.review_reports FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND reported_by_user_id = auth.uid ()
    );

-- =============================================================================
-- RLS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- Habilitar RLS en nuevas tablas
ALTER TABLE public.real_estate_reviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.real_estate_review_votes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.real_estate_review_reports ENABLE ROW LEVEL SECURITY;

-- Políticas para real_estate_reviews
DROP POLICY IF EXISTS "Anyone can view real estate reviews" ON public.real_estate_reviews;

CREATE POLICY "Anyone can view real estate reviews" ON public.real_estate_reviews FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create real estate reviews" ON public.real_estate_reviews;

CREATE POLICY "Authenticated users can create real estate reviews" ON public.real_estate_reviews FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

DROP POLICY IF EXISTS "Users can update own real estate reviews" ON public.real_estate_reviews;

CREATE POLICY "Users can update own real estate reviews" ON public.real_estate_reviews FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND user_id = auth.uid ()
)
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

DROP POLICY IF EXISTS "Users can delete own real estate reviews" ON public.real_estate_reviews;

CREATE POLICY "Users can delete own real estate reviews" ON public.real_estate_reviews FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND user_id = auth.uid ()
);

-- Políticas para real_estate_review_votes
DROP POLICY IF EXISTS "Anyone can view real estate review votes" ON public.real_estate_review_votes;

CREATE POLICY "Anyone can view real estate review votes" ON public.real_estate_review_votes FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can manage own real estate review votes" ON public.real_estate_review_votes;

CREATE POLICY "Users can manage own real estate review votes" ON public.real_estate_review_votes FOR ALL USING (
    auth.uid () IS NOT NULL
    AND user_id = auth.uid ()
);

-- Políticas para real_estate_review_reports
DROP POLICY IF EXISTS "Users can create real estate review reports" ON public.real_estate_review_reports;

CREATE POLICY "Users can create real estate review reports" ON public.real_estate_review_reports FOR INSERT
WITH
    CHECK (reported_by_user_id = auth.uid ());

DROP POLICY IF EXISTS "Users can view own real estate review reports" ON public.real_estate_review_reports;

CREATE POLICY "Users can view own real estate review reports" ON public.real_estate_review_reports FOR
SELECT
    USING (reported_by_user_id = auth.uid ());

-- =============================================================================
-- Habilitar RLS en las nuevas tablas
-- =============================================================================
ALTER TABLE public.real_estate_votes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.real_estate_reports ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Políticas para real_estate_votes
-- =============================================================================
DROP POLICY IF EXISTS "Anyone can view real estate votes" ON public.real_estate_votes;

CREATE POLICY "Anyone can view real estate votes" ON public.real_estate_votes FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own real estate votes" ON public.real_estate_votes;

CREATE POLICY "Users can insert their own real estate votes" ON public.real_estate_votes FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

DROP POLICY IF EXISTS "Users can update their own real estate votes" ON public.real_estate_votes;

CREATE POLICY "Users can update their own real estate votes" ON public.real_estate_votes FOR
UPDATE USING (auth.uid () = user_id);

DROP POLICY IF EXISTS "Users can delete their own real estate votes" ON public.real_estate_votes;

CREATE POLICY "Users can delete their own real estate votes" ON public.real_estate_votes FOR DELETE USING (auth.uid () = user_id);

-- =============================================================================
-- Políticas para real_estate_reports 
-- =============================================================================
DROP POLICY IF EXISTS "Users can create real estate reports" ON public.real_estate_reports;

CREATE POLICY "Users can create real estate reports" ON public.real_estate_reports FOR INSERT
WITH
    CHECK (reported_by_user_id = auth.uid ());

DROP POLICY IF EXISTS "Users can view their own real estate reports" ON public.real_estate_reports;

CREATE POLICY "Users can view their own real estate reports" ON public.real_estate_reports FOR
SELECT
    USING (reported_by_user_id = auth.uid ());

-- Habilitar RLS
ALTER TABLE public.real_estate_favorites ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS
ALTER TABLE public.review_favorites ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 014_review_system_rls.sql
-- Sistema de reviews - Row Level Security (RLS)
-- =============================================================================
--
-- Este es el ÚNICO archivo que define políticas RLS para:
-- - review_votes
-- - review_reports
-- - review_deletions
-- - review_audit
--
-- NOTA: Si necesitas modificar políticas RLS de estas tablas, edita SOLO este archivo.
--
-- Responsabilidad:
--   - Definir quién puede leer / insertar / actualizar / borrar filas
--   - NO contiene lógica de negocio
--   - NO contiene funciones ni triggers
-- =============================================================================
-- ---------------------------------------------------------------------------
-- review_deletions
-- ---------------------------------------------------------------------------
-- Inserción desde sistema / triggers
CREATE POLICY "review_deletions_system_insert" ON public.review_deletions FOR INSERT
WITH
    CHECK (auth.role () = 'service_role');

-- El usuario puede ver las eliminaciones que realizó
CREATE POLICY "review_deletions_select_own" ON public.review_deletions FOR
SELECT
    USING (deleted_by = auth.uid ());

-- ---------------------------------------------------------------------------
-- review_audit
-- ---------------------------------------------------------------------------
-- Inserción desde sistema / triggers
CREATE POLICY "review_audit_system_insert" ON public.review_audit FOR INSERT
WITH
    CHECK (true);

-- El usuario puede ver auditoría de sus propias reviews
CREATE POLICY "review_audit_select_own_reviews" ON public.review_audit FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.reviews r
            WHERE
                r.id = review_audit.review_id
                AND r.user_id = auth.uid ()
        )
    );

-- ---------------------------------------------------------------------------
-- Políticas adicionales para service_role (administración)
-- ---------------------------------------------------------------------------
-- Service role puede gestionar todos los reportes (moderación)
CREATE POLICY "review_reports_service_role_all" ON public.review_reports FOR ALL USING (auth.role () = 'service_role');

-- Políticas de seguridad
DROP POLICY IF EXISTS "Anyone can view real estate favorites" ON public.real_estate_favorites;

CREATE POLICY "Anyone can view real estate favorites" ON public.real_estate_favorites FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.real_estate_favorites;

CREATE POLICY "Users can insert their own favorites" ON public.real_estate_favorites FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.real_estate_favorites;

CREATE POLICY "Users can delete their own favorites" ON public.real_estate_favorites FOR DELETE USING (auth.uid () = user_id);

-- =============================================================================
-- POLÍTICAS RLS PARA FAVORITOS DE RESEÑAS
-- =============================================================================
-- Políticas de seguridad
DROP POLICY IF EXISTS "Anyone can view review favorites" ON public.review_favorites;

CREATE POLICY "Anyone can view review favorites" ON public.review_favorites FOR
SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own review favorites" ON public.review_favorites;

CREATE POLICY "Users can insert their own review favorites" ON public.review_favorites FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

DROP POLICY IF EXISTS "Users can delete their own review favorites" ON public.review_favorites;

CREATE POLICY "Users can delete their own review favorites" ON public.review_favorites FOR DELETE USING (auth.uid () = user_id);

-- Política para service role (adicional a las de 014)
-- NOTA: Esta política es complementaria, no duplica las de 014
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_reports' AND policyname = 'Service role can manage reports') THEN
        CREATE POLICY "Service role can manage reports" ON review_reports 
        FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- =============================================================================
-- MIGRACIÓN 061: CONSOLIDACIÓN DE POLÍTICAS RLS
-- =============================================================================
-- Fecha: 17 de enero de 2026
-- Descripción: Elimina políticas duplicadas y consolida RLS en un solo lugar
-- =============================================================================
-- =============================================================================
-- LIMPIEZA: ELIMINAR POLÍTICAS DUPLICADAS
-- =============================================================================
-- Para reviews: Mantener solo las políticas de 006_policies_reviews.sql
-- Eliminar duplicados de 055_security_rules.sql y 014_review_system_rls.sql
DROP POLICY IF EXISTS "Public can read all reviews" ON public.reviews;

DROP POLICY IF EXISTS "Public can read reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

-- Para review_votes: Mantener solo las políticas de 014_review_system_rls.sql
-- Eliminar duplicados de 013_review_system_rpc.sql y 055_security_rules.sql
DROP POLICY IF EXISTS "Anyone can view review_votes" ON public.review_votes;

DROP POLICY IF EXISTS "Users can manage own review_votes" ON public.review_votes;

DROP POLICY IF EXISTS "Public can read votes" ON public.review_votes;

DROP POLICY IF EXISTS "Users can manage their own votes" ON public.review_votes;

-- =============================================================================
-- POLÍTICAS CONSOLIDADAS Y DOCUMENTADAS
-- =============================================================================
-- ---------------------------------------------------------------------------
-- REVIEWS: Políticas de acceso a reseñas
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden leer todas las reseñas (incluyendo anónimos)
-- Reviews are intentionally public by business requirement.
-- Any user (authenticated or anonymous) can read non-deleted reviews.
DROP POLICY IF EXISTS "reviews_select_public" ON public.reviews;

CREATE POLICY "reviews_select_public" ON public.reviews FOR
SELECT
   USING (deleted_at IS NULL);

-- INSERT: Solo usuarios autenticados pueden crear, y solo con su propio user_id
DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;

CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

-- UPDATE: Los usuarios solo pueden actualizar sus propias reseñas
DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;

CREATE POLICY "reviews_update_own" ON public.reviews FOR
UPDATE USING (user_id = auth.uid ())
WITH
    CHECK (user_id = auth.uid ());

-- DELETE: Los usuarios solo pueden eliminar sus propias reseñas
DROP POLICY IF EXISTS "reviews_delete_own" ON public.reviews;

CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (user_id = auth.uid ());

-- ---------------------------------------------------------------------------
-- REVIEW_ROOMS: Políticas para habitaciones de reseñas
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden leer (público)
DROP POLICY IF EXISTS "review_rooms_select_public" ON public.review_rooms;

CREATE POLICY "review_rooms_select_public" ON public.review_rooms FOR
SELECT
    USING (true);

-- ALL: Los usuarios pueden gestionar habitaciones de sus propias reseñas
DROP POLICY IF EXISTS "review_rooms_manage_own" ON public.review_rooms;

CREATE POLICY "review_rooms_manage_own" ON public.review_rooms FOR ALL USING (
    EXISTS (
        SELECT
            1
        FROM
            public.reviews
        WHERE
            reviews.id = review_rooms.review_id
            AND reviews.user_id = auth.uid ()
    )
)
WITH
    CHECK (
        EXISTS (
            SELECT
                1
            FROM
                public.reviews
            WHERE
                reviews.id = review_rooms.review_id
                AND reviews.user_id = auth.uid ()
        )
    );

-- ---------------------------------------------------------------------------
-- REVIEW_VOTES: Políticas de votación
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden ver los votos (para mostrar contadores)
DROP POLICY IF EXISTS "review_votes_select_public" ON public.review_votes;

CREATE POLICY "review_votes_select_public" ON public.review_votes FOR
SELECT
    USING (true);

-- INSERT: Los usuarios solo pueden crear votos con su propio user_id
DROP POLICY IF EXISTS "review_votes_insert_own" ON public.review_votes;

CREATE POLICY "review_votes_insert_own" ON public.review_votes FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

-- UPDATE: Los usuarios solo pueden cambiar sus propios votos
DROP POLICY IF EXISTS "review_votes_update_own" ON public.review_votes;

CREATE POLICY "review_votes_update_own" ON public.review_votes FOR
UPDATE USING (user_id = auth.uid ())
WITH
    CHECK (user_id = auth.uid ());

-- DELETE: Los usuarios solo pueden eliminar sus propios votos
DROP POLICY IF EXISTS "review_votes_delete_own" ON public.review_votes;

CREATE POLICY "review_votes_delete_own" ON public.review_votes FOR DELETE USING (user_id = auth.uid ());

-- ---------------------------------------------------------------------------
-- REVIEW_REPORTS: Políticas de reportes
-- ---------------------------------------------------------------------------
-- SELECT: Los usuarios solo ven sus propios reportes
DROP POLICY IF EXISTS "review_reports_select_own" ON public.review_reports;

CREATE POLICY "review_reports_select_own" ON public.review_reports FOR
SELECT
    USING (reported_by_user_id = auth.uid ());

-- INSERT: Los usuarios pueden crear reportes (solo uno por reseña)
DROP POLICY IF EXISTS "review_reports_insert_own" ON public.review_reports;

CREATE POLICY "review_reports_insert_own" ON public.review_reports FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND reported_by_user_id = auth.uid ()
    );

-- ALL (service_role): Moderadores pueden gestionar todos los reportes
DROP POLICY IF EXISTS "review_reports_service_role_all" ON public.review_reports;

CREATE POLICY "review_reports_service_role_all" ON public.review_reports FOR ALL USING (auth.role () = 'service_role');

-- ---------------------------------------------------------------------------
-- REVIEW_DELETIONS: Políticas de auditoría de eliminaciones
-- ---------------------------------------------------------------------------
-- SELECT: Los usuarios pueden ver las eliminaciones que realizaron
DROP POLICY IF EXISTS "review_deletions_select_own" ON public.review_deletions;

CREATE POLICY "review_deletions_select_own" ON public.review_deletions FOR
SELECT
    USING (deleted_by = auth.uid ());

-- INSERT: Solo triggers del sistema pueden insertar (SECURITY DEFINER)
DROP POLICY IF EXISTS "review_deletions_system_insert" ON public.review_deletions;

CREATE POLICY "review_deletions_system_insert" ON public.review_deletions FOR INSERT
WITH
    CHECK (auth.role () = 'service_role');

-- ---------------------------------------------------------------------------
-- REVIEW_AUDIT: Políticas de auditoría de cambios
-- ---------------------------------------------------------------------------
-- SELECT: Los usuarios pueden ver auditoría de sus propias reseñas
DROP POLICY IF EXISTS "review_audit_select_own_reviews" ON public.review_audit;

CREATE POLICY "review_audit_select_own_reviews" ON public.review_audit FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.reviews
            WHERE
                reviews.id = review_audit.review_id
                AND reviews.user_id = auth.uid ()
        )
    );

-- INSERT: Solo triggers del sistema pueden insertar (SECURITY DEFINER)
DROP POLICY IF EXISTS "review_audit_system_insert" ON public.review_audit;

CREATE POLICY "review_audit_system_insert" ON public.review_audit FOR INSERT
WITH
    CHECK (auth.role () = 'service_role');

-- ---------------------------------------------------------------------------
-- REAL_ESTATES: Políticas para inmobiliarias
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden ver inmobiliarias
DROP POLICY IF EXISTS "real_estates_select_public" ON public.real_estates;

CREATE POLICY "real_estates_select_public" ON public.real_estates FOR
SELECT
    USING (true);

-- INSERT: Usuarios autenticados pueden crear inmobiliarias
DROP POLICY IF EXISTS "real_estates_insert_authenticated" ON public.real_estates;

CREATE POLICY "real_estates_insert_authenticated" ON public.real_estates FOR INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND (
            created_by = auth.uid ()
            OR created_by IS NULL
        )
    );

-- UPDATE: Solo el creador puede actualizar
DROP POLICY IF EXISTS "real_estates_update_creator" ON public.real_estates;

CREATE POLICY "real_estates_update_creator" ON public.real_estates FOR
UPDATE USING (
    auth.uid () IS NOT NULL
    AND (
        created_by = auth.uid ()
        OR created_by IS NULL
    )
);

-- DELETE: Solo el creador puede eliminar
DROP POLICY IF EXISTS "real_estates_delete_creator" ON public.real_estates;

CREATE POLICY "real_estates_delete_creator" ON public.real_estates FOR DELETE USING (
    auth.uid () IS NOT NULL
    AND (
        created_by = auth.uid ()
        OR created_by IS NULL
    )
);

-- =============================================================================
-- VERIFICACIÓN: Listar todas las políticas activas
-- =============================================================================
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE '=== POLÍTICAS RLS CONSOLIDADAS ===';
    
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname, cmd, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public'
        ORDER BY tablename, cmd, policyname
    LOOP
        RAISE NOTICE 'Tabla: %, Política: %, Comando: %', 
            policy_record.tablename, 
            policy_record.policyname, 
            policy_record.cmd;
    END LOOP;
END $$;

-- =============================================================================
-- DOCUMENTACIÓN: Resumen de cambios
-- =============================================================================
COMMENT ON POLICY "reviews_select_public" ON public.reviews IS 'Permite a todos (incluyendo anónimos) leer reseñas. Reemplaza: Anyone can view reviews, Public can read all reviews, Public can read reviews';

COMMENT ON POLICY "review_votes_select_public" ON public.review_votes IS 'Permite a todos ver votos. Reemplaza: Anyone can view review_votes, Public can read votes, review_votes_select_all';

COMMENT ON POLICY "review_votes_insert_own" ON public.review_votes IS 'Usuarios solo pueden votar con su propio user_id. Reemplaza: enable_insert_review_votes, Users can manage their own votes (INSERT)';