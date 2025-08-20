# 🏠 Reseñas de Alquileres - Mapa Interactivo

Una aplicación web moderna para reseñar apartamentos y casas de alquiler. 

## 🌟 Características Principales

- **📝 Sistema de Reseñas**: Formulario completo con validación
- **⭐ Puntuación por Estrellas**: Sistema de rating de 1 a 5 estrellas
- **📱 Diseño Responsivo**: Optimizado para desktop y móvil con Tailwind CSS
- **🎯 Marcadores Dinámicos**: Pins en el mapa que muestran popups con información
- **📷 Carga de Imágenes**: Soporte para subir imágenes (simulado)
- **📋 Lista de Reseñas**: Panel lateral con todas las reseñas agregadas

## 🛠️ Tecnologías Utilizadas

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de utilidades CSS
- **Leaflet** - Biblioteca de mapas interactivos
- **React-Leaflet** - Wrapper de React para Leaflet
- **Lucide React** - Iconos SVG modernos

## 🚀 Instalación y Uso

1. **Instalar dependencias:**

   ```bash
   yarn install
   ```

2. **Ejecutar en modo desarrollo:**

   ```bash
   yarn dev
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css          # Estilos globales y de Leaflet
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página principal
├── components/
│   ├── MapComponent.tsx     # Componente del mapa interactivo
│   ├── ReviewForm.tsx       # Formulario de reseñas
│   └── ReviewList.tsx       # Lista de reseñas
└── types/
    └── review.ts            # Interfaces TypeScript
```

## 🔧 Componentes Principales

### MapComponent

- Renderiza el mapa con Leaflet
- Maneja clics para agregar nuevas reseñas
- Muestra marcadores existentes con popups
- Incluye marcador temporal para nueva ubicación

### ReviewForm

- Modal con formulario completo
- Sistema de rating con estrellas interactivas
- Subida de imágenes (simulada)
- Validación de campos requeridos

### ReviewList

- Lista scrolleable de reseñas
- Vista previa de imágenes
- Información resumida de cada reseña
- Click handler para futura funcionalidad

## 🎯 Funcionalidades Implementadas

- ✅ Formulario con validación completa
- ✅ Sistema de puntuación por estrellas
- ✅ Subida de imágenes (simulada)
- ✅ Marcadores dinámicos con popups
- ✅ Lista de reseñas responsive
- ✅ Gestión de estado local
- ✅ Interfaz moderna con Tailwind CSS

## 🚧 Próximas Mejoras

- [ ] Integración con base de datos
- [ ] Sistema de autenticación
- [ ] Subida real de imágenes
- [ ] Búsqueda y filtros
- [ ] Geolocalización automática
- [ ] Comentarios en reseñas
- [ ] Notificaciones
- [ ] PWA support

## 🤝 Contribuir

Este es un proyecto MVP (Minimum Viable Product) diseñado como prototipo. Las contribuciones son bienvenidas para expandir las funcionalidades.

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.
