-- =============================================================================
-- AGREGAR CONTADORES DE LIKES/DISLIKES A REAL_ESTATES
-- =============================================================================

-- Agregar columnas de likes y dislikes a real_estates si no existen
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'real_estates' 
        AND column_name = 'likes'
    ) THEN
        ALTER TABLE public.real_estates ADD COLUMN likes INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'real_estates' 
        AND column_name = 'dislikes'
    ) THEN
        ALTER TABLE public.real_estates ADD COLUMN dislikes INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;