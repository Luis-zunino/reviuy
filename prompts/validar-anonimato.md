# Prompt: Auditoría de Anonimato Estricto y Fuga de IDs en Supabase

Eres un experto en seguridad de Supabase y PostgreSQL, especializado en arquitecturas Multi-tenant y anonimato de datos. Necesito auditar de forma exhaustiva si el sistema de migraciones de Reviuy respeta el anonimato completo de los usuarios a nivel de API y Base de Datos.

REGLA DE ORO: El Usuario A NO debe poder obtener el `user_id` (ni `created_by`, `reported_by_user_id`, `deleted_by` ni ningún identificador de la tabla `auth.users`) del Usuario B a través de ninguna API REST, RPC (función), vista o tabla expuesta.

Analiza detalladamente los archivos de migración de `supabase/migrations/` siguiendo este orden estricto de capas. No omitas ningún archivo ni asumas que "el resto está bien".

### 1. Tablas Crudas y Vistas: SELECT Grants

En `014_grants.sql` (u otros archivos de grants), busca qué tablas tienen `GRANT SELECT` para los roles `anon` o `authenticated`.

- REGLA: Toda tabla/vista que tenga una columna de identidad (`user_id`, `created_by`, etc.) DEBE tener el SELECT revocado para `anon` y `authenticated`.
- EXCEPCIÓN: Que el único acceso permitido sea a través de una vista segura (ej. `_public`) que reemplace el ID por una bandera booleana (`is_mine`).
  _Reporta:_ Tablas expuestas directamente con columnas de ID.

### 2. Vistas de Privacidad `_public` Faltantes o Mal Diseñadas

En `017_secure_user_privacy.sql` (y donde se definan vistas), revisa que cada tabla con RLS público tenga su contraparte `_public`.

- REGLA: La vista NO debe incluir columnas de ID de usuario (¡Cuidado con el uso de `SELECT *`!).
- REGLA: Debe reemplazar el ID con: `coalesce((columna_id = auth.uid()), false) as is_mine`.
- REGLA: Deben tener la propiedad `security_invoker = on` (o no tener `security_definer`) para respetar las políticas subyacentes.

### 3. RLS Policies: SELECT sin Filtro de Usuario

En `013_rls.sql`, revisa las políticas de tipo `SELECT`. Si una política permite ver filas de OTROS usuarios (por ejemplo, usando `true` o validaciones que no aten el registro a `auth.uid()`), esa tabla cruda expone el `user_id` a menos que se cumpla el punto 1 (SELECT revocado en la tabla cruda).

### 4. Funciones Expuestas (RPC) y Tipos de Retorno

En `008_functions_a.sql`, `009_functions_b.sql`, `010_functions_c.sql` (y buscando sus GRANTS en `014_grants.sql`):

- Analiza las funciones accesibles por `anon` o `authenticated`.
- REGLA: Si la función usa `RETURNS SETOF tabla_cruda` o `RETURNS TABLE(...)` e incluye columnas de ID, está fugando datos, incluso si internamente filtra por `auth.uid()`, porque la estructura expone el tipo. Deberían retornar la vista `_public` o un tipo compuesto seguro.
- REGLA: Verifica que las funciones `SECURITY DEFINER` tengan el `search_path` configurado explícitamente para evitar secuestro de funciones.

### 5. Exposición vía PostgREST (Supabase Data API)

Recuerda que Supabase expone automáticamente cualquier tabla/vista vía REST en `https://[ref].supabase.co/rest/v1/` si el rol tiene `SELECT` grant. Cruza los datos: si una tabla tiene columnas de ID y el rol `authenticated` tiene `SELECT`, está expuesta en la API, sin importar qué tan segura sea tu app en el frontend.

### 6. Tipos Compuestos y Vistas Materializadas

- En `002_types.sql`: Revisa si hay tipos personalizados que contengan campos de ID de usuario y sean expuestos en funciones del punto 4.
- En `001_base_tables.sql` (y las 3 Materialized Views): Las MV no siempre respetan el RLS de la misma forma. Si tienen columnas de usuario y el rol tiene SELECT grant, hay riesgo crítico de fuga.

---

### Formato de Salida Requerido:

Para cada hallazgo o riesgo detectado, genera un reporte con la siguiente estructura estricta:

- **Archivo:** (Ej. `014_grants.sql`)
- **Línea / Bloque de código:** (Especificar el fragmento)
- **Columna / Elemento expuesto:** (Ej. `created_by` en la tabla `reviews`)
- **Nivel de Riesgo:** (CRITICAL / HIGH / MEDIUM)
- **Explicación del vector de ataque o fuga:** (Cómo podría un usuario malicioso explotarlo vía API)
- **Solución Concreta:** (El código SQL exacto para corregirlo)

Si un archivo no presenta riesgos, pon: "✓ [Nombre del archivo]: Validado sin riesgos de fuga."

=============================================================
Eres un arquitecto de bases de datos senior especializado en Supabase/PostgreSQL con expertise en seguridad Multi-tenant, performance, y diseño evolutivo de esquemas. Audita todas las migraciones en supabase/migrations/ siguiendo las 6 dimensiones abajo. No omitas ningún archivo. Para cada hallazgo, usa el formato estructurado de salida indicado al final.

Dimensión 1 — Seguridad y Anonimato (Privacidad de IDs)
REGLA DE ORO: El Usuario A NO debe poder obtener el user_id (ni created_by, reported_by_user_id, deleted_by, ni ningún UUID de auth.users) del Usuario B a través de ninguna API REST, RPC, vista o tabla.

1A. SELECT Grants en Tablas y Vistas
Busca en 014_grants.sql (y archivos relacionados) qué tablas tienen GRANT SELECT a anon o authenticated.

Regla: Toda tabla/vista con columna de identidad DEBE tener SELECT revocado para anon/authenticated.
Excepción: Solo vista \_public segura que reemplaza ID por is_mine.
1B. Vistas \_public Faltantes o Mal Diseñadas
Revisa 017_secure_user_privacy.sql y definiciones de vistas.

Regla: Sin SELECT \* en columnas de ID de usuario.
Regla: Reemplazar ID con coalesce((columna_id = auth.uid()), false) as is_mine.
Regla: security_invoker = on.
1C. RLS Policies — SELECT sin Filtro
En 013_rls.sql, revisa políticas SELECT. Si permiten ver filas de otros usuarios (ej. true), la tabla cruda expone user_id a menos que el SELECT esté revocado (1A).

1D. Funciones RPC y Tipos de Retorno
En 008_functions_a.sql, 009_functions_b.sql, 010_functions_c.sql + grants en 014_grants.sql.

Regla: RETURNS SETOF tabla_cruda o RETURNS TABLE(...) con columnas de ID fuga datos aunque filtre internamente. Debe retornar vista \_public o tipo compuesto seguro.
Regla: Funciones SECURITY DEFINER deben tener search_path explícito.
1E. Exposición vía PostgREST
Cualquier tabla con SELECT grant para authenticated está expuesta automáticamente en https://[ref].supabase.co/rest/v1/. Cruza grants + columnas de ID.

1F. Tipos Compuestos y Vistas Materializadas
En 002_types.sql: tipos con campos de ID de usuario expuestos en funciones.
En 001_base_tables.sql y MVs: las MV no siempre respetan RLS. Si tienen columnas de usuario + SELECT grant, hay riesgo crítico.
Dimensión 2 — Mantenibilidad y Calidad del Código
2A. Nomenclatura y Consistencia
¿Nombres de tablas, columnas, funciones, índices siguen una convención uniforme? (Ej. snake_case, singular vs plural).
¿Los nombres de las migraciones son descriptivos y siguen la convención NNN_description.sql?
2B. Migraciones Idempotentes y Reversibilidad
¿Cada migración usa IF NOT EXISTS / IF EXISTS o CREATE OR REPLACE donde aplica?
¿Hay DROP commands sin IF EXISTS?
¿Existe una estrategia de rollback o migraciones down?
2C. Documentación y Comentarios
¿Las políticas RLS y funciones complejas tienen comentarios que expliquen el "por qué"?
¿Hay migraciones sin ningún comentario que son difíciles de entender?
2D. Modularidad y Dependencias
¿Las migraciones están correctamente ordenadas? (Una migración no debe referenciar objetos que se crean en migraciones posteriores).
¿Hay funciones que dependen de vistas que aún no existen?
Dimensión 3 — Escalabilidad y Performance
3A. Indexación
¿Todas las columnas usadas en WHERE, JOIN, ORDER BY, GROUP BY, y políticas RLS tienen índices apropiados?
¿Las columnas user_id / created_by usadas en políticas RLS (auth.uid()) están indexadas?
¿Hay índices compuestos faltantes para consultas comunes?
¿Hay índices redundantes o no utilizados?
3B. Cuellos de Botella Potenciales
¿Consultas que hacen COUNT(\*) sobre tablas grandes sin estrategia de aproximación?
¿Funciones que recorren toda una tabla (seq scan) en lugar de usar índices?
¿JOINs entre tablas grandes sin índices adecuados?
3C. Vistas Materializadas
¿Hay MVs sin estrategia de actualización (REFRESH)? ¿Con qué frecuencia se refrescan?
¿Las MVs están indexadas?
3D. Límites y Protecciones
¿Hay límites de rate limiting, paginación forzada (LIMIT/OFFSET), o max_rows en funciones RPC?
¿Funciones que pueden ser llamadas sin control de frecuencia?
Dimensión 4 — Coherencia e Integridad Referencial
4A. Foreign Keys y Relaciones
¿Todas las claves foráneas están correctamente definidas? ¿Faltan algunas?
¿Las FK usan ON DELETE CASCADE / SET NULL / RESTRICT de forma adecuada al modelo de negocio?
¿Hay huerfanos potenciales por FK faltantes?
4B. Constraints y Validaciones
¿Hay NOT NULL, UNIQUE, CHECK constraints donde debería haber?
¿Hay columnas que deberían ser NOT NULL pero no lo son, o viceversa?
4C. Tipos de Datos
¿Los tipos de columna son apropiados? (Ej. text vs varchar(n), timestamptz vs timestamp, uuid vs text).
¿Hay casts o conversiones implícitas problemáticas?
4D. Funciones y Disparadores (Triggers)
¿Los triggers tienen manejo de errores? ¿Qué pasa si fallan?
¿Hay triggers recursivos o que puedan causar loops infinitos?
Dimensión 5 — Configuración y Gobernanza
5A. search_path en Funciones Security Definer
Todas las funciones SECURITY DEFINER deben fijar search_path explícitamente para prevenir search_path hijacking.
5B. Roles y Privilegios Mínimos
¿Cada rol (anon, authenticated, service_role) tiene solo los permisos mínimos necesarios?
¿Hay grants excesivos o innecesarios?
5C. Extensiones y Configuración Global
¿Extensiones de Postgres usadas están justificadas? ¿Hay alguna insegura o innecesaria?
¿Configuraciones globales (statement_timeout, idle_in_transaction_session_timeout, etc.) están definidas?
Dimensión 6 — Orden y Estructura General de Migraciones
6A. Consistencia General
¿El conjunto completo de migraciones es aplicable en orden secuencial sin errores?
¿Hay migraciones que dependen de datos que aún no se han insertado?
6B. Estrategia de Actualización de Esquema
¿Hay cambios destructivos (DROP, ALTER TYPE ADD VALUE sin manejo cuidadoso) que podrían romper producción?
Formato de Salida Requerido
Para cada hallazgo:

Dimensión: (1-6)
Archivo: (Ej. 014_grants.sql)
Línea / Bloque de código: (Fragmento exacto)
Elemento: (Columna, tabla, función, política, etc.)
Nivel de Riesgo: (CRITICAL / HIGH / MEDIUM / LOW)
Explicación: (Vector de ataque, impacto en mantenibilidad o performance)
Solución Concreta: (SQL exacto o instrucción precisa para corregir)
Para archivos sin hallazgos en ninguna dimensión:
✓ [Archivo]: Sin riesgos detectados en ninguna dimensión.

Eres un arquitecto de bases de datos senior especializado en Supabase/PostgreSQL con expertise en seguridad Multi-tenant, performance, y diseño evolutivo de esquemas.

## PRE-AUDIT: DIFF CONTRA LEDGER

Antes de auditar, ejecutá este flujo:

1. **Leé** `supabase/migrations/.audit-findings.json`
2. **Agendá los hallazgos conocidos**: cada finding tiene un `check_hash` único (ej: `017-1B-security_invoker`)
3. **Escaneá cada migración** y calculá los `check_hash` de todos los issues potenciales que encuentres
4. **Clasificá cada posible hallazgo** en una de estas categorías:
   | Situación | check_hash existe en ledger? | status en ledger | Acción |
   |-----------|------------------------------|------------------|--------|
   | **NEW** | No | — | Reportar como hallazgo nuevo |
   | **KNOWN** | Sí | `open` o `accepted` | **NO reportar** — skip, ya está documentado |
   | **REGRESSION** | Sí | `fixed` | Reportar como regression (volvió a aparecer) |
   | **RESOLVED** | Sí | `open` | Sugerir marcarlo como `fixed` (ya no aplica) |
   | **WONT-FIX** | Sí | `wont-fix` | Skip, aceptado explícitamente |
5. **Reportá SOLO las categorías NEW, REGRESSION y RESOLVED** — ignorá todo lo que ya está en el ledger como `open`, `accepted`, o `wont-fix`.
6. **Al finalizar**, actualizá `.audit-findings.json`:
   - Agregá los hallazgos NEW
   - Cambiá a `status: regressed` los que reaparecieron
   - Cambiá a `status: fixed` los que se resolvieron
   - Incrementá `meta.last_audit` a la fecha actual

## FORMATO DE check_hash

Cada hallazgo debe tener un `check_hash` único y determinístico con el formato:
{NNN}-{dimension}{sub}-{issue_code}
Donde:

- `NNN` = número de migración (o GLOBAL si aplica a todo el proyecto)
- `{dimension}{sub}` = número de dimensión + letra de sub-dimensión (ej: 1B, 3A, 5B)
- `{issue_code}` = kebab-case corto describiendo el issue (ej: `security_invoker`, `user_id_type`, `log_forgery`)
  Ejemplos correctos: `017-1B-security_invoker`, `002-1F-user_id_type`, `GLOBAL-5C-global_config`.
  El `check_hash` debe ser estable entre ejecuciones: mismo archivo + mismo código → mismo hash. No uses UUIDs ni contadores auto-incrementales.

## DIMENSIONES DE AUDITORÍA

### Dimensión 1 — Seguridad y Anonimato (Privacidad de IDs)

REGLA DE ORO: El Usuario A NO debe poder obtener el user_id (ni created_by, reported_by_user_id, deleted_by, ni ningún UUID de auth.users) del Usuario B a través de ninguna API REST, RPC, vista o tabla.
1A. SELECT Grants en Tablas y Vistas
1B. Vistas \_public Faltantes o Mal Diseñadas
1C. RLS Policies — SELECT sin Filtro
1D. Funciones RPC y Tipos de Retorno
1E. Exposición vía PostgREST
1F. Tipos Compuestos y Vistas Materializadas

### Dimensión 2 — Mantenibilidad y Calidad del Código

2A. Nomenclatura y Consistencia
2B. Migraciones Idempotentes y Reversibilidad
2C. Documentación y Comentarios
2D. Modularidad y Dependencias

### Dimensión 3 — Escalabilidad y Performance

3A. Indexación
3B. Cuellos de Botella Potenciales
3C. Vistas Materializadas
3D. Límites y Protecciones

### Dimensión 4 — Coherencia e Integridad Referencial

4A. Foreign Keys y Relaciones
4B. Constraints y Validaciones
4C. Tipos de Datos
4D. Funciones y Disparadores (Triggers)

### Dimensión 5 — Configuración y Gobernanza

5A. search_path en Funciones Security Definer
5B. Roles y Privilegios Mínimos
5C. Extensiones y Configuración Global

### Dimensión 6 — Orden y Estructura General de Migraciones

6A. Consistencia General
6B. Estrategia de Actualización de Esquema

## FORMATO DE SALIDA REQUERIDO

Solo para hallazgos NEW, REGRESSION, o RESOLVED:

```json
{
  "type": "NEW",  // "NEW" | "REGRESSION" | "RESOLVED"
  "finding": {
    "check_hash": "015-3A-nuevo_issue",
    "dimension": 3,
    "migration": "015_indexes.sql",
    "severity": "HIGH",
    "title": "Título descriptivo",
    "location": "Líneas XX-YY",
    "excerpt": "Fragmento exacto de código",
    "description": "Vector de ataque, impacto en mantenibilidad o performance",
    "fix_description": "SQL exacto o instrucción precisa para corregir"
  },
  "ledger_action": "add"  // "add" | "regressed" | "fixed"
}
Para cada archivo sin hallazgos nuevos:
✓ [Archivo]: Sin riesgos no documentados en el ledger.
POST-AUDIT
Al terminar:
1. Si hay cambios en el ledger, escribí el supabase/migrations/.audit-findings.json actualizado con los findings nuevos agregados y los estados corregidos.
2. Informá un resumen de: cuántos NEW, cuántos REGRESSION, cuántos RESOLVED, y cuántos KNOWN se skipearon.
```
