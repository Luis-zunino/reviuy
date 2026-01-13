-- Optimization: Wrap auth calls in SELECT to prevent re-evaluation for every row
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan

-- 1. Real Estate Reviews
DROP POLICY IF EXISTS "Authenticated users can create real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Authenticated users can create real estate reviews"
ON public.real_estate_reviews
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Users can delete own real estate reviews"
ON public.real_estate_reviews
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own real estate reviews" ON public.real_estate_reviews;
CREATE POLICY "Users can update own real estate reviews"
ON public.real_estate_reviews
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- 2. Real Estates
DROP POLICY IF EXISTS "Authenticated users can create real estates" ON public.real_estates;
CREATE POLICY "Authenticated users can create real estates"
ON public.real_estates
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) IS NOT NULL); -- Simplified check if user is just authenticated

DROP POLICY IF EXISTS "Creators can delete their real estates" ON public.real_estates;
CREATE POLICY "Creators can delete their real estates"
ON public.real_estates
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = created_by);

DROP POLICY IF EXISTS "Creators can update their real estates" ON public.real_estates;
CREATE POLICY "Creators can update their real estates"
ON public.real_estates
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = created_by)
WITH CHECK ((SELECT auth.uid()) = created_by);


-- 3. Reviews (General)
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id) 
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews; -- Seems duplicate based on warnings, ensuring clean slate
CREATE POLICY "Users can insert their own reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);


-- 4. Real Estate Reports
DROP POLICY IF EXISTS "Users can create real estate reports" ON public.real_estate_reports;
CREATE POLICY "Users can create real estate reports"
ON public.real_estate_reports
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = reported_by_user_id);

DROP POLICY IF EXISTS "Users can view their own real estate reports" ON public.real_estate_reports;
CREATE POLICY "Users can view their own real estate reports"
ON public.real_estate_reports
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = reported_by_user_id);


-- 5. Real Estate Review Reports
DROP POLICY IF EXISTS "Users can create real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can create real estate review reports"
ON public.real_estate_review_reports
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = reported_by_user_id);

DROP POLICY IF EXISTS "Users can view their own real estate review reports" ON public.real_estate_review_reports;
CREATE POLICY "Users can view their own real estate review reports"
ON public.real_estate_review_reports
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = reported_by_user_id);


-- 6. Review Reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.review_reports;
CREATE POLICY "Users can view their own reports"
ON public.review_reports
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = reported_by_user_id);


-- 7. Real Estate Favorites
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.real_estate_favorites;
CREATE POLICY "Users can delete their own favorites"
ON public.real_estate_favorites
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.real_estate_favorites;
CREATE POLICY "Users can insert their own favorites"
ON public.real_estate_favorites
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);


-- 8. Real Estate Review Votes
DROP POLICY IF EXISTS "Users can delete their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can delete their own real estate review votes"
ON public.real_estate_review_votes
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can insert their own real estate review votes"
ON public.real_estate_review_votes
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own real estate review votes" ON public.real_estate_review_votes;
CREATE POLICY "Users can update their own real estate review votes"
ON public.real_estate_review_votes
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);


-- 9. Real Estate Votes
DROP POLICY IF EXISTS "Users can delete their own real estate votes" ON public.real_estate_votes;
CREATE POLICY "Users can delete their own real estate votes"
ON public.real_estate_votes
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own real estate votes" ON public.real_estate_votes;
CREATE POLICY "Users can insert their own real estate votes"
ON public.real_estate_votes
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own real estate votes" ON public.real_estate_votes;
CREATE POLICY "Users can update their own real estate votes"
ON public.real_estate_votes
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);


-- 10. Review Favorites
DROP POLICY IF EXISTS "Users can delete their own review favorites" ON public.review_favorites;
CREATE POLICY "Users can delete their own review favorites"
ON public.review_favorites
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own review favorites" ON public.review_favorites;
CREATE POLICY "Users can insert their own review favorites"
ON public.review_favorites
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);


-- 11. Review Audit & Deletions
DROP POLICY IF EXISTS "Users can view audit of their reviews" ON public.review_audit;
CREATE POLICY "Users can view audit of their reviews"
ON public.review_audit
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = changed_by::uuid); -- Cast might be needed if changed_by is text

DROP POLICY IF EXISTS "Users can view their own deletions" ON public.review_deletions;
CREATE POLICY "Users can view their own deletions"
ON public.review_deletions
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = deleted_by::uuid);


-- 12. Review Votes (Fixing legacy policy names like 'enable_...')
DROP POLICY IF EXISTS "enable_delete_review_votes" ON public.review_votes;
CREATE POLICY "Users can delete their own review votes"
ON public.review_votes
FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "enable_insert_review_votes" ON public.review_votes;
CREATE POLICY "Users can insert their own review votes"
ON public.review_votes
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "enable_update_review_votes" ON public.review_votes;
CREATE POLICY "Users can update their own review votes"
ON public.review_votes
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);


-- 13. Review Rooms
DROP POLICY IF EXISTS "Users can manage rooms of their reviews" ON public.review_rooms;
-- Split into granular policies for better control and performance
CREATE POLICY "Users can insert rooms for their reviews"
ON public.review_rooms
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.reviews
        WHERE id = review_rooms.review_id
        AND user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can update rooms for their reviews"
ON public.review_rooms
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.reviews
        WHERE id = review_rooms.review_id
        AND user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "Users can delete rooms for their reviews"
ON public.review_rooms
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.reviews
        WHERE id = review_rooms.review_id
        AND user_id = (SELECT auth.uid())
    )
);


-- Cleanup duplicate indexes
DROP INDEX IF EXISTS public.idx_real_estate_reports_reported_by_user_id;
-- idx_real_estate_reports_reported_by is kept as the primary index for this column

