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

La carpeta src/services/apis sigue existiendo, pero su rol esperado es cada vez mas fino: actuar como adaptador de React Query o de consumo cliente sobre casos de uso y query handlers definidos en src/modules.

Ejemplos actuales de adaptadores temporales:

- src/services/apis/address/\*.hook.ts delega a addresses
- src/services/apis/user/verifyAuthentication.hook.ts y hooks de current user delegan a profiles
- hooks en src/services/apis/reviews y src/services/apis/realEstates siguen encapsulando consumo cliente mientras la migracion se completa

La deuda pendiente no es volver a implementar estas capacidades, sino decidir cuales hooks deben permanecer como adaptadores de consumo y cuales ya pueden eliminarse o consolidarse.

## Pendiente Principal

- consolidar mas read models de profiles, por ejemplo resumen del usuario
- extender content hacia FAQ, tips y contenido institucional
- seguir eliminando dependencias legacy que hoy son solo adaptadores de consumo

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
