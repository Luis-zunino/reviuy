# Profiles Module

Owner funcional:

- resumen del usuario
- reseñas propias
- favoritos
- configuracion y acciones sensibles de cuenta

## Estructura

- application
- domain
- infrastructure
- presentation

## Estado Actual

Implementado actualmente:

- verificacion de autenticacion
- lectura de sesion actual
- eliminacion de cuenta con validaciones de seguridad y rate limit
- resumen agregado del usuario
- reseñas propias del usuario
- reseñas favoritas del usuario
- inmobiliarias favoritas del usuario

Patron actual:

- queries y commands definidos en application
- contratos propios en domain
- repositorio auth especifico y repositorio read compuesto para perfil
- hooks de consumo y lectura expuestos desde presentation del modulo

Pendiente cercano:

- actividad o historial si aporta valor de producto
- posible consolidacion de la pantalla de perfil en una query mas agregada
