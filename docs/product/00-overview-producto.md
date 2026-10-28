# ReviUy — Visión general del producto

> Centro de la documentación de producto. Cada documento describe un flujo de usuario tal como funciona hoy en producción.

## Qué es ReviUy

ReviUy es una plataforma uruguaya de reseñas de alquileres, inmobiliarias y proveedores de garantías. Permite a inquilinos leer experiencias reales sobre direcciones específicas, las inmobiliarias que intervienen en esas operaciones, y los proveedores de garantías de alquiler, **antes** de firmar un contrato de alquiler.

La propuesta de valor central: *"Antes de alquilar, leé experiencias reales"*. El contenido lo genera la comunidad de inquilinos; la plataforma garantiza anonimato, moderación por reportes y una reseña honesta por propiedad.

## Usuarios objetivo

| Actor | Descripción |
|---|---|
| **Visitante anónimo** | Puede explorar el sitio completo: buscar direcciones, leer reseñas, ver inmobiliarias. No puede escribir reseñas, votar, reportar ni gestionar favoritos. |
| **Usuario autenticado (inquilino)** | Además de leer: escribe reseñas (1 por dirección), vota utilidad, marca favoritos, reporta contenido, contacta al equipo y elimina su cuenta. |
| **Moderador / equipo ReviUy** | No tiene panel dentro del producto. Recibe reportes por email y gestiona la moderación fuera de la app (RPC directo). |

## Mapa de flujos documentados

| # | Documento | Flujo |
|---|---|---|
| 1 | [01-autenticacion.md](01-autenticacion.md) | Login por magic link / Google, aceptación de términos, cierre de sesión |
| 2 | [02-explorar-busqueda.md](02-explorar-busqueda.md) | Explorar reseñas por zona o cercanía, búsqueda de direcciones |
| 3 | [03-detalle-inmueble.md](03-detalle-inmueble.md) | Detalle de dirección y detalle de inmobiliaria con sus reseñas |
| 4 | [04-crear-resena.md](04-crear-resena.md) | Crear, editar y eliminar reseñas (wizard de 3 pasos) |
| 5 | [05-moderacion-reportes.md](05-moderacion-reportes.md) | Reportar reseñas/inmobiliarias y ciclo de moderación |
| 6 | [06-perfil-usuario.md](06-perfil-usuario.md) | Mis reseñas, favoritos, configuración y borrado de cuenta |
| 7 | [07-contacto-contenido.md](07-contacto-contenido.md) | Contacto y contenido estático (tips, FAQ, buenas prácticas, legal) |
| 8 | [08-reputacion-usuario.md](08-reputacion-usuario.md) | Reputación y puntaje de usuario (karma, score, leaderboard) |
| 9 | [09-garantias.md](09-garantias.md) | Garantías de alquiler (explorar, comparar y reseñar proveedores) |
| 10 | [10-tips-usuario.md](10-tips-usuario.md) | Tips recomendados por usuarios (proponer, votar, comentar) |
| 11 | [11-terminos-aceptacion.md](11-terminos-aceptacion.md) | Aceptación y re-aceptación de términos (consentimiento vigente, auditoria) |

## Principios de producto observables

1. **Lectura libre, escritura autenticada**: todo el contenido de reseñas es público; cualquier acción de escritura exige sesión iniciada.
2. **Una reseña por usuario y dirección**: regla dura, validada en base de datos además de en la interfaz.
3. **Anonimato protegido**: las reseñas no exponen datos personales; el borrado de cuenta anonimiza pero conserva las reseñas publicadas.
4. **Direcciones reales de OpenStreetMap**: las direcciones no se cargan a mano; provienen siempre de Nominatim (OSM), limitado a Uruguay.
5. **Contenido controlado**: los textos libres pasan por validaciones anti-datos-personales, teléfonos y profanidad.

## Estado actual (limitaciones conocidas)

Estas son brechas visibles para el usuario hoy:

- No hay recuperación de contraseña (el acceso es solo magic link / Google, por eso no aplica).
- La subida de imágenes en reseñas existe en backend pero no está expuesta en la interfaz.
- No existe panel de moderación dentro de la app; la moderación se hace por fuera (email + RPC).
- Las reseñas de una dirección se listan completas, sin paginación.
- Algunos datos de la landing (reseñas destacadas, estadísticas, barrios más comentados) son contenido fijo de demostración, no datos reales.
- No existe sección de garantías de alquiler (Anda, Porto, etc.); el inquilino no puede explorar ni reseñar proveedores de garantía desde la plataforma.
- Los tips son contenido estático del equipo; los usuarios no pueden proponer, votar ni comentar nuevos tips.
- La re-aceptación de términos solo se verifica en el login; un usuario con sesión activa no es forzado a aceptar versiones nuevas de los T&C ni se audita el consentimiento.

## Navegación global

- **Navbar sticky**: Explorar · Inmobiliarias · Tips · FAQ · botón destacado "Escribir reseña" · selector de tema claro/oscuro · menú hamburguesa.
- **Menú de sesión**: autenticado ve Contáctanos, Perfil y Cerrar sesión; anónimo ve Iniciar sesión.
- **Footer**: Sobre nosotros, Contáctanos, Privacidad, Términos, Buenas prácticas.
- **Rutas protegidas** (redirigen a login si no hay sesión): `/profile`, `/review/create`, edición de reseñas, creación/edición de inmobiliarias y sus reseñas.
