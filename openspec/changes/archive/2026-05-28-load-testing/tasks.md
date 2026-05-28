# Tasks: Load Testing Initiative

## Review Workload Forecast

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: Medium

| Field                   | Value                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Estimated changed lines | ~705 (15 files: 11 new, 1 modified, 3 supporting)              |
| 400-line budget risk    | Medium — mostly k6 boilerplate that reviewers skim             |
| Chained PRs recommended | Yes                                                            |
| Suggested split         | PR 1 (Foundation) → PR 2 (Journeys) → PR 3 (CI + Verification) |
| Delivery strategy       | ask-on-risk                                                    |

### Suggested Work Units

| Unit | Goal                                       | Likely PR | Notes                                       |
| ---- | ------------------------------------------ | --------- | ------------------------------------------- |
| 1    | Shared modules + seed + cleanup + fixtures | PR 1      | Foundation; base → main                     |
| 2    | All 5 journey scripts                      | PR 2      | Base → main; k6 scripts follow same pattern |
| 3    | CI workflow + validation + dry-run         | PR 3      | Base → main; integration wiring             |

---

## Phase 1: Foundation (no deps, parallelizable)

- [ ] T1.1 Create `k6/shared/` modules: `config.js` (thresholds, env validation), `auth.js` (password grant + SharedArray), `cleanup.js` (RPC caller), `nominatim-stub.js` (fixture interceptor)
- [ ] T1.2 Create `supabase/migrations/016_load_test_seed.sql` — 20 users, 50 properties, 200 reviews, idempotent
- [ ] T1.3 Create cleanup RPC in `supabase/cleanup-test-data.sql` (or migration 017) — SECURITY DEFINER, deletes loadtest data
- [ ] T1.4 Create `k6/fixtures/nominatim.json` — cached OSM response fixtures
- [ ] T1.5 Create `k6/reports/.gitkeep` — output directory placeholder

## Phase 2: User Journeys (depends on shared modules)

- [ ] T2.1 Create `k6/journeys/home.js` — browser journey: GET `/`, wait `[data-testid="property-card"]`, enforce p95<3s/p99<4s/error<1%
- [ ] T2.2 Create `k6/journeys/explore.js` — browser journey: GET `/explore`, type "test property", wait results, enforce API<500ms/page<3s
- [ ] T2.3 Create `k6/journeys/login.js` — HTTP journey: POST password grant, cache token, enforce p95<1s
- [ ] T2.4 Create `k6/journeys/create-review.js` — HTTP journey: login → GET property → POST review SA, enforce SA<1s/e2e<5s
- [ ] T2.5 Create `k6/journeys/review-detail.js` — HTTP journey: GET `/reviews/{id}`, validate body, enforce page<3s/API<500ms

## Phase 3: CI & Integration (depends on journeys)

- [ ] T3.1 Create `.github/workflows/load-test.yml` — matrix per journey, weekly+manual trigger, container runner, artifact upload, notification on failure
- [ ] T3.2 Add `test:load` script to `package.json` — `k6 run` entry point for local execution
- [ ] T3.3 Dry-run validation — `k6 run --dry-run` on all 5 journey scripts, verify imports resolve and options parse

## Phase 4: Verification

- [ ] T4.1 Run all 5 journeys locally against staging, verify every threshold passes cleanly
- [ ] T4.2 Verify CI artifact output — HTML report + JSON summary produced per journey on manual dispatch

### Parallelization

| Tasks                        | Can run together  | Reason                                                                                       |
| ---------------------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| T1.1, T1.2, T1.3, T1.4, T1.5 | ✅ All Phase 1    | No deps between them; shared modules can be written independently from seed SQL and fixtures |
| T2.1–T2.5                    | ✅ Within Phase 2 | Journeys share same patterns, but each is an independent file; can be written in parallel    |
| T3.1, T3.2                   | ✅                | CI workflow and package.json change are independent                                          |
| T4.1, T4.2                   | ✅                | Local run and CI artifact check are independent verification paths                           |
