# Load Testing — Specification

## Purpose

Five critical user journeys tested with k6 + k6 browser. Ramp 10→50 VUs / 2 min, hold 5 min, ramp down. Thresholds: p95 < 500ms (API) / < 3s (pages), error < 1%.

## Requirements

### Requirement: Critical User Journeys

Each journey MUST execute under load and satisfy its thresholds. Test data MUST be isolated per journey.

| Journey       | Steps                                         | Data                     | Thresholds (p95)                       |
| ------------- | --------------------------------------------- | ------------------------ | -------------------------------------- |
| Home          | GET `/`, wait `[data-testid="property-card"]` | None                     | page < 3s, p99 < 4s                    |
| Explore       | GET `/explore`, type search, wait results     | 50 properties            | page < 3s (covers API latency via LCP) |
| Login         | POST Supabase password grant, extract token   | 20 test users            | auth < 1s                              |
| Create Review | Login, GET property, POST review SA           | 50 properties + 20 users | SA < 1s, e2e < 5s                      |
| Review Detail | GET `/reviews/{id}`, wait body                | 200 reviews              | page < 3s, API < 500ms                 |

All journeys: error rate < 1%, status 200 on every step.

#### Scenario: home loads under load

- GIVEN 10→50 VUs over 2 min
- WHEN all VUs request `/`
- THEN p95 < 3s AND error < 1%

#### Scenario: search returns under load

- GIVEN 50 seeded properties
- WHEN VUs search "test property" in browser
- THEN p95 page load < 3s (covers API latency via LCP) AND error < 1%
- NOTE: API latency is inherently included in page load LCP metric in k6 browser context
- NOTE: HTTP journeys can independently measure API latency where tagged thresholds are configured

#### Scenario: login succeeds under load

- GIVEN 20 test users with known credentials
- WHEN VUs authenticate
- THEN p95 auth < 1s AND error < 1%

#### Scenario: review created under load

- GIVEN authenticated user + seeded property
- WHEN VUs submit a valid review
- THEN p95 SA < 1s AND error < 1%

#### Scenario: detail loads under load

- GIVEN 200 seeded reviews
- WHEN VUs request review pages
- THEN p95 page < 3s AND error < 1%

### Requirement: Global Thresholds Enforced

| Metric                        | Threshold  | Applies To                       |
| ----------------------------- | ---------- | -------------------------------- |
| p95 page load                 | < 3s       | Browser journeys (home, explore) |
| p99 page load                 | < 4s       | Browser journeys (home)          |
| p95 API (search, review data) | < 500ms    | HTTP journeys (review-detail)    |
| p95 auth                      | < 1s       | Login journey                    |
| p95 Server Action             | < 1s       | Create review journey            |
| Error rate                    | < 1%       | All journeys                     |
| RPS under 50 VUs              | > 10 req/s | All journeys                     |

Note: Explore journey API latency is inherently measured through page load LCP in k6 browser — no independent API threshold is available. HTTP journeys (review-detail) have independently tagged API thresholds.

#### Scenario: CI fails on threshold breach

- GIVEN load test completes
- WHEN any threshold breached
- THEN CI exits non-zero AND breach reported in summary JSON

### Requirement: Test Data Strategy

Seed: 50 properties, 200 reviews, 20 users. `cleanup_test_data()` RPC MUST run after every execution. Nominatim MUST be stubbed with cached fixtures.

#### Scenario: cleanup removes test data

- GIVEN load test finishes
- WHEN `cleanup_test_data()` called
- THEN all test records MUST be deleted

### Requirement: Environment Configuration

| Env Var                | Required | Description          |
| ---------------------- | -------- | -------------------- |
| `BASE_URL`             | Yes      | Target URL           |
| `SUPABASE_URL`         | Yes      | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes      | Service role key     |
| `TEST_PASSWORD`        | Yes      | Test user password   |

#### Scenario: missing env var fails fast

- GIVEN required var is unset
- WHEN test initializes
- THEN MUST exit non-zero with descriptive message

### Requirement: CI Integration

Schedule: weekly (Mon 06:00 UTC) + `workflow_dispatch`. Runner: `grafana/k6` Docker. Max run: 10 min. Artifacts: HTML report, JSON summary, trend data. Notification: GitHub check.

#### Scenario: weekly run produces artifacts

- GIVEN scheduled trigger
- WHEN CI completes
- THEN HTML report AND JSON summary MUST be uploaded

## Out of Scope

- Stress-to-failure, chaos engineering, bundle analysis, Lighthouse/CWV
- DB pooling tuning, Nominatim caching infra
