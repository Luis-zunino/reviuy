ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS apartment_number text;
