-- =============================================================================
-- MIGRACIÓN 006: ROW LEVEL SECURITY
-- =============================================================================
-- Políticas de acceso a nivel de fila.
-- Principio: cada usuario ve/modifica solo sus propios datos.
-- INSERT: auth.uid() = user_id
-- UPDATE/DELETE: auth.uid() = user_id
-- SELECT: defense-in-depth (SELECT está revocado en 007, pero por si se re-grant)
--
-- NOTA: review_deletions y review_audit tienen políticas más restrictivas
-- (solo service_role puede insertar en audit, solo el usuario puede ver sus
-- propias eliminaciones).
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

create policy reviews_select_public on public.reviews
  for select
  using (deleted_at is null);

drop policy if exists reviews_insert_own on public.reviews;

create policy reviews_insert_own on public.reviews
  for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
  );

drop policy if exists reviews_update_own on public.reviews;

create policy reviews_update_own on public.reviews
  for update
  using (
    user_id = auth.uid()
    and deleted_at is null
  )
  with check (user_id = auth.uid());

drop policy if exists reviews_delete_own on public.reviews;

create policy reviews_delete_own on public.reviews
  for delete
  using (user_id = auth.uid());

-- =============================================================================
-- REVIEW VOTES
-- =============================================================================
-- Solo mostrar votos propios. Los contadores agregados se obtienen
-- vía vistas _public (que corren como owner y bypasean RLS)
-- y funciones get_*_vote_counts (SECURITY DEFINER).
drop policy if exists review_votes_select_own on public.review_votes;

create policy review_votes_select_own on public.review_votes
  for select
  using (user_id = auth.uid());

drop policy if exists review_votes_insert_own on public.review_votes;

create policy review_votes_insert_own on public.review_votes
  for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
  );

drop policy if exists review_votes_update_own on public.review_votes;

create policy review_votes_update_own on public.review_votes
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists review_votes_delete_own on public.review_votes;

create policy review_votes_delete_own on public.review_votes
  for delete
  using (user_id = auth.uid());

-- =============================================================================
-- REVIEW FAVORITES (NO PÚBLICO)
-- =============================================================================
drop policy if exists review_favorites_select_own on public.review_favorites;

create policy review_favorites_select_own on public.review_favorites
  for select
  using (user_id = auth.uid());

drop policy if exists review_favorites_insert_own on public.review_favorites;

create policy review_favorites_insert_own on public.review_favorites
  for insert
  with check (user_id = auth.uid());

drop policy if exists review_favorites_delete_own on public.review_favorites;

create policy review_favorites_delete_own on public.review_favorites
  for delete
  using (user_id = auth.uid());

-- =============================================================================
-- REVIEW REPORTS
-- =============================================================================
drop policy if exists review_reports_select_own on public.review_reports;

create policy review_reports_select_own on public.review_reports
  for select
  using (reported_by_user_id = auth.uid());

drop policy if exists review_reports_insert_own on public.review_reports;

create policy review_reports_insert_own on public.review_reports
  for insert
  with check (
    auth.uid() is not null
    and reported_by_user_id = auth.uid()
  );

drop policy if exists review_reports_service_role_all on public.review_reports;

create policy review_reports_service_role_all on public.review_reports
  for all
  to service_role
  using (true);

-- =============================================================================
-- REVIEW DELETIONS (AUDITORÍA)
-- =============================================================================
drop policy if exists review_deletions_select_own on public.review_deletions;

create policy review_deletions_select_own on public.review_deletions
  for select
  using (deleted_by = auth.uid());

drop policy if exists review_deletions_system_insert on public.review_deletions;

create policy review_deletions_system_insert on public.review_deletions
  for insert
  to service_role
  with check (true);

drop policy if exists review_audit_system_insert on public.review_audit;

-- Solo service_role puede insertar directamente. Las funciones SECURITY DEFINER
-- (como log_review_changes) bypasean RLS al ejecutarse como el owner (postgres).
create policy review_audit_system_insert on public.review_audit
  for insert
  to service_role
  with check (true);

-- =============================================================================
-- REAL ESTATES
-- =============================================================================
drop policy if exists real_estates_select_public on public.real_estates;

create policy real_estates_select_public on public.real_estates
  for select
  using (deleted_at is null);

drop policy if exists real_estates_insert_authenticated on public.real_estates;

create policy real_estates_insert_authenticated on public.real_estates
  for insert
  with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists real_estates_update_creator on public.real_estates;

-- Solo el creador original puede actualizar. Inmobiliarias huérfanas (created_by IS NULL)
-- solo se modifican via service_role.
create policy real_estates_update_creator on public.real_estates
  for update
  using (
    auth.uid() is not null
    and created_by = auth.uid()
  )
  with check (
    auth.uid() is not null
    and created_by = auth.uid()
  );

drop policy if exists real_estates_delete_creator on public.real_estates;

create policy real_estates_delete_creator on public.real_estates
  for delete
  using (
    auth.uid() is not null
    and created_by = auth.uid()
  );

-- =============================================================================
-- REAL ESTATE REVIEWS
-- =============================================================================
drop policy if exists real_estate_reviews_select_public on public.real_estate_reviews;

create policy real_estate_reviews_select_public on public.real_estate_reviews
  for select
  using (deleted_at is null);

drop policy if exists real_estate_reviews_insert_own on public.real_estate_reviews;

create policy real_estate_reviews_insert_own on public.real_estate_reviews
  for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
  );

drop policy if exists real_estate_reviews_update_own on public.real_estate_reviews;

create policy real_estate_reviews_update_own on public.real_estate_reviews
  for update
  using (
    user_id = auth.uid()
    and deleted_at is null
  )
  with check (user_id = auth.uid());

drop policy if exists real_estate_reviews_delete_own on public.real_estate_reviews;

create policy real_estate_reviews_delete_own on public.real_estate_reviews
  for delete
  using (user_id = auth.uid());

-- =============================================================================
-- REAL ESTATE FAVORITES (NO PÚBLICO)
-- =============================================================================
drop policy if exists real_estate_favorites_select_own on public.real_estate_favorites;

create policy real_estate_favorites_select_own on public.real_estate_favorites
  for select
  using (user_id = auth.uid());

drop policy if exists real_estate_favorites_insert_own on public.real_estate_favorites;

create policy real_estate_favorites_insert_own on public.real_estate_favorites
  for insert
  with check (user_id = auth.uid());

drop policy if exists real_estate_favorites_delete_own on public.real_estate_favorites;

create policy real_estate_favorites_delete_own on public.real_estate_favorites
  for delete
  using (user_id = auth.uid());

-- =============================================================================
-- REAL ESTATE VOTES
-- =============================================================================
-- Solo mostrar votos propios al usuario autenticado.
-- Contadores agregados vía vistas _public y funciones get_*_vote_counts.
drop policy if exists real_estate_votes_select_own on public.real_estate_votes;

create policy real_estate_votes_select_own on public.real_estate_votes
  for select
  using (user_id = auth.uid());

drop policy if exists real_estate_votes_insert_own on public.real_estate_votes;

create policy real_estate_votes_insert_own on public.real_estate_votes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists real_estate_votes_update_own on public.real_estate_votes;

create policy real_estate_votes_update_own on public.real_estate_votes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists real_estate_votes_delete_own on public.real_estate_votes;

create policy real_estate_votes_delete_own on public.real_estate_votes
  for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- REAL ESTATE REVIEW VOTES
-- =============================================================================
-- Solo mostrar votos propios al usuario autenticado.
-- Contadores agregados vía vistas _public y funciones get_*_vote_counts.
drop policy if exists real_estate_review_votes_select_own on public.real_estate_review_votes;

create policy real_estate_review_votes_select_own on public.real_estate_review_votes
  for select
  using (user_id = auth.uid());

drop policy if exists real_estate_review_votes_insert_own on public.real_estate_review_votes;

create policy real_estate_review_votes_insert_own on public.real_estate_review_votes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists real_estate_review_votes_update_own on public.real_estate_review_votes;

create policy real_estate_review_votes_update_own on public.real_estate_review_votes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists real_estate_review_votes_delete_own on public.real_estate_review_votes;

create policy real_estate_review_votes_delete_own on public.real_estate_review_votes
  for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- REAL ESTATE REVIEW REPORTS
-- =============================================================================
drop policy if exists real_estate_review_reports_select_own on public.real_estate_review_reports;

create policy real_estate_review_reports_select_own on public.real_estate_review_reports
  for select
  using (reported_by_user_id = auth.uid());

drop policy if exists real_estate_review_reports_insert_own on public.real_estate_review_reports;

create policy real_estate_review_reports_insert_own on public.real_estate_review_reports
  for insert
  with check (
    auth.uid() is not null
    and reported_by_user_id = auth.uid()
  );

drop policy if exists real_estate_review_reports_service_role_all on public.real_estate_review_reports;

create policy real_estate_review_reports_service_role_all on public.real_estate_review_reports
  for all
  to service_role
  using (true);

-- =============================================================================
-- REAL ESTATE REPORTS
-- =============================================================================
drop policy if exists real_estate_reports_select_own on public.real_estate_reports;

create policy real_estate_reports_select_own on public.real_estate_reports
  for select
  using (reported_by_user_id = auth.uid());

drop policy if exists real_estate_reports_insert_own on public.real_estate_reports;

create policy real_estate_reports_insert_own on public.real_estate_reports
  for insert
  with check (
    auth.uid() is not null
    and reported_by_user_id = auth.uid()
  );

drop policy if exists real_estate_reports_service_role_all on public.real_estate_reports;

create policy real_estate_reports_service_role_all on public.real_estate_reports
  for all
  to service_role
  using (true);

-- =============================================================================
-- RATE LIMITS
-- =============================================================================
drop policy if exists rate_limits_select_own on public.rate_limits;

create policy rate_limits_select_own on public.rate_limits
  for select
  using (user_id = auth.uid());

drop policy if exists rate_limits_insert_own on public.rate_limits;

create policy rate_limits_insert_own on public.rate_limits
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists rate_limits_update_own on public.rate_limits;

create policy rate_limits_update_own on public.rate_limits
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists rate_limits_system_manage on public.rate_limits;

create policy rate_limits_system_manage on public.rate_limits
  for all
  to service_role
  using (true);

-- =============================================================================
-- SECURITY LOGS
-- =============================================================================
drop policy if exists security_logs_service_role on public.security_logs;

create policy security_logs_service_role on public.security_logs
  for select
  to service_role
  using (true);

drop policy if exists security_logs_insert_authenticated on public.security_logs;

create policy security_logs_insert_authenticated on public.security_logs
  for insert
  to authenticated
  with check (user_id = auth.uid());
