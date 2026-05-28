# Proposal: Load Testing Initiative

## Intent

Establish baselines and catch bottlenecks before production. Currently no load testing — platform behavior under concurrency is unknown. Target: p95 < 500ms (API) / < 3s (page load).

## Scope

### In Scope

- k6 toolchain (OSS + browser) for 5 critical user journeys
- Test data strategy: seeded Supabase records + cleanup RPC
- CI scheduled run with regression threshold enforcement

### Out of Scope

- Stress-to-failure, chaos engineering, bundle analysis, Lighthouse
- DB pooling tuning, Nominatim caching infra

## Capabilities

### New Capabilities

- `load-testing`: k6 scripts for critical user journeys with CI enforcement of latency, RPS, and error-rate thresholds.

### Modified Capabilities

- None

## Approach

- **Tool**: k6 + k6 browser for page journeys (home, explore); k6 HTTP for API flows (vote, create review).
- **Scenario**: ramp 10→50 VUs / 2 min, hold 5 min, ramp down. Isolated data per journey.
- **Metrics**: p50/p95/p99, error rate (<1%), RPS. Thresholds enforced in CI.
- **Where**: CI weekly + manual dispatch; local `k6 run`; staging env with isolated Supabase + Upstash.
- **Data**: 50 real estates, 200 reviews, 20 test users via seed migration. Cleanup RPC post-run.
- **Nominatim**: stubbed (cached fixture) to avoid external rate-limit poisoning.
- **Playwright baseline**: existing e2e instrumented with `page.metrics()` for first-load timing trends.

## Affected Areas

| Area                              | Impact                              |
| --------------------------------- | ----------------------------------- |
| `k6/`                             | New — scripts + helpers             |
| `.github/workflows/load-test.yml` | New — CI workflow                   |
| `supabase/seed.sql`               | Modified — test data                |
| `supabase/cleanup-test-data.sql`  | New — cleanup RPC                   |
| `package.json`                    | Modified — `test:load` script       |
| `e2e/`                            | Modified — Playwright perf baseline |

## Risks

| Risk                            | Likelihood | Mitigation                        |
| ------------------------------- | ---------- | --------------------------------- |
| Nominatim rate-limit poisoning  | High       | Stub in load tests                |
| Test data pollution in staging  | Low        | Cleanup RPC per run               |
| CI pipeline time blowout        | Med        | ≤10 min runs; schedule not per-PR |
| k6 browser CI resource overhead | Med        | Fallback to HTTP-only in CI       |

## Rollback Plan

Delete `k6/`, revert seed and package.json, remove CI workflow. Existing Playwright tests untouched.

## Dependencies

- k6 in CI (Docker `grafana/k6`)
- Staging Supabase with seed data
- `.env.test` with test credentials

## Success Criteria

- [ ] All 5 journeys run locally with clean threshold pass
- [ ] CI passes/fails on threshold breach
- [ ] Baseline document with p95 per journey produced
- [ ] PRs degrading p95 >20% are flagged
