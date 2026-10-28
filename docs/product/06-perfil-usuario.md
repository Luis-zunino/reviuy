# Flujo 06 — Perfil de usuario

## Propósito

Dar al usuario autenticado un único lugar para gestionar su actividad: sus reseñas publicadas, sus favoritos, y las acciones sensibles de la cuenta (incluido el borrado definitivo).

## Acceso

- Ruta: `/profile` (protegida por middleware).
- Entrada: menú hamburguesa → Perfil.
- Sin sesión activa: middleware redirige a `/login`; si igualmente se accede sin sesión válida, la página muestra el bloque "Acceso requerido".

## Estructura — 4 pestañas

Los datos se cargan en paralelo: resumen del usuario con sus reseñas, favoritos, inmobiliarias favoritas y contadores de cada pestaña.

### 1. Mis reseñas

- Lista de reseñas publicadas por el usuario.
- Cada tarjeta permite **Ver** el detalle o **Editar** la reseña.
- Estado vacío con llamado a la acción *"Crear tu primera reseña"*.

### 2. Favoritas (reseñas)

- Reseñas que el usuario marcó con el corazón desde cualquier detalle de reseña.
- El marcado/desmarcado es instantáneo y persistente; el título del botón alterna entre "Agregar a favoritos" y "Quitar de favoritos".

### 3. Inmobiliarias

- Inmobiliarias favoritas del usuario (marcadas desde el detalle de cada inmobiliaria).
- Acceso directo al detalle de cada una.

### 4. Configuración

Contiene la acción sensible de la cuenta:

## Borrado de cuenta

Es la operación más protegida del producto.

1. En Configuración, zona visualmente diferenciada (roja): **Eliminar cuenta**.
2. Diálogo de confirmación explícito. El texto aclara qué pasa con el contenido: **las reseñas publicadas permanecen**, anonimizadas (no desaparecen de la comunidad).
3. Al confirmar:
   - Se exige **sesión reciente**: si pasaron más de 30 minutos desde el último inicio de sesión real, se rechaza con *"Por seguridad, vuelve a iniciar sesión y reintenta eliminar tu cuenta."*
   - La operación está sujeta a límite anti-abuso (categoría sensible).
   - La cuenta se elimina definitivamente en el proveedor de autenticación.

### Reglas del borrado

| Regla | Detalle |
|---|---|
| Sesión ≤ 30 minutos | Obligatoria; es el equivalente a "re-autenticación" ya que no hay contraseñas |
| Contenido generado | Conservado y anonimizado |
| Reversibilidad | Ninguna: el borrado es definitivo |

## Excepciones comunes

| Situación | Comportamiento |
|---|---|
| Sesión vencida en ruta protegida | Middleware renueva la sesión si puede; si no, redirige a login con retorno |
| Borrado con sesión antigua (>30 min) | Error de seguridad; el usuario debe cerrar sesión e ingresar de nuevo |
| Error del servicio al borrar | Toast de error; la cuenta permanece intacta |

## Referencias técnicas

- Página: `src/app/(dashboard)/profile/page.tsx`
- Resumen de usuario: `getCurrentUserSummary` (módulo `profiles`)
- Favoritos: RPCs `toggle_favorite_review` / `toggle_favorite_real_estate`
- Borrado de cuenta: `DeleteAccountSection`, server action con `admin.deleteUser` (service role) y rate limit `sensitive`
