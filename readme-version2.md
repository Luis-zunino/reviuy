---
Inspirado en: https://reviucasa.com/es
## 🏠 Proyecto: Plataforma de Reseñas de Propiedades en Alquiler

### 🎯 Objetivo

Permitir que los usuarios puedan dejar opiniones, experiencias y calificaciones sobre propiedades (apartamentos o casas) que hayan alquilado, vinculadas a **una dirección específica**. El sistema estará basado en un **mapa interactivo** con reseñas geolocalizadas, calificaciones por ubicación y un sistema de evaluación comunitaria mediante likes/dislikes.

---

## 🔁 Flujos Principales del Usuario

1. **Explorar reseñas en el mapa**
2. **Consultar reseñas de una dirección específica**
3. **Leer el detalle de una experiencia de alquiler**
4. **Calificar si una reseña fue útil o no (like/dislike)**
5. **Agregar una nueva reseña vinculada a una dirección**
6. **Ver resumen por zona (ranking por barrio o ciudad)**

---

## 🧭 Pantallas y Subpantallas

### 1. 🗺️ Pantalla Principal: Mapa + Reseñas

- Mapa interactivo con pines representando direcciones con reseñas.
- Listado lateral (desktop) o inferior (móvil) con reseñas recientes o destacadas.
- Filtro por ciudad, barrio, tipo de propiedad, calificación.
- Buscador de dirección (con autocompletado).

📌 **Interacciones**:

- Clic en pin → Abre modal con detalle de reseña.
- Botón flotante: “Agregar reseña” → Abre formulario.

---

### 2. 💬 Modal: Detalle de Reseña

- Título, tipo de propiedad, texto completo de la experiencia.
- Calificaciones:

  - 🏠 Propiedad (comodidad, estado, precio-calidad)
  - 🏘️ Zona (ruido, seguridad, servicios cercanos)

- Imágenes (si hay).
- Información adicional: fecha, duración del alquiler.
- Botones:

  - 👍 “Esta reseña fue útil” / 👎 “No fue útil”
  - (Opcional) “Reportar reseña”

---

### 3. 📝 Modal: Agregar Reseña

Formulario para ingresar una nueva experiencia de alquiler.

#### Campos:

- Dirección (input con autocompletado, por calle y número)
- Tipo de propiedad (casa, apartamento, habitación)
- Texto de experiencia
- Estrellas para:

  - Estado de la propiedad
  - Experiencia con la zona

- Adjuntar imágenes (opcional)
- Fecha del alquiler (aproximada)
- Checkbox de aceptación de términos

📌 Botón: **Publicar reseña**

---

### 4. 📊 Pantalla: Resumen por Zonas

Muestra un ranking de zonas/barrios/ciudades basado en:

- Promedio de calificación de las propiedades
- Promedio de calificación de la zona
- Cantidad de reseñas
- Tendencia (mejorando/empeorando)

📌 Representación:

- Tabla con filtros y ordenamientos
- Gráfico de mapa de calor (opcional, en una segunda fase)

---

### 5. 👤 Pantalla (futura): Perfil de usuario

- Historial de reseñas publicadas
- Cantidad de likes/dislikes recibidos
- Opciones para editar o borrar reseñas

---

## ⭐ Sistema de Calificaciones

### A. Calificación de la propiedad (por reseña)

- De 1 a 5 estrellas
- Subcategorías (opcional):

  - Limpieza
  - Estado general
  - Relación precio-calidad

### B. Calificación de la zona

- De 1 a 5 estrellas
- Subcategorías:

  - Seguridad
  - Nivel de ruido
  - Accesibilidad/servicios

📌 Estas calificaciones alimentan una **calificación promedio por dirección** que se muestra en el mapa.

---

## 👍👎 Calificación comunitaria (por reseña)

- Cada reseña puede recibir “Me fue útil” 👍 o “No fue útil” 👎
- Se muestra un contador en la tarjeta y en el modal
- Sirve para destacar experiencias verdaderamente informativas o alertas

---

## 🗃️ Datos técnicos importantes

- Las **ubicaciones estarán vinculadas por dirección textual**, no coordenadas puras.
- El sistema puede usar APIs de geocodificación inversa (como Mapbox, Google Maps o Nominatim) solo para posicionar en el mapa, pero **la agrupación y visualización será por dirección escrita (calle + número)**.
- Esto permite que varias reseñas se agrupen por la misma propiedad (ej: “Calle 1234, Montevideo”).

---

## 🚀 Ideas futuras

- Verificación opcional por email o con recibo/contrato (para validar reseñas reales)
- Modo de comparación entre dos ubicaciones
- Exportar reseñas o zonas como PDF (para agencias, inquilinos, etc.)
- Integrar IA para detectar reseñas sospechosas o alertas frecuentes

---

¿Querés que esto te lo convierta ahora en un documento tipo "especificación funcional del producto" (PDF, docx o markdown)? ¿O preferís que lo traduzca a tickets/historias de usuario para comenzar a desarrollarlo?
