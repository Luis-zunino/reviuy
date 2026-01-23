import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ReviUy - Reseñas de Propiedades',
    short_name: 'ReviUy',
    description:
      'Descubre y comparte experiencias sobre propiedades de alquiler e inmobiliarias en Uruguay',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['lifestyle', 'real-estate'],
    icons: [
      {
        src: '/icon.192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.svg',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
