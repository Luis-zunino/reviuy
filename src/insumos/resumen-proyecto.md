https://ratethelandlord.org/

https://reviucasa.com/es

## Redacción del flujo y estructura del proyecto

### 1. **Layout principal**

Cuando el usuario ingresa a la plataforma, se encuentra con una interfaz limpia y clara, pensada para facilitar la búsqueda y creación de reseñas.

- **Barra de navegación superior:**

  - **Logo (lado izquierdo):** Funciona como botón de inicio, redirigiendo siempre al Home.
  - **Botón “Iniciar sesión” (lado derecho):** Lleva a la pantalla de autenticación.
  - **Botón “Crear reseña” (lado derecho):** Solo habilitado si el usuario está autenticado; de lo contrario, redirige primero al inicio de sesión.

- **Footer (parte inferior):** Enlaces a páginas legales (Términos, Privacidad).

---

**Elementos principales:**

### 1. **Pantalla principal (Home)**

- **Sección de búsqueda y filtros (parte superior del Home):**

  - **Campo de búsqueda principal:** Permite buscar por barrio, ciudad o palabra clave. Ademas tiene la posibilidad de buscar inmobiliarias donde se redirigia a un formulario diferente. Este ultimo se puede marcar dentro del input de búsqueda. Al momento de hacer click en los resultado que aparecen, se redirige a la página de detalles de la propiedad o de la inmobiliaria, segun haya marcado el usuario.
  Los campos a visualizar en el resultado son direccion, tipo de propiedad, zona, lugar, tu experiencia, etc.

- **Sección de reseñas destacadas:**

  - Lista de reseñas recientes o con mejor puntuación.
  - Cada tarjeta muestra: foto si tiene, título, ubicación, resumen de la experiencia y puntuación promedio.
  - Un botón “Ver más” lleva a la ficha completa de la reseña.

- **Sección de “Preguntas Frecuentes” (vista previa):**

  - Muestra preguntas comunes en formato desplegable.

- **Sección de “Tips para inquilinos y propietarios”:**

  - Presenta 3 consejos en tarjetas resumidas.
  - Un botón “Ver más” dirige a la pantalla completa de tips.
  - Un botón “Ver todas las preguntas” lleva a una pantalla dedicada.

- **Sección de “Creá tu propia reseña”:**
- Se muestra un botón para crear una reseña, el cual redirige a la pantalla de creacion en caso de que el usuario se encuentre logeado en caso contrario redirige a la pantalla de inicio de sesión.

---

### 2. **Pantalla de inicio de sesión / registro**

- **Formulario de autenticación:**

  - Email. Quiero que el usuario se registre o inicie sesion solo con su email, enviando un correo de confirmacion el cual redirige a la pantalla de creacion.
  - Opción de “¿No tienes cuenta? Regístrate aquí”.

- **Registro rápido:**

  - Email.
  - Aceptación de términos y condiciones.

---

### 3. **Pantalla de creación de reseña**

- **Formulario paso a paso:**

  1. **Datos de la propiedad:** ubicación se hara una busqueda segun palabras clave que ingrese el usuario, hasta que el usuario no haya ingresado una direccion valida no se habilitará el resto de campos.
  2. **Experiencia:** pros, contras, puntuación por categorías (ubicación, seguridad, etc.). Tipo de propiedad, experiencia, rating de la propiedad y de la zona.
  3. **Fotos opcionales.**
  4. **Confirmación y publicación.**

---

### 4. **Pantalla de reseña individual**

- Información completa de la propiedad y experiencia.
- Puntuación promedio y por categorías.
- Fotos subidas por usuarios.
- Botón para dar “Me gusta” o marcar como útil.

---

### 5. **Pantalla de Preguntas Frecuentes**

- Lista completa de preguntas con sus respuestas.
- Búsqueda interna por palabra clave.

---

### 6. **Pantalla de Tips**

- Listado completo de consejos y guías.
- Clasificación por categorías (ej. “Antes de alquilar”, “Durante la estadía”, “Seguridad”, etc.).

---
