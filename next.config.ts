import { PagesUrls } from '@/enums';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        // Supabase Storage CDN
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        // Google OAuth avatares
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95], // Calidades permitidas
    // Minimizar Layout Shift con placeholders
    minimumCacheTTL: 60,
    // Deshabilitar optimización en desarrollo para faster reloads
    unoptimized: process.env.NODE_ENV === 'development' ? false : false,
  },

  // Optimizaciones de rendimiento
  compress: true,
  poweredByHeader: false,

  // Headers para seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `
                    default-src 'self';
                    script-src
                    'self'
                    'unsafe-inline'
                    'unsafe-eval'
                    https://apis.google.com
                    https://va.vercel-scripts.com;
                    style-src
                    'self'
                    'unsafe-inline';
                    img-src
                    'self'
                    data:
                    blob:
                    https://placehold.co
                    https://firebasestorage.googleapis.com
                    https://lh3.googleusercontent.com
                    https://*.tile.openstreetmap.org;
                    font-src 'self' data:;
                    connect-src
                    'self'
                    https://*.supabase.co
                    https://firebasestorage.googleapis.com
                    https://vitals.vercel-insights.com
                    https://nominatim.openstreetmap.org;
                    object-src 'none';
                    base-uri 'self';
                    frame-ancestors 'none';
                    `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: `
              geolocation=(),
              microphone=(),
              camera=(),
              gyroscope=(),
              magnetometer=(),
              accelerometer=(),
              payment=(),
              usb=()
            `.replace(/\s+/g, ''),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: PagesUrls.HOME,
        permanent: true,
      },
    ];
  },
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
};

export default nextConfig;
