
-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_real_estate_id 
ON public.real_estate_favorites(real_estate_id);

CREATE INDEX IF NOT EXISTS idx_real_estate_favorites_user_id 
ON public.real_estate_favorites(user_id);