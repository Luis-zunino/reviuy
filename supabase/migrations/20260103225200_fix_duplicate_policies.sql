-- Migration to fix remaining RLS issues: multiple permissive policies and auth performance
-- This migration removes duplicate/conflicting policies identified by the linter.

-- 1. Table: public.real_estate_review_votes
-- Problem: Multiple permissive policies for SELECT, DELETE, INSERT, UPDATE.
-- (e.g. "Anyone can view real estate review votes" vs "Users can manage own real estate review votes")

-- Drop OLD policies that are redundant or too broad if managed by the new granular ones
DROP POLICY IF EXISTS "Anyone can view real estate review votes" ON public.real_estate_review_votes;
DROP POLICY IF EXISTS "Users can manage own real estate review votes" ON public.real_estate_review_votes;

-- Re-assert the single source of truth for SELECT (Public read access is usually desired for votes)
CREATE POLICY "Anyone can view real estate review votes"
ON public.real_estate_review_votes
FOR SELECT
TO public
USING (true);

-- Ensure user-specific management policies exist (created in previous migration, but ensuring no conflict)
-- Note: "Users can {delete,insert,update} their own real estate review votes" are the correct granular ones.
-- The "Users can manage own real estate review votes" (likely an ALL policy) was causing the "multiple permissive" warning.


-- 2. Table: public.reviews
 
-- Drop duplicate read policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

-- 3. Table: public.real_estate_review_reports
-- Problem: Multiple permissive policies for SELECT (e.g. "Users can view own..." vs "Users can view their own...")

DROP POLICY IF EXISTS "Users can view own real estate review reports" ON public.real_estate_review_reports;
-- "Users can view their own real estate review reports" (with 'their') was created in the previous step and is the one we keep.


-- 4. Table: public.review_rooms
-- Problem: Multiple permissions for SELECT (e.g. "Anyone can view review rooms" vs "Users can manage rooms of their reviews")

DROP POLICY IF EXISTS "Anyone can view review rooms" ON public.review_rooms;
DROP POLICY IF EXISTS "Users can manage rooms of their reviews" ON public.review_rooms;

-- Re-create single public read policy
CREATE POLICY "Anyone can view review rooms"
ON public.review_rooms
FOR SELECT
TO public
USING (true);

-- Ensure the 'manage' policy is gone (it was an ALL policy likely), and rely on the granular INSERT/UPDATE/DELETE policies created previously.


-- 5. Fix remaining 'auth_rls_initplan' warnings for policies not caught in previous step
-- If any "Users can manage..." policies for other tables still exist and use auth.uid() directly without SELECT, drop them.

DROP POLICY IF EXISTS "Users can manage own real estate review votes" ON public.real_estate_review_votes; -- Already handled above but double checking
DROP POLICY IF EXISTS "Users can manage rooms of their reviews" ON public.review_rooms; -- Already handled above

