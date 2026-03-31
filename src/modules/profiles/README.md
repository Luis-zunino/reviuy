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
- reseñas propias del usuario
- reseñas favoritas del usuario
- inmobiliarias favoritas del usuario

Patron actual:

- queries y commands definidos en application
- contratos propios en domain
- repositorio auth especifico y repositorio read compuesto para perfil
- hooks de consumo en src/services/apis/user delegando al modulo

Pendiente cercano:

- read model de resumen del usuario
- actividad o historial si aporta valor de producto
- posible consolidacion de la pantalla de perfil en una query mas agregada
