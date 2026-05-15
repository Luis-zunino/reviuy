# Content Module

Owner funcional:

- tips
- faq
- buenas practicas
- contenido institucional

## Estructura

- application
- domain
- infrastructure
- presentation

## Estado Actual

Implementado actualmente:

- flujo de contacto desde API route hacia use case y repositorio del modulo

Pendiente cercano:

- queries de lectura para FAQ
- queries de lectura para tips o guias
- ownership de contenido institucional hoy disperso fuera del modulo

Alcance recomendado:

- usar este modulo como owner del contenido editorial o institucional, aunque la fuente inicial sea estatica
- evitar que componentes de UI queden atados a arrays hardcodeados o barrels sin ownership claro
