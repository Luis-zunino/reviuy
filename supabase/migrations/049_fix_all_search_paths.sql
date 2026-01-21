-- Dynamic fix for "Function Search Path Mutable"
-- Updates ALL functions in the public schema to have search_path = public.
-- This handles overloaded functions and "ghost" functions that might be left over from previous migrations.
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT p.oid::regprocedure as func_signature
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f' -- f = function (excludes procedures and aggregates)
    LOOP
        BEGIN
            -- Attempt to set search_path
            -- This will skip functions that belong to extensions (throws exception which we catch)
            EXECUTE format('ALTER FUNCTION %s SET search_path = public', r.func_signature);
        EXCEPTION 
            WHEN object_not_in_prerequisite_state THEN
                -- Handles "function ... is part of extension ..."
                RAISE NOTICE 'Skipping extension function: %', r.func_signature;
            WHEN OTHERS THEN
                -- Logs other errors but continues
                RAISE NOTICE 'Could not check/update function %: %', r.func_signature, SQLERRM;
        END;
    END LOOP;
END $$;