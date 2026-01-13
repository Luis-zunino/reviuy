-- =============================================================================
-- Triggers (después de crear las tablas)
-- =============================================================================

-- Trigger para updated_at en real_estate_reports
DROP TRIGGER IF EXISTS update_real_estate_reports_updated_at ON public.real_estate_reports;
CREATE TRIGGER update_real_estate_reports_updated_at 
    BEFORE UPDATE ON public.real_estate_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at en real_estate_votes
DROP TRIGGER IF EXISTS update_real_estate_votes_updated_at ON public.real_estate_votes;
CREATE TRIGGER update_real_estate_votes_updated_at 
    BEFORE UPDATE ON public.real_estate_votes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();