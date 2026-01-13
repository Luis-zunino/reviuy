-- Políticas de seguridad
DROP POLICY IF EXISTS "Anyone can view real estate favorites" ON public.real_estate_favorites;
CREATE POLICY "Anyone can view real estate favorites" 
ON public.real_estate_favorites FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.real_estate_favorites;
CREATE POLICY "Users can insert their own favorites" 
ON public.real_estate_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.real_estate_favorites;
CREATE POLICY "Users can delete their own favorites" 
ON public.real_estate_favorites FOR DELETE 
USING (auth.uid() = user_id);