# Shared

Esta carpeta contiene capacidades compartidas entre modulos de dominio.

## Objetivo

Centralizar piezas transversales reutilizables sin convertirlas en un lugar ambiguo para logica de negocio.

## Subcarpetas Iniciales

- kernel: primitivas y tipos comunes de bajo nivel
- errors: contratos y helpers de error compartidos
- validation: componentes reutilizables de validacion
- auth: contratos y utilidades transversales de autenticacion y autorizacion
- observability: logging, tracing y metricas compartidas
- cache: contratos y adaptadores comunes de cache o rate limiting

## Regla Importante

Shared no debe absorber logica especifica de negocio.
Si una regla pertenece solo a un dominio, debe vivir dentro de su modulo.
