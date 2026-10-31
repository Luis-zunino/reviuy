# Flujo 02 — Explorar y búsqueda

## Propósito

Que cualquier visitante (sin login) descubra reseñas de propiedades de dos maneras: **cerca de su ubicación actual** o **por nombre de barrio/zona**, y que pueda saltar de una búsqueda directa de dirección al detalle de la misma.

## Actores

- Visitante anónimo o autenticado (idéntico comportamiento)
- Servicios externos: OpenStreetMap (Nominatim) para direcciones y geocodificación inversa; navegador para geolocalización

## Puntos de entrada

| Entrada | Comportamiento |
|---|---|
| Hero de la home `/` | Buscador de direcciones: al elegir un resultado navega directo a `/address/:osmId` |
| Menú → Explorar (`/explorar`) | Panel de exploración por zona o cercanía |
| Menú → Inmobiliarias (`/real-estate`) | Listado público de inmobiliarias (ver flujo 03) |

## Explorar por zona (`/explorar`)

### Estado inicial

Ilustración con lupa y copy: *"Explora reseñas por zona — Usá tu ubicación actual o escribí un barrio…"*. Sin mapa ni resultados hasta que el usuario actúa.

### Modo A — Búsqueda por barrio

1. El usuario escribe el nombre de una zona/barrio en el buscador.
2. A partir de 3 caracteres se dispara la búsqueda automáticamente (con espera de 500 ms tras dejar de tipear).
3. Se listan las reseñas cuya dirección coincide con esa zona, junto con un mapa centrado en los resultados.
4. Cada tarjeta de resultado permite abrir el detalle completo de la reseña.

### Modo B — Cerca de mí

1. El usuario presiona "Usar mi ubicación".
2. El navegador pide permiso de geolocalización.
3. Si otorga permiso: se muestran las reseñas dentro del área circundante, el mapa se centra en su posición y una etiqueta muestra el barrio/ciudad detectado (geocodificación inversa).
4. Si niega permiso o falla: mensaje *"No fue posible obtener tu ubicación…"* y vuelve al estado inicial.

### Excepciones comunes

- Zona con menos de 3 caracteres → no busca.
- Sin resultados / error de servicio → estado vacío o de error, sin romper la página.
- Botón "Limpiar" restablece el panel a su estado inicial.

## Búsqueda de direcciones (usada en home y formulario de reseña)

El componente de búsqueda de direcciones funciona igual en todo el producto:

1. El usuario tipea una dirección.
2. Con más de 7 caracteres se consulta Nominatim (OpenStreetMap) **limitado a Uruguay**, máximo 5 resultados.
3. Se muestra un desplegable con los nombres completos de las coincidencias (ej: *"Avenida Brasil 1234, Pocitos, Montevideo, Uruguay"*). Debounce de 1 segundo mientras tipea.
4. Al seleccionar, el sistema guarda dirección, identificador OSM y coordenadas.
5. En el formulario de reseña aparece además un **preview de mapa** con la dirección elegida.

Reglas importantes:

- **No existe alta manual de direcciones.** La única fuente es Nominatim. Si no hay resultados, el usuario ve *"No se encontraron resultados"* y no puede continuar (en el formulario de reseña el campo es obligatorio).
- Una dirección "existe" en ReviUy solo cuando alguien publica una reseña sobre ella; el alta es implícita a ese paso.
- Errores de Nominatim fallan en silencio (lista vacía), nunca con error técnico al usuario.

## Reglas de negocio

- Toda la lectura es pública: explorar y buscar no requieren sesión.
- Las búsquedas de direcciones están acotadas geográficamente a Uruguay.
- El mapa usa teselas de OpenStreetMap.

## Referencias técnicas

- Página explorar: `src/app/(dashboard)/explorar/page.tsx`
- Lógica de exploración: `src/components/features/Review/ExploreReviews/hooks/useExploreReviews.hook.ts`
- Buscador de direcciones: `src/components/common/AddressSearchInput/`, query en `src/modules/addresses/application/queries/search-address-by-name.query.ts`
- Repositorio Nominatim: `src/modules/addresses/infrastructure/repositories/nominatim-address-read.repository.ts`
