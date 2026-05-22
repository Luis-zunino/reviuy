-- =============================================================================
-- ROW LEVEL SECURITY - CONFIGURACIÓN FINAL (PRODUCCIÓN)
-- =============================================================================
-- =============================================================================
-- HABILITAR RLS EN TABLAS
-- =============================================================================
alter table public.reviews enable row level security;

alter table public.review_rooms enable row level security;

alter table public.review_votes enable row level security;

alter table public.review_reports enable row level security;

alter table public.review_deletions enable row level security;

alter table public.review_audit enable row level security;

alter table public.review_favorites enable row level security;

alter table public.real_estates enable row level security;

alter table public.real_estate_votes enable row level security;

alter table public.real_estate_reviews enable row level security;

alter table public.real_estate_review_votes enable row level security;

alter table public.real_estate_review_reports enable row level security;

alter table public.real_estate_favorites enable row level security;

alter table public.real_estate_reports enable row level security;

alter table public.rate_limits enable row level security;

alter table public.security_logs enable row level security;

-- =============================================================================
-- REVIEWS
-- =============================================================================
drop policy if exists reviews_select_public on public.reviews;

create policy reviews_select_public on public.reviews for
select
  using (deleted_at is null);

drop policy if exists reviews_insert_own on public.reviews;

create policy reviews_insert_own on public.reviews for insert
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy if exists reviews_update_own on public.reviews;

create policy reviews_update_own on public.reviews
for update
  using (
    user_id = auth.uid ()
    and deleted_at is null
  )
with
  check (user_id = auth.uid ());

drop policy if exists reviews_delete_own on public.reviews;

create policy reviews_delete_own on public.reviews for delete using (user_id = auth.uid ());

-- =============================================================================
-- REVIEW ROOMS
-- =============================================================================
drop policy if exists review_rooms_select_public on public.review_rooms;

-- NOTA: Se usa reviews_public (vista con SELECT grant) en lugar de reviews
-- (SELECT revocado de authenticated) porque las subconsultas en políticas RLS
-- se evalúan con permisos del usuario autenticado. reviews_public ya filtra
-- deleted_at IS NULL y reemplaza user_id por is_mine.
create policy review_rooms_select_public on public.review_rooms for
select
  using (
    exists (
      select
        1
      from
        public.reviews_public rp
      where
        rp.id = review_rooms.review_id
    )
  );

drop policy if exists review_rooms_manage_own on public.review_rooms;

create policy review_rooms_manage_own on public.review_rooms for all using (
  exists (
    select
      1
    from
      public.reviews_public rp
    where
      rp.id = review_rooms.review_id
      and rp.is_mine
  )
)
with
  check (
    exists (
      select
        1
      from
        public.reviews_public rp
      where
        rp.id = review_rooms.review_id
        and rp.is_mine
    )
  );

-- =============================================================================
-- REVIEW VOTES
-- =============================================================================
drop policy if exists review_votes_select_public on public.review_votes;

-- Solo mostrar votos propios. Los contadores agregados se obtienen
-- vía vistas _public (que corren como owner y bypasean RLS)
-- y funciones get_*_vote_counts (SECURITY DEFINER).
create policy review_votes_select_own on public.review_votes for
select
  using (user_id = auth.uid ());

drop policy if exists review_votes_insert_own on public.review_votes;

create policy review_votes_insert_own on public.review_votes for insert
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy if exists review_votes_update_own on public.review_votes;

create policy review_votes_update_own on public.review_votes
for update
  using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

drop policy if exists review_votes_delete_own on public.review_votes;

create policy review_votes_delete_own on public.review_votes for delete using (user_id = auth.uid ());

-- =============================================================================
-- REVIEW FAVORITES (NO PÚBLICO)
-- =============================================================================
drop policy if exists review_favorites_select_own on public.review_favorites;

create policy review_favorites_select_own on public.review_favorites for
select
  using (user_id = auth.uid ());

drop policy if exists review_favorites_insert_own on public.review_favorites;

create policy review_favorites_insert_own on public.review_favorites for insert
with
  check (user_id = auth.uid ());

drop policy if exists review_favorites_delete_own on public.review_favorites;

create policy review_favorites_delete_own on public.review_favorites for delete using (user_id = auth.uid ());

-- =============================================================================
-- REVIEW REPORTS
-- =============================================================================
drop policy if exists review_reports_select_own on public.review_reports;

create policy review_reports_select_own on public.review_reports for
select
  using (reported_by_user_id = auth.uid ());

drop policy if exists review_reports_insert_own on public.review_reports;

create policy review_reports_insert_own on public.review_reports for insert
with
  check (
    auth.uid () is not null
    and reported_by_user_id = auth.uid ()
  );

drop policy if exists review_reports_service_role_all on public.review_reports;

create policy review_reports_service_role_all on public.review_reports for all to service_role using (true);

-- =============================================================================
-- REVIEW DELETIONS (AUDITORÍA)
-- =============================================================================
drop policy if exists review_deletions_select_own on public.review_deletions;

create policy review_deletions_select_own on public.review_deletions for
select
  using (deleted_by = auth.uid ());

drop policy if exists review_deletions_system_insert on public.review_deletions;

create policy review_deletions_system_insert on public.review_deletions for insert
to service_role
with
  check (true);

-- =============================================================================
-- REVIEW AUDIT
-- =============================================================================
drop policy if exists review_audit_select_own on public.review_audit;

-- NOTA: Se usa reviews_public en lugar de reviews por la misma razón que
-- en las políticas de review_rooms. is_mine reemplaza user_id = auth.uid().
-- Audit entries de reviews eliminadas no son visibles (tradeoff aceptable).
create policy review_audit_select_own on public.review_audit for
select
  using (
    exists (
      select
        1
      from
        public.reviews_public rp
      where
        rp.id = review_audit.review_id
        and rp.is_mine
    )
  );

drop policy if exists review_audit_system_insert on public.review_audit;

-- Solo service_role puede insertar directamente. Las funciones SECURITY DEFINER
-- (como log_review_changes) bypasean RLS al ejecutarse como el owner (postgres).
create policy review_audit_system_insert on public.review_audit for insert to service_role
with
  check (true);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
drop policy if exists real_estates_select_public on public.real_estates;

create policy real_estates_select_public on public.real_estates for
select
  using (deleted_at is null);

drop policy if exists real_estates_insert_authenticated on public.real_estates;

create policy real_estates_insert_authenticated on public.real_estates for insert
with
  check (
    auth.uid () is not null
    and created_by = auth.uid ()
  );

drop policy if exists real_estates_update_creator on public.real_estates;

-- Solo el creador original puede actualizar. Inmobiliarias huérfanas (created_by IS NULL)
-- solo se modifican via service_role.
create policy real_estates_update_creator on public.real_estates
for update
  using (
    auth.uid () is not null
    and created_by = auth.uid ()
  )
  with check (
    auth.uid () is not null
    and created_by = auth.uid ()
  );

drop policy if exists real_estates_delete_creator on public.real_estates;

create policy real_estates_delete_creator on public.real_estates for delete using (
  auth.uid () is not null
  and created_by = auth.uid ()
);

-- =============================================================================
-- REAL ESTATE REVIEWS
-- =============================================================================
drop policy if exists real_estate_reviews_select_public on public.real_estate_reviews;

create policy real_estate_reviews_select_public on public.real_estate_reviews for
select
  using (deleted_at is null);

drop policy if exists real_estate_reviews_insert_own on public.real_estate_reviews;

create policy real_estate_reviews_insert_own on public.real_estate_reviews for insert
with
  check (
    auth.uid () is not null
    and user_id = auth.uid ()
  );

drop policy if exists real_estate_reviews_update_own on public.real_estate_reviews;

create policy real_estate_reviews_update_own on public.real_estate_reviews
for update
  using (
    user_id = auth.uid ()
    and deleted_at is null
  )
with
  check (user_id = auth.uid ());

drop policy if exists real_estate_reviews_delete_own on public.real_estate_reviews;

create policy real_estate_reviews_delete_own on public.real_estate_reviews for delete using (user_id = auth.uid ());

-- =============================================================================
-- REAL ESTATE FAVORITES (NO PÚBLICO)
-- =============================================================================
drop policy if exists real_estate_favorites_select_own on public.real_estate_favorites;

create policy real_estate_favorites_select_own on public.real_estate_favorites for
select
  using (user_id = auth.uid ());

drop policy if exists real_estate_favorites_insert_own on public.real_estate_favorites;

create policy real_estate_favorites_insert_own on public.real_estate_favorites for insert
with
  check (user_id = auth.uid ());

drop policy if exists real_estate_favorites_delete_own on public.real_estate_favorites;

create policy real_estate_favorites_delete_own on public.real_estate_favorites for delete using (user_id = auth.uid ());

-- =============================================================================
-- RATE LIMITS
-- =============================================================================
drop policy if exists rate_limits_select_own on public.rate_limits;

create policy rate_limits_select_own on public.rate_limits for
select
  using (user_id = auth.uid ());

drop policy if exists rate_limits_insert_own on public.rate_limits;

create policy rate_limits_insert_own on public.rate_limits for insert
to authenticated
with
  check (user_id = auth.uid ());

drop policy if exists rate_limits_update_own on public.rate_limits;

create policy rate_limits_update_own on public.rate_limits for update
to authenticated
using (user_id = auth.uid ())
with
  check (user_id = auth.uid ());

-- =============================================================================
-- SECURITY LOGS
-- =============================================================================
drop policy if exists security_logs_service_role on public.security_logs;

create policy security_logs_service_role on public.security_logs for
select
  to service_role using (true);

-- =============================================================================
-- POLÍTICAS FALTANTES - COMPLEMENTO A LA SEGUNDA VERSIÓN
-- =============================================================================
-- 1. REAL_ESTATE_VOTES
drop policy IF exists real_estate_votes_select_public on real_estate_votes;

-- Solo mostrar votos propios al usuario autenticado.
-- Contadores agregados vía vistas _public y funciones get_*_vote_counts.
create policy real_estate_votes_select_own on real_estate_votes for
select
  using (user_id = auth.uid ());

drop policy IF exists real_estate_votes_insert_own on real_estate_votes;

create policy real_estate_votes_insert_own on real_estate_votes for INSERT
with
  check (auth.uid () = user_id);

drop policy IF exists real_estate_votes_update_own on real_estate_votes;

create policy real_estate_votes_update_own on real_estate_votes
for update
  using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);

drop policy IF exists real_estate_votes_delete_own on real_estate_votes;

create policy real_estate_votes_delete_own on real_estate_votes for DELETE using (auth.uid () = user_id);

-- 2. REAL_ESTATE_REVIEW_VOTES
drop policy IF exists real_estate_review_votes_select_public on real_estate_review_votes;

-- Solo mostrar votos propios al usuario autenticado.
-- Contadores agregados vía vistas _public y funciones get_*_vote_counts.
create policy real_estate_review_votes_select_own on real_estate_review_votes for
select
  using (user_id = auth.uid ());

drop policy IF exists real_estate_review_votes_insert_own on real_estate_review_votes;

create policy real_estate_review_votes_insert_own on real_estate_review_votes for INSERT
with
  check (auth.uid () = user_id);

drop policy IF exists real_estate_review_votes_update_own on real_estate_review_votes;

create policy real_estate_review_votes_update_own on real_estate_review_votes
for update
  using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);

drop policy IF exists real_estate_review_votes_delete_own on real_estate_review_votes;

create policy real_estate_review_votes_delete_own on real_estate_review_votes for DELETE using (auth.uid () = user_id);

-- 3. REAL_ESTATE_REVIEW_REPORTS
drop policy IF exists real_estate_review_reports_select_own on real_estate_review_reports;

create policy real_estate_review_reports_select_own on real_estate_review_reports for
select
  using (reported_by_user_id = auth.uid ());

drop policy IF exists real_estate_review_reports_insert_own on real_estate_review_reports;

create policy real_estate_review_reports_insert_own on real_estate_review_reports for INSERT
with
  check (
    auth.uid () is not null
    and reported_by_user_id = auth.uid ()
  );

drop policy IF exists real_estate_review_reports_service_role_all on real_estate_review_reports;

create policy real_estate_review_reports_service_role_all on real_estate_review_reports for all to service_role using (true);

-- 4. REAL_ESTATE_REPORTS
drop policy IF exists real_estate_reports_select_own on real_estate_reports;

create policy real_estate_reports_select_own on real_estate_reports for
select
  using (reported_by_user_id = auth.uid ());

drop policy IF exists real_estate_reports_insert_own on real_estate_reports;

create policy real_estate_reports_insert_own on real_estate_reports for INSERT
with
  check (
    auth.uid () is not null
    and reported_by_user_id = auth.uid ()
  );

drop policy IF exists real_estate_reports_service_role_all on real_estate_reports;

create policy real_estate_reports_service_role_all on real_estate_reports for all to service_role using (true);

-- 5. OPCIONAL: Rate limits para el sistema
drop policy IF exists rate_limits_system_manage on rate_limits;

create policy rate_limits_system_manage on rate_limits for all to service_role using (true);