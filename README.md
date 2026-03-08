# 🏠 ReviUy - Plataforma de Reseñas de Alquileres

Plataforma web completa para reseñar y evaluar direcciones, apartamentos y casas de alquiler en Uruguay. Sistema integral con autenticación, base de datos, mapas interactivos, gestión de usuarios y sistema completo de consejos para arrendatarios.

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
- **📍 Geocodificación**: Búsqueda y selección automática de direcciones con Nominatim
- **🎯 Marcadores Dinámicos**: Visualización de ubicaciones con popups informativos

### Sistema de Consejos

- **💡 Tips para Arrendatarios**: Más de 4000 líneas de contenido educativo
- **🏠 Guías de Alquiler**: Consejos sobre contratos, costos y evaluación de propiedades
- **⚠️ Detección de Estafas**: Guías para identificar fraudes comunes
- **📋 Checklists**: Listas de verificación para visitas y documentación

### Características Técnicas

- **📱 Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- **🌙 Modo Oscuro**: Soporte para temas claro/oscuro
- **⚡ Optimización**: Server-Side Rendering y carga dinámica
- **♿ Accesibilidad**: Componentes Radix UI con ARIA support
- **🔍 SEO**: Metadatos dinámicos, sitemap automático y robots.txt
- **🛡️ Rate Limiting**: Protección contra abuso de API con Redis

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
- **Upstash Redis** - Rate limiting distribuido

### DevOps y Calidad

- **ESLint** - Análisis estático de código
- **Prettier** - Formateo automático de código
- **TypeScript Strict Mode** - Verificación de tipos estricta
- **Yarn 4** - Gestor de paquetes moderno

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 20 o superior
- Yarn 4.12 o superior
- Docker Desktop (para Supabase local)
- Cuenta de Supabase (para producción)
- Cuenta de Supabase

### 1. Clonar e Instalar

````bash
git clone <repositorio>
cd reviuy
yarn installproject-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Upstash Redis - Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Email (Resend)
RESEND_API_KEY=tu-resend-api-key
CONTACT_EMAIL=tu-email@ejemplo.com
FROM_EMAIL='Nombre <noreply@tudominio.com>'

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000/auth/callback

# Modo de desarrollo
NODE_ENV=development
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
````

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación y Usuarios

- [x] Sistema de login/registro con Supabase Auth
- [x] Protección de rutas con middleware
- [x] Gestión de sesiones y tokens
- [x] Perfil de usuario editable
- [x] Row Level Security (RLS) en todas las tablas

### ✅ Sistema de Reseñas

- [x] CRUD completo de reseñas de direcciones
- [x] CRUD completo de reseñas de bienes raíces
- [x] Sistema de puntuación de 1 a 5 estrellas
- [x] Votación (upvotes/downvotes) con optimistic updates
- [x] Sistema de favoritos
- [x] Reportes de contenido inapropiado

### ✅ Mapas y Geolocalización

- [x] Mapa interactivo con componente MapComponent
- [x] Marcadores dinámicos con popups - Estructura técnica y decisiones de diseño
- [Flujos de Usuario](supabase/doc/FLOWS.md) - Diagramas de flujo de las funcionalidades principales
- [Análisis Crítico](supabase/doc/ANALISIS_CRITICO_FINAL_V2.md) - Evaluación técnica del proyecto

### Optimización y Mantenimiento

- [Guía de Optimización](supabase/doc/PERFORMANCE_OPTIMIZATION_GUIDE.md) - Mejores prácticas de rendimiento
- [Orden de Migraciones](supabase/doc/ORDEN_MIGRACIONES.md) - Secuencia de aplicación de cambios en BD
- [Rate Limiting](RATE_LIMITING_IMPLEMENTATION.md) - Implementación de límites de tasa con Redis

### Medidas Implementadas

- ✅ **Row Level Security (RLS)**: Políticas de acceso a nivel de base de datos
- ✅ **Validación de Entrada**: Validación en cliente y servidor con Zod
- ✅ **Filtro de Contenido**: Detección de palabras inapropiadas con bad-words
- ✅ **Rate Limiting**: Protección contra abuso de API con Redis
  - Write operations: 5 requests / 10 segundos
  - Vote operations: 10 requests / 10 segundos
- ✅ **Variables de Entorno Protegidas**: Keys nunca expuestas al cliente
- ✅ **Middleware de Autenticación**: Protección de rutas sensibles en middleware.ts
- ✅ **Server Actions**: Lógica de negocio en servidor con 'use server'
- ✅ **Sanitización de Inputs**: Prevención de XSS e inyección SQL

### Documentación de Seguridad

Para más detalles, consulta [security.readme.md](security.readme.md) y [RATE_LIMITING_IMPLEMENTATION.md](RATE_LIMITING_IMPLEMENTATION.md).

```tsx
<MapComponent lat={-34.9011} lon={-56.1645}>
  <div>Montevideo, Uruguay</div>
</MapComponent>
```

### RealEstateVoteButtons

**Ubicación:** [`src/components/common/RealEstateVoteButtons/index.tsx`](src/components/common/RealEstateVoteButtons/index.tsx)

Sistema de votación para propiedades con rate limiting.

```tsx
<RealEstateVoteButtons
  realEstateId="123"
  likes={45}
  dislikes={3}
  userVote="like"
  refetchRealEstate={refetch}
/>
```

**Características:**

- Botones de upvote/downvote
- Actualización optimista de UI
- Rate limiting (10 votos/10s)
- Tooltips dinámicos según estado del voto

### ReviewLikesButtons

**Ubicación:** [`src/components/common/ReviewLikesButtons/index.tsx`](src/components/common/ReviewLikesButtons/index.tsx)

Botones de votación para reseñas.

```tsx
<ReviewLikesButtons id="review-123" likes={10} dislikes={2} />
```

### ReviewCard

**Ubicación:** [`src/components/common/ReviewCard/index.tsx`](src/components/common/ReviewCard/index.tsx)

Tarjeta de visualización de reseña con toda la información resumida.

```tsx
<ReviewCard review={reviewData} />
```

### ReviewForm

**Ubicación:** [`src/components/features/Review/components/ReviewForm/index.tsx`](src/components/features/Review/components/ReviewForm/index.tsx)

Formulario multi-paso (wizard) para crear/editar reseñas.

**Características:**

- 3 pasos: dirección, habitaciones, confirmación
- Validación con Zod
- Autocomplete de direcciones
- Campo dinámico de habitacionesnido en tips.mock.ts
- [x] Guías sobre contratos de alquiler
- [x] Checklists de evaluación de propiedades
- [x] Consejos de seguridad y prevención de estafas
- [x] Estimación de costos de mudanza

### ✅ Características Técnicas

- [x] Validación de formularios con Zod y React Hook Form
- [x] Filtro de palabras inapropiadas (bad-words)
- [x] Rate limiting con Redis (ver RATE_LIMITING_IMPLEMENTATION.md)
- [x] Optimización de imágenes con Next.js Image
- [x] Server-Side Rendering (SSR)
- [x] Componentes accesibles con Radix UI
- [x] Notificaciones toast con Sonner
- [x] Server Actions con 'use server'

## 📚 Documentación Adicional

### Arquitectura y Diseño

- [Arquitectura del Sistema](supabase/doc/ARCHITECTURE.md)
- [Análisis Crítico](supabase/doc/ANALISIS_CRITICO_FINAL_V2.md)
- [Flujos de Usuario](supabase/doc/FLOWS.md)
- [Guía de Optimización](supabase/doc/PERFORMANCE_OPTIMIZATION_GUIDE.md)
- [Orden de Migraciones](supabase/doc/ORDEN_MIGRACIONES.md)
- [Seguridad](security.readme.md)

## Troubleshooting

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

## 📄 Licencia

[Especificar Licencia]

---

Desarrollado con ❤️ para la comunidad de alquileres en Uruguay

## 📧 Contacto

Para consultas, sugerencias o reporte de problemas:

- Email: [tu-email@ejemplo.com]
- GitHub Issues: [link-al-repo]

**💡 Tip:** Copia `.env.example` como base:

```bash
cp .env.example .env.local
```

### 3. Configurar Supabase Local

#### Iniciar Supabase (primera vez)

```bash
# Inicia contenedores de Docker
yarn supabase:start

# Esto mostrará:
# - API URL: http://localhost:54321
# - Anon key: eyJhbGc...
# - Service role key: eyJhbGc...
```

#### Aplicar Migraciones

```bash
# Aplica todas las migraciones a la DB local
yarn migrations

reviuy/
├── .next/                       # Build de Next.js (generado)
├── public/                      # Archivos estáticos
│   ├── sw.js                    # Service Worker
│   └── leaflet/                 # Assets de Leaflet
├── src/
│   ├── app/                     # App Router de Next.js
│   │   ├── (auth)/             # Grupo de rutas de autenticación
│   │   │   └── login/          # Página de login
│   │   ├── (dashboard)/        # Grupo de rutas protegidas
│   │   │   ├── address/        # Detalle y gestión de direcciones
│   │   │   ├── admin/          # Panel de administración
│   │   │   ├── home/           # Página principal del dashboard
│   │   │   ├── profile/        # Perfil de usuario
│   │   │   ├── real-estate/    # Gestión de bienes raíces
│   │   │   ├── review/         # CRUD de reseñas
│   │   │   ├── about/          # Información sobre la plataforma
│   │   │   ├── faq/            # Preguntas frecuentes
│   │   │   ├── contact/        # Contacto
│   │   │   ├── good-practices/ # Buenas prácticas
│   │   │   ├── privacidad/     # Política de privacidad
│   │   │   ├── terminos/       # Términos y condiciones
│   │   │   └── tips/           # Consejos para arrendatarios
│   │   ├── _actions/           # Server Actions (carpeta privada)
│   │   │   ├── review.actions.ts
│   │   │   ├── review-interactions.actions.ts
│   │   │   ├── real-estate-review.actions.ts
│   │   │   ├── real-estate-interactions.actions.ts
│   │   │   └── types/          # Tipos de Server Actions
│   │   ├── api/                # API Routes
│   │   │   ├── contact/        # Endpoint de contacto
│   │   │   ├── report-review/  # Endpoint de reportes
│   │   │   ├── report-real-estate/
│   │   │   ├── report-real-estate-review/
│   │   │   ├── _utils/         # Utilidades privadas de API
│   │   │   └── route.ts        # Handler raíz de /api
│   │   ├── layout.tsx          # Layout raíz
│   │   ├── globals.css         # Estilos globales
│   │   └── manifest.ts         # PWA manifest
│   ├── components/
│   │   ├── common/             # Componentes reutilizables
│   │   │   ├── MapComponent/   # Mapa interactivo con Leaflet
│   │   │   │   ├── MapComponent.tsx
│   │   │   │   └── types/
│   │   │   ├── RealEstateVoteButtons/  # Sistema de votación
│   │   │   ├── ReviewLikesButtons/     # Votación de reseñas
│   │   │   ├── ReviewCard/             # Tarjeta de reseña
│   │   │   ├── FavoriteReviewButton/   # Botón de favoritos
│   │   │   ├── StarRating/             # Componente de estrellas
│   │   │   └── [muchos más...]
│   │   ├── features/           # Componentes por feature
│   │   │   ├── Review/         # Feature de reseñas
│   │   │   │   ├── components/
│   │   │   │   │   ├── ReviewForm/
│   │   │   │   │   ├── FirstForm/
│   │   │   │   │   ├── SecondForm/
│   │   │   │   │   └── ThirdForm/
│   │   │   │   └── hooks/
│   │   │   ├── RealEstate/     # Feature de bienes raíces
│   │   │   └── Home/           # Feature de home
│   │   ├── providers/          # Context Providers
│   │   │   └── AuthProvider.tsx
│   │   └── ui/                 # Componentes de Shadcn/ui
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useDebounce.hook.ts
│   │   └── useUserReviews.hook.ts
│   ├── lib/                    # Utilidades y configuración
│   │   ├── supabase/          # Cliente de Supabase
│   │   │   ├── client.ts      # Cliente para componentes
│   │   │   ├── server.ts      # Cliente para Server Actions
│   │   │   ├── middleware.ts  # Cliente para middleware
│   │   │   └── index.ts       # Barrel export (NO exporta server)
│   │   ├── redis/             # Rate Limiting con Redis
│   │   │   ├── rate-limit.ts
│   │   │   ├── with-rate-limit.ts
│   │   │   └── types/
│   │   └── utils.ts           # Funciones auxiliares
│   ├── services/               # Lógica de negocio
│   │   ├── apis/              # Llamadas a APIs
│   │   │   ├── reviews/
│   │   │   ├── realEstates/
│   │   │   └── user/
│   │   ├── mocks/
│   │   │   └── tips.mock.ts   # 4000+ líneas de consejos
│   │   └── constants/
│   ├── types/                  # Definiciones de tipos TypeScript
│   │   ├── article/
│   │   │   ├── article.type.ts
│   │   │   └── index.ts
│   │   ├── review/
│   │   │   ├── review.ts
│   │   │   └── index.ts
│   │   ├── real-estate/
│   │   ├── nominatim/
│   │   ├── report-review/
│   │   ├── review-votes/
│   │   ├── supabase/
│   │   ├── vote-type/
│   │   └── index.ts           # Barrel principal
│   ├── utils/                  # Funciones de utilidad
│   │   ├── sessionMapped.util.ts
│   │   ├── supabaseErrorMap.util.ts
│   │   └── index.ts
│   └── enums/                  # Enumeraciones
├── supabase/
│   ├── migrations/             # Migraciones SQL (001-007)
│   ├── functions/              # Edge Functions
│   ├── config.toml            # Configuración de Supabase
│   └── doc/                    # Documentación técnica
│       ├── ARCHITECTURE.md
│       ├── FLOWS.md
│       ├── AUDIT_CONSOLIDADO.md
│       └── PERFORMANCE_OPTIMIZATION_GUIDE.md
├── .env.local                  # Variables de entorno (no commiteado)
├── .env.example               # Plantilla de variables
├── middleware.ts              # Middleware de Next.js
├── next.config.ts             # Configuración de Next.js
├── tailwind.config.ts         # Configuración de Tailwind
├── tsconfig.json             # Configuración de TypeScript
├── components.json           # Config de Shadcn/ui
└── package.json              # Dependencias y scripts
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
