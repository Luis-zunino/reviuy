# Flujo 04 — Crear, editar y eliminar reseñas

## Propósito

Capturar la experiencia de un inquilino sobre una dirección (y opcionalmente su inmobiliaria) mediante un asistente guiado de 3 pasos, garantizando calidad de contenido y la regla de **una reseña por usuario y dirección**.

## Actores y precondiciones

- Solo usuarios autenticados. Las rutas de creación/edición están protegidas: un anónimo es enviado a `/login?redirectTo=...`.
- El usuario no debe tener otra reseña en esa misma dirección.
- Punto de entrada típico: botón "Escribir reseña" del navbar o CTA "Compartí tu experiencia" en el detalle de una dirección.

## Flujo principal — Wizard de 3 pasos (`/review/create`)

### Paso 1 — General

Campos:

| Campo | Regla |
|---|---|
| Dirección | Búsqueda obligatoria sobre OpenStreetMap (solo Uruguay) + preview en mapa |
| Título | Entre 10 y 100 caracteres |
| Descripción | Entre 20 y 800 caracteres |
| Rating general | Obligatorio, de 1 a 5 estrellas |
| Tipo de propiedad | Apartamento / casa / habitación |

Validaciones automáticas sobre los textos libres: se bloquean datos personales, teléfonos, documentos y lenguaje ofensivo.

### Paso 2 — Características

- Confort de invierno y confort de verano (escalas).
- Humedad.
- Habitaciones: lista dinámica donde cada una define tipo + superficie en m². Si se completa uno de los dos datos, el otro pasa a ser obligatorio.

### Paso 3 — Inmobiliaria (opcional)

- Buscar y seleccionar una inmobiliaria existente, o crearla al vuelo desde el mismo selector.
- Se puede omitir.

### Navegación del wizard

1. "Siguiente" valida el paso actual; si falta algo → toast *"Por favor completa todos los campos requeridos"* y no avanza.
2. No se pueden saltear pasos.
3. Al publicar: se crea la reseña, se redirige al detalle de la dirección con confirmación.

## Reglas de negocio (duras)

| Regla | Aplicación |
|---|---|
| Una sola reseña por usuario y dirección | Prevenida en la UI antes de entrar al formulario y reforzada en base de datos. Error: *"Ya has publicado una reseña para esta propiedad…"* |
| Límite anti-spam | Máximo 5 publicaciones por usuario cada 10 segundos |
| Contenido sin datos personales | Bloqueo automático de teléfonos, documentos, etc. |
| Imágenes | El backend soporta subida (JPG/PNG/WebP hasta 15 MB, reprocesadas), pero hoy **no hay campo visible** para hacerlo |

## Editar reseña propia

1. Desde el detalle de una reseña propia o desde Perfil → Mis reseñas, el usuario entra a `/review/:id/edit`.
2. La ruta solo está disponible si la reseña le pertenece; reutiliza el mismo wizard precargado.
3. Al guardar, la reseña se actualiza.

## Eliminar reseña propia

1. En el detalle de una reseña propia aparece "Eliminar".
2. Diálogo de confirmación.
3. Confirmado → toast *"Reseña eliminada"* y regreso a la página anterior.

## Detalle de una reseña — `/review/:id/details`

Público para lectura. Muestra:

- Badge **"Recomendado"** si el rating es ≥ 3.5.
- Rating, título, descripción completa y características informadas.
- Acciones según quién mira:
  - Cualquier autenticado: marcar favorito, votar utilidad (likes/dislikes), reportar.
  - Autor: además editar y eliminar.

## Reseñas de inmobiliaria (variante)

Mismo modelo aplicado a inmobiliarias, con formulario propio:

- Creación: `/real-estate/:id/review/create` (protegida).
- Edición: `/real-estate/:id/review/:reviewId/update`.
- Un usuario tiene una sola reseña por inmobiliaria; el botón de crear desaparece si ya existe.

## Excepciones comunes

| Situación | Comportamiento |
|---|---|
| Anónimo intenta crear | Redirect a login con retorno al formulario |
| Ya reseñó esa dirección | Toast de advertencia; no entra al wizard |
| Paso incompleto | Toast de error, permanece en el paso |
| Dirección sin resultados en OSM | No puede avanzar: el campo dirección es obligatorio |

## Referencias técnicas

- Wizard: `src/components/features/Review/components/MultiForm/` (FirstForm, SecondForm, ThirdForm), navegación en `useMultiForm.hook.ts`
- Server action: `createReviewAction` (módulo `property-reviews`)
- RPC de creación: `create_review` (una reseña por usuario/dirección validada en `supabase/migrations/003_functions_core.sql`)
- Validación de textos: `textValidationRefinement`, schemas Zod en `src/schemas/`
