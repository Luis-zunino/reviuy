# 🏠 Reviuy - Plataforma de Reseñas de Alquileres

Plataforma web completa para reseñar y evaluar direcciones, apartamentos y casas de alquiler en Uruguay. Sistema integral con autenticación, base de datos, mapas interactivos y gestión de usuarios.

## 🌟 Características Principales

### Sistema de Reseñas
- **📝 Reseñas de Direcciones**: Sistema completo con validación y formulario multi-paso
- **🏢 Reseñas de Bienes Raíces**: Evaluación de propiedades específicas
- **⭐ Sistema de Puntuación**: Rating de 1 a 5 estrellas con promedios
- **👍 Votación y Likes**: Sistema de votos positivos/negativos para reseñas
- **🚩 Reportes**: Sistema de moderación para contenido inapropiado
- **✏️ CRUD Completo**: Crear, leer, actualizar y eliminar reseñas

### Autenticación y Usuarios
- **🔐 Autenticación con Supabase**: Login/registro con email
- **👤 Perfiles de Usuario**: Gestión de información personal
- **📊 Dashboard Personal**: Vista de reseñas propias y actividad
- **⭐ Favoritos**: Sistema para guardar reseñas favoritas

### Mapas y Geolocalización
- **🗺️ Mapas Interactivos**: Integración con Leaflet y OpenStreetMap
- **📍 Geocodificación**: Búsqueda y selección de direcciones
- **🎯 Marcadores Dinámicos**: Visualización de ubicaciones con popups

### Características Técnicas
- **📱 Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **🌙 Modo Oscuro**: Soporte para temas claro/oscuro
- **⚡ Optimización**: Server-Side Rendering y carga dinámica
- **♿ Accesibilidad**: Componentes Radix UI con ARIA support
- **🔍 SEO**: Metadatos dinámicos, sitemap y robots.txt

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15.4** - Framework React con App Router y Turbopack
- **React 19** - Librería UI con Server Components
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Radix UI** - Componentes accesibles y sin estilos
- **Shadcn/ui** - Sistema de componentes

### Backend y Base de Datos
- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
- **PostgreSQL** - Base de datos relacional con RLS
- **Supabase Auth** - Autenticación y autorización

### Librerías y Herramientas
- **TanStack Query (React Query)** - Gestión de estado asíncrono
- **React Hook Form** - Formularios con validación
- **Zod 4** - Validación de esquemas TypeScript
- **Leaflet + React-Leaflet** - Mapas interactivos
- **Lucide React** - Iconos SVG
- **Sonner** - Notificaciones toast
- **Resend + Nodemailer** - Envío de emails
- **Bad Words** - Filtro de contenido inapropiado

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js 20 o superior
- Yarn 4.12 o superior
- Cuenta de Supabase

### 1. Clonar e Instalar

```bash
git clone <repositorio>
cd reviuy
yarn install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
├── src/
│   ├── app/                      # App Router de Next.js
│   │   ├── (auth)/              # Rutas de autenticación
│   │   │   └── login/           # Página de login
│   │   ├── (dashboard)/         # Rutas protegidas
│   │   │   ├── address/         # Detalle de direcciones
│   │   │   ├── admin/           # Panel de administración
│   │   │   ├── home/            # Página principal
│   │   │   ├── profile/         # Perfil de usuario
│   │   │   ├── real-estate/     # Bienes raíces
│   │   │   ├── review/          # Gestión de reseñas
│   │   │   ├── about/           # Sobre nosotros
│   │   │   ├── faq/            # Preguntas frecuentes
│   │ Scripts Disponibles

```bash
# Desarrollo
yarn dev              # Inicia servidor con Turbopack
yarn build            # Build de producción
yarn start            # Ejecuta build de producción
yarn type-check       # Verifica tipos TypeScript

# Supabase
yarn supabase:start   # Inicia Supabase local
yarn supabase:stop    # Detiene Supabase local
yarn supabase:status  # Estado de Supabase local
yarn supabase:reset   # Resetea DB local
yarn migrations       # Aplica migraciones
yarn supabase:typeLocal # Genera tipos TypeScript

# Calidad de Código
yarn lint             # Ejecuta ESLint
yarn lint:fix         # Corrige errores de ESLint
yarn format           # Formatea código con Prettier
yarn format:check     # Verifica formato

# Análisis
yarn analyze          # Analiza tamaño del bundle
```

## 🎯 Funcionalidades Implementadas

### ✅ Core Features
- Sistema completo de autenticación (login/registro)
- CRUD de reseñas de direcciones y bienes raíces
- Sistema de votación (upvotes/downvotes)
- Sistema de favoritos
- Sistema de reportes y moderación
- Búsqueda de direcciones con geocodificación
- Mapas interactivos con Leaflet
- Perfil de usuario editable

### ✅ Características Avanzadas
- Validación de formularios con Zod
- Filtro de palabras inapropiadas
- Row Level Security (RLS) en Supabase
- Optimización de imágenes con Next.js
- S📚 Documentación Adicional

- [Arquitectura del Sistema](supabase/doc/ARCHITECTURE.md)
- [Análisis Crítico](supabase/doc/ANALISIS_CRITICO_FINAL_V2.md)
- [Flujos de Usuario](supabase/doc/FLOWS.md)
- [Guía de Optimización](supabase/doc/PERFORMANCE_OPTIMIZATION_GUIDE.md)
- [Orden de Migraciones](supabase/doc/ORDEN_MIGRACIONES.md)
- [Seguridad](security.readme.md)

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Validación de entrada en cliente y servidor
- Filtro de contenido inapropiado
- Rate limiting en API routes
- Variables de entorno protegidas
- Consulta [security.readme.md](security.readme.md) para más detalles

## 🐛 Troubleshooting

### Error de HMR con MapComponent
Si encuentras errores de Hot Module Replacement con el mapa:
1. Limpia el caché: `rm -rf .next`
2. Reinicia el servidor: `yarn dev`
3. Haz hard refresh en el navegador: `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows/Linux)

### Errores de Supabase Local
Si Supabase local no inicia:
```bash
yarn supabase:stop
docker system prune -a
yarn supabase:start
```

### Errores de TypeScript
```bash
yarn type-check
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

[Especificar Licencia]

---

Desarrollado con ❤️ para la comunidad de alquileres en Uruguay
- Sitemap automático
- robots.txt configurado
- PWA con Service Worker
- Optimización de bundle

## 🚧 Roadmap

- [ ] Sistema de comentarios en reseñas
- [ ] Subida de imágenes de propiedades
- [ ] Notificaciones en tiempo real
- [ ] Chat entre usuarios
- [ ] Sistema de verificación de reseñas
- [ ] API pública
- [ ] Aplicación móvil nativa
- [ ] Integración con redes sociales
# Aplicar migraciones a la nube
yarn migrations
```

### 4. Ejecutar en Desarrollo

```bash
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

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
