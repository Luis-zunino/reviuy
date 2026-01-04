-- Final cleanup for persistent duplicate policies and RLS optimizations
-- Targeting specifically the 'reviews' and 'real_estate_reviews' tables where duplicates remain.

-- -----------------------------------------------------------------------------
-- 1. Table: public.reviews
-- -----------------------------------------------------------------------------

-- DROP potentially conflicting policies (both "own" and "their own" variants)
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- RE-CREATE optimized single policies
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);


-- -----------------------------------------------------------------------------
-- 2. Table: public.real_estate_reviews
-- -----------------------------------------------------------------------------

-- Fix auth_rls_initplan for INSERT
DROP POLICY IF EXISTS "Authenticated users can create real estate reviews" ON public.real_estate_reviews;

CREATE POLICY "Authenticated users can create real estate reviews"
ON public.real_estate_reviews
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);
