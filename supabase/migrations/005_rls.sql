-- =============================================================================
-- RLS BASE
-- =============================================================================
-- Políticas para REAL_ESTATES
drop policy IF exists "Anyone can view real estates" on public.real_estates;

create policy "Anyone can view real estates" on public.real_estates for
select
  using (true);

drop policy IF exists "Authenticated users can create real estates" on public.real_estates;

create policy "Authenticated users can create real estates" on public.real_estates for INSERT
with
  check (
    auth.uid () is not null
    and (
      created_by = auth.uid ()
      or created_by is null
    )
  );

drop policy IF exists "Creators can update their real estates" on public.real_estates;

create policy "Creators can update their real estates" on public.real_estates
for update
  using (
    auth.uid () is not null
    and (
      created_by = auth.uid ()
      or created_by is null
    )
  );

drop policy IF exists "Creators can delete their real estates" on public.real_estates;

create policy "Creators can delete their real estates" on public.real_estates for DELETE using (
  auth.uid () is not null
  and (
    created_by = auth.uid ()
    or created_by is null
  )
);

--------- RLS para rate_limits
alter table public.rate_limits ENABLE row LEVEL SECURITY;

create policy "Users can view their own rate limits" on public.rate_limits for
select
  using (auth.uid () = user_id);

-- RLS para security_logs
alter table public.security_logs ENABLE row LEVEL SECURITY;

create policy "Service role can view all logs" on public.security_logs for
select
  using (auth.role () = 'service_role');

-- Habilitar RLS en tablas base
alter table public.reviews ENABLE row LEVEL SECURITY;

alter table public.real_estates ENABLE row LEVEL SECURITY;

alter table public.review_rooms ENABLE row LEVEL SECURITY;

-- =============================================================================
-- Políticas para REVIEW_ROOMS
-- =============================================================================
drop policy IF exists "Anyone can view review rooms" on public.review_rooms;

create policy "Anyone can view review rooms" on public.review_rooms for
select
  using (true);

drop policy IF exists "Users can manage rooms of their reviews" on public.review_rooms;

create policy "Users can manage rooms of their reviews" on public.review_rooms for all using (
  exists (
    select
      1
    from
      public.reviews
    where
      reviews.id = review_rooms.review_id
      and reviews.user_id = auth.uid ()
  )
);

-- ---------------------------------------------------------------------------
-- review_votes
-- ---------------------------------------------------------------------------
-- Lectura pública de votos
create policy "review_votes_select_all" on public.review_votes for
select
  using (true);

-- Insertar solo tu propio voto
drop policy "review_votes_insert_own" on public.review_votes;
create policy "review_votes_insert_own" on public.review_votes for INSERT
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

-- Actualizar solo tu propio voto
drop policy "review_votes_update_own" on public.review_votes;
create policy "review_votes_update_own" on public.review_votes
for update
  using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);

-- Borrar solo tu propio voto
drop policy "review_votes_delete_own" on public.review_votes;
create policy "review_votes_delete_own" on public.review_votes for DELETE using (auth.uid () = user_id);

-- =============================================================================
-- Políticas para REVIEWS
-- =============================================================================
drop policy IF exists "Anyone can view reviews" on public.reviews;

create policy "Anyone can view reviews" on public.reviews for
select
  using (true);

drop policy IF exists "Authenticated users can create reviews" on public.reviews;

create policy "Authenticated users can create reviews" on public.reviews for INSERT
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy IF exists "Users can update own reviews" on public.reviews;

create policy "Users can update own reviews" on public.reviews
for update
  using (
    auth.uid () is not null
    and user_id = auth.uid ()
  )
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy IF exists "Users can delete own reviews" on public.reviews;

create policy "Users can delete own reviews" on public.reviews for DELETE using (
  auth.uid () is not null
  and user_id = auth.uid ()
);

-- ---------------------------------------------------------------------------
-- Habilitar RLS
-- ---------------------------------------------------------------------------
alter table public.review_votes ENABLE row LEVEL SECURITY;

alter table public.review_reports ENABLE row LEVEL SECURITY;

alter table public.review_deletions ENABLE row LEVEL SECURITY;

alter table public.review_audit ENABLE row LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- review_reports
-- ---------------------------------------------------------------------------
-- Crear reportes (solo usuarios autenticados)
create policy "review_reports_insert_own" on public.review_reports for INSERT
with
  check (
    auth.uid () is not null
    and reported_by_user_id = auth.uid ()
  );

-- =============================================================================
-- RLS PARA RESEÑAS DE INMOBILIARIAS
-- =============================================================================
-- Habilitar RLS en nuevas tablas
alter table public.real_estate_reviews ENABLE row LEVEL SECURITY;

alter table public.real_estate_review_votes ENABLE row LEVEL SECURITY;

alter table public.real_estate_review_reports ENABLE row LEVEL SECURITY;

-- Políticas para real_estate_reviews
drop policy IF exists "Anyone can view real estate reviews" on public.real_estate_reviews;

create policy "Anyone can view real estate reviews" on public.real_estate_reviews for
select
  using (true);

drop policy IF exists "Authenticated users can create real estate reviews" on public.real_estate_reviews;

create policy "Authenticated users can create real estate reviews" on public.real_estate_reviews for INSERT
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy IF exists "Users can update own real estate reviews" on public.real_estate_reviews;

create policy "Users can update own real estate reviews" on public.real_estate_reviews
for update
  using (
    auth.uid () is not null
    and user_id = auth.uid ()
  )
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy IF exists "Users can delete own real estate reviews" on public.real_estate_reviews;

create policy "Users can delete own real estate reviews" on public.real_estate_reviews for DELETE using (
  auth.uid () is not null
  and user_id = auth.uid ()
);

-- Políticas para real_estate_review_votes
drop policy IF exists "Anyone can view real estate review votes" on public.real_estate_review_votes;

create policy "Anyone can view real estate review votes" on public.real_estate_review_votes for
select
  using (true);

drop policy IF exists "Users can manage own real estate review votes" on public.real_estate_review_votes;

create policy "Users can manage own real estate review votes" on public.real_estate_review_votes for all using (
  auth.uid () is not null
  and user_id = auth.uid ()
);

-- Políticas para real_estate_review_reports
drop policy IF exists "Users can create real estate review reports" on public.real_estate_review_reports;

create policy "Users can create real estate review reports" on public.real_estate_review_reports for INSERT
with
  check (reported_by_user_id = auth.uid ());

drop policy IF exists "Users can view own real estate review reports" on public.real_estate_review_reports;

create policy "Users can view own real estate review reports" on public.real_estate_review_reports for
select
  using (reported_by_user_id = auth.uid ());

-- =============================================================================
-- Habilitar RLS en las nuevas tablas
-- =============================================================================
alter table public.real_estate_votes ENABLE row LEVEL SECURITY;

alter table public.real_estate_reports ENABLE row LEVEL SECURITY;

-- =============================================================================
-- Políticas para real_estate_votes
-- =============================================================================
drop policy IF exists "Anyone can view real estate votes" on public.real_estate_votes;

create policy "Anyone can view real estate votes" on public.real_estate_votes for
select
  using (true);

drop policy IF exists "Users can insert their own real estate votes" on public.real_estate_votes;

create policy "Users can insert their own real estate votes" on public.real_estate_votes for INSERT
with
  check (auth.uid () = user_id);

drop policy IF exists "Users can update their own real estate votes" on public.real_estate_votes;

create policy "Users can update their own real estate votes" on public.real_estate_votes
for update
  using (auth.uid () = user_id);

drop policy IF exists "Users can delete their own real estate votes" on public.real_estate_votes;

create policy "Users can delete their own real estate votes" on public.real_estate_votes for DELETE using (auth.uid () = user_id);

-- =============================================================================
-- Políticas para real_estate_reports 
-- =============================================================================
drop policy IF exists "Users can create real estate reports" on public.real_estate_reports;

create policy "Users can create real estate reports" on public.real_estate_reports for INSERT
with
  check (reported_by_user_id = auth.uid ());

drop policy IF exists "Users can view their own real estate reports" on public.real_estate_reports;

create policy "Users can view their own real estate reports" on public.real_estate_reports for
select
  using (reported_by_user_id = auth.uid ());

-- Habilitar RLS
alter table public.real_estate_favorites ENABLE row LEVEL SECURITY;

-- Habilitar RLS
alter table public.review_favorites ENABLE row LEVEL SECURITY;

-- =============================================================================
-- Sistema de reviews - Row Level Security (RLS)
-- =============================================================================--
-- Inserción desde sistema / triggers
drop policy "review_deletions_system_insert" on public.review_deletions;
create policy "review_deletions_system_insert" on public.review_deletions for INSERT
with
  check (auth.role () = 'service_role');

-- El usuario puede ver las eliminaciones que realizó
drop policy "review_deletions_select_own" on public.review_deletions;
create policy "review_deletions_select_own" on public.review_deletions for
select
  using (deleted_by = auth.uid ());

-- ---------------------------------------------------------------------------
-- review_audit
-- ---------------------------------------------------------------------------
-- Inserción desde sistema / triggers
drop policy "review_audit_system_insert" on public.review_audit;
create policy "review_audit_system_insert" on public.review_audit for INSERT
with
  check (true);

-- El usuario puede ver auditoría de sus propias reviews
drop policy IF exists  "review_audit_select_own_reviews" on public.review_audit;
create policy "review_audit_select_own_reviews" on public.review_audit for
select
  using (
    exists (
      select
        1
      from
        public.reviews r
      where
        r.id = review_audit.review_id
        and r.user_id = auth.uid ()
    )
  );

-- ---------------------------------------------------------------------------
-- Políticas adicionales para service_role (administración)
-- ---------------------------------------------------------------------------
-- Service role puede gestionar todos los reportes (moderación)
create policy "review_reports_service_role_all" on public.review_reports for all using (auth.role () = 'service_role');

-- Políticas de seguridad
drop policy IF exists "Anyone can view real estate favorites" on public.real_estate_favorites;

create policy "Anyone can view real estate favorites" on public.real_estate_favorites for
select
  using (true);

drop policy IF exists "Users can insert their own favorites" on public.real_estate_favorites;

create policy "Users can insert their own favorites" on public.real_estate_favorites for INSERT
with
  check (auth.uid () = user_id);

drop policy IF exists "Users can delete their own favorites" on public.real_estate_favorites;

create policy "Users can delete their own favorites" on public.real_estate_favorites for DELETE using (auth.uid () = user_id);

-- =============================================================================
-- POLÍTICAS RLS PARA FAVORITOS DE RESEÑAS
-- =============================================================================
-- Políticas de seguridad
drop policy IF exists "Anyone can view review favorites" on public.review_favorites;

create policy "Anyone can view review favorites" on public.review_favorites for
select
  using (true);

drop policy IF exists "Users can insert their own review favorites" on public.review_favorites;

create policy "Users can insert their own review favorites" on public.review_favorites for INSERT
with
  check (auth.uid () = user_id);

drop policy IF exists "Users can delete their own review favorites" on public.review_favorites;

create policy "Users can delete their own review favorites" on public.review_favorites for DELETE using (auth.uid () = user_id);

-- Política para service role (adicional a las de 014)
-- NOTA: Esta política es complementaria, no duplica las de 014
do $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'review_reports' AND policyname = 'Service role can manage reports') THEN
        CREATE POLICY "Service role can manage reports" ON review_reports 
        FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

drop policy IF exists "Public can read all reviews" on public.reviews;

drop policy IF exists "Public can read reviews" on public.reviews;

drop policy IF exists "Users can create their own reviews" on public.reviews;

drop policy IF exists "Users can update their own reviews" on public.reviews;

drop policy IF exists "Anyone can view review_votes" on public.review_votes;

drop policy IF exists "Users can manage own review_votes" on public.review_votes;

drop policy IF exists "Public can read votes" on public.review_votes;

drop policy IF exists "Users can manage their own votes" on public.review_votes;

-- =============================================================================
-- POLÍTICAS CONSOLIDADAS Y DOCUMENTADAS
-- =============================================================================
-- ---------------------------------------------------------------------------
-- REVIEWS: Políticas de acceso a reseñas
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden leer todas las reseñas (incluyendo anónimos)
-- Reviews are intentionally public by business requirement.
-- Any user (authenticated or anonymous) can read non-deleted reviews.
drop policy IF exists "reviews_select_public" on public.reviews;

create policy "reviews_select_public" on public.reviews for
select
  using (deleted_at is null);

-- INSERT: Solo usuarios autenticados pueden crear, y solo con su propio user_id
drop policy IF exists "reviews_insert_own" on public.reviews;

create policy "reviews_insert_own" on public.reviews for INSERT
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

-- UPDATE: Los usuarios solo pueden actualizar sus propias reseñas
drop policy IF exists "reviews_update_own" on public.reviews;

create policy "reviews_update_own" on public.reviews
for update
  using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

-- DELETE: Los usuarios solo pueden eliminar sus propias reseñas
drop policy IF exists "reviews_delete_own" on public.reviews;

create policy "reviews_delete_own" on public.reviews for DELETE using (user_id = auth.uid ());

-- ---------------------------------------------------------------------------
-- REVIEW_ROOMS: Políticas para habitaciones de reseñas
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden leer (público)
drop policy IF exists "review_rooms_select_public" on public.review_rooms;

create policy "review_rooms_select_public" on public.review_rooms for
select
  using (true);

-- ALL: Los usuarios pueden gestionar habitaciones de sus propias reseñas
drop policy IF exists "review_rooms_manage_own" on public.review_rooms;

create policy "review_rooms_manage_own" on public.review_rooms for all using (
  exists (
    select
      1
    from
      public.reviews
    where
      reviews.id = review_rooms.review_id
      and reviews.user_id = auth.uid ()
  )
)
with
  check (
    exists (
      select
        1
      from
        public.reviews
      where
        reviews.id = review_rooms.review_id
        and reviews.user_id = auth.uid ()
    )
  );

-- ---------------------------------------------------------------------------
-- REVIEW_VOTES: Políticas de votación
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden ver los votos (para mostrar contadores)
drop policy IF exists "review_votes_select_public" on public.review_votes;

create policy "review_votes_select_public" on public.review_votes for
select
  using (true);

-- INSERT: Los usuarios solo pueden crear votos con su propio user_id
drop policy IF exists "review_votes_insert_own" on public.review_votes;

create policy "review_votes_insert_own" on public.review_votes for INSERT
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

-- UPDATE: Los usuarios solo pueden cambiar sus propios votos
drop policy IF exists "review_votes_update_own" on public.review_votes;

create policy "review_votes_update_own" on public.review_votes
for update
  using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

-- DELETE: Los usuarios solo pueden eliminar sus propios votos
drop policy IF exists "review_votes_delete_own" on public.review_votes;

create policy "review_votes_delete_own" on public.review_votes for DELETE using (user_id = auth.uid ());

-- ---------------------------------------------------------------------------
-- REVIEW_REPORTS: Políticas de reportes
-- ---------------------------------------------------------------------------
-- SELECT: Los usuarios solo ven sus propios reportes
drop policy IF exists "review_reports_select_own" on public.review_reports;

create policy "review_reports_select_own" on public.review_reports for
select
  using (reported_by_user_id = auth.uid ());

-- INSERT: Los usuarios pueden crear reportes (solo uno por reseña)
drop policy IF exists "review_reports_insert_own" on public.review_reports;

create policy "review_reports_insert_own" on public.review_reports for INSERT
with
  check (
    auth.uid () is not null
    and reported_by_user_id = auth.uid ()
  );

-- ALL (service_role): Moderadores pueden gestionar todos los reportes
drop policy IF exists "review_reports_service_role_all" on public.review_reports;

create policy "review_reports_service_role_all" on public.review_reports for all using (auth.role () = 'service_role');

-- ---------------------------------------------------------------------------
-- REVIEW_DELETIONS: Políticas de auditoría de eliminaciones
-- ---------------------------------------------------------------------------
-- SELECT: Los usuarios pueden ver las eliminaciones que realizaron
drop policy IF exists "review_deletions_select_own" on public.review_deletions;

create policy "review_deletions_select_own" on public.review_deletions for
select
  using (deleted_by = auth.uid ());

-- INSERT: Solo triggers del sistema pueden insertar (SECURITY DEFINER)
drop policy IF exists "review_deletions_system_insert" on public.review_deletions;

create policy "review_deletions_system_insert" on public.review_deletions for INSERT
with
  check (auth.role () = 'service_role');

-- ---------------------------------------------------------------------------
-- REVIEW_AUDIT: Políticas de auditoría de cambios
-- ---------------------------------------------------------------------------
-- SELECT: Los usuarios pueden ver auditoría de sus propias reseñas
drop policy IF exists "review_audit_select_own_reviews" on public.review_audit;

create policy "review_audit_select_own_reviews" on public.review_audit for
select
  using (
    exists (
      select
        1
      from
        public.reviews
      where
        reviews.id = review_audit.review_id
        and reviews.user_id = auth.uid ()
    )
  );

-- INSERT: Solo triggers del sistema pueden insertar (SECURITY DEFINER)
drop policy IF exists "review_audit_system_insert" on public.review_audit;

create policy "review_audit_system_insert" on public.review_audit for INSERT
with
  check (auth.role () = 'service_role');

-- ---------------------------------------------------------------------------
-- REAL_ESTATES: Políticas para inmobiliarias
-- ---------------------------------------------------------------------------
-- SELECT: Todos pueden ver inmobiliarias
drop policy IF exists "real_estates_select_public" on public.real_estates;

create policy "real_estates_select_public" on public.real_estates for
select
  using (true);

-- INSERT: Usuarios autenticados pueden crear inmobiliarias
drop policy IF exists "real_estates_insert_authenticated" on public.real_estates;

create policy "real_estates_insert_authenticated" on public.real_estates for INSERT
with
  check (
    auth.uid () is not null
    and (
      created_by = auth.uid ()
      or created_by is null
    )
  );

-- UPDATE: Solo el creador puede actualizar
drop policy IF exists "real_estates_update_creator" on public.real_estates;

create policy "real_estates_update_creator" on public.real_estates
for update
  using (
    auth.uid () is not null
    and (
      created_by = auth.uid ()
      or created_by is null
    )
  );

-- DELETE: Solo el creador puede eliminar
drop policy IF exists "real_estates_delete_creator" on public.real_estates;

create policy "real_estates_delete_creator" on public.real_estates for DELETE using (
  auth.uid () is not null
  and (
    created_by = auth.uid ()
    or created_by is null
  )
);

-- =============================================================================
-- VERIFICACIÓN: Listar todas las políticas activas
-- =============================================================================
do $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE '=== POLÍTICAS RLS CONSOLIDADAS ===';
    
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname, cmd, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public'
        ORDER BY tablename, cmd, policyname
    LOOP
        RAISE NOTICE 'Tabla: %, Política: %, Comando: %', 
            policy_record.tablename, 
            policy_record.policyname, 
            policy_record.cmd;
    END LOOP;
END $$;

-- =============================================================================
-- DOCUMENTACIÓN: Resumen de cambios
-- =============================================================================
COMMENT on POLICY "reviews_select_public" on public.reviews is 'Permite a todos (incluyendo anónimos) leer reseñas. Reemplaza: Anyone can view reviews, Public can read all reviews, Public can read reviews';

COMMENT on POLICY "review_votes_select_public" on public.review_votes is 'Permite a todos ver votos. Reemplaza: Anyone can view review_votes, Public can read votes, review_votes_select_all';

COMMENT on POLICY "review_votes_insert_own" on public.review_votes is 'Usuarios solo pueden votar con su propio user_id. Reemplaza: enable_insert_review_votes, Users can manage their own votes (INSERT)';


