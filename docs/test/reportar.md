# Testeo del flujo — Reportar contenido (reseñas / inmobiliarias)

> Flujo: usuarios reportan reseñas o inmobiliarias con un motivo; los reportes quedan auditados y solo moderan vía `moderate_reports` (service_role). Vía API routes `/api/report-*` y server actions de moderation.

## Arquitectura del flujo (objeto de test)

```
UI → server action  ┐
API → /api/report-* ┴→ createReportXUseCase → rateLimit('report-*:<userId>', 'sensitive')
                                              → RPC report_review / report_real_estate
                                              → tabla reportes + security_logs (Trigger M3)
service_role → moderate_reports (único rol habilitado)
```

## Reglas de negocio (M3)

- El autor **no** puede reportar su propio contenido (`success:false`).
- Un usuario solo tiene un reporte por contenido (unique constraint — doble reporte bloqueado).
- Cada reporte escribe a `security_logs` (auditoría con endpoint, ip y extra info).

## Prerequisitos

- 2 usuarios: **A** (autor) y **B** (reportante). Reseña e inmobiliaria propias de A.

## 1. Reporte de reseña — manual

1. Con B logueado, abrir la reseña de A → "Reportar" → elegir motivo (`spam`) con descripción.
2. ✅ Submit exitoso: toast de confirmación; fila en `review_reports` (status nuevo/pending).
3. Verificar auditoría: `select * from security_logs order by created_at desc` → registro del endpoint con user y justificación.

## 2. Fail paths — verificación (casos cubiertos por verify-services)

| Situación | Resultado esperado |
|---|---|
| Reportar la **propia** reseña | bloqueado (`success:false`, M3) + toast — verify-services lo cobra como asserts |
| B reporta la reseña 2 veces (mismo motivo u otro) | bloqueado **unique constraint** (`success:false`) |
| Sin sesión | la API route devuelve `UNAUTHORIZED` (`getAuthenticatedUser()` null) — nunca inserta |
| 4º reporte en < 1h | bloqueado por Redis `sensitive` 3/1h con la key correcta |
| Payload fuera de los motivos del enum | rechazo del api schema (`reportReviewApiSchema`) |
| Moderar con B (authenticated) | `moderate_reports` bloqueado por grant — only `service_role` |

## 3. Server actions de moderación (real-restates)

Verificar que B puede reportar la inmobiliaria de A, pero:
- No la suya propia (M3).
- No 2 veces (unique).
- No su propia review de inmobiliaria (M3, igual comportamiento).

## 4. Rate limit (clave correcta)

| Contenido | Key | Scope |
|---|---|---|
| report_review | `report-review:<userId>` | `sensitive` 3/1h |
| report_real_estate | `report-real-estate:<userId>` | `sensitive` 3/1h |
| report_real_estate_review | `report-real-estate-review:<userId>` | `sensitive` 3/1h |

Verificar en Upstash después de un reporte: la key con TTL ≤ 1h.

## 5. Cobertura en suites

| Nivel | Suite / comando | Qué cubre |
|---|---|---|
| Unit | `report-review.use-case.test.ts` (+ los 3 de real estate) | rate limit, orden de reglas (self → unique → rate), auditoría |
| Unit | `reportReview.hook.test.ts`, `reportRealEstate*` | hooks de la UI |
| E2E | `e2e/specs/contact.spec.ts` (misma ruta de email) | recovery para reportes en CI — luchar por specs nuevos (F2-04 del plan) |
| Integración DB | `pnpm test:services` → "report_review: A NO puede reportar su propia review (M3)", "B reporta review ajena (spam) — OK", "reporte doble bloqueado por unique", "moderate_reports solo service_role" | reglas server-side contra DB de staging |

## 6. Qué NO debe ser posible

- Insertar directo en `review_reports`/`security_logs` vía REST con authenticated (bloqueado — verify-services: "REST INSERT security_logs bloqueado (S2)").
- exponer campos de moderación (`reported_by`) a usuarios no-moderadores vía las vistas `_public` (chequear columnas de `reviews_public`).

## 6. Casos borde y subflujos — exhaustiva (reportes)

### 6.1 Motivos y payload

| # | Caso | Resultado esperado |
|---|---|---|
| R1 | Motivo válido del enum (`spam` etc.) | insert con status inicial |
| R2 | Motivo inválido o fuera del enum | rechazo del schema (`reportReviewApiSchema`) antes del RPC |
| R3 | Description muy larga (bajo el max del schema) | según límite del schema ⏳ |
| R4 | Description vacía (si es opcional) | permitida según el schema ⏳ |
| R5 | `review_uuid` inexistente | RPC rechaza (no se registra un reporte fantasma) |

### 6.2 Permisos

| # | Caso | Resultado esperado |
|---|---|---|
| R6 | Reportar la reseña propia | bloqueado (M3) — verify-services |
| R7 | Reporte duplicado por mismo user (content) | unique constraint → `success:false` |
| R8 | Anon | API routes exigen sesión (`getAuthenticatedUser`) |
| R9 | Forzar insert REST a `review_reports`/`security_logs` | bloqueado (S2) |

### 6.3 Rate limits y colas

| # | Caso | Resultado esperado |
|---|---|---|
| R10 | 3 reportes en 1h (keys por user, grafico por flow: `review`/`real-estate`) | pasan |
| R11 | 4to en la hora | bloqueado por Redis `sensitive` — incluso si es sobre un contenido distinto (key es por usuario) |
| R12 | Ventana nueva (>1h) | reseteados los 3 slots |
| R13 | Moderación por un authenticated simulando panel | `moderate_reports` bloqueado por grant (solo service_role) |
| R14 | Moderar con status inválido | rechazo del RPC (enum de status) ⏳ |

### 6.4 Estados de datos

| # | Caso | Resultado esperado |
|---|---|---|
| R15 | Reportar contenido ya soft-deleted | rechazado por el RPC ⏳ |
| R16 | Registro en `security_logs` | endpoint/ip/justificación del M3 capturada |
| R17 | Moderar resuleve: status persiste | `moderate_reports` actualiza el row de los reports |

## Referencias técnicas

- Use-cases: `src/modules/moderation/application/commands/report-{review,real-estate,real-estate-review,real-estate-by-name}.use-case.ts`
- API: `src/app/api/report-review/route.tsx`, `report-real-estate/`, `report-real-estate-review/` (+ `createSupabaseServerClient + getAuthenticatedUser`)
- DB: RPCs `report_review` / `report_real_estate` (+ security_logs) — migraciones `003_functions_core.sql`, `011_audit_fixes.sql` (M3)
- Rate: scope `sensitive` 3/1h en `src/lib/redis/rate-limit.ts`
