-- =============================================================================
-- FUNCIONES BASE
-- =============================================================================
-- Función para actualizar timestamp de updated_at
CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();

RETURN NEW;

END;

$$ LANGUAGE plpgsql;