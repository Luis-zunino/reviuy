# Modules

Esta carpeta introduce la estructura objetivo por dominio para la evolucion arquitectonica de ReviUy.

## Objetivo

Separar el sistema por bounded contexts y no por tipo tecnico global.
La migracion es incremental: el codigo legacy puede seguir conviviendo fuera de esta carpeta mientras se mueve por verticales.

## Regla De Dependencias

- presentation puede depender de application
- application puede depender de domain
- infrastructure implementa contratos definidos por application o domain
- domain no depende de Next.js, React, Supabase ni proveedores externos

## Estructura Base

Cada modulo sigue esta forma:

- application: casos de uso, commands, queries y DTOs
- domain: entidades, value objects, politicas, eventos y puertos
- infrastructure: repositorios, gateways y adapters concretos
- presentation: entrypoints del framework, mappers y wiring de UI

## Modulos Iniciales

- addresses
- property-reviews
- real-estates
- moderation
- profiles
- content

## Estado Actual

La carpeta ya no es solo un scaffold.

Estado consolidado a marzo de 2026:

- property-reviews migrado en comandos y lecturas principales
- real-estates migrado en comandos y lecturas principales
- addresses activo para busqueda por nombre y detalle de direccion
- moderation activo para reportes desde server actions y API routes
- profiles activo para auth, session, delete-account, reseñas propias y favoritos
- content activo para el flujo de contacto

Todavia coexiste codigo legacy fuera de esta carpeta.
La migracion sigue siendo incremental: nuevos slices deben nacer aqui y los entrypoints existentes deben ir delegando progresivamente a estos modulos.

## Estado Por Modulo

| Modulo           | Estado  | Alcance actual                                                 |
| ---------------- | ------- | -------------------------------------------------------------- |
| addresses        | activo  | busqueda por nombre y detalle de direccion                     |
| property-reviews | activo  | commands y lecturas principales de reseñas                     |
| real-estates     | activo  | commands y lecturas principales de inmobiliarias y sus reseñas |
| moderation       | activo  | reportes desde actions y API routes                            |
| profiles         | activo  | auth, session, delete-account, reseñas propias y favoritos     |
| content          | parcial | contacto implementado; FAQ, tips e institucional pendientes    |

## Adaptadores Legacy Temporales

La carpeta src/services ya fue retirada por completo.

Estado actual esperado:

- la logica transversal reutilizable debe vivir en shared
- las query keys compartidas deben vivir en constants
- los hooks de dominio deben vivir en presentation del modulo owner
- el contenido estatico owner de un dominio puede vivir en data dentro del modulo owner

Migraciones ya consolidadas:

- src/shared/auth/useAuthMutation.hook.ts como helper compartido para mutaciones autenticadas
- src/modules/content/presentation/useSendContactMessage.hook.ts para contacto
- src/modules/content/data/tips.mock.ts para tips y contenido estatico del dominio
- src/modules/moderation/presentation/useSendReport\*.hook.ts para reportes
- src/modules/real-estates/presentation/toggleFavoriteRealEstate.hook.ts y useInfiniteRealEstates.hook.ts
- src/modules/property-reviews/presentation/useToggleFavoriteReview.hook.ts
- src/constants/queryKeys.constants.ts para query keys compartidas entre modulos

La deuda pendiente ya no es retirar adaptadores legacy, sino seguir consolidando ownership claro por dominio y evitar reintroducir barrels transversales innecesarios.

## Pendiente Principal

- extender content hacia FAQ, tips y contenido institucional
- seguir moviendo activos o utilidades al modulo owner correcto cuando aparezcan nuevos casos

## Glosario de Capas

Detalle de lo que se espera encontrar en cada subdirectorio de un modulo:

### Domain (Dominio)

El nucleo de la logica de negocio, aislado de detalles tecnicos.

- **entities**: Objetos con identidad y estado mutable.
- **value-objects**: Objetos inmutables definidos por sus atributos.
- **ports**: Interfaces que definen contratos para repositorios y servicios (Inversión de Dependencia).
- **events**: Definicion de eventos de dominio.
- **policies**: Reglas de negocio o validaciones complejas.

### Application (Aplicacion)

Orquestacion de casos de uso y coordinacion del dominio.

- **use-cases**: Implementacion de flujos especificos (interactors).
- **commands**: Objetos de intencion de escritura (CQRS).
- **queries**: Objetos de solicitud de lectura (CQRS).
- **dtos**: Objetos de transferencia de datos para desacoplar capas.

### Infrastructure (Infraestructura)

Implementaciones tecnicas concretas.

- **repositories**: Acceso a datos (Supabase) implementando puertos del dominio.
- **adapters**: Adaptadores de servicios externos.
- **mappers**: Transformadores entre modelos de persistencia y dominio.

### Presentation (Presentacion)

Puntos de entrada y adaptadores para la UI (Next.js).

- **actions**: Server Actions para invocar casos de uso.
- **hooks**: Hooks de React para consumo de datos.
- **view-models**: Modelos optimizados para la vista.
