-- =============================================================================
-- RLS PARA SISTEMA DE REVIEWS
-- =============================================================================

-- Políticas para REVIEW_VOTES
-- Política para SELECT (todos pueden ver)
DROP POLICY IF EXISTS "Anyone can view review_votes" ON public.review_votes;
CREATE POLICY "Anyone can view review_votes" ON public.review_votes 
FOR SELECT USING (true);

-- Política unificada para INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Users can manage own review_votes" ON public.review_votes;
CREATE POLICY "Users can manage own review_votes" ON public.review_votes 
FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "enable_insert_review_votes" ON public.review_votes;
-- CREAR política de INSERT CORRECTA
CREATE POLICY "enable_insert_review_votes" ON public.review_votes
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

DROP POLICY IF EXISTS "enable_delete_review_votes" ON public.review_votes;
CREATE POLICY "enable_delete_review_votes" ON public.review_votes
FOR DELETE USING (auth.uid() = user_id);

-- Políticas para REVIEW_REPORTS
DROP POLICY IF EXISTS "Users can view their own reports" ON public.review_reports;
CREATE POLICY "Users can view their own reports" ON public.review_reports FOR SELECT USING (reported_by_user_id = auth.uid());

-- Políticas para REVIEW_DELETIONS
DROP POLICY IF EXISTS "Users can view their own deletions" ON public.review_deletions;
CREATE POLICY "Users can view their own deletions" ON public.review_deletions 
FOR SELECT USING (auth.uid() = deleted_by);

-- Política para INSERT: permitir que el sistema registre eliminaciones
-- (el trigger se ejecuta cuando el usuario tiene permisos para eliminar la review)
DROP POLICY IF EXISTS "System can log review deletions" ON public.review_deletions;
CREATE POLICY "System can log review deletions" ON public.review_deletions 
FOR INSERT WITH CHECK (true);

-- Políticas para REVIEW_AUDIT
DROP POLICY IF EXISTS "System can insert audit records" ON public.review_audit;
CREATE POLICY "System can insert audit records" ON public.review_audit FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view audit of their reviews" ON public.review_audit;
CREATE POLICY "Users can view audit of their reviews" ON public.review_audit FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.reviews WHERE reviews.id = review_audit.review_id AND reviews.user_id = auth.uid())
);
