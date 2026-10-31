# Flujo 03 — Detalle de dirección e inmobiliaria

## Propósito

Presentar toda la información disponible sobre una dirección específica o una inmobiliaria: su reseñas, rating promedio y acciones disponibles (escribir reseña, favorito, reportar, votar utilidad).

Ambos detalles son **públicos**: se pueden leer sin iniciar sesión.

---

## A) Detalle de dirección — `/address/:osmId`

### Flujo principal (lectura)

1. El usuario llega desde el hero de la home, desde Explorar o desde un link de reseña.
2. La página muestra:
   - **Mapa compacto** con la ubicación de la dirección.
   - **Card resumen**: calle y número, barrio/ciudad, código postal.
   - **Rating promedio** (calculado sobre las reseñas existentes) + cantidad de reseñas.
   - **Listado "Últimas opiniones"** en grilla, ordenado de más reciente a más antigua. Cada tarjeta muestra:
     - Badge *"No recomiendo"* si el promedio es menor a 3.5 estrellas.
     - Estrellas, título, extracto de la reseña (3 líneas).
     - Fecha relativa (*"Hace 5 días"*) y votos de utilidad (likes/dislikes).
     - Botón **Ver más** → detalle completo de la reseña (`/review/:id/details`).
3. Si no hay reseñas: estado vacío *"Aún no hay reseñas para esta dirección"* con copy motivador.

### Acción: "Compartí tu experiencia"

El CTA principal del detalle valida antes de navegar:

| Situación | Comportamiento |
|---|---|
| Usuario anónimo | Redirige a `/login` |
| Ya tiene una reseña en esta dirección | Toast: *"Ya has reseñado esta propiedad. Solo puedes escribir una reseña por propiedad…"* |
| Puede reseñar | Navega al formulario `/review/create` (la dirección debe buscarse de nuevo dentro del formulario) |

### Excepciones

- Identificador OSM inválido o servicio de direcciones caído → página de error, aunque la dirección tenga reseñas (la información de dirección siempre viene del servicio externo, no de la base de datos).

### Reglas

- Listado completo sin paginación.
- Una sola reseña por usuario y dirección (regla dura; ver flujo 04).

---

## B) Detalle de inmobiliaria — `/real-estate/:id`

### Flujo principal (lectura)

1. El usuario llega desde el listado `/real-estate` (búsqueda/filtros en barra lateral, tarjetas con nombre + rating, carga incremental "cargar más").
2. La página muestra un **header** con:
   - Nombre de la inmobiliaria + rating promedio + cantidad de reseñas.
   - Botón de **favorito** (corazón, con texto dinámico agregar/quitar).
   - Botón **Reportar Inmobiliaria** (ver flujo 05).
   - Botón **"Crea tu reseña"** — se oculta si el usuario ya reseñó esta inmobiliaria.
   - Bloque de voto: *"¿Recomendarías esta inmobiliaria?"* con contadores de likes/dislikes y el voto propio.
3. Debajo, dos pestañas:
   - **Reseñas de usuarios**: reseñas dirigidas a la inmobiliaria. Cada una con Ver (detalle) y Editar si es propia.
   - **Experiencias en alquileres**: reseñas de propiedades donde intervino esa inmobiliaria, con dirección, fecha y enlace al detalle.

### Acciones de escritura (requieren sesión)

| Acción | Regla |
|---|---|
| Crear reseña de inmobiliaria | Anónimo recibe toast *"Debes iniciar sesión…"*; autenticado va al formulario. Un usuario tiene una sola reseña por inmobiliaria. |
| Favorito | Toggle persistente por usuario. |
| Voto utilidad | Un voto por usuario, modificable. |
| Reportar | Ver flujo 05. |

### Alta de inmobiliaria

Desde el listado (`CreateRealEstateModal`) o desde su estado vacío:

1. Usuario autenticado completa el nombre (máximo 100 caracteres, único).
2. Se crea vía RPC y aparece toast *"Inmobiliaria creada"*.

---

## Referencias técnicas

- Detalle dirección: `src/app/(dashboard)/address/[osmId]/page.tsx`, `src/components/features/Review/ViewAddressReviews/`
- Detalle inmobiliaria: `src/app/(dashboard)/real-estate/[realEstateId]/page.tsx`, `src/components/features/RealEstate/ViewRealEstateDetails/`
- Listado inmobiliarias: `src/app/(dashboard)/real-estate/page.tsx`
- Vistas públicas de datos: `reviews_with_votes_public`, `real_estate_reviews_with_votes_public`
