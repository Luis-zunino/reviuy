-- Add missing indexes for foreign keys to improve join performance and avoid linter warnings.

-- 1. review_audit.changed_by
CREATE INDEX IF NOT EXISTS idx_review_audit_changed_by ON public.review_audit(changed_by);

-- 2. review_reports.reported_by_user_id
CREATE INDEX IF NOT EXISTS idx_review_reports_reported_by_user_id ON public.review_reports(reported_by_user_id);

-- 3. review_rooms.review_id
CREATE INDEX IF NOT EXISTS idx_review_rooms_review_id ON public.review_rooms(review_id);
