-- Supabase Migration: Add RLS Policies for Authenticated Users
-- This migration addresses critical gaps in user permissions, allowing them
-- to interact with the application's core features.

-- ========== Policies for 'reviews' table ==========

-- Enable RLS if not already enabled. It's safe to run this even if it's already on.
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read access to all reviews.
-- This is a common requirement for a review platform. Adjust if reviews should be private.
DROP POLICY IF EXISTS "Public can read reviews" ON public.reviews;
CREATE POLICY "Public can read reviews" ON public.reviews
FOR SELECT USING (true);

-- 2. Allow authenticated users to insert their own reviews.
-- The user_id of the new row must match the currently authenticated user.
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.reviews;
CREATE POLICY "Users can create their own reviews" ON public.reviews
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Allow users to update their own reviews.
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews" ON public.reviews
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Allow users to delete their own reviews.
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
CREATE POLICY "Users can delete their own reviews" ON public.reviews
FOR DELETE TO authenticated USING (auth.uid() = user_id);


-- ========== Policies for 'review_votes' table ==========


-- 1. Allow public read access to all votes.
DROP POLICY IF EXISTS "Public can read votes" ON public.review_votes;
CREATE POLICY "Public can read votes" ON public.review_votes
FOR SELECT USING (true);

-- 2. Allow authenticated users to insert, update, and delete their own votes.
-- This single policy handles all operations for a user's own votes.
DROP POLICY IF EXISTS "Users can manage their own votes" ON public.review_votes;
CREATE POLICY "Users can manage their own votes" ON public.review_votes
FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);


-- ========== Policies for 'review_reports' table ==========

-- 1. Allow authenticated users to create (insert) reports.
-- The user_id of the report must match the currently authenticated user.
DROP POLICY IF EXISTS "Users can create reports" ON public.review_reports;
CREATE POLICY "Users can create reports" ON public.review_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reported_by_user_id);

-- Note: The policy for 'service_role' to manage all reports from 20260108000002_security_rules.sql
-- remains in effect and does not need to be redefined.
