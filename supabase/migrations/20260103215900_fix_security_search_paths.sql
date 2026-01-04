-- Security fix: Set search_path to public for all functions to prevent search_path hijacking
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_real_estate_counters() SET search_path = public;
ALTER FUNCTION public.vote_review(UUID, TEXT) SET search_path = public;
ALTER FUNCTION public.update_review(UUID, TEXT, TEXT, INTEGER, TEXT, INTEGER, INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.has_user_reported_real_estate_review(UUID) SET search_path = public;
ALTER FUNCTION public.log_review_changes() SET search_path = public;
ALTER FUNCTION public.log_review_deletion() SET search_path = public;
ALTER FUNCTION public.create_review(TEXT, TEXT, INTEGER, UUID, TEXT, TEXT, TEXT, DECIMAL, DECIMAL, INTEGER, INTEGER, INTEGER, TEXT, TEXT, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.report_review(UUID, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.update_review_votes() SET search_path = public;

-- Note: refresh_supabase_schema was listed in warnings but seems to be a system function or not defined in local migrations. 
-- If it exists in public schema, uncomment the line below:
-- ALTER FUNCTION public.refresh_supabase_schema() SET search_path = public;

ALTER FUNCTION public.vote_real_estate(UUID, TEXT) SET search_path = public;
ALTER FUNCTION public.create_real_estate_review(UUID, TEXT, TEXT, INTEGER) SET search_path = public;
ALTER FUNCTION public.has_user_reported_review(UUID) SET search_path = public;
ALTER FUNCTION public.update_real_estate_review_votes() SET search_path = public;
ALTER FUNCTION public.vote_real_estate_review(UUID, TEXT) SET search_path = public;
ALTER FUNCTION public.has_user_reported_real_estate(UUID) SET search_path = public;
ALTER FUNCTION public.toggle_favorite_review(UUID) SET search_path = public;
ALTER FUNCTION public.create_real_estate(TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.report_real_estate(UUID, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.is_review_favorite(UUID) SET search_path = public;
ALTER FUNCTION public.update_real_estate_rating_from_reviews() SET search_path = public;
ALTER FUNCTION public.get_review_delete_info(UUID) SET search_path = public;
ALTER FUNCTION public.delete_review_safe(UUID) SET search_path = public;
ALTER FUNCTION public.report_real_estate_review(UUID, TEXT, TEXT) SET search_path = public;
ALTER FUNCTION public.toggle_favorite_real_estate(UUID) SET search_path = public;
ALTER FUNCTION public.is_real_estate_favorite(UUID) SET search_path = public;
