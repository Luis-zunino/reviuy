-- Enforce 1 review per user per property at the Database level (Review uniqueness constraints)

-- 1. Uniqueness for Reviews based on OSM ID
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_address_osm_unique
ON public.reviews(user_id, address_osm_id)
WHERE address_osm_id IS NOT NULL;

-- 2. Uniqueness for Reviews based on Real Estate ID
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_real_estate_unique
ON public.reviews(user_id, real_estate_id)
WHERE real_estate_id IS NOT NULL;

-- 3. Uniqueness for Real Estate Reviews table
CREATE UNIQUE INDEX IF NOT EXISTS idx_real_estate_reviews_user_re_unique
ON public.real_estate_reviews(user_id, real_estate_id);
