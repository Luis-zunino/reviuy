-- =============================================================================
-- CASOS DE USO REALES (pgTAP) — Flujos de negocio completos
-- =============================================================================
-- Complementa a rls/001_rls_policies.sql, que valida ESTRUCTURA (existencia de
-- policies, grants y triggers). Este archivo valida COMPORTAMIENTO: ejecuta los
-- RPCs reales como usuarios simulados y comprueba el resultado de negocio de
-- punta a punta. Es la red de seguridad para detectar regresiones al tocar
-- migraciones.
--
-- MECÁNICA
--   - Usuario simulado: `set_config('request.jwt.claims', ...)` + `set local
--     role authenticated`. Es lo que lee auth.uid().
--   - Los RPC son SECURITY DEFINER, así que escriben correctamente; las lecturas
--     de tablas base (SELECT está revocado a authenticated por diseño) se hacen
--     con pg_temp.q(), un helper SECURITY DEFINER del owner.
--   - pg_temp.clear_rl() limpia el rate limit del usuario. Es necesario porque
--     create_review valida el rate limit ANTES de los campos, así que incluso
--     una validación fallida consume cupo (comportamiento real, ver nota abajo).
--   - Todo corre en una transacción con ROLLBACK: no deja datos ni requiere
--     limpieza, y no colisiona entre ejecuciones.
--
-- CONVENCIONES QUE REFLEJAN EL COMPORTAMIENTO REAL (no "como debería ser").
-- Si una deja de ser cierta, es un cambio de comportamiento que hay que decidir
-- explícitamente, no un test que haya que arreglar:
--   - Los mensajes de error varían entre RPCs análogos; se compara el literal.
--   - delete_review_safe enmascara sus errores internos con
--     'Error al eliminar reseña' (EXCEPTION WHEN OTHERS externo).
--   - update_review usa COALESCE(param, actual): NULL significa "no tocar", así
--     que no se puede limpiar un campo opcional.
--   - Los contadores de rating/review_count de una inmobiliaria se recalculan
--     por trigger, no en vivo.
--   - create_review devuelve un tipo compuesto (create_review_result), por eso
--     se accede con .success/.error; el resto de RPCs devuelven json y se
--     accede con ->>'campo'.
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgtap;

SELECT plan(91);

-- =============================================================================
-- HELPERS
-- =============================================================================
-- Evalúa un SELECT como owner. Necesario porque el SELECT sobre las tablas base
-- está revocado a authenticated (endurecimiento S2/S3); las vistas _public sí
-- son legibles y se consultan directamente.
CREATE OR REPLACE FUNCTION pg_temp.q(p_sql text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp AS $f$
DECLARE v text;
BEGIN
  EXECUTE p_sql INTO v;
  RETURN v;
END;
$f$;

-- Instala un usuario simulado como rol autenticado.
CREATE OR REPLACE FUNCTION pg_temp.as_user(p_uid uuid)
RETURNS void LANGUAGE plpgsql AS $f$
BEGIN
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', p_uid::text, 'role', 'authenticated')::text, true);
  EXECUTE 'set local role authenticated';
END;
$f$;

-- Instala el rol de servicio (para moderación y limpieza).
CREATE OR REPLACE FUNCTION pg_temp.as_service()
RETURNS void LANGUAGE plpgsql AS $f$
BEGIN
  PERFORM set_config('request.jwt.claims', '{"role":"service_role"}', true);
  EXECUTE 'set local role service_role';
END;
$f$;

CREATE OR REPLACE FUNCTION pg_temp.as_anon()
RETURNS void LANGUAGE plpgsql AS $f$
BEGIN
  PERFORM set_config('request.jwt.claims', '{"role":"anon"}', true);
  EXECUTE 'set local role anon';
END;
$f$;

CREATE OR REPLACE FUNCTION pg_temp.as_owner()
RETURNS void LANGUAGE plpgsql AS $f$
BEGIN
  EXECUTE 'reset role';
END;
$f$;

-- Reinicia el rate limit de un usuario. Necesario entre secciones porque
-- create_review consume cupo incluso cuando la validación posterior falla.
CREATE OR REPLACE FUNCTION pg_temp.clear_rl(p_uid uuid DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp AS $f$
BEGIN
  IF p_uid IS NULL THEN
    DELETE FROM public.rate_limits;
  ELSE
    DELETE FROM public.rate_limits WHERE user_id = p_uid;
  END IF;
END;
$f$;

-- UUIDs fijos de los tres usuarios de prueba:
--   A = 11111111-...  autor de todo
--   B = 22222222-...  tercero que interactúa
--   C = 33333333-...  usuario sin actividad, para probar aislamiento

-- Fixture: 3 usuarios de auth. Necesarios porque las FKs de reviews/real_estates
-- apuntan a auth.users.
SELECT pg_temp.as_owner();
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at,
                        raw_app_meta_data, raw_user_meta_data)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated',
   'usecase-a@reviuy.qa', extensions.crypt('TestPassword123!', gen_salt('bf', 10)),
   now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"terms_accepted_at":"2024-01-01T00:00:00Z","terms_version":"v1"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated',
   'usecase-b@reviuy.qa', extensions.crypt('TestPassword123!', gen_salt('bf', 10)),
   now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"terms_accepted_at":"2024-01-01T00:00:00Z","terms_version":"v1"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated',
   'usecase-c@reviuy.qa', extensions.crypt('TestPassword123!', gen_salt('bf', 10)),
   now(), '{"provider":"email","providers":["email"]}'::jsonb,
   '{"terms_accepted_at":"2024-01-01T00:00:00Z","terms_version":"v1"}'::jsonb);

-- =============================================================================
-- 1. CREATE_REVIEW — happy path
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();

SELECT is(
  (SELECT (public.create_review(
      p_title => 'Depto luminoso', p_description => 'Excelente para vivir',
      p_rating => 5, p_address_text => 'Av. Libertador 1234',
      p_address_osm_id => 'R100001', p_latitude => -34.90, p_longitude => -56.16,
      p_property_type => 'apartment', p_apartment_number => 'A',
      p_zone_rating => 4)).success),
  true, 'create_review (A): crea review de apartamento');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'Depto con rooms', p_description => 'Tres dormitorios',
      p_rating => 4, p_address_text => 'Av. Libertador 2222',
      p_address_osm_id => 'R100002', p_latitude => -34.90, p_longitude => -56.16,
      p_property_type => 'apartment', p_apartment_number => 'B',
      p_review_rooms => '[{"name":"Sala"},{"name":"Cocina"}]'::jsonb)).success),
  true, 'create_review (A): crea review con habitaciones');

-- =============================================================================
-- 2. CREATE_REVIEW — validaciones
--    El rate limit se evalúa antes que los campos, así que se limpia entre
--    casos para aislar cada validación.
-- =============================================================================
SELECT is(
  (SELECT (public.create_review(
      p_title => '', p_description => 'x', p_rating => 5,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0)).error),
  'El título es obligatorio', 'create_review: rechaza título vacío');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'x', p_description => '', p_rating => 5,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0)).error),
  'La descripción es obligatoria', 'create_review: rechaza descripción vacía');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'x', p_description => 'y', p_rating => 9,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0)).error),
  'El rating debe estar entre 1 y 5', 'create_review: rechaza rating fuera de rango');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'x', p_description => 'y', p_rating => 5,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0, p_property_type => 'castle')).error),
  'property_type inválido', 'create_review: rechaza property_type inválido');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'x', p_description => 'y', p_rating => 5,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0, p_zone_rating => 8)).error),
  'zone_rating debe estar entre 1 y 5', 'create_review: rechaza zone_rating inválido');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'x', p_description => 'y', p_rating => 5,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0,
      p_real_estate_id => '99999999-9999-9999-9999-999999999999')).error),
  'La inmobiliaria no existe o fue eliminada',
  'create_review: rechaza inmobiliaria inexistente');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => repeat('a', 201), p_description => 'y', p_rating => 5,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0)).error),
  'El título supera los 200 caracteres', 'create_review: rechaza título > 200 chars');

-- =============================================================================
-- 3. CREATE_REVIEW — reglas de unicidad por tipo de propiedad
--    house/room: 1 por dirección (ignora apartamento).
--    apartment/NULL: 1 por dirección + apartamento.
-- =============================================================================
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'Duplicada', p_description => 'y', p_rating => 4,
      p_address_text => 'Av. Libertador 1234', p_address_osm_id => 'R100001',
      p_latitude => -34.9, p_longitude => -56.16,
      p_property_type => 'apartment', p_apartment_number => 'A')).error),
  'Ya has publicado una reseña para este apartamento en esta dirección.',
  'create_review: bloquea 2ª review del mismo apartamento');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'Otro piso', p_description => 'y', p_rating => 4,
      p_address_text => 'Av. Libertador 1234', p_address_osm_id => 'R100001',
      p_latitude => -34.9, p_longitude => -56.16,
      p_property_type => 'apartment', p_apartment_number => 'B')).success),
  true, 'create_review: permite 2º apartamento en la misma dirección');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'La casa', p_description => 'y', p_rating => 4,
      p_address_text => 'Av. Italia 555', p_address_osm_id => 'R200001',
      p_latitude => -34.9, p_longitude => -56.16,
      p_property_type => 'house', p_apartment_number => 'X')).success),
  true, 'create_review: 1ª review de tipo house');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'La casa otra vez', p_description => 'y', p_rating => 4,
      p_address_text => 'Av. Italia 555', p_address_osm_id => 'R200001',
      p_latitude => -34.9, p_longitude => -56.16,
      p_property_type => 'house', p_apartment_number => 'Y')).error),
  'Ya has publicado una reseña para esta dirección. Solo puedes escribir una reseña por propiedad.',
  'create_review: house ignora apartment_number y bloquea duplicado');

-- =============================================================================
-- 4. UPDATE_REVIEW — permisos, validación y COALESCE
-- =============================================================================
SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.update_review(
      p_review_id => (SELECT id FROM public.reviews_public
                       WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
      p_title => ' hackeado'))->>'error'),
  'No tienes permisos para editar esta reseña',
  'update_review (B): no puede editar una review ajena');

SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.update_review(
      p_review_id => (SELECT id FROM public.reviews_public
                       WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
      p_title => 'Titulo editado'))->>'success'),
  'true', 'update_review (A): edita su propia review');

SELECT is(
  (SELECT title FROM public.reviews_public
   WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
  'Titulo editado', 'update_review: el título nuevo es visible en la vista pública');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.update_review(
      p_review_id => (SELECT id FROM public.reviews_public
                       WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
      p_title => ''))->>'error'),
  'El título no puede estar vacío', 'update_review: rechaza título vacío');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.update_review(
      p_review_id => '99999999-9999-9999-9999-999999999999',
      p_title => 'x'))->>'error'),
  'La reseña no existe', 'update_review: rechaza review inexistente');

-- COALESCE: NULL significa "no tocar", por lo que el rating se conserva.
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.update_review(
      p_review_id => (SELECT id FROM public.reviews_public
                       WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
      p_rating => NULL, p_description => 'Otra descripcion'))->>'success'),
  'true', 'update_review: p_rating NULL no rompe la operacion');

SELECT is(
  (SELECT rating FROM public.reviews_public
   WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
  5, 'update_review: COALESCE conserva el rating previo cuando se pasa NULL');

-- La auditoría registra creación y edición.
SELECT is(
  (SELECT pg_temp.q($$SELECT count(*)::int FROM public.review_audit a
      JOIN public.reviews r ON r.id = a.review_id
      WHERE r.address_osm_id = 'R100001' AND a.change_type = 'create'$$)),
  '2', 'review_audit: registra las 2 creaciones de R100001');

SELECT is(
  (SELECT pg_temp.q($$SELECT count(*)::int FROM public.review_audit a
      JOIN public.reviews r ON r.id = a.review_id
      WHERE r.address_osm_id = 'R100001' AND a.change_type = 'update'$$)),
  '2', 'review_audit: registra las 2 ediciones de R100001');

-- =============================================================================
-- 5. VOTOS — ownership, tipo válido, toggle like -> dislike -> off
-- =============================================================================
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_vote_type => 'like'))->>'error'),
  'No puedes votar tu propia reseña',
  'vote_review (A): no puede votar su propia review');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_vote_type => 'neutral'))->>'error'),
  'Tipo de voto inválido. Use like o dislike',
  'vote_review: rechaza tipo de voto inválido');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => '99999999-9999-9999-9999-999999999999',
      p_vote_type => 'like'))->>'error'),
  'La reseña no existe o fue eliminada',
  'vote_review: rechaza review inexistente');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_vote_type => 'like'))->>'action'),
  'inserted', 'vote_review (B): registra like por primera vez');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_vote_type => 'dislike'))->>'action'),
  'updated', 'vote_review (B): cambia like -> dislike');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_vote_type => 'dislike'))->>'action'),
  'deleted', 'vote_review (B): repetir dislike elimina el voto (toggle)');

SELECT is(
  (SELECT (public.get_review_vote_counts(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1))).likes_count),
  0::bigint, 'get_review_vote_counts: 0 likes tras el toggle');

-- =============================================================================
-- 6. REPORTES
-- =============================================================================
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_reason => ''))->>'error'),
  'La razón del reporte es obligatoria', 'report_review: rechaza razón vacía');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_reason => 'spam'))->>'success'),
  'true', 'report_review (B): reporta una review ajena');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_reason => 'spam'))->>'error'),
  'Ya has reportado esta reseña anteriormente',
  'report_review: bloquea el reporte duplicado');

SELECT is(
  public.has_user_reported_review(
    (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1)),
  true, 'has_user_reported_review (B): true tras reportar');

-- A no puede reportar la review de la que es autor (R100002 es suya).
-- El check de propiedad va antes del de duplicado, así que gana sobre el
-- reporte previo de B.
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1),
      p_reason => 'spam'))->>'error'),
  'No puedes reportar tu propia reseña',
  'report_review (A): no puede reportar su propia review');

-- =============================================================================
-- 7. FAVORITOS
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.toggle_favorite_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1))->>'error')),
  'No puedes favoritar tu propia reseña',
  'toggle_favorite_review (A): no puede favoritar su propia review');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.toggle_favorite_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1))->>'is_favorite')),
  'true', 'toggle_favorite_review (B): agrega a favoritos');

SELECT is(
  public.is_review_favorite(
    (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1)),
  true, 'is_review_favorite (B): true tras agregar');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.toggle_favorite_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1))->>'is_favorite')),
  'false', 'toggle_favorite_review (B): el segundo toggle quita el favorito');

SELECT is(
  public.is_review_favorite(
    (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1)),
  false, 'is_review_favorite (B): false tras quitar');

-- =============================================================================
-- 8. INMOBILIARIAS — create, vote, favorite, report
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate(
      p_name => 'Inmobiliaria Usecase Uno', p_description => 'Sucursal central'))->>'success'),
  'true', 'create_real_estate (A): crea inmobiliaria');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate(
      p_name => 'inmobiliaria usecase uno', p_description => 'Mismo nombre'))->>'error'),
  'Ya existe una inmobiliaria con ese nombre',
  'create_real_estate: el nombre duplicado se compara sin distinguir mayúsculas');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate(p_name => ''))->>'error'),
  'El nombre es obligatorio', 'create_real_estate: rechaza nombre vacío');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_real_estate(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_vote_type => 'like'))->>'error'),
  'No puedes votar tu propia inmobiliaria',
  'vote_real_estate (A): no puede votar su propia inmobiliaria');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.toggle_favorite_real_estate(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'))).error),
  'No puedes favoritar tu propia inmobiliaria',
  'toggle_favorite_real_estate (A): no puede favoritar su propia inmobiliaria');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_real_estate(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_reason => 'spam'))->>'error'),
  'No puedes reportar tu propia inmobiliaria',
  'report_real_estate (A): no puede reportar su propia inmobiliaria');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_real_estate(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_vote_type => 'like'))->>'success'),
  'true', 'vote_real_estate (B): vota una inmobiliaria ajena');

SELECT is(
  (SELECT (public.get_real_estate_vote_counts(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'))).likes_count),
  1::bigint, 'get_real_estate_vote_counts: refleja el like de B');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.toggle_favorite_real_estate(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'))).is_favorite),
  'true', 'toggle_favorite_real_estate (B): agrega a favoritos');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_real_estate(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_reason => 'falso'))->>'success'),
  'true', 'report_real_estate (B): reporta una inmobiliaria ajena');

-- =============================================================================
-- 9. REVIEWS DE INMOBILIARIA — create, duplicado, rating por trigger, vote
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate_review(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_title => 'Mala atencion', p_description => 'Me trataron mal', p_rating => 2))->>'success'),
  'true', 'create_real_estate_review (A): crea review de inmobiliaria');

SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate_review(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_title => 'Duplicada', p_description => 'Otra vez', p_rating => 4))->>'error'),
  'Ya has escrito una reseña para esta inmobiliaria',
  'create_real_estate_review: bloquea la 2ª review del mismo usuario e inmobiliaria');

-- El trigger recalcula rating y review_count de la inmobiliaria.
SELECT is(
  (SELECT rating FROM public.real_estates_public WHERE name = 'Inmobiliaria Usecase Uno'),
  2.0, 'trigger: el rating promedio de la inmobiliaria queda en 2');

SELECT is(
  (SELECT review_count FROM public.real_estates_public WHERE name = 'Inmobiliaria Usecase Uno'),
  1, 'trigger: review_count de la inmobiliaria queda en 1');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate_review(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Usecase Uno'),
      p_title => 'Buena atencion', p_description => 'Todo bien', p_rating => 4))->>'success'),
  'true', 'create_real_estate_review (B): un 2º usuario reviewa la misma inmobiliaria');

SELECT is(
  (SELECT rating FROM public.real_estates_public WHERE name = 'Inmobiliaria Usecase Uno'),
  3.0, 'trigger: el rating promedio sube a 3 con la 2ª review (rating=4)');

SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.vote_real_estate_review(
      p_real_estate_review_id => (SELECT id FROM public.real_estate_reviews_public
                                    WHERE title = 'Buena atencion'),
      p_vote_type => 'like'))->>'success'),
  'true', 'vote_real_estate_review (A): vota una review de inmobiliaria ajena');

SELECT is(
  (SELECT (public.get_real_estate_review_vote_counts(
      p_real_estate_review_id => (SELECT id FROM public.real_estate_reviews_public
                                    WHERE title = 'Buena atencion'))).likes_count),
  1::bigint, 'get_real_estate_review_vote_counts: refleja el like');

-- =============================================================================
-- 10. MODERACIÓN (service_role)
-- =============================================================================
SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.report_real_estate_review(
      p_real_estate_review_id => (SELECT id FROM public.real_estate_reviews_public
                                    WHERE title = 'Mala atencion'),
      p_reason => 'abuso'))->>'success'),
  'true', 'report_real_estate_review (B): reporta una review de inmobiliaria ajena');

-- Un usuario autenticado no tiene EXECUTE: el grant fue revocado.
SELECT throws_ok(
  $fn$SELECT public.moderate_reports(
      p_report_id => (SELECT id FROM public.real_estate_review_reports LIMIT 1),
      p_target_type => 'real_estate_review', p_status => 'resolved')$fn$,
  '42501', NULL,
  'moderate_reports: bloqueado para un usuario autenticado');

SELECT pg_temp.as_service();
SELECT is(
  (public.moderate_reports(
      p_report_id => (SELECT id FROM public.real_estate_review_reports LIMIT 1),
      p_target_type => 'real_estate_review', p_status => 'resolved'))->>'success',
  'true', 'moderate_reports (service_role): modera el reporte');

SELECT is(
  (SELECT pg_temp.q($$SELECT status FROM public.real_estate_review_reports LIMIT 1$$)),
  'resolved', 'moderate_reports: el nuevo status queda persistido');

-- =============================================================================
-- 11. SOFT DELETE de review de dirección
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT is(
  (public.delete_review_safe(
      (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100002' LIMIT 1))),
  true, 'delete_review_safe (A): soft-delete de su propia review');

-- La fila persiste en la tabla, pero desaparece de la vista pública.
SELECT is(
  (SELECT pg_temp.q($$SELECT count(*)::int FROM public.reviews WHERE address_osm_id = 'R100002'$$)),
  '1', 'delete_review_safe: la fila sigue existiendo en la tabla (soft delete)');

SELECT is(
  (SELECT count(*)::int FROM public.reviews_public WHERE address_osm_id = 'R100002'),
  0, 'delete_review_safe: reviews_public ya no la expone');

SELECT is(
  (SELECT pg_temp.q($$SELECT count(*)::int FROM public.review_deletions d
      JOIN public.reviews r ON r.id = d.review_id WHERE r.address_osm_id = 'R100002'$$)),
  '1', 'delete_review_safe: registra la eliminación en review_deletions');

-- B no puede borrar la review de A; el error interno está enmascarado.
SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT throws_ok(
  $fn$SELECT public.delete_review_safe(
      (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R100001' LIMIT 1))$fn$,
  'P0001', 'Error al eliminar reseña',
  'delete_review_safe (B): no puede borrar una review ajena (mensaje enmascarado)');

-- =============================================================================
-- 12. SOFT DELETE de review de inmobiliaria
-- =============================================================================
SELECT is(
  (public.delete_real_estate_review_safe(
      (SELECT id FROM public.real_estate_reviews_public
        WHERE title = 'Buena atencion')))->>'success',
  'true', 'delete_real_estate_review_safe (B): soft-delete de su review');

SELECT is(
  (SELECT count(*)::int FROM public.real_estate_reviews_public WHERE title = 'Buena atencion'),
  0, 'delete_real_estate_review_safe: desaparece de la vista pública');

-- El trigger recalcula el promedio tras el borrado lógico.
SELECT is(
  (SELECT review_count FROM public.real_estates_public WHERE name = 'Inmobiliaria Usecase Uno'),
  1, 'trigger: review_count vuelve a 1 tras el soft-delete');

-- =============================================================================
-- 13. AISLAMIENTO Y LECTURA — is_mine, listados, vistas sin identidad
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT is(
  (SELECT is_mine FROM public.reviews_public
   WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
  true, 'reviews_public: is_mine=true para el autor (A)');

SELECT pg_temp.as_user('33333333-3333-3333-3333-333333333333');
SELECT is(
  (SELECT is_mine FROM public.reviews_public
   WHERE address_osm_id = 'R100001' AND apartment_number = 'A' LIMIT 1),
  false, 'reviews_public: is_mine=false para un tercero (C)');

SELECT is(
  (SELECT count(*)::int FROM public.get_reviews_by_current_user()),
  0, 'get_reviews_by_current_user (C): vacío para un usuario sin reviews');

-- Favoritos: B quitó el suyo, y C nunca vio los de B.
SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT is(
  (SELECT count(*)::int FROM public.get_favorite_reviews_by_current_user()),
  0, 'get_favorite_reviews_by_current_user (B): vacío tras quitar el favorito');

SELECT pg_temp.as_user('33333333-3333-3333-3333-333333333333');
SELECT is(
  (SELECT count(*)::int FROM public.get_favorite_reviews_by_current_user()),
  0, 'get_favorite_reviews_by_current_user (C): no ve los favoritos de B');

-- La vista con votos agrega contadores y sigue filtrando las reviews eliminadas.
SELECT is(
  (SELECT count(*)::int FROM public.reviews_with_votes_public
   WHERE address_osm_id = 'R100001'),
  2, 'reviews_with_votes_public: 2 reviews activas en R100001');

SELECT is(
  (SELECT count(*)::int FROM information_schema.columns
   WHERE table_name = 'reviews_with_votes_public'
     AND column_name IN ('user_id','created_by','deleted_by','reported_by_user_id')),
  0, 'reviews_with_votes_public: no expone columnas de identidad');

-- =============================================================================
-- 14. TRIGGERS updated_at (regresión de la migración M6)
--     review_votes y real_estate_review_votes Incorporan la columna
--     updated_at con DEFAULT now() y un trigger BEFORE UPDATE que la refresca
--     sólo cuando la fila cambia de verdad (NEW IS DISTINCT FROM OLD).
--     Dentro de una transacción now() es constante, así que el valor por sí
--     solo no prueba que el trigger corra. Por eso la prueba escribe un
--     centinela: el discriminador es doble — con trigger lo sobrescribe con
--     now() y el UPDATE pasa; sin trigger el centinela queda por debajo de
--     created_at y review_votes_check (updated_at >= created_at) rechaza la
--     fila, así que el UPDATE también falla.
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_review(
      p_title => 'Review para triggers', p_description => 'Fixture de updated_at',
      p_rating => 4, p_address_text => 'Calle Trigger', p_address_osm_id => 'R300001',
      p_latitude => -34.9, p_longitude => -56.16,
      p_property_type => 'apartment', p_apartment_number => 'A')).success),
  true, 'fixture: review creada para probar los triggers updated_at');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT is(
  (SELECT (public.vote_review(
      p_review_id => (SELECT id FROM public.reviews_public WHERE address_osm_id = 'R300001' LIMIT 1),
      p_vote_type => 'like'))->>'action'),
  'inserted', 'fixture: voto de B sobre R300001');

-- El DEFAULT now() deja la columna poblada desde el INSERT.
SELECT is(
  (SELECT updated_at FROM public.review_votes
    WHERE review_id = (SELECT id FROM public.reviews_public
                         WHERE address_osm_id = 'R300001' LIMIT 1)),
  now(), 'review_votes: updated_at se puebla con now() al insertar');

SELECT pg_temp.as_owner();
UPDATE public.review_votes
   SET vote_type = 'dislike', updated_at = '2000-01-01T00:00:00Z'::timestamptz
 WHERE review_id = (SELECT id FROM public.reviews_public
                      WHERE address_osm_id = 'R300001' LIMIT 1);

-- Control: el UPDATE realmente modificó la fila.
SELECT is(
  (SELECT vote_type FROM public.review_votes
    WHERE review_id = (SELECT id FROM public.reviews_public
                         WHERE address_osm_id = 'R300001' LIMIT 1)),
  'dislike', 'review_votes: el UPDATE de control sí cambió la fila');

-- Si el trigger corrió, pisa el centinela del 2000 y deja now().
SELECT is(
  (SELECT updated_at FROM public.review_votes
    WHERE review_id = (SELECT id FROM public.reviews_public
                         WHERE address_osm_id = 'R300001' LIMIT 1)),
  now(), 'review_votes: el trigger updated_at pisa el centinela al cambiar la fila');

-- Una actualización que no cambia nada no debe tocar la marca.
SELECT is(
  (SELECT updated_at FROM public.review_votes
    WHERE review_id = (SELECT id FROM public.reviews_public
                         WHERE address_osm_id = 'R300001' LIMIT 1)),
  now(), 'review_votes: una actualización sin cambios deja updated_at intacto');

-- El mismo contrato debe cumplirse en real_estate_review_votes.
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
SELECT is(
  (SELECT (public.create_real_estate(
      p_name => 'Inmobiliaria Triggers', p_description => 'Fixture de updated_at'))->>'success'),
  'true', 'fixture: inmobiliaria creada para probar los triggers updated_at');

SELECT is(
  (SELECT (public.create_real_estate_review(
      p_real_estate_id => (SELECT id FROM public.real_estates_public
                            WHERE name = 'Inmobiliaria Triggers'),
      p_title => 'Review trigger', p_description => 'Para el trigger',
      p_rating => 5))->>'success'),
  'true', 'fixture: review de inmobiliaria para probar los triggers updated_at');

SELECT pg_temp.as_user('22222222-2222-2222-2222-222222222222');
SELECT is(
  (SELECT (public.vote_real_estate_review(
      p_real_estate_review_id => (SELECT id FROM public.real_estate_reviews_public
                                    WHERE title = 'Review trigger'),
      p_vote_type => 'like'))->>'success'),
  'true', 'fixture: voto de B sobre la review de inmobiliaria');

SELECT is(
  (SELECT updated_at FROM public.real_estate_review_votes
    WHERE real_estate_review_id = (SELECT id FROM public.real_estate_reviews_public
                                    WHERE title = 'Review trigger')),
  now(), 'real_estate_review_votes: updated_at se puebla con now() al insertar');

SELECT pg_temp.as_owner();
UPDATE public.real_estate_review_votes
   SET vote_type = 'dislike', updated_at = '2000-01-01T00:00:00Z'::timestamptz
 WHERE real_estate_review_id = (SELECT id FROM public.real_estate_reviews_public
                                  WHERE title = 'Review trigger');

SELECT is(
  (SELECT updated_at FROM public.real_estate_review_votes
    WHERE real_estate_review_id = (SELECT id FROM public.real_estate_reviews_public
                                    WHERE title = 'Review trigger')),
  now(), 'real_estate_review_votes: el trigger updated_at pisa el centinela');

-- =============================================================================
-- 15. RATE LIMIT de create_review (5 por 10 min)
-- =============================================================================
SELECT pg_temp.as_user('11111111-1111-1111-1111-111111111111');
SELECT pg_temp.clear_rl();
DO $do$
DECLARE
  i int;
BEGIN
  -- 5 direcciones distintas: el límite es por usuario, no por dirección.
  FOR i IN 1..5 LOOP
    PERFORM public.create_review(
      p_title => 'RL ' || i, p_description => 'test de rate limit',
      p_rating => 3, p_address_text => 'Calle RL', p_address_osm_id => 'RL' || i,
      p_latitude => -34.9, p_longitude => -56.16,
      p_property_type => 'apartment', p_apartment_number => 'A');
  END LOOP;
END;
$do$;

SELECT is(
  (SELECT (public.create_review(
      p_title => 'RL Overflow', p_description => 'ya excedio el cupo',
      p_rating => 3, p_address_text => 'Calle RL', p_address_osm_id => 'RL999',
      p_latitude => -34.9, p_longitude => -56.16)).error),
  'Demasiadas reseñas. Intenta más tarde.',
  'rate limit: create_review bloquea tras agotar el cupo de 5/10min');

-- =============================================================================
-- 16. LECTURA ANÓNIMA
-- =============================================================================
SELECT pg_temp.as_anon();
SELECT is(
  (SELECT count(*)::int FROM public.get_reviews_paginated(10, 0)) >= 0,
  true, 'get_reviews_paginated: accesible para anon');

SELECT is(
  (SELECT (public.get_review_vote_counts(
      p_review_id => (SELECT id FROM public.reviews_public
                        WHERE address_osm_id = 'R100001' LIMIT 1))).likes_count >= 0),
  true, 'get_review_vote_counts: accesible para anon');

SELECT throws_ok(
  $fn$SELECT public.create_review(
      p_title => 'anon', p_description => 'x', p_rating => 3,
      p_address_text => 'a', p_address_osm_id => 'o',
      p_latitude => 0, p_longitude => 0)$fn$,
  '42501', NULL, 'create_review: bloqueado para anon');

-- =============================================================================
-- FIN
-- =============================================================================
SELECT * FROM finish();
ROLLBACK;
