# Design: Load Testing Initiative

## Technical Approach

k6 OSS + k6 browser for 5 critical user journeys, running as parallel CI matrix jobs. Each journey is an isolated k6 script sharing auth, thresholds, and cleanup modules from `k6/shared/`. Test data seeded via SQL migration; `cleanup_test_data()` RPC purges after every run. Nominatim stubbed via cached JSON fixtures — no external API calls under load.

## Architecture Decisions

### Decision: CI Matrix per Journey

| Option                              | Tradeoff                                           | Decision |
| ----------------------------------- | -------------------------------------------------- | -------- |
| Single script, sequential scenarios | Total runtime ~45 min, exceeds 10-min budget       | ❌       |
| Single script, parallel scenarios   | Cannot mix browser+HTTP in one k6 instance         | ❌       |
| **CI matrix (5 parallel jobs)**     | Each job = 1 journey, wall time = longest (~9 min) | ✅       |

**Rationale**: GitHub Actions supports 20+ parallel runners. Each journey runs in isolation with its own k6 instance, so browser journeys (heavy) don't compete with HTTP journeys (light). Total wall time fits the 10-min cap.

### Decision: Seed Data via SQL Migration

| Option                                       | Tradeoff                                               | Decision |
| -------------------------------------------- | ------------------------------------------------------ | -------- |
| Node.js seed script with Supabase JS client  | Needs `@supabase/supabase-js` + service key runtime    | ❌       |
| **SQL migration** (`016_load_test_seed.sql`) | Deterministic, versioned, `supabase db reset`-friendly | ✅       |
| k6 `setup()` creating records via REST       | Slow, couples test logic with data prep                | ❌       |

**Rationale**: SQL migration runs once per staging environment, not per test run. Creates 20 users (`loadtest-{0..19}@reviuy.qa`), 50 real estates, 200 reviews. Idempotent via `on conflict do nothing`.

### Decision: k6 SharedArray for Auth Tokens

Auth tokens acquired in `setup()` and stored in a `SharedArray` — all VUs read, no race. The login journey uses password grant; others reuse cached tokens from an authenticated Supabase session cookie or bearer token. Rationale: avoids 50 simultaneous auth requests per journey.

### Decision: Nominatim Stubs as Static JSON Fixtures

Any Nominatim HTTP call made during load tests routes to `k6/fixtures/nominatim.json` via a k6 HTTP wrapper that intercepts the matching URL pattern and returns the fixture. Rationale: zero external dependency, deterministic responses, no rate-limit poisoning.

## Data Flow

```
            ┌─────────────────────────────────────────────────┐
            │              CI Runner (per journey)             │
            │                                                  │
  setup()   │  1. Validate env vars                            │
            │  2. Seed check (SKIP — migration handles it)     │
            │  3. Auth: login → cache token in SharedArray     │
            │                                                  │
  default() │  4. VUs iterate: HTTP request or browser action  │
            │  5. k6 records p50/p95/p99, RPS, errors          │
            │                                                  │
  teardown()│  6. POST /rest/v1/rpc/cleanup_test_data          │
            │  7. k6 exports HTML + JSON report                │
            │                                                  │
            └──────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐     ┌─────────────────┐
                    │  Supabase   │     │  GitHub Artifacts│
                    │  Staging    │     │  - HTML report   │
                    │  (seed data)│     │  - JSON summary  │
                    └─────────────┘     └─────────────────┘
```

## File Changes

| File                                         | Action | Description                                                 |
| -------------------------------------------- | ------ | ----------------------------------------------------------- |
| `k6/shared/config.js`                        | Create | Centralized thresholds, env var validation, export defaults |
| `k6/shared/auth.js`                          | Create | Password grant login, token caching via SharedArray         |
| `k6/shared/cleanup.js`                       | Create | Calls `cleanup_test_data()` RPC, logs result                |
| `k6/shared/nominatim-stub.js`                | Create | Returns fixture response for Nominatim URL patterns         |
| `k6/journeys/home.js`                        | Create | Browser journey: GET `/`, wait for property cards           |
| `k6/journeys/explore.js`                     | Create | Browser journey: search flow, wait for results              |
| `k6/journeys/login.js`                       | Create | HTTP journey: POST password grant, measure latency          |
| `k6/journeys/create-review.js`               | Create | HTTP journey: auth, POST review via Server Action           |
| `k6/journeys/review-detail.js`               | Create | HTTP journey: GET review page, validate response            |
| `k6/fixtures/nominatim.json`                 | Create | Cached OSM response fixtures                                |
| `k6/reports/.gitkeep`                        | Create | Output directory placeholder                                |
| `supabase/migrations/016_load_test_seed.sql` | Create | 20 users, 50 properties, 200 reviews                        |
| `supabase/cleanup-test-data.sql`             | Create | `cleanup_test_data()` RPC (or inline in migration 017)      |
| `.github/workflows/load-test.yml`            | Create | CI workflow: matrix, schedule, artifacts                    |
| `package.json`                               | Modify | Add `test:load` script entry                                |

## Interfaces / Contracts

```yaml
# Env vars required by k6 scripts
BASE_URL: 'https://staging.reviuy.app'
SUPABASE_URL: 'https://abc123.supabase.co'
SUPABASE_SERVICE_KEY: 'eyJ...service_role_key'
TEST_PASSWORD: 'LoadTestPass2024!'
```

```sql
-- RPC: cleanup_test_data — SECURITY DEFINER, service_role only
create or replace function cleanup_test_data()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Delete reviews + rooms by loadtest users
  delete from review_rooms
  where review_id in (
    select id from reviews r
    where r.user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa')
  );
  delete from reviews
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');
  delete from review_votes
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');
  -- Reset real estate counters
  update real_estates set review_count = 0, rating = 0;
  -- Clear rate limit entries
  delete from rate_limits
  where user_id in (select id from auth.users where email like 'loadtest-%@reviuy.qa');
end;
$$;
```

## Journey Execution Design

| Journey       | Type    | Steps                                         | Thresholds             | Key Scenario                |
| ------------- | ------- | --------------------------------------------- | ---------------------- | --------------------------- |
| Home          | browser | GET `/`, wait `[data-testid="property-card"]` | p95 < 3s, p99 < 4s     | ramp 10→50 VU / 2m, hold 5m |
| Explore       | browser | GET `/explore`, type "test property", wait    | API < 500ms, page < 3s | ramp 10→50 VU / 2m, hold 5m |
| Login         | HTTP    | POST `auth/v1/token?grant_type=password`      | p95 < 1s               | ramp 10→50 VU / 2m, hold 3m |
| Create Review | HTTP    | auth + GET property + POST Server Action      | SA < 1s, e2e < 5s      | ramp 10→30 VU / 1m, hold 3m |
| Review Detail | HTTP    | GET `/reviews/{id}`                           | page < 3s, API < 500ms | ramp 10→50 VU / 2m, hold 5m |

k6 options per journey: `thresholds` from shared config, `scenarios` with fixed `vus` and `stages`, `ext.loadimpact` for trend export.

## CI Workflow Structure

```yaml
name: Load Tests
on:
  schedule: [{ cron: '0 6 * * 1' }]
  workflow_dispatch:
jobs:
  seed-check:
    runs-on: ubuntu-latest
    steps: [checkout, pnpm install, pnpm exec supabase db push]
  load-test:
    needs: [seed-check]
    strategy:
      matrix:
        journey: [home, explore, login, create-review, review-detail]
    runs-on: ubuntu-latest
    container: grafana/k6:latest
    steps:
      - run: k6 run k6/journeys/${{ matrix.journey }}.js
      - uses: actions/upload-artifact@v4
        with:
          name: report-${{ matrix.journey }}
          path: k6/reports/${{ matrix.journey }}/
  notify:
    needs: [load-test]
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - run: echo "Load test threshold breach — check artifacts"
```

Threshold breach = k6 exits non-zero → GitHub check fails → notification triggers.

## Testing Strategy

| Layer                   | What to Test                           | Approach                             |
| ----------------------- | -------------------------------------- | ------------------------------------ |
| k6 script syntax        | Valid ES module imports                | `k6 run --dry-run k6/journeys/*.js`  |
| Cleanup RPC idempotency | Run twice, assert no errors            | SQL test via pgTAP or direct call    |
| Seed migration          | Row counts match spec                  | `select count(*)` assertions         |
| CI workflow             | Schedule trigger + artifacts           | `act` local runner or push to branch |
| Threshold enforcement   | Inject slow response, verify exit code | k6 `thresholds` test in isolation    |

## Open Questions

- [ ] Should the rate limit bypass (migration 015) extend to `loadtest-*` users, or should rate limiting be tested too? Proposal says "isolated Supabase" so bypass is safe.
- [ ] Do browser journeys need a visible `--headless` shell in the `grafana/k6` Docker image, or does the default Chromium headless mode work?
