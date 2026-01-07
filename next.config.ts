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
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://placehold.co https://firebasestorage.googleapis.com https://lh3.googleusercontent.com; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://firebasestorage.googleapis.com https://vitals.vercel-insights.com https://nominatim.openstreetmap.org;",
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

  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
};

export default nextConfig;
