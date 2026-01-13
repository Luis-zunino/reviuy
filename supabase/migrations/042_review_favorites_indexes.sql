-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_review_favorites_review_id 
ON public.review_favorites(review_id);

CREATE INDEX IF NOT EXISTS idx_review_favorites_user_id 
ON public.review_favorites(user_id);
