-- Add new columns to the reviews table
ALTER TABLE public.reviews
ADD COLUMN zone_rating REAL NOT NULL DEFAULT 0,
ADD COLUMN image_url TEXT,
ADD COLUMN likes INTEGER NOT NULL DEFAULT 0,
ADD COLUMN dislikes INTEGER NOT NULL DEFAULT 0,
ADD COLUMN property_type TEXT,
-- Create the review_votes table
CREATE TABLE
    public.review_votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        review_id UUID NOT NULL REFERENCES public.reviews (id) ON DELETE CASCADE,
        user_id UUID, -- Can be NULL for anonymous votes
        vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (review_id, user_id) -- A user can only vote once per review
    );

-- Create a function to update vote counts
CREATE
OR REPLACE FUNCTION update_review_votes () RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF NEW.vote_type = 'like' THEN
            UPDATE public.reviews SET likes = likes + 1 WHERE id = NEW.review_id;
        ELSE
            UPDATE public.reviews SET dislikes = dislikes + 1 WHERE id = NEW.review_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.vote_type = 'like' THEN
            UPDATE public.reviews SET likes = likes - 1 WHERE id = OLD.review_id;
        ELSE
            UPDATE public.reviews SET dislikes = dislikes - 1 WHERE id = OLD.review_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function
CREATE TRIGGER review_votes_trigger
AFTER INSERT
OR DELETE ON public.review_votes FOR EACH ROW
EXECUTE FUNCTION update_review_votes ();