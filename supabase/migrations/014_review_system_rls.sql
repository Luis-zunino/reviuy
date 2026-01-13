-- =============================================================================
-- 014_review_system_rls.sql
-- Sistema de reviews - Row Level Security (RLS)
-- =============================================================================
-- Responsabilidad:
--   - Definir quién puede leer / insertar / actualizar / borrar filas
--   - NO contiene lógica de negocio
--   - NO contiene funciones ni triggers
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Habilitar RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.review_votes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_deletions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_audit     ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- review_votes
-- ---------------------------------------------------------------------------

-- Lectura pública de votos
CREATE POLICY "review_votes_select_all"
ON public.review_votes
FOR SELECT
USING (true);

-- Insertar solo tu propio voto
CREATE POLICY "review_votes_insert_own"
ON public.review_votes
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
);

-- Actualizar solo tu propio voto
CREATE POLICY "review_votes_update_own"
ON public.review_votes
FOR UPDATE
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- Borrar solo tu propio voto
CREATE POLICY "review_votes_delete_own"
ON public.review_votes
FOR DELETE
USING (
  auth.uid() = user_id
);

-- ---------------------------------------------------------------------------
-- review_reports
-- ---------------------------------------------------------------------------

-- Crear reportes (solo usuarios autenticados)
CREATE POLICY "review_reports_insert_own"
ON public.review_reports
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND reported_by_user_id = auth.uid()
);

-- Ver solo los reportes creados por el usuario
CREATE POLICY "review_reports_select_own"
ON public.review_reports
FOR SELECT
USING (
  reported_by_user_id = auth.uid()
);

-- ---------------------------------------------------------------------------
-- review_deletions
-- ---------------------------------------------------------------------------

-- Inserción desde sistema / triggers
CREATE POLICY "review_deletions_system_insert"
ON public.review_deletions
FOR INSERT
WITH CHECK (true);

-- El usuario puede ver las eliminaciones que realizó
CREATE POLICY "review_deletions_select_own"
ON public.review_deletions
FOR SELECT
USING (
  deleted_by = auth.uid()
);

-- ---------------------------------------------------------------------------
-- review_audit
-- ---------------------------------------------------------------------------

-- Inserción desde sistema / triggers
CREATE POLICY "review_audit_system_insert"
ON public.review_audit
FOR INSERT
WITH CHECK (true);

-- El usuario puede ver auditoría de sus propias reviews
CREATE POLICY "review_audit_select_own_reviews"
ON public.review_audit
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.reviews r
    WHERE r.id = review_audit.review_id
      AND r.user_id = auth.uid()
  )
);

-- =============================================================================
-- Fin de 014_review_system_rls.sql
-- =============================================================================
